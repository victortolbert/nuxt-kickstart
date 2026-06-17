import { defineCollection } from '@nuxt/content'
import { z } from 'zod'
import { base } from '../../shared/base'

export const emailDrafts = defineCollection({
  type: 'page',
  source: {
    include: 'email-drafts/**/*.md',
    prefix: '/email-drafts',
  },
  schema: base.extend({
    subject: z.string(),
    body: z.string(),
    template: z.enum(['newsletter', 'announcement', 'personal']).default('newsletter'),

    recipientMode: z.enum(['manual', 'list']).default('manual'),
    recipients: z.array(z.string()).default([]),
    listSlug: z.string().optional(),

    scheduledAt: z.string().optional(),
    status: z.enum(['draft', 'scheduled', 'sent']).default('draft'),
    sentAt: z.string().optional(),

    createdAt: z.string().optional(),
  }),
})
