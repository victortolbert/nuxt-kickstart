import type { Client } from '@libsql/client'
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@libsql/client'
import { generateSQLiteDrizzleJson, generateSQLiteMigration } from 'drizzle-kit/api'
import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { afterEach, describe, expect, it } from 'vitest'
import { migrateDatabase } from '../../server/db/migrate'

/**
 * `pnpm run db:migrate` is the only way the schema changes. These drive it the
 * way an environment does — against a database file, then inspect the file —
 * so they say nothing about how the migrator is built.
 */

const MIGRATIONS = fileURLToPath(new URL('../../server/db/migrations', import.meta.url))
const LEGACY_INIT = readFileSync(fileURLToPath(new URL('../fixtures/legacy-init-schema.sql', import.meta.url)), 'utf8')

const scratch: string[] = []
const clients: Client[] = []

function tempDir(): string {
  const dir = mkdtempSync(join(tmpdir(), 'kickstart-migrate-'))
  scratch.push(dir)
  return dir
}

function openDatabase(dir = tempDir()): Client {
  const client = createClient({ url: `file:${join(dir, 'app.db')}` })
  clients.push(client)
  return client
}

/** The database exactly as `scripts/init-better-auth-db.ts` (v1.0.0) left it. */
async function initScriptDatabase(sql = LEGACY_INIT): Promise<Client> {
  const client = openDatabase()
  await client.executeMultiple(sql)
  return client
}

/** A copy of the committed chain with one more migration on the end. */
function chainWith(extra: { tag: string, sql: string }[]): string {
  const dir = join(tempDir(), 'migrations')
  cpSync(MIGRATIONS, dir, { recursive: true })
  const journalPath = join(dir, 'meta/_journal.json')
  const journal = JSON.parse(readFileSync(journalPath, 'utf8')) as { entries: { idx: number, when: number, tag: string }[] }
  for (const { tag, sql } of extra) {
    const last = journal.entries.at(-1)!
    journal.entries.push({ ...last, idx: last.idx + 1, when: last.when + 1000, tag })
    writeFileSync(join(dir, `${tag}.sql`), sql)
  }
  writeFileSync(journalPath, JSON.stringify(journal, null, 2))
  return dir
}

async function tables(client: Client): Promise<string[]> {
  const { rows } = await client.execute(`SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name`)
  return rows.map(row => String(row.name))
}

async function columns(client: Client, table: string): Promise<string[]> {
  const { rows } = await client.execute(`PRAGMA table_info(${table})`)
  return rows.map(row => String(row.name))
}

async function journalLength(client: Client): Promise<number> {
  const { rows } = await client.execute('SELECT count(*) AS n FROM __drizzle_migrations')
  return Number(rows[0]!.n)
}

afterEach(() => {
  for (const client of clients.splice(0))
    client.close()
  for (const dir of scratch.splice(0))
    rmSync(dir, { recursive: true, force: true })
})

