import { queryCollection } from '@nuxt/content/server'
import { and, eq } from 'drizzle-orm'
import { db } from '#server/podcasts-db'
import { playbackProgress } from '#server/podcasts-db/schema'

// Pattern: Playback states as filterable resources
// GET /api/podcasts/completed-episodes
// Returns episodes with completed = true

export default defineEventHandler(async (event) => {
  // Get userId from session, fallback to 'anonymous'
  const session = await getUserSession(event)
  const userId = session.user?.id || 'anonymous'

  // Query completed playback records
  const progressRecords = await db
    .select()
    .from(playbackProgress)
    .where(
      and(
        eq(playbackProgress.userId, userId),
        eq(playbackProgress.completed, true),
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
  const completedEpisodes = progressRecords
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

  return completedEpisodes
})
