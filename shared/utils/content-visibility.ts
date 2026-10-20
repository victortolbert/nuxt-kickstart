/**
 * The content visibility rules, as pure functions.
 *
 * Every surface that decides who sees a document reads these: the listing
 * filter (`useVisibilityFilter`), the detail-page guard (`useContentAccess`),
 * and the sitemap hook in `nuxt.config.ts`. One implementation, so the three
 * cannot drift. The audience tiers behind them are ADR-0006.
 */

export interface ContentWithVisibility {
  visibility?: 'public' | 'internal' | 'private' | string
  /** The document's content path (`/posts/...`). Needed for the review gate. */
  path?: string
  /** The date the author vouched for the page. Absent = unreviewed. */
  reviewed?: string | null
  /** The garden status; `wilted` is archived and reads as internal. */
  status?: string | null
}

/** Who is asking: the same descriptor the navigation rules take. */
export interface VisibilityViewer {
  loggedIn: boolean
  isAdmin: boolean
}

/**
 * The review gate: the collections where `public` is a claim the author still
 * has to vouch for. A page under one of these prefixes with
 * `visibility: public` and no `reviewed` date behaves as `internal` — at its
 * URL for a signed-in reader, but not in a visitor's listing or the sitemap —
 * until the date is added. Nothing moves; adding the date is the review.
 *
 * Empty in the template: every shipped collection is curated on the way in.
 * Add a content-path prefix (`'/posts/'`) to gate a collection whose documents
 * are written straight into the repo — notes, drafts, anything an author might
 * mark `public` before reading it twice. A gated collection's schema should
 * declare `reviewed` (it is on the base schema already).
 */
export const REVIEW_GATED_PREFIXES: readonly string[] = []

/** Whether a content path falls in a gated collection, locale prefix or not. */
export function isReviewGated(
  path: string | undefined,
  gated: readonly string[] = REVIEW_GATED_PREFIXES,
): boolean {
  if (!path)
    return false
  const unlocalized = path.replace(/^\/[a-z]{2}(?=\/)/, '')
  return gated.some(prefix => unlocalized.startsWith(prefix))
}

/**
 * The visibility the rules should read: the declared one, except that a
 * `wilted` public page reads as `internal`, and so does an unreviewed `public`
 * page in a gated collection.
 *
 * An item that carries no `path` cannot be placed, so it is not gated — a
 * caller that selects `visibility` without `path` has opted out, which the
 * select-shape test guards against.
 */
export function effectiveVisibility(
  item: ContentWithVisibility,
  gated: readonly string[] = REVIEW_GATED_PREFIXES,
): string {
  const visibility = item.visibility ?? 'private'
  if (visibility !== 'public')
    return visibility
  // Wilted is the archive verdict: off the listings for a visitor, still at
  // its URL for a member. Any collection, reviewed or not.
  if (item.status === 'wilted')
    return 'internal'
  if (isReviewGated(item.path, gated) && !item.reviewed)
    return 'internal'
  return visibility
}

/**
 * Can this viewer see this item?
 *
 * - `public` — everyone
 * - `internal` — signed-in viewers
 * - `private` — admins
 * - missing — treated as `private` (secure by default)
 * - anything else — denied
 */
export function canViewContent(
  item: ContentWithVisibility,
  viewer: VisibilityViewer,
  gated: readonly string[] = REVIEW_GATED_PREFIXES,
): boolean {
  const visibility = effectiveVisibility(item, gated)

  if (visibility === 'public')
    return true

  if (visibility === 'internal')
    return viewer.loggedIn

  if (visibility === 'private')
    return viewer.isAdmin

  return false
}

/** Filter a collection down to what this viewer may see. */
export function filterByVisibility<T extends ContentWithVisibility>(
  items: T[] | null | undefined,
  viewer: VisibilityViewer,
  gated: readonly string[] = REVIEW_GATED_PREFIXES,
): T[] {
  if (!items)
    return []

  return items.filter(item => canViewContent(item, viewer, gated))
}

/**
 * The sitemap entry for a parsed document, or `false` to leave it out — what
 * the `content:file:afterParse` hook in nuxt.config.ts writes to the
 * document's `sitemap` field before `@nuxtjs/sitemap` reads it.
 *
 * Only an effectively public document is listed, so a visitor's sitemap holds
 * exactly what a visitor's listing does. The hook sees frontmatter as written —
 * Zod defaults are applied on insert, not here — so an unset `visibility` is
 * read as `collectionDefault`, the value the row will hold.
 *
 * `loc` is the route that renders the document: a localized collection keeps
 * its locale in the content path (`/en/guides/x`), and `prefix_except_default`
 * serves English unprefixed (`/guides/x`).
 */
export function contentSitemapEntry(
  doc: ContentWithVisibility,
  collectionDefault: string | undefined,
): { loc: string } | false {
  if (!doc.path)
    return false
  const visibility = doc.visibility ?? collectionDefault
  if (effectiveVisibility({ ...doc, visibility }) !== 'public')
    return false
  return { loc: doc.path.replace(/^\/en(?=\/)/, '') }
}
