import { eq } from 'drizzle-orm'
import { db } from '#server/podcasts-db'
import { subscriptions } from '#server/podcasts-db/schema'

// Pattern: Pivot models are their own resource, not /podcasts/[id]/unsubscribe
// This endpoint deletes a subscription by ID
export default defineEventHandler(async (event) => {
  // Get userId from session (use 'anonymous' if not logged in)
  const session = await getUserSession(event)
  const userId = session.user?.id || 'anonymous'

  // Get subscription ID from route params
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Subscription ID is required',
    })
  }

  // Delete the subscription (ensure it belongs to the current user)
  const result = await db
    .delete(subscriptions)
    .where(eq(subscriptions.id, Number.parseInt(id)))
    .returning()

  const deletedSubscription = result[0]

  if (!deletedSubscription) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Subscription not found',
    })
  }

  // Verify the subscription belonged to the current user
  if (deletedSubscription.userId !== userId) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Unauthorized to delete this subscription',
    })
  }

  return { success: true, deleted: deletedSubscription }
})
