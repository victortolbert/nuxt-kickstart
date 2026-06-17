// Pattern: Progress is independent property, separate resource from episode
// GET /api/podcasts/playback-progress
// Returns all playback progress records for the current user

import { eq } from 'drizzle-orm'
import { db } from '#server/podcasts-db'
import { playbackProgress } from '#server/podcasts-db/schema'

export default defineEventHandler(async (event) => {
  // Get userId from session, fallback to 'anonymous'
  const session = await getUserSession(event)
  const userId = session.user?.id || 'anonymous'

  // Query all playback progress for this user
  const progress = await db
    .select()
    .from(playbackProgress)
    .where(eq(playbackProgress.userId, userId))
    .all()

  return progress
})
