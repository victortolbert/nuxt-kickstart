import { defineSitemapSchema } from '@nuxtjs/seo/content'
import { z } from 'zod'
import { horizon, status, visibility } from './enums'

export const base = z.object({
  title: z.string(),
  description: z.string().optional(),
  tags: z.array(z.string()).default([]),
  status,
  visibility,
  horizon,
  created: z.string().optional(),
  updated: z.string().optional(),
  /**
   * The date the author vouched for the page. In a review-gated collection
   * (see REVIEW_GATED_PREFIXES in shared/utils/content-visibility.ts) a
   * `public` page is held as `internal` until this is set; adding the date is
   * the review. Ungated collections may carry it as a record.
   */
  reviewed: z.string().optional(),
  /**
   * The sitemap entry `@nuxtjs/sitemap` fills in at parse time — declaring the
   * field is what opts a collection into the sitemap at all. Which documents
   * make it is decided in `nuxt.config.ts` (`content:file:afterParse`), where
   * anything not effectively public is set to `false` before the module sees
   * it. Authors do not set this.
   */
  sitemap: defineSitemapSchema({ z }),
})
