import { defineCollection } from '@nuxt/content'
import { z } from 'zod'
import { base } from '../shared/base'

export const posts = defineCollection({
  type: 'page',
  source: {
    include: 'en/posts/**/*.md',
    prefix: '/posts',
  },
  schema: base.extend({
    date: z.string().optional(),
    author: z.string().optional(),
    image: z.string().optional(),
  }),
})