describe('db:migrate', () => {
  it('builds every table on an empty database and writes the journal', async () => {
    const client = openDatabase()

    const report = await migrateDatabase(client, MIGRATIONS)

    expect(await tables(client)).toEqual(['__drizzle_migrations', 'account', 'session', 'user', 'verification'])
    expect(await columns(client, 'session')).toContain('impersonated_by')
    expect(report.adopted).toBe(false)
    expect(report.applied.length).toBeGreaterThan(0)
    expect(await journalLength(client)).toBe(report.applied.length)
  })

  it('adopts a database the old init script built, keeps its rows, and applies what it lacks', async () => {
    const client = await initScriptDatabase()
    await client.execute(`INSERT INTO user (id, name, email) VALUES ('u1', 'Ada', 'ada@example.com')`)
    await client.execute(`INSERT INTO session (id, expires_at, token, user_id) VALUES ('s1', 0, 't1', 'u1')`)

    const report = await migrateDatabase(client, MIGRATIONS)

    expect(report.adopted).toBe(true)
    expect(report.recorded).toEqual(['0000_baseline'])
    // The column commit 2583aaa had to add by hand arrives as a regular migration.
    expect(report.applied).toEqual(['0001_session_impersonated_by'])
    expect(await columns(client, 'session')).toContain('impersonated_by')
    const { rows } = await client.execute(`SELECT u.email, s.token FROM user u JOIN session s ON s.user_id = u.id`)
    expect(rows.map(r => [r.email, r.token])).toEqual([['ada@example.com', 't1']])
  })

  it('adopts the later init script, which already had impersonated_by, at that migration', async () => {
    const withColumn = LEGACY_INIT.replace('user_agent TEXT,', 'user_agent TEXT,\n  impersonated_by TEXT,')
    expect(withColumn).not.toBe(LEGACY_INIT)
    const client = await initScriptDatabase(withColumn)

    const report = await migrateDatabase(client, MIGRATIONS)

    expect(report.recorded).toEqual(['0000_baseline', '0001_session_impersonated_by'])
    expect(report.applied).toEqual([])
  })

  it('changes nothing the second time', async () => {
    const client = await initScriptDatabase()
    await migrateDatabase(client, MIGRATIONS)
    const journal = await journalLength(client)

    const second = await migrateDatabase(client, MIGRATIONS)

    expect(second).toEqual({ adopted: false, recorded: [], applied: [] })
    expect(await journalLength(client)).toBe(journal)
  })

  it('applies a migration added after adoption', async () => {
    const client = await initScriptDatabase()
    await migrateDatabase(client, MIGRATIONS)

    const later = chainWith([{ tag: '9000_notes', sql: 'CREATE TABLE `note` (`id` text PRIMARY KEY NOT NULL);' }])
    const report = await migrateDatabase(client, later)

    expect(report.applied).toEqual(['9000_notes'])
    expect(await tables(client)).toContain('note')
  })

  it('creates a layer\'s table from the migration generated off its schema file', async () => {
    // What `db:generate` writes for a layer's schema file, applied the way a
    // deploy applies it: the table appears in the database.
    const empty = await generateSQLiteDrizzleJson({})
    const withLayer = await generateSQLiteDrizzleJson({
      note: sqliteTable('planner_note', { id: text('id').primaryKey(), body: text('body') }),
    })
    const statements = await generateSQLiteMigration(empty, withLayer)
    const client = openDatabase()

    await migrateDatabase(client, chainWith([{ tag: '9000_planner', sql: statements.join('\n--> statement-breakpoint\n') }]))

    expect(await tables(client)).toContain('planner_note')
    expect(await columns(client, 'planner_note')).toEqual(['id', 'body'])
  })

  it('leaves a deleted layer\'s table alone, and migrates around it', async () => {
    // The layer is gone from the chain this run reads; its table is not.
    const client = await initScriptDatabase()
    await client.execute(`CREATE TABLE planner_note (id TEXT PRIMARY KEY, body TEXT)`)
    await client.execute(`INSERT INTO planner_note (id, body) VALUES ('n1', 'kept')`)

    const report = await migrateDatabase(client, MIGRATIONS)
    await migrateDatabase(client, MIGRATIONS)

    expect(report.recorded).toEqual(['0000_baseline'])
    const { rows } = await client.execute('SELECT body FROM planner_note')
    expect(rows.map(r => r.body)).toEqual(['kept'])
  })

  it('fails and leaves the database untouched when a migration fails', async () => {
    const client = openDatabase()
    const broken = chainWith([
      { tag: '9000_good', sql: 'CREATE TABLE `good` (`id` text);' },
      { tag: '9001_bad', sql: 'CREATE TABLE `user` (`id` text);' },
    ])

    await expect(migrateDatabase(client, broken)).rejects.toThrow()
    expect(await tables(client)).not.toContain('good')
    expect(await tables(client)).not.toContain('account')
  })

  it('refuses to adopt a database that is neither empty nor the init script\'s', async () => {
    const client = openDatabase()
    await client.execute('CREATE TABLE user (id TEXT PRIMARY KEY)')

    await expect(migrateDatabase(client, MIGRATIONS)).rejects.toThrow(/Refusing to adopt/)
    expect(await tables(client)).toEqual(['user'])
  })
})
