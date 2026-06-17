import { queryCollection } from '@nuxt/content/server'

// Pattern: Nested resources get dedicated routes, not actions on parent
// This endpoint returns a single episode by slug within a podcast context
export default defineEventHandler(async (event) => {
  const podcastId = getRouterParam(event, 'podcastId')
  const episodeId = getRouterParam(event, 'episode-id')

  if (!podcastId) {
    throw createError({
      statusCode: 400,
      message: 'Podcast ID is required',
    })
  }

  if (!episodeId) {
    throw createError({
      statusCode: 400,
      message: 'Episode ID is required',
    })
  }

  // Query episodes collection
  const episodes = await queryCollection(event, 'examplesEpisodes').all()

  // Find episode by slug and podcastSlug
  const episode = episodes.find(
    ep => ep.slug === episodeId && ep.podcastSlug === podcastId,
  )

  if (!episode) {
    throw createError({
      statusCode: 404,
      message: 'Episode not found',
    })
  }

  return episode
})
