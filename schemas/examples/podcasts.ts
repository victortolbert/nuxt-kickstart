import { defineCollection } from '@nuxt/content'
import { z } from 'zod'
import { base } from '../shared/base'

export const examplesPodcasts = defineCollection({
  type: 'page',
  source: {
    include: 'examples/podcasts/**/*.md',
    prefix: '/examples/podcasts',
  },
  schema: base.extend({
    slug: z.string(),
    author: z.string(),
    coverImage: z.string().optional(),
    website: z.string().optional(),
    feedUrl: z.string().optional(),
    categories: z.array(z.string()).default([]),
  }),
})
