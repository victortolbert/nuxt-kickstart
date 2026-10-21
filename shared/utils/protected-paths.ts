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
 * What a layer adds to the lists above, from its own `nuxt.config.ts` under the
 * `protectedPaths` key — never by editing this file. Each field extends the
 * matching base list: `protected` → `PROTECTED_PATH_PREFIXES`, `public` →
 * `PUBLIC_PATH_EXCEPTIONS`, `pageGated` → `PAGE_GATED_PATH_PREFIXES`,
 * `unindexed` → `UNINDEXED_PATH_PREFIXES`.
 */
export interface ProtectedPathsContribution {
  protected?: readonly string[]
  public?: readonly string[]
  pageGated?: readonly string[]
  unindexed?: readonly string[]
}

/** The base lists and every layer's contributions, merged. */
export interface ProtectedPaths {
  /** Gated by the global middleware. */
  protected: readonly string[]
  /** Open inside an otherwise-gated prefix. */
  public: readonly string[]
  /** Left out of the sitemap and marked noindex. */
  noindex: readonly string[]
}

const ROUTE_PREFIX = /^(?:\/[\w.~-]+)+$/

function checkedPrefixes(prefixes: readonly string[] | undefined): string[] {
  for (const prefix of prefixes ?? []) {
    // `/` would gate every route; a trailing slash or a missing leading one
    // would gate none. Either is a typo that fails open or closed silently.
    if (!ROUTE_PREFIX.test(prefix))
      throw new Error(`protectedPaths: "${prefix}" is not a route prefix (expected a form like "/planner")`)
  }
  return [...(prefixes ?? [])]
}

const unique = (values: readonly string[]): string[] => [...new Set(values)]

/**
 * Merge the base lists with what each layer contributes. `nuxt.config.ts`
 * calls this once with every layer's `protectedPaths`, and hands the result
 * to the middleware (through runtime config), the sitemap and the route rules.
 * A malformed prefix throws, so the build stops rather than shipping a gate
 * that matches nothing.
 */
export function resolveProtectedPaths(contributions: readonly ProtectedPathsContribution[]): ProtectedPaths {
  const extra = contributions.map(c => ({
    protected: checkedPrefixes(c.protected),
    public: checkedPrefixes(c.public),
    pageGated: checkedPrefixes(c.pageGated),
    unindexed: checkedPrefixes(c.unindexed),
  }))
  const protectedPrefixes = unique([...PROTECTED_PATH_PREFIXES, ...extra.flatMap(c => c.protected)])
  return {
    protected: protectedPrefixes,
    public: unique([...PUBLIC_PATH_EXCEPTIONS, ...extra.flatMap(c => c.public)]),
    noindex: unique([
      ...protectedPrefixes,
      ...PAGE_GATED_PATH_PREFIXES,
      ...extra.flatMap(c => c.pageGated),
      ...UNINDEXED_PATH_PREFIXES,
      ...extra.flatMap(c => c.unindexed),
    ]),
  }
}

/** The base lists alone: what every surface reads when it is given no merged list. */
const BASE_PATHS: ProtectedPaths = resolveProtectedPaths([])

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
export function isProtectedPath(
  path: string,
  locales: readonly string[] = LOCALE_CODES,
  paths: ProtectedPaths = BASE_PATHS,
): boolean {
  const unlocalized = stripLocalePrefix(path, locales)
  if (startsWithAnySegment(unlocalized, paths.public))
    return false
  return startsWithAnySegment(unlocalized, paths.protected)
}

/** Whether a path is left out of the sitemap and marked noindex. */
export function isNoindexPath(
  path: string,
  locales: readonly string[] = LOCALE_CODES,
  paths: ProtectedPaths = BASE_PATHS,
): boolean {
  const unlocalized = stripLocalePrefix(path, locales)
  if (startsWithAnySegment(unlocalized, paths.public))
    return false
  return startsWithAnySegment(unlocalized, paths.noindex)
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
  exceptions: readonly string[] = PUBLIC_PATH_EXCEPTIONS,
): RegExp[] {
  const locale = `(?:/(?:${locales.map(escapeRegExp).join('|')}))?`
  return prefixes.map((prefix) => {
    const carveOuts = exceptions
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
  exceptions: readonly string[] = PUBLIC_PATH_EXCEPTIONS,
): Record<string, { robots: boolean }> {
  const rules: Record<string, { robots: boolean }> = {}
  for (const prefix of prefixes) {
    rules[prefix] = { robots: false }
    rules[`${prefix}/**`] = { robots: false }
  }
  for (const exception of exceptions)
    rules[exception] = { robots: true }
  return rules
}
