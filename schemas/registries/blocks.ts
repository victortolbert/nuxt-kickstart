import { defineCollection } from '@nuxt/content'
import { z } from 'zod'
import { base } from '../shared/base'

/**
 * Blocks: OS-level app features like widgets, shortcuts, extensions and
 * integrations, grouped under a parent app (see the `apps` registry).
 */

const blockType = z.enum([
  'widget',
  'shortcut-action',
  'extension',
  'share-sheet',
  'menu-bar',
  'integration',
  'settings',
  'api',
]).default('widget')

const platform = z.enum(['ios', 'ipados', 'macos', 'watchos', 'tvos', 'visionos', 'web', 'android', 'windows', 'linux'])

export const blocks = defineCollection({
  type: 'page',
  source: {
    include: 'en/blocks/**/*.md',
    prefix: '/blocks',
  },
  schema: base.extend({
    kind: z.literal('block').default('block'),
    slug: z.string(),
    /** Slug of the parent app this block belongs to (see the `apps` registry). */
    app: z.string(),
    blockType,
    platforms: z.array(platform).default([]),
    entryPoints: z.array(z.string()).default([]),
    jobsToBeDone: z.array(z.string()).default([]),
  }),
})
