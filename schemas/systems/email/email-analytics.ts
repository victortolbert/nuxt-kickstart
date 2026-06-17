import { defineCollection } from '@nuxt/content'
import { z } from 'zod'
import { base } from '../../shared/base'

export const emailAnalytics = defineCollection({
  type: 'page',
  source: {
    include: 'email-analytics/**/*.md',
    prefix: '/email-analytics',
  },
  schema: base.extend({
    emailId: z.string(),
    recipient: z.string().email(),

    opens: z.array(z.object({ timestamp: z.string() })).default([]),
    clicks: z.array(z.object({ timestamp: z.string(), url: z.string() })).default([]),
  }),
})
