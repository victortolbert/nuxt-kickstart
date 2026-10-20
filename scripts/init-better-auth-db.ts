#!/usr/bin/env tsx
/**
 * Initialize Better Auth database tables
 * Creates user, session, account, and verification tables
 */

import { createClient } from '@libsql/client'

const client = createClient({
  // eslint-disable-next-line node/no-process-env
  url: process.env.TURSO_DATABASE_URL || 'file:.data/auth.db',
  // eslint-disable-next-line node/no-process-env
  authToken: process.env.TURSO_AUTH_TOKEN,
})

async function addColumnIfMissing(table: string, column: string, type: string) {
  const { rows } = await client.execute(`PRAGMA table_info(${table})`)
  if (!rows.some(row => row.name === column))
    await client.execute(`ALTER TABLE ${table} ADD COLUMN ${column} ${type}`)
}

async function init() {
  console.log('Creating Better Auth tables...')

  // Create user table with all columns from schema
  await client.execute(`
    CREATE TABLE IF NOT EXISTS user (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      email_verified INTEGER NOT NULL DEFAULT 0,
      image TEXT,
      created_at INTEGER NOT NULL DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)),
      updated_at INTEGER NOT NULL DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)),
      phone_number TEXT UNIQUE,
      phone_number_verified INTEGER,
      role TEXT NOT NULL DEFAULT 'viewer',
      banned INTEGER DEFAULT 0,
      ban_reason TEXT,
      ban_expires INTEGER,
      last_login_at INTEGER,
      login_count INTEGER DEFAULT 0
    )
  `)
  console.log('✓ user table created')

  // Create session table
  await client.execute(`
    CREATE TABLE IF NOT EXISTS session (
      id TEXT PRIMARY KEY,
      expires_at INTEGER NOT NULL,
      token TEXT NOT NULL UNIQUE,
      created_at INTEGER NOT NULL DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)),
      updated_at INTEGER NOT NULL DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)),
      ip_address TEXT,
      user_agent TEXT,
      impersonated_by TEXT,
      user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE
    )
  `)
  // CREATE TABLE IF NOT EXISTS leaves a database created before a column was
  // added untouched, so add it to existing tables too.
  await addColumnIfMissing('session', 'impersonated_by', 'TEXT')
  await client.execute('CREATE INDEX IF NOT EXISTS session_userId_idx ON session(user_id)')
  console.log('✓ session table created')

  // Create account table
  await client.execute(`
    CREATE TABLE IF NOT EXISTS account (
      id TEXT PRIMARY KEY,
      account_id TEXT NOT NULL,
      provider_id TEXT NOT NULL,
      user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
      access_token TEXT,
      refresh_token TEXT,
      id_token TEXT,
      access_token_expires_at INTEGER,
      refresh_token_expires_at INTEGER,
      scope TEXT,
      password TEXT,
      created_at INTEGER NOT NULL DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)),
      updated_at INTEGER NOT NULL DEFAULT (cast(unixepoch('subsecond') * 1000 as integer))
    )
  `)
  await client.execute('CREATE INDEX IF NOT EXISTS account_userId_idx ON account(user_id)')
  console.log('✓ account table created')

  // Create verification table
  await client.execute(`
    CREATE TABLE IF NOT EXISTS verification (
      id TEXT PRIMARY KEY,
      identifier TEXT NOT NULL,
      value TEXT NOT NULL,
      expires_at INTEGER NOT NULL,
      created_at INTEGER NOT NULL DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)),
      updated_at INTEGER NOT NULL DEFAULT (cast(unixepoch('subsecond') * 1000 as integer))
    )
  `)
  await client.execute('CREATE INDEX IF NOT EXISTS verification_identifier_idx ON verification(identifier)')
  console.log('✓ verification table created')

  console.log('✅ Better Auth tables initialized successfully')
}

init().catch((err) => {
  console.error('Failed to initialize Better Auth tables:', err)
  process.exit(1)
})
