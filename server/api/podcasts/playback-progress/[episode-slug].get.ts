// Pattern: Progress is independent property, separate resource from episode
// GET /api/podcasts/playback-progress/[episodeSlug]
// Returns playback progress for a specific episode for the current user

import { and, eq } from 'drizzle-orm'
import { db } from '#server/podcasts-db'
import { playbackProgress } from '#server/podcasts-db/schema'

export default defineEventHandler(async (event) => {
  const episodeSlug = getRouterParam(event, 'episodeSlug')

  if (!episodeSlug) {
    throw createError({
      statusCode: 400,
      message: 'Episode slug is required',
    })
  }

  // Get userId from session, fallback to 'anonymous'
  const session = await getUserSession(event)
  const userId = session.user?.id || 'anonymous'

  // Query progress for this episode and user
  const progress = await db
    .select()
    .from(playbackProgress)
    .where(
      and(
        eq(playbackProgress.userId, userId),
        eq(playbackProgress.episodeSlug, episodeSlug),
      ),
    )
    .get()

  if (!progress) {
    throw createError({
      statusCode: 404,
      message: 'Progress not found',
    })
  }

  return progress
})
