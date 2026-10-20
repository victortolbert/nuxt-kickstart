import { defineCollection } from '@nuxt/content'
import { z } from 'zod'
import { base } from '../shared/base'

const vendor = z.enum(['apple', 'third-party']).default('third-party')
const platform = z.enum(['ios', 'ipados', 'macos', 'watchos', 'tvos', 'visionos', 'web', 'android', 'windows', 'linux'])

export const apps = defineCollection({
  type: 'page',
  source: {
    include: 'en/apps/**/*.md',
    prefix: '/apps',
  },
  // No route renders an app on its own (they are read by /blocks pages), so
  // the collection stays out of the sitemap: listing one would be a 404.
  schema: base.omit({ sitemap: true }).extend({
    kind: z.literal('app').default('app'),
    slug: z.string(),
    vendor,
    platforms: z.array(platform).default([]),
    category: z.string().optional(),
    bundleId: z.string().optional(),
    appStoreUrl: z.string().optional(),
    websiteUrl: z.string().optional(),
    /** Slugs of the blocks belonging to this app (see the `blocks` registry). */
    blocks: z.array(z.string()).default([]),
  }),
})
