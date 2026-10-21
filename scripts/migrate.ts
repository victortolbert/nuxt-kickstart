#!/usr/bin/env tsx
/**
 * Apply pending migrations from server/db/migrations/ to the database.
 *
 * `pnpm run db:migrate`. Runs on install (postinstall) and before a deploy.
 * Targets Turso when TURSO_DATABASE_URL is set (with TURSO_AUTH_TOKEN), the
 * local file:.data/auth.db otherwise. MIGRATIONS_DIR overrides the folder,
 * which the Docker image uses because it ships the folder beside the server.
 *
 * A database the retired init script created is adopted onto the chain on its
 * first run (server/db/migrate.ts). Any failure exits 1, so a deploy that
 * migrates first stops before a half-migrated schema serves traffic.
 */

import { mkdirSync } from 'node:fs'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { createClient } from '@libsql/client'
import { migrateDatabase } from '../server/db/migrate'

// eslint-disable-next-line node/no-process-env
const env = process.env
const url = env.TURSO_DATABASE_URL || 'file:.data/auth.db'
const migrationsDir = env.MIGRATIONS_DIR || fileURLToPath(new URL('../server/db/migrations', import.meta.url))

/** The URL without its credentials or query, for the log line. */
function describeTarget(target: string): string {
  return target.startsWith('file:') ? target : target.replace(/\?.*$/, '').replace(/\/\/[^@/]*@/, '//')
}

async function main() {
  if (url.startsWith('file:'))
    mkdirSync('.data', { recursive: true })

  console.info(`Migrating ${describeTarget(url)}`)
  const client = createClient({ url, authToken: env.TURSO_AUTH_TOKEN })
  try {
    const report = await migrateDatabase(client, migrationsDir)
    if (report.adopted)
      console.info(`✓ Adopted an existing database at ${report.recorded.at(-1)} (recorded without running: ${report.recorded.join(', ')})`)
    for (const tag of report.applied)
      console.info(`✓ Applied ${tag}`)
    console.info(report.applied.length ? '✅ Migrations applied' : '✅ Database is up to date')
  }
  finally {
    client.close()
  }
}

main().then(
  // A remote libSQL client can hold the event loop open after close(), which
  // would hang whatever is chained after this command.
  () => process.exit(0),
  (error) => {
    console.error('✗ Migration failed; the database was left as it was:', error)
    process.exit(1)
  },
)
