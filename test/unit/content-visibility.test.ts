import { describe, expect, it } from 'vitest'
import {
  canViewContent,
  contentSitemapEntry,
  effectiveVisibility,
  filterByVisibility,
  isReviewGated,
  REVIEW_GATED_PREFIXES,
} from '../../shared/utils/content-visibility'

/**
 * The content visibility rules, exercised as behavior. They are testable at all
 * because they are pure functions; the composables that read the session
 * (`useVisibilityFilter`, `useContentAccess`) only build the viewer and delegate.
 */

const VISITOR = { loggedIn: false, isAdmin: false }
const MEMBER = { loggedIn: true, isAdmin: false }
const OWNER = { loggedIn: true, isAdmin: true }

describe('canViewContent', () => {
  it('shows public content to everyone', () => {
    for (const viewer of [VISITOR, MEMBER, OWNER])
      expect(canViewContent({ visibility: 'public' }, viewer)).toBe(true)
  })

  it('shows internal content only to signed-in viewers', () => {
    expect(canViewContent({ visibility: 'internal' }, VISITOR)).toBe(false)
    expect(canViewContent({ visibility: 'internal' }, MEMBER)).toBe(true)
    expect(canViewContent({ visibility: 'internal' }, OWNER)).toBe(true)
  })

  it('shows private content only to the owner (admin)', () => {
    expect(canViewContent({ visibility: 'private' }, VISITOR)).toBe(false)
    expect(canViewContent({ visibility: 'private' }, MEMBER)).toBe(false)
    expect(canViewContent({ visibility: 'private' }, OWNER)).toBe(true)
  })

  it('treats missing visibility as private', () => {
    expect(canViewContent({}, VISITOR)).toBe(false)
    expect(canViewContent({}, MEMBER)).toBe(false)
    expect(canViewContent({}, OWNER)).toBe(true)
  })

  it('denies unrecognized visibility values rather than passing them through', () => {
    for (const value of ['Public', 'shared', '', 'yes'])
      expect(canViewContent({ visibility: value }, VISITOR), value).toBe(false)
  })

  it('does not let an unrecognized value reach even the owner by accident', () => {
    // The owner legitimately sees everything; the point is that this is denied
    // by the fallback rather than granted by one.
    expect(canViewContent({ visibility: 'bogus' }, OWNER)).toBe(false)
  })
})

describe('filterByVisibility', () => {
  const items = [
    { id: 'pub', visibility: 'public' },
    { id: 'int', visibility: 'internal' },
    { id: 'priv', visibility: 'private' },
    { id: 'unset' },
    { id: 'bogus', visibility: 'nonsense' },
  ]

  it('gives a visitor only public items', () => {
    expect(filterByVisibility(items, VISITOR).map(i => i.id)).toEqual(['pub'])
  })

  it('gives a member public and internal items', () => {
    expect(filterByVisibility(items, MEMBER).map(i => i.id)).toEqual(['pub', 'int'])
  })

  it('gives the owner everything except the unrecognized value', () => {
    expect(filterByVisibility(items, OWNER).map(i => i.id)).toEqual(['pub', 'int', 'priv', 'unset'])
  })

  it('returns an empty array for null or undefined input', () => {
    expect(filterByVisibility(null, OWNER)).toEqual([])
    expect(filterByVisibility(undefined, OWNER)).toEqual([])
  })
})

describe('wilted', () => {
  // Wilted is the archive verdict: off the listings and the sitemap for a
  // visitor, still at its URL for a member. That is `internal`, in any
  // collection.
  const wilted = { visibility: 'public', path: '/tech/old-tool', status: 'wilted' }

  it('reads a wilted public page as internal', () => {
    expect(effectiveVisibility(wilted)).toBe('internal')
    expect(canViewContent(wilted, VISITOR)).toBe(false)
    expect(canViewContent(wilted, MEMBER)).toBe(true)
  })

  it('leaves the other statuses alone', () => {
    for (const status of ['seed', 'sprout', 'evergreen', undefined])
      expect(canViewContent({ ...wilted, status }, VISITOR), String(status)).toBe(true)
  })

  it('never raises a private page', () => {
    expect(effectiveVisibility({ visibility: 'private', status: 'wilted' })).toBe('private')
    expect(canViewContent({ visibility: 'private', status: 'wilted' }, MEMBER)).toBe(false)
  })
})

/**
 * The review gate: in a gated collection, `public` is a claim the author has
 * to vouch for with a `reviewed` date before a visitor sees it; until then the
 * page behaves as `internal`. The template ships with no gated collections, so
 * the mechanism is exercised here with an explicit prefix list.
 */
