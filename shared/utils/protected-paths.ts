/**
 * The routes a visitor is turned away from, in one place.
 *
 * Three surfaces read this list: `app/middleware/app-auth.global.ts` sends a
 * signed-out request under `PROTECTED_PATH_PREFIXES` to `/login`; the sitemap
 * leaves `NOINDEX_PATH_PREFIXES` out (`sitemapExcludePatterns`); and
 * `routeRules` marks them `robots: false` (`noindexRouteRules`). With one list,
 * a gated page cannot be redirected by the middleware and still be handed to a
 * crawler by the sitemap.
 *
 * `test/unit/protected-paths.test.ts` reads `app/pages/` and fails if a page
 * that declares `middleware: 'auth'` or `'admin'` is not covered here, which
 * is how a new gated page stays out of the sitemap without anyone remembering.
 */

/**
 * The configured locale codes, mirrored from `i18n.locales` in nuxt.config.
 *
 * The gate carries its own copy on purpose: a runtime i18n lookup inside the
 * auth path is a dependency that can be unavailable, and an unavailable
 * dependency here fails *open*. A constant cannot fail.
 * `test/unit/protected-paths.test.ts` reads nuxt.config and fails when the two
 * drift, so adding a locale there without adding it here is caught.
 */
export const LOCALE_CODES = ['en', 'es'] as const

/** Prefixes the global middleware gates for signed-out visitors. */
export const PROTECTED_PATH_PREFIXES = [
  // The signed-in app shell, including the admin suite at /app/admin.
  '/app',
  // Legacy admin location; kept gated so an old bookmark never renders.
  '/admin',
  '/settings',
  // Labs are member-only, except the exceptions below.
  '/labs',
] as const

/**
 * Public pages inside an otherwise-protected prefix. The Broadsheet reference
 * is design documentation: a static page with no data access and no API
 * calls, more useful to the kit's audience unauthenticated than gated. It is
 * open to the middleware and indexable.
 */
export const PUBLIC_PATH_EXCEPTIONS = [
  '/labs/broadsheet',
] as const

/**
 * Pages that gate themselves with `definePageMeta({ middleware })` outside
 * the global list. Same outcome for a visitor, so the sitemap treats them the
 * same; the middleware does not need them. Empty today — the admin pages sit
 * under `/app`.
 */
export const PAGE_GATED_PATH_PREFIXES = [] as const

/** Reachable by anyone, but not a page to be found by: the sign-in form. */
export const UNINDEXED_PATH_PREFIXES = [
  '/login',
] as const

/** Everything the sitemap omits and the crawler is told not to index. */
export const NOINDEX_PATH_PREFIXES: readonly string[] = [
  ...PROTECTED_PATH_PREFIXES,
  ...PAGE_GATED_PATH_PREFIXES,
  ...UNINDEXED_PATH_PREFIXES,
]

/**
 * Whether a route path is one of the prefixes or inside one, by whole
 * segment: `/app` covers `/app` and `/app/admin`, never `/appearance` or
 * `/apps`.
 */
export function startsWithAnySegment(path: string, prefixes: readonly string[]): boolean {
  return prefixes.some(prefix => path === prefix || path.startsWith(`${prefix}/`))
}

/**
 * A route path with its locale segment removed, if it has one.
 *
 * `prefix_except_default` serves the default locale unprefixed and every
 * other locale behind its code, so `/es/settings` and `/settings` are the
 * same page. Matching is by whole segment against the configured codes — a
 * first segment that merely looks like one (`/ui`) is left alone.
 */
export function stripLocalePrefix(path: string, locales: readonly string[] = LOCALE_CODES): string {
  const segments = path.split('/').filter(Boolean)
  const first = segments[0]
  if (!first || !locales.includes(first))
    return path
  return `/${segments.slice(1).join('/')}`
}

/**
 * Whether a request for this path must carry a session — the one call the
 * global middleware makes. It strips the locale before matching, because the
 * list is written unprefixed and `/es/settings` starts with none of it.
 */
export function isProtectedPath(path: string, locales: readonly string[] = LOCALE_CODES): boolean {
  const unlocalized = stripLocalePrefix(path, locales)
  if (startsWithAnySegment(unlocalized, PUBLIC_PATH_EXCEPTIONS))
    return false
  return startsWithAnySegment(unlocalized, PROTECTED_PATH_PREFIXES)
}

/** Whether a path is left out of the sitemap and marked noindex. */
export function isNoindexPath(path: string, locales: readonly string[] = LOCALE_CODES): boolean {
  const unlocalized = stripLocalePrefix(path, locales)
  if (startsWithAnySegment(unlocalized, PUBLIC_PATH_EXCEPTIONS))
    return false
  return startsWithAnySegment(unlocalized, NOINDEX_PATH_PREFIXES)
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * One `exclude` entry per prefix for `@nuxtjs/sitemap`: the prefix and its
 * subtree, optionally behind a configured locale — the i18n integration emits
 * `/es/settings` alongside `/settings`, and a string glob would miss it. A
 * public exception inside the prefix is carved out with a lookahead.
 */
export function sitemapExcludePatterns(
  prefixes: readonly string[] = NOINDEX_PATH_PREFIXES,
  locales: readonly string[] = LOCALE_CODES,
): RegExp[] {
  const locale = `(?:/(?:${locales.map(escapeRegExp).join('|')}))?`
  return prefixes.map((prefix) => {
    const carveOuts = PUBLIC_PATH_EXCEPTIONS
      .filter(exception => exception.startsWith(`${prefix}/`))
      .map(exception => `(?!${escapeRegExp(exception.slice(prefix.length))}(?:/|$))`)
      .join('')
    return new RegExp(`^${locale}${escapeRegExp(prefix)}${carveOuts}(?:/|$)`)
  })
}

/**
 * The `routeRules` entries that carry `robots: false` — the prefix and its
 * subtree — plus `robots: true` on each public exception, which Nitro applies
 * over the broader `/**` match because it is more specific. The locale forms
 * are not listed: they answer with the same redirect as the unprefixed path,
 * and the rule is a second line behind it.
 */
export function noindexRouteRules(
  prefixes: readonly string[] = NOINDEX_PATH_PREFIXES,
): Record<string, { robots: boolean }> {
  const rules: Record<string, { robots: boolean }> = {}
  for (const prefix of prefixes) {
    rules[prefix] = { robots: false }
    rules[`${prefix}/**`] = { robots: false }
  }
  for (const exception of PUBLIC_PATH_EXCEPTIONS)
    rules[exception] = { robots: true }
  return rules
}
