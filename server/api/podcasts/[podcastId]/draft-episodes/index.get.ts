// Pattern: State as Resource
// Different states (published/draft) modeled as different resources
// Draft episodes require authentication (admin/author access)

import { queryCollection } from '@nuxt/content/server'

export default defineEventHandler(async (event) => {
  const podcastId = getRouterParam(event, 'podcastId')

  if (!podcastId) {
    throw createError({
      statusCode: 400,
      message: 'Podcast ID is required',
    })
  }

  // TODO: Add authentication check when auth is implemented
  // For now, this endpoint is accessible but would require auth in production
  const session = await getUserSession(event)
  if (!session.user) {
    throw createError({
      statusCode: 401,
      message: 'Authentication required to view draft episodes',
    })
  }

  // Query episodes collection filtered by podcast and draft status
  const episodes = await queryCollection(event, 'examplesEpisodes')
    .all()

  const draftEpisodes = episodes.filter(
    episode => episode.podcastSlug === podcastId && episode.status === 'draft',
  )

  return draftEpisodes
})
