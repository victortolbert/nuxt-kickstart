import { describe, expect, it } from 'vitest'
import {
  isNoindexPath,
  isProtectedPath,
  NOINDEX_PATH_PREFIXES,
  noindexRouteRules,
  PROTECTED_PATH_PREFIXES,
  resolveProtectedPaths,
  sitemapExcludePatterns,
} from '../../shared/utils/protected-paths'

/**
 * A layer adds its gated routes to the Protected path list from inside the
 * layer (its `protectedPaths` config key), and the three surfaces — the global
 * middleware, the sitemap excludes, the `robots: false` route rules — cover
 * them with no base file edited. These drive the merged list through those
 * three surfaces.
 */

const withPlanner = resolveProtectedPaths([{ protected: ['/planner'] }])

describe('protected paths contributed by a layer', () => {
  it('leaves the base list alone when no layer contributes', () => {
    const base = resolveProtectedPaths([])
    expect(base.protected).toEqual([...PROTECTED_PATH_PREFIXES])
    expect(base.noindex).toEqual([...NOINDEX_PATH_PREFIXES])
  })

  it('gates a layer\'s prefix in the middleware, locale form included', () => {
    expect(isProtectedPath('/planner/today', undefined, withPlanner)).toBe(true)
    expect(isProtectedPath('/es/planner', undefined, withPlanner)).toBe(true)
    expect(isProtectedPath('/plannerish', undefined, withPlanner)).toBe(false)
    // Without the layer, the route is ordinary.
    expect(isProtectedPath('/planner')).toBe(false)
  })

  it('keeps a layer\'s prefix out of the sitemap and marks it noindex', () => {
    expect(isNoindexPath('/planner', undefined, withPlanner)).toBe(true)
    expect(sitemapExcludePatterns(withPlanner.noindex).some(p => p.test('/es/planner/x'))).toBe(true)
    expect(noindexRouteRules(withPlanner.noindex)['/planner/**']).toEqual({ robots: false })
  })

  it('lets a layer open a public page inside a gated prefix', () => {
    const paths = resolveProtectedPaths([{ protected: ['/planner'], public: ['/planner/about'] }])
    expect(isProtectedPath('/planner/about', undefined, paths)).toBe(false)
    expect(isNoindexPath('/planner/about', undefined, paths)).toBe(false)
    expect(noindexRouteRules(paths.noindex, paths.public)['/planner/about']).toEqual({ robots: true })
  })

  it('takes a layer\'s noindex-only and page-gated prefixes', () => {
    const paths = resolveProtectedPaths([{ unindexed: ['/planner-share'], pageGated: ['/reports'] }])
    expect(isProtectedPath('/planner-share', undefined, paths)).toBe(false)
    expect(isNoindexPath('/planner-share', undefined, paths)).toBe(true)
    expect(isNoindexPath('/reports/q3', undefined, paths)).toBe(true)
  })

  it('lists each prefix once, however many layers name it', () => {
    const paths = resolveProtectedPaths([{ protected: ['/app', '/planner'] }, { protected: ['/planner'] }])
    expect(paths.protected.filter(p => p === '/planner')).toHaveLength(1)
    expect(paths.protected.filter(p => p === '/app')).toHaveLength(1)
  })

  it('refuses a prefix that is not a route path', () => {
    expect(() => resolveProtectedPaths([{ protected: ['planner'] }])).toThrow(/planner/)
    expect(() => resolveProtectedPaths([{ protected: ['/'] }])).toThrow(/\//)
    expect(() => resolveProtectedPaths([{ protected: ['/planner/'] }])).toThrow(/planner/)
  })
})
