#!/usr/bin/env bun
/**
 * Add login activity tracking columns to user table (lastLoginAt, loginCount)
 */

import { createClient } from '@libsql/client'

const client = createClient({
  // eslint-disable-next-line node/no-process-env
  url: process.env.TURSO_DATABASE_URL || 'file:.data/auth.db',
  // eslint-disable-next-line node/no-process-env
  authToken: process.env.TURSO_AUTH_TOKEN,
})

async function addLoginTrackingColumns() {
  console.log('Adding login tracking columns to user table...')

  try {
    // Add lastLoginAt column (nullable integer timestamp)
    await client.execute(`
      ALTER TABLE user ADD COLUMN last_login_at INTEGER
    `)
    console.log('✅ last_login_at column added')
  }
  catch (error: any) {
    if (error.message.includes('duplicate column name')) {
      console.log('✓ last_login_at column already exists')
    }
    else {
      throw error
    }
  }

  try {
    // Add loginCount column (integer, default 0)
    await client.execute(`
      ALTER TABLE user ADD COLUMN login_count INTEGER DEFAULT 0
    `)
    console.log('✅ login_count column added')
  }
  catch (error: any) {
    if (error.message.includes('duplicate column name')) {
      console.log('✓ login_count column already exists')
    }
    else {
      throw error
    }
  }

  console.log('✅ All login tracking columns added successfully')
}

addLoginTrackingColumns().catch((err) => {
  console.error('Failed to add login tracking columns:', err)
  process.exit(1)
})
