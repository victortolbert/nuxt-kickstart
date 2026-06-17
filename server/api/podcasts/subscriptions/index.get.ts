import { eq } from 'drizzle-orm'
import { db } from '#server/podcasts-db'
import { subscriptions } from '#server/podcasts-db/schema'

// Pattern: Pivot models are their own resource, not /podcasts/[id]/subscribe
// This endpoint lists all subscriptions for the current user
export default defineEventHandler(async (event) => {
  // Get userId from session (use 'anonymous' if not logged in)
  const session = await getUserSession(event)
  const userId = session.user?.id || 'anonymous'

  // Query subscriptions for this user
  const userSubscriptions = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))

  return userSubscriptions
})
