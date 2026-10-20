import type { Client } from '@libsql/client'
import { createClient } from '@libsql/client'
import { generateSQLiteDrizzleJson, generateSQLiteMigration } from 'drizzle-kit/api'
import * as schema from '../../../server/db/schema'

/**
 * An in-memory libSQL client holding every table in `server/db/schema.ts`.
 *
 * The DDL is generated from the Drizzle schema itself — the same diff
 * `drizzle-kit push` would apply to an empty database — so a column added to
 * the schema appears here without a second copy to keep in step. Tests that
 * mock `#server/utils/db` swap this client in so Better Auth runs real SQL
 * against real tables.
 */
export async function createSchemaMemoryClient(): Promise<Client> {
  const empty = await generateSQLiteDrizzleJson({})
  const current = await generateSQLiteDrizzleJson(schema)
  const statements = await generateSQLiteMigration(empty, current)

  const client = createClient({ url: ':memory:' })
  for (const statement of statements)
    await client.execute(statement)

  return client
}
