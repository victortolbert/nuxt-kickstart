import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { generateSQLiteDrizzleJson, generateSQLiteMigration } from 'drizzle-kit/api'
import { afterEach, describe, expect, it } from 'vitest'
import { schemaFiles } from '../../server/db/schema-files'

/**
 * The migration tooling reads the base schema plus every layer's, found by
 * convention, so a layer brings its tables without registering anything
 * (ADR-0010). These pin what drizzle-kit will see.
 */

const ROOT = fileURLToPath(new URL('../..', import.meta.url))
const scratch: string[] = []

afterEach(() => {
  for (const dir of scratch.splice(0))
    rmSync(dir, { recursive: true, force: true })
})

/** The schema `drizzle-kit generate` builds from a root's schema files. */
async function generatedTables(rootDir: string): Promise<string[]> {
  const modules = await Promise.all(schemaFiles(rootDir).map(file => import(file)))
  const json = await generateSQLiteDrizzleJson(Object.assign({}, ...modules))
  return Object.keys(json.tables).sort()
}

describe('schema files', () => {
  it('picks up a layer\'s schema file, and its table reaches the generated schema', async () => {
    const root = mkdtempSync(join(ROOT, '.tmp-schema-files-'))
    scratch.push(root)
    mkdirSync(join(root, 'server/db'), { recursive: true })
    writeFileSync(join(root, 'server/db/schema.ts'), `import { sqliteTable, text } from 'drizzle-orm/sqlite-core'\nexport const base = sqliteTable('base', { id: text('id').primaryKey() })\n`)
    mkdirSync(join(root, 'layers/notes/server/db'), { recursive: true })
    writeFileSync(join(root, 'layers/notes/server/db/schema.ts'), `import { sqliteTable, text } from 'drizzle-orm/sqlite-core'\nexport const note = sqliteTable('note', { id: text('id').primaryKey() })\n`)

    expect(await generatedTables(root)).toEqual(['base', 'note'])
  })

  it('stops seeing a layer once its folder is gone', async () => {
    const root = mkdtempSync(join(tmpdir(), 'kickstart-schema-files-'))
    scratch.push(root)
    mkdirSync(join(root, 'layers/notes'), { recursive: true })

    expect(schemaFiles(root)).toEqual([join(root, 'server/db/schema.ts')])
  })

  it('has a committed migration for every change to the schema files', async () => {
    // A schema edited without `pnpm run db:generate` would ship a table the
    // chain never creates. The newest snapshot must be the schema as it stands.
    const dir = join(ROOT, 'server/db/migrations')
    const journal = JSON.parse(readFileSync(join(dir, 'meta/_journal.json'), 'utf8')) as { entries: { tag: string }[] }
    const latest = journal.entries.at(-1)!.tag.split('_')[0]
    const committed = JSON.parse(readFileSync(join(dir, 'meta', `${latest}_snapshot.json`), 'utf8'))

    const modules = await Promise.all(schemaFiles(ROOT).map(file => import(file)))
    const current = await generateSQLiteDrizzleJson(Object.assign({}, ...modules))

    expect(await generateSQLiteMigration(committed, current), 'run `pnpm run db:generate`').toEqual([])
  })
})
