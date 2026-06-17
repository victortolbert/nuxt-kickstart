import { defineCollection } from '@nuxt/content'
import { z } from 'zod'
import { base } from '../../shared/base'

export const emailLists = defineCollection({
  type: 'page',
  source: {
    include: 'email-lists/**/*.md',
    prefix: '/email-lists',
  },
  schema: base.extend({
    name: z.string(),
    contacts: z
      .array(
        z.object({
          email: z.string().email(),
          name: z.string().optional(),
        }),
      )
      .default([]),
    createdAt: z.string().optional(),
  }),
})
