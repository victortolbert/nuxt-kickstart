import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import {
  isNoindexPath,
  isProtectedPath,
  LOCALE_CODES,
  NOINDEX_PATH_PREFIXES,
  noindexRouteRules,
  PROTECTED_PATH_PREFIXES,
  PUBLIC_PATH_EXCEPTIONS,
  sitemapExcludePatterns,
  startsWithAnySegment,
  stripLocalePrefix,
} from '../../shared/utils/protected-paths'

const pagesDir = fileURLToPath(new URL('../../app/pages', import.meta.url))

/** Every page file under app/pages, as the route it serves. */
function pageRoutes(): { file: string, route: string }[] {
  const out: { file: string, route: string }[] = []
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry)
      if (statSync(full).isDirectory()) {
        walk(full)
        continue
      }
      if (!entry.endsWith('.vue'))
        continue
      const route = `/${relative(pagesDir, full)}`
        .replace(/\.vue$/, '')
        .replace(/\/index$/, '')
        .replace(/\[\.\.\.[^\]]+\]/g, 'x')
        .replace(/\[[^\]]+\]/g, 'x')
      out.push({ file: relative(pagesDir, full), route: route || '/' })
    }
  }
  walk(pagesDir)
  return out
}

/** Whether a page file declares a session-requiring middleware in definePageMeta. */
function declaresAuthMiddleware(file: string): boolean {
  const source = readFileSync(join(pagesDir, file), 'utf8')
  const meta = source.match(/definePageMeta\(\{([\s\S]*?)\}\)/)
  if (!meta)
    return false
  return /middleware:\s*(?:\[[^\]]*)?['"](?:auth|admin)['"]/.test(meta[1]!)
}

describe('protected paths', () => {
  /**
   * The point of the shared list: a page that gates itself is a page the
   * sitemap must not list. Read the pages directory rather than pin a list
   * here, so a new gated page fails this test until a prefix covers it.
   */
  it('covers every page that declares an auth or admin middleware', () => {
    const uncovered = pageRoutes()
      .filter(({ file }) => declaresAuthMiddleware(file))
      .filter(({ route }) => !isNoindexPath(route))
      .map(({ file, route }) => `${route} (${file})`)
    expect(uncovered).toEqual([])
  })

  it('finds the gated pages it exists to find', () => {
    // A detector that matches nothing is indistinguishable from a broken one.
    const gated = pageRoutes().filter(({ file }) => declaresAuthMiddleware(file)).map(r => r.route)
    expect(gated).toContain('/app/admin')
  })

  it('does not gate the public surface', () => {
    for (const route of ['/', '/about', '/tech', '/guides', '/guides/getting-started', '/blocks', '/posts', '/appearance', '/labs/broadsheet'])
      expect(isProtectedPath(route), route).toBe(false)
  })

  it('gates every protected prefix and its subtree', () => {
    for (const prefix of PROTECTED_PATH_PREFIXES) {
      expect(isProtectedPath(prefix), prefix).toBe(true)
      expect(isProtectedPath(`${prefix}/sub`), prefix).toBe(true)
    }
  })

  it('matches by whole segment, so /app does not gate /appearance or /apps', () => {
    expect(startsWithAnySegment('/app', ['/app'])).toBe(true)
    expect(startsWithAnySegment('/app/admin', ['/app'])).toBe(true)
    expect(startsWithAnySegment('/appearance', ['/app'])).toBe(false)
    expect(startsWithAnySegment('/apps/x', ['/app'])).toBe(false)
  })

  it('opens the public exceptions inside a protected prefix, and only those', () => {
    expect(PUBLIC_PATH_EXCEPTIONS).toContain('/labs/broadsheet')
    expect(isProtectedPath('/labs/broadsheet')).toBe(false)
    expect(isProtectedPath('/labs')).toBe(true)
    expect(isProtectedPath('/labs/broadsheet-draft')).toBe(true)
  })

  it('never lists a public exception as noindex', () => {
    for (const path of PUBLIC_PATH_EXCEPTIONS)
      expect(isNoindexPath(path), path).toBe(false)
  })

  describe('sitemap exclude patterns', () => {
    const excluded = (path: string) => sitemapExcludePatterns().some(p => p.test(path))

    it('exclude every noindex prefix, its subtree, and its locale form', () => {
      for (const prefix of NOINDEX_PATH_PREFIXES) {
        for (const path of [prefix, `${prefix}/x`, `/es${prefix}`, `/es${prefix}/x`])
          expect(excluded(path), path).toBe(true)
      }
    })

    it('leave the public surface and the public exceptions alone', () => {
      for (const path of ['/', '/es', '/guides', '/es/guides/x', '/appearance', '/apps', '/labs/broadsheet', '/es/labs/broadsheet'])
        expect(excluded(path), path).toBe(false)
    })
  })

  it('emits robots: false for each noindex prefix and its subtree, and re-opens the exceptions', () => {
    const rules = noindexRouteRules()
    expect(rules['/app']).toEqual({ robots: false })
    expect(rules['/app/**']).toEqual({ robots: false })
    expect(rules['/login']).toEqual({ robots: false })
    // Nitro applies the most specific match last, so the exact rule wins
    // over `/labs/**`.
    expect(rules['/labs/broadsheet']).toEqual({ robots: true })
  })
})

/**
 * `prefix_except_default` puts the locale in segment one for every locale but
 * the default, so a Spanish request for a gated page arrives as `/es/settings`
 * — which starts with none of the unprefixed prefixes. The gate strips the
 * locale before matching.
 */
describe('the locale prefix does not open a gated page', () => {
  it('strips a leading locale segment, and only a locale segment', () => {
    expect(stripLocalePrefix('/es/settings')).toBe('/settings')
    expect(stripLocalePrefix('/settings')).toBe('/settings')
    // Two letters, but not a configured locale.
    expect(stripLocalePrefix('/ui/buttons')).toBe('/ui/buttons')
  })

  it('reduces a bare locale root to /', () => {
    expect(stripLocalePrefix('/es')).toBe('/')
    expect(stripLocalePrefix('/')).toBe('/')
  })

  it('gates every protected prefix under every non-default locale', () => {
    const open: string[] = []
    for (const locale of LOCALE_CODES.filter(code => code !== 'en')) {
      for (const prefix of PROTECTED_PATH_PREFIXES) {
        if (!isProtectedPath(`/${locale}${prefix}`))
          open.push(`/${locale}${prefix}`)
      }
    }
    expect(open).toEqual([])
  })

  it('keeps the public exceptions open under a locale', () => {
    expect(isProtectedPath('/es/labs/broadsheet')).toBe(false)
  })

  it('names exactly the locales nuxt.config configures', () => {
    // The gate carries its own copy so that no runtime i18n lookup sits in the
    // auth path; this is what fails when the two drift.
    const config = readFileSync(fileURLToPath(new URL('../../nuxt.config.ts', import.meta.url)), 'utf8')
    const block = config.match(/locales:\s*\[([\s\S]*?)\n {4}\]/)
    expect(block, 'could not find the i18n locales block in nuxt.config.ts').toBeTruthy()
    const configured = [...block![1]!.matchAll(/code:\s*'([a-z-]+)'/g)].map(m => m[1]!)
    expect(configured.length).toBeGreaterThan(1)
    expect([...LOCALE_CODES].sort()).toEqual(configured.sort())
  })
})
