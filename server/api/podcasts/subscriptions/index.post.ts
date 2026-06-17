import { db } from '#server/podcasts-db'
import { subscriptions } from '#server/podcasts-db/schema'

// Pattern: Pivot models are their own resource, not /podcasts/[id]/subscribe
// This endpoint creates a new subscription
export default defineEventHandler(async (event) => {
  // Get userId from session (use 'anonymous' if not logged in)
  const session = await getUserSession(event)
  const userId = session.user?.id || 'anonymous'

  // Read the request body for podcastSlug
  const body = await readBody(event)
  const { podcastSlug } = body

  if (!podcastSlug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'podcastSlug is required',
    })
  }

  // Insert new subscription
  const result = await db.insert(subscriptions).values({
    userId,
    podcastSlug,
    createdAt: new Date(),
  }).returning()

  return result[0]
})
