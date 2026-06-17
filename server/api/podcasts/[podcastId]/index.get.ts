import { queryCollection } from '@nuxt/content/server'

export default defineEventHandler(async (event) => {
  const podcastId = getRouterParam(event, 'podcastId')

  if (!podcastId) {
    throw createError({
      statusCode: 400,
      message: 'Podcast ID is required',
    })
  }

  // Query the examplesPodcasts collection and filter by slug
  const podcasts = await queryCollection(event, 'examplesPodcasts').all()

  // Find the podcast matching the slug
  const podcast = podcasts.find(p => p.slug === podcastId)

  if (!podcast) {
    throw createError({
      statusCode: 404,
      message: `Podcast with slug "${podcastId}" not found`,
    })
  }

  return podcast
})
