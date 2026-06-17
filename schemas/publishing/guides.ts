import { defineCollection } from '@nuxt/content'
import { z } from 'zod'
import { base } from '../shared/base'

export const guides = defineCollection({
  type: 'page',
  // Both locales live in one collection; paths keep their locale prefix
  // (/en/guides/*, /es/guides/*) so pages can resolve the current locale
  // with an English fallback. See app/utils/localized-collection.ts.
  // Add a source entry here when adding a locale.
  source: [
    { include: 'en/guides/**/*.md' },
    { include: 'es/guides/**/*.md' },
  ],
  schema: base.extend({
    category: z
      .enum(['getting-started', 'authentication', 'content', 'customization', 'deployment', 'other'])
      .default('other'),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
    prerequisites: z.array(z.string()).default([]),
    order: z.number().default(0),
    machineTranslated: z.boolean().default(false),
  }),
})
