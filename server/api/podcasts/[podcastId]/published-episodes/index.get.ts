// Pattern: State as Resource
// Different states (published/draft) modeled as different resources
// This allows filtering, permissions, and operations to be resource-specific

import { queryCollection } from '@nuxt/content/server'

export default defineEventHandler(async (event) => {
  const podcastId = getRouterParam(event, 'podcastId')

  if (!podcastId) {
    throw createError({
      statusCode: 400,
      message: 'Podcast ID is required',
    })
  }

  // Query episodes collection filtered by podcast and published status
  const episodes = await queryCollection(event, 'examplesEpisodes')
    .all()

  const publishedEpisodes = episodes.filter(
    episode => episode.podcastSlug === podcastId && episode.status === 'published',
  )

  return publishedEpisodes
})
