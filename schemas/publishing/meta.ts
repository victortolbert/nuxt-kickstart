import { defineCollection } from '@nuxt/content'
import { z } from 'zod'
import { createCollectionSource } from '../../shared/utils/content-source'
import { base } from '../shared/base'

const metaKind = z.enum(['index', 'lens', 'portal', 'landing', 'other']).default('other')

export const meta = defineCollection({
  type: 'page',
  source: createCollectionSource('_meta/**/*.md', 'meta'),
  schema: base.extend({
    slug: z.string().optional(),
    metaKind,
  }),
})
