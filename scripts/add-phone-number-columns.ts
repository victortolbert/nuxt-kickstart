import { createClient } from '@libsql/client'

// Add phoneNumber and phoneNumberVerified columns to user table
async function addPhoneNumberColumns() {
  // eslint-disable-next-line node/no-process-env
  const url = process.env.TURSO_DATABASE_URL || 'file:.data/auth.db'
  // eslint-disable-next-line node/no-process-env
  const authToken = process.env.TURSO_AUTH_TOKEN

  const client = createClient({
    url,
    authToken,
  })

  try {
    // Check if columns already exist
    const tableInfo = await client.execute('PRAGMA table_info(user)')
    const columns = tableInfo.rows.map(row => row.name)

    if (!columns.includes('phone_number')) {
      console.log('Adding phone_number column...')
      await client.execute('ALTER TABLE user ADD COLUMN phone_number TEXT')
      console.log('✓ phone_number column added')
    }
    else {
      console.log('✓ phone_number column already exists')
    }

    if (!columns.includes('phone_number_verified')) {
      console.log('Adding phone_number_verified column...')
      await client.execute('ALTER TABLE user ADD COLUMN phone_number_verified INTEGER')
      console.log('✓ phone_number_verified column added')
    }
    else {
      console.log('✓ phone_number_verified column already exists')
    }

    console.log('\n✅ Phone number columns migration complete!')
  }
  catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

addPhoneNumberColumns()
