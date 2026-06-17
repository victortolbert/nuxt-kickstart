import { and, eq } from 'drizzle-orm'
import { db } from '#server/podcasts-db'
import { playbackProgress } from '#server/podcasts-db/schema'

// DELETE /api/podcasts/playback-progress/[episodeSlug]
// Deletes playback progress for a specific episode

export default defineEventHandler(async (event) => {
  // Get userId from session, fallback to 'anonymous'
  const session = await getUserSession(event)
  const userId = session.user?.id || 'anonymous'

  // Get episode slug from route params
  const episodeSlug = getRouterParam(event, 'episode-slug')

  if (!episodeSlug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Episode slug is required',
    })
  }

  // Delete the progress record
  await db
    .delete(playbackProgress)
    .where(
      and(
        eq(playbackProgress.userId, userId),
        eq(playbackProgress.episodeSlug, episodeSlug),
      ),
    )
    .run()

  return { success: true }
})
