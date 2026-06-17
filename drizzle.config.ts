/// <reference types="node" />
import type { Config } from 'drizzle-kit'
import process from 'node:process'

export default {
  schema: './server/db/schema.ts',
  dialect: 'turso',
  dbCredentials: {
    // eslint-disable-next-line node/no-process-env
    url: process.env.TURSO_DATABASE_URL || 'file:.data/auth.db',
    // eslint-disable-next-line node/no-process-env
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
} satisfies Config
