#!/usr/bin/env bun
/**
 * Add admin plugin columns to user table (banned, banReason, banExpires)
 */

import { createClient } from '@libsql/client'

const client = createClient({
  // eslint-disable-next-line node/no-process-env
  url: process.env.TURSO_DATABASE_URL || 'file:.data/auth.db',
  // eslint-disable-next-line node/no-process-env
  authToken: process.env.TURSO_AUTH_TOKEN,
})

async function addAdminColumns() {
  console.log('Adding admin plugin columns to user table...')

  try {
    // Add banned column (boolean, default false)
    await client.execute(`
      ALTER TABLE user ADD COLUMN banned INTEGER DEFAULT 0
    `)
    console.log('✅ banned column added')
  }
  catch (error: any) {
    if (error.message.includes('duplicate column name')) {
      console.log('✓ banned column already exists')
    }
    else {
      throw error
    }
  }

  try {
    // Add banReason column (nullable text)
    await client.execute(`
      ALTER TABLE user ADD COLUMN ban_reason TEXT
    `)
    console.log('✅ ban_reason column added')
  }
  catch (error: any) {
    if (error.message.includes('duplicate column name')) {
      console.log('✓ ban_reason column already exists')
    }
    else {
      throw error
    }
  }

  try {
    // Add banExpires column (nullable integer timestamp)
    await client.execute(`
      ALTER TABLE user ADD COLUMN ban_expires INTEGER
    `)
    console.log('✅ ban_expires column added')
  }
  catch (error: any) {
    if (error.message.includes('duplicate column name')) {
      console.log('✓ ban_expires column already exists')
    }
    else {
      throw error
    }
  }

  console.log('✅ All admin plugin columns added successfully')
}

addAdminColumns().catch((err) => {
  console.error('Failed to add admin columns:', err)
  process.exit(1)
})
