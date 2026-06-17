import { defineCollection } from '@nuxt/content'
import { z } from 'zod'
import { base } from '../shared/base'

export const examplesEpisodes = defineCollection({
  type: 'page',
  source: {
    include: 'examples/episodes/**/*.md',
    prefix: '/examples/episodes',
  },
  schema: base.extend({
    slug: z.string(),
    podcastSlug: z.string(), // foreign key to podcast
    publishedAt: z.string(),
    duration: z.number().int(), // minutes
    audioUrl: z.string(),
    showNotes: z.string().optional(),
    status: z.enum(['draft', 'published']).default('draft'),
  }),
})
