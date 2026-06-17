import { queryCollection } from '@nuxt/content/server'

// Pattern: Nested resources get dedicated routes, not actions on parent
// This endpoint lists all published episodes for a specific podcast
export default defineEventHandler(async (event) => {
  const podcastId = getRouterParam(event, 'podcastId')

  if (!podcastId) {
    throw createError({
      statusCode: 400,
      message: 'Podcast ID is required',
    })
  }

  // Query episodes for this podcast, filter by podcastSlug and published status
  const episodes = await queryCollection(event, 'examplesEpisodes')
    .all()

  // Filter by podcastSlug and status=published
  const filteredEpisodes = episodes.filter(
    episode => episode.podcastSlug === podcastId && episode.status === 'published',
  )

  return filteredEpisodes
})
