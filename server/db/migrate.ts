import type { Client } from '@libsql/client'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { drizzle } from 'drizzle-orm/libsql'
import { migrate } from 'drizzle-orm/libsql/migrator'
import { readMigrationFiles } from 'drizzle-orm/migrator'
import { z } from 'zod'

/**
 * Bring a database onto the migration chain in `server/db/migrations/`.
 *
 * This is the only way the schema changes (ADR-0010): `pnpm run db:migrate`
 * runs it on install and before a deploy, against the local file or Turso.
 * Applying is all-or-nothing — the pending migrations run in one batch, so a
 * failure leaves the database where it was and the caller exits non-zero.
 *
 * A database created by the retired `scripts/init-better-auth-db.ts` has the
 * auth tables and no journal. Running the baseline over it would fail on the
 * first `CREATE TABLE`, so it is **adopted** instead: every migration whose
 * snapshot the database already satisfies is recorded as applied, without
 * running, and the rest apply normally. The init script existed in two shapes
 * (before and after commit 2583aaa added `session.impersonated_by`); the first
 * is adopted at the baseline and gets 0001, the second is adopted at 0001.
 */

const JOURNAL_TABLE = '__drizzle_migrations'

/** The tables the baseline creates: their presence is what marks a legacy database. */
const BASELINE_TABLES = ['user', 'session', 'account', 'verification'] as const

export interface MigrateReport {
  /** Whether a pre-journal database was adopted on this run. */
  adopted: boolean
  /** Tags recorded as already applied by adoption. */
  recorded: string[]
  /** Tags whose SQL ran on this run. */
  applied: string[]
}

// Only the parts of drizzle-kit's metadata this module reads. Parsed, so a
// hand-edited or truncated file fails here with its path, not deep inside
// adoption with an undefined property.
const journalSchema = z.object({
  entries: z.array(z.object({ idx: z.number(), when: z.number(), tag: z.string() })),
})

const snapshotSchema = z.object({
  tables: z.record(z.string(), z.object({ columns: z.record(z.string(), z.unknown()) })),
})

type JournalEntry = z.infer<typeof journalSchema>['entries'][number]
type Snapshot = z.infer<typeof snapshotSchema>

function readMeta<T>(file: string, schema: z.ZodType<T>): T {
  const parsed = schema.safeParse(JSON.parse(readFileSync(file, 'utf8')))
  if (!parsed.success)
    throw new Error(`${file} is not drizzle-kit migration metadata: ${parsed.error.message}`)
  return parsed.data
}

function readJournal(migrationsDir: string): JournalEntry[] {
  return readMeta(join(migrationsDir, 'meta/_journal.json'), journalSchema).entries
}

function readSnapshot(migrationsDir: string, entry: JournalEntry): Snapshot {
  const prefix = entry.tag.split('_')[0]
  return readMeta(join(migrationsDir, 'meta', `${prefix}_snapshot.json`), snapshotSchema)
}

/** Table name → column names, as the database has them now. */
async function describeDatabase(client: Client): Promise<Map<string, Set<string>>> {
  const { rows } = await client.execute(`SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'`)
  const shape = new Map<string, Set<string>>()
  for (const row of rows) {
    const table = String(row.name)
    const info = await client.execute(`PRAGMA table_info(\`${table}\`)`)
    shape.set(table, new Set(info.rows.map(column => String(column.name))))
  }
  return shape
}

async function journalRows(client: Client, shape: Map<string, Set<string>>): Promise<number> {
  if (!shape.has(JOURNAL_TABLE))
    return 0
  const { rows } = await client.execute(`SELECT count(*) AS n FROM ${JOURNAL_TABLE}`)
  return Number(rows[0]?.n ?? 0)
}

function satisfies(shape: Map<string, Set<string>>, snapshot: Snapshot): boolean {
  return Object.entries(snapshot.tables).every(([table, { columns }]) => {
    const present = shape.get(table)
    return !!present && Object.keys(columns).every(column => present.has(column))
  })
}

/**
 * Record the migrations a pre-journal database already satisfies, in one
 * batch. Throws when the database holds some of the baseline tables but not a
 * shape any migration describes: that is not a database this chain made or the
 * init script made, and guessing would corrupt it.
 */
async function adopt(client: Client, migrationsDir: string, shape: Map<string, Set<string>>): Promise<string[]> {
  const entries = readJournal(migrationsDir)
  const files = readMigrationFiles({ migrationsFolder: migrationsDir })

  // The index of the last migration the database already satisfies.
  let adoptedThrough = -1
  for (const [i, entry] of entries.entries()) {
    if (!satisfies(shape, readSnapshot(migrationsDir, entry)))
      break
    adoptedThrough = i
  }

  if (adoptedThrough < 0) {
    const missing = BASELINE_TABLES.filter(table => !shape.has(table))
    throw new Error(
      `Refusing to adopt this database: it has no migration journal and does not match the baseline `
      + `(${missing.length ? `missing tables: ${missing.join(', ')}` : 'the baseline tables are missing columns'}). `
      + `Inspect it by hand before migrating.`,
    )
  }

  await client.batch([
    `CREATE TABLE IF NOT EXISTS ${JOURNAL_TABLE} (id SERIAL PRIMARY KEY, hash text NOT NULL, created_at numeric)`,
    ...files.slice(0, adoptedThrough + 1).map(file => ({
      sql: `INSERT INTO ${JOURNAL_TABLE} ("hash", "created_at") VALUES (?, ?)`,
      args: [file.hash, file.folderMillis],
    })),
  ], 'write')

  return entries.slice(0, adoptedThrough + 1).map(entry => entry.tag)
}

async function appliedSince(client: Client, before: number): Promise<number[]> {
  const { rows } = await client.execute({
    sql: `SELECT created_at FROM ${JOURNAL_TABLE} WHERE created_at > ? ORDER BY created_at`,
    args: [before],
  })
  return rows.map(row => Number(row.created_at))
}

export async function migrateDatabase(client: Client, migrationsDir: string): Promise<MigrateReport> {
  const shape = await describeDatabase(client)
  const hasBaselineTables = BASELINE_TABLES.some(table => shape.has(table))
  const unjournaled = (await journalRows(client, shape)) === 0

  const recorded = unjournaled && hasBaselineTables
    ? await adopt(client, migrationsDir, shape)
    : []

  const { rows } = await client.execute(`SELECT max(created_at) AS last FROM ${JOURNAL_TABLE}`).catch(() => ({ rows: [] }))
  const before = Number(rows[0]?.last ?? 0)

  await migrate(drizzle(client), { migrationsFolder: migrationsDir })

  const byWhen = new Map(readJournal(migrationsDir).map(entry => [entry.when, entry.tag]))
  const applied = (await appliedSince(client, before)).map(when => byWhen.get(when) ?? String(when))

  return { adopted: recorded.length > 0, recorded, applied }
}
