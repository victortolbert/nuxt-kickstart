#!/usr/bin/env bun
/**
 * Add role column to user table
 */

import { createClient } from '@libsql/client'

const client = createClient({
  // eslint-disable-next-line node/no-process-env
  url: process.env.TURSO_DATABASE_URL || 'file:.data/auth.db',
  // eslint-disable-next-line node/no-process-env
  authToken: process.env.TURSO_AUTH_TOKEN,
})

async function addRoleColumn() {
  console.log('Adding role column to user table...')

  try {
    await client.execute(`
      ALTER TABLE user ADD COLUMN role TEXT DEFAULT 'viewer' NOT NULL
    `)
    console.log('✅ Role column added successfully')
  }
  catch (error: any) {
    if (error.message.includes('duplicate column name')) {
      console.log('✓ Role column already exists')
    }
    else {
      throw error
    }
  }
}

addRoleColumn().catch((err) => {
  console.error('Failed to add role column:', err)
  process.exit(1)
})
