// Pattern: Progress is independent property, separate resource from episode
// PUT /api/podcasts/playback-progress/[episodeSlug]
// Updates playback progress for a specific episode

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

  // Parse request body
  const body = await readBody(event)
  const { position, completed } = body

  if (typeof position !== 'number' || position < 0) {
    throw createError({
      statusCode: 400,
      message: 'Valid position (seconds) is required',
    })
  }

  // Check if progress record exists
  const existing = await db
    .select()
    .from(playbackProgress)
    .where(
      and(
        eq(playbackProgress.userId, userId),
        eq(playbackProgress.episodeSlug, episodeSlug),
      ),
    )
    .get()

  const now = new Date()

  if (existing) {
    // Update existing record
    const updated = await db
      .update(playbackProgress)
      .set({
        position,
        completed: completed ?? existing.completed,
        updatedAt: now,
      })
      .where(eq(playbackProgress.id, existing.id))
      .returning()
      .get()

    return updated
  }
  else {
    // Create new record
    const created = await db
      .insert(playbackProgress)
      .values({
        userId,
        episodeSlug,
        position,
        completed: completed ?? false,
        updatedAt: now,
      })
      .returning()
      .get()

    return created
  }
})
