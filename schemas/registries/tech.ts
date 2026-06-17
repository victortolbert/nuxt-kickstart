import { defineCollection } from '@nuxt/content'
import { z } from 'zod'
import { createCollectionSource } from '../../shared/utils/content-source'
import { base } from '../shared/base'
import { icon } from '../shared/icon'

/**
 * Technology taxonomy categories. The /tech page rolls these up into coarse
 * display buckets (Languages, Frameworks, …) — see app/utils/tech-taxonomy.ts.
 */
export const techCategory = z.enum([
  'programming-language',
  'scripting-language',
  'markup-language',
  'templating-language',
  'frontend-framework',
  'backend-framework',
  'full-stack-framework',
  'meta-framework',
  'library',
  'ui-library',
  'mobile-framework',
  'data-app-framework',
  'build-tool',
  'testing-framework',
  'testing-tool',
  'linting-tool',
  'design-tool',
  'platform',
  'full-stack-adapter',
  'tool',
  'other',
])

export const tech = defineCollection({
  type: 'page',
  source: createCollectionSource('tech/**/*.md', 'tech'),
  schema: base.extend({
    slug: z.string(),
    /** Display label; falls back to `title` when omitted. */
    displayName: z.string().optional(),
    /** Brand icon (e.g. `logos:nuxt-icon`). Iconify provider by default. */
    icon: icon.default({ provider: 'iconify' }),
    category: techCategory,
    secondaryCategories: z.array(techCategory).default([]),
    ecosystem: z.string().optional(),
    website: z.string().url().optional(),
    relatedTech: z.array(z.string()).default([]),
    aliases: z.array(z.string()).default([]),
    maturity: z.enum(['emerging', 'active', 'mature', 'legacy', 'deprecated']).default('active'),
    usageContexts: z.array(z.string()).default([]),
    notes: z.string().optional(),
  }),
})
