import { defineCollection } from '@nuxt/content'
import { z } from 'zod'
import { createCollectionSource } from '../../shared/utils/content-source'
import { base } from '../shared/base'

const metaKind = z.enum(['index', 'lens', 'portal', 'landing', 'other']).default('other')

export const meta = defineCollection({
  type: 'page',
  source: createCollectionSource('_meta/**/*.md', 'meta'),
  // Landing/system copy read by other pages, never a route of its own, so
  // the collection stays out of the sitemap.
  schema: base.omit({ sitemap: true }).extend({
    slug: z.string().optional(),
    metaKind,
  }),
})
