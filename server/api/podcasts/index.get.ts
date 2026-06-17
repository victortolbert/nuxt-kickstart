import { queryCollection } from '@nuxt/content/server'

/** List all podcasts (the examplesPodcasts collection). GET /api/podcasts */
export default defineEventHandler(async (event) => {
  return queryCollection(event, 'examplesPodcasts').all()
})
