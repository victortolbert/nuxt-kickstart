/// <reference types="node" />
import type { Config } from 'drizzle-kit'
import { dirname } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { schemaFiles } from './server/db/schema-files'

const rootDir = dirname(fileURLToPath(import.meta.url))

export default {
  // The base schema and every layer's (server/db/schema-files.ts).
  schema: schemaFiles(rootDir),
  out: './server/db/migrations',
  dialect: 'turso',
  dbCredentials: {
    // eslint-disable-next-line node/no-process-env
    url: process.env.TURSO_DATABASE_URL || 'file:.data/auth.db',
    // eslint-disable-next-line node/no-process-env
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
} satisfies Config