describe('review gate', () => {
  const GATED = ['/posts/'] as const
  const unreviewed = { visibility: 'public', path: '/posts/draft-idea' }
  const reviewed = { ...unreviewed, reviewed: '2026-10-01' }

  it('ships with no gated collections', () => {
    // Every shipped `public` document is public as written. Gating a
    // collection is one entry in REVIEW_GATED_PREFIXES.
    expect(REVIEW_GATED_PREFIXES).toEqual([])
    expect(canViewContent(unreviewed, VISITOR)).toBe(true)
  })

  it('holds an unreviewed public page in a gated collection back from a visitor', () => {
    expect(effectiveVisibility(unreviewed, GATED)).toBe('internal')
    expect(canViewContent(unreviewed, VISITOR, GATED)).toBe(false)
  })

  it('still shows it to a member — it behaves as internal, not private', () => {
    expect(canViewContent(unreviewed, MEMBER, GATED)).toBe(true)
  })

  it('lets a reviewed public page through to everyone', () => {
    expect(canViewContent(reviewed, VISITOR, GATED)).toBe(true)
  })

  it('treats an empty reviewed as unreviewed', () => {
    expect(canViewContent({ ...unreviewed, reviewed: '' }, VISITOR, GATED)).toBe(false)
  })

  it('does not gate collections outside the list', () => {
    expect(canViewContent({ visibility: 'public', path: '/tech/nuxt' }, VISITOR, GATED)).toBe(true)
  })

  it('matches after a locale prefix', () => {
    expect(isReviewGated('/es/posts/x', GATED)).toBe(true)
    expect(isReviewGated('/posts/x', GATED)).toBe(true)
    expect(isReviewGated('/tech/x', GATED)).toBe(false)
  })

  it('leaves internal and private exactly as they were', () => {
    expect(canViewContent({ visibility: 'internal', path: '/posts/x', reviewed: '2026-10-01' }, VISITOR, GATED)).toBe(false)
    expect(canViewContent({ visibility: 'private', path: '/posts/x', reviewed: '2026-10-01' }, MEMBER, GATED)).toBe(false)
  })

  it('cannot gate an item that carries no path, and leaves it ungated', () => {
    // A caller that selects `visibility` without `path` has opted out; the
    // select-shape test in content-visibility-selects.test.ts guards that.
    expect(canViewContent({ visibility: 'public' }, VISITOR, GATED)).toBe(true)
  })

  it('filters a listing the same way', () => {
    expect(filterByVisibility([unreviewed, reviewed], VISITOR, GATED)).toEqual([reviewed])
  })
})

/**
 * The sitemap is a fourth surface for the same rules: `content:file:afterParse`
 * in nuxt.config.ts asks this for each document, and anything not effectively
 * public is left out before `@nuxtjs/sitemap` sees it.
 */
describe('contentSitemapEntry', () => {
  it('leaves out anything not effectively public', () => {
    expect(contentSitemapEntry({ visibility: 'internal', path: '/posts/x' }, 'private')).toBe(false)
    expect(contentSitemapEntry({ visibility: 'private', path: '/posts/x' }, 'private')).toBe(false)
    expect(contentSitemapEntry({ visibility: 'public', status: 'wilted', path: '/posts/x' }, 'private')).toBe(false)
  })

  it('reads an unset visibility as the collection default, which is what the row will hold', () => {
    expect(contentSitemapEntry({ path: '/tech/nuxt' }, 'private')).toBe(false)
    expect(contentSitemapEntry({ path: '/tech/nuxt' }, 'public')).toEqual({ loc: '/tech/nuxt' })
    expect(contentSitemapEntry({ path: '/tech/nuxt' }, undefined)).toBe(false)
  })

  it('lists a public document at the route that renders it, not its content path', () => {
    // Guides keep their locale in the content path; English is served unprefixed.
    expect(contentSitemapEntry({ visibility: 'public', path: '/en/guides/getting-started' }, 'private')).toEqual({ loc: '/guides/getting-started' })
    expect(contentSitemapEntry({ visibility: 'public', path: '/es/guides/getting-started' }, 'private')).toEqual({ loc: '/es/guides/getting-started' })
    expect(contentSitemapEntry({ visibility: 'public', path: '/posts/hello' }, 'private')).toEqual({ loc: '/posts/hello' })
  })

  it('leaves out a document with no path to list', () => {
    expect(contentSitemapEntry({ visibility: 'public' }, 'private')).toBe(false)
  })
})
