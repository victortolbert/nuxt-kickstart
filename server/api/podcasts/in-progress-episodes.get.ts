import { queryCollection } from '@nuxt/content/server'
import { and, eq, gt } from 'drizzle-orm'
import { db } from '#server/podcasts-db'
import { playbackProgress } from '#server/podcasts-db/schema'

// Pattern: Playback states as filterable resources
// GET /api/podcasts/in-progress-episodes
// Returns episodes with playback progress > 0 and completed = false

export default defineEventHandler(async (event) => {
  // Get userId from session, fallback to 'anonymous'
  const session = await getUserSession(event)
  const userId = session.user?.id || 'anonymous'

  // Query in-progress playback records (position > 0 and not completed)
  const progressRecords = await db
    .select()
    .from(playbackProgress)
    .where(
      and(
        eq(playbackProgress.userId, userId),
        gt(playbackProgress.position, 0),
        eq(playbackProgress.completed, false),
      ),
    )
    .all()

  // If no progress records, return empty array
  if (progressRecords.length === 0) {
    return []
  }

  // Query all episodes from content collection
  const allEpisodes = await queryCollection(event, 'examplesEpisodes').all()

  // Join progress with episode data
  const inProgressEpisodes = progressRecords
    .map((progress) => {
      const episode = allEpisodes.find(ep => ep.slug === progress.episodeSlug)
      if (!episode)
        return null

      return {
        ...episode,
        progress: {
          position: progress.position,
          completed: progress.completed,
          updatedAt: progress.updatedAt,
        },
      }
    })
    .filter((episode): episode is NonNullable<typeof episode> => episode !== null)

  return inProgressEpisodes
})
