import { createClient } from '@libsql/client'
import { eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/libsql'
import * as schema from '#server/db/schema'
import { manageUsers } from '#shared/utils/abilities'

// Create libsql client (same as auth.ts)
const client = createClient({
  // eslint-disable-next-line node/no-process-env
  url: process.env.TURSO_DATABASE_URL || 'file:.data/auth.db',
  // eslint-disable-next-line node/no-process-env
  authToken: process.env.TURSO_AUTH_TOKEN,
})

// Create Drizzle instance
const db = drizzle(client, { schema })

export default defineEventHandler(async (event) => {
  // Require admin role
  await authorizeUser(event, manageUsers)

  // Get user ID from route params
  const userId = getRouterParam(event, 'id')

  if (!userId) {
    throw createError({
      statusCode: 400,
      message: 'User ID is required',
    })
  }

  try {
    // Query account table for this user's linked accounts
    const accounts = await db
      .select({
        id: schema.account.id,
        providerId: schema.account.providerId,
        accountId: schema.account.accountId,
        createdAt: schema.account.createdAt,
      })
      .from(schema.account)
      .where(eq(schema.account.userId, userId))

    // Return 404 if no accounts found
    if (accounts.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'No accounts found for this user',
      })
    }

    return accounts
  }
  catch (error) {
    // If the error is already a createError, rethrow it
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    // Otherwise, wrap as 500 error
    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : 'Failed to fetch user accounts',
    })
  }
})
