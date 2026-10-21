/**
 * Site search, answered from the search registry through the visibility rules.
 *
 * Every collection registered under `search.collections` in app config
 * (`#shared/utils/search-registry`) is queried for its match fields plus the
 * fields the visibility rules read. Each candidate is checked against the
 * request's Viewer with the shared rule, `canViewContent`, so search agrees
 * with listings, pages, navigation and the sitemap about Effective visibility:
 * wilted pages and the Review gate included. A candidate the rules cannot
 * place (no path) is dropped.
 *
 * The request never fails because of one collection: a registration that does
 * not parse is ignored, and a collection that throws is logged and left out.
 * Results link to the route that renders them in the reader's locale.
 */

import type { H3Event } from 'h3'
import type { SearchableCollection, SearchAppConfig, SearchResult } from '#shared/utils/search-registry'
import { queryCollection } from '@nuxt/content/server'
import { canViewContent } from '#shared/utils/content-visibility'
import { localizedContentUrl, pickLocalizedEntries } from '#shared/utils/localized-collection'
import { LOCALE_CODES } from '#shared/utils/protected-paths'
import { matchScore, queryTerms, resolveRegistry, selectedFields, toSearchResult } from '#shared/utils/search-registry'

defineRouteMeta({
  openAPI: {
    tags: ['Content'],
    summary: 'Site search',
    description: 'Matches `q` against every collection in the search registry and returns what this viewer may see, best match first, with paths for `locale`.',
    parameters: [
      { in: 'query', name: 'q', required: true, schema: { type: 'string' } },
      { in: 'query', name: 'locale', schema: { type: 'string', enum: [...LOCALE_CODES] } },
    ],
  },
})

/** Enough for a palette or a results page; a client wanting more should narrow the query. */
const MAX_RESULTS = 50
/** Longer than any honest query; bounds the work a request can ask for. */
const MAX_QUERY_LENGTH = 200

type Row = Record<string, unknown> & { path?: string }

function requestedLocale(value: unknown): string {
  return typeof value === 'string' && (LOCALE_CODES as readonly string[]).includes(value) ? value : 'en'
}

/** The route for a non-localized document: unprefixed in English, behind the locale otherwise. */
function routeFor(path: string, locale: string): string {
  return locale === 'en' ? path : `/${locale}${path}`
}

async function queryRows(event: H3Event, entry: SearchableCollection): Promise<Row[]> {
  // `select()` is typed per collection and this loop is generic over every
  // registered one, so the query is widened once here.
  const query = queryCollection(event, entry.collection as never) as unknown as {
    select: (...fields: string[]) => { all: () => Promise<Row[]> }
  }
  // The visibility fields are named here as well as in `selectedFields`, so the
  // select-shape sweep (content-visibility-selects.test.ts) can see them.
  return await query.select(...selectedFields(entry), 'path', 'visibility', 'reviewed', 'status').all() ?? []
}

export default defineEventHandler(async (event: H3Event): Promise<{ results: SearchResult[] }> => {
  // The body depends on who asked, so nothing may cache it.
  setResponseHeader(event, 'Cache-Control', 'private, no-store, max-age=0')
  setResponseHeader(event, 'Vary', 'Cookie')

  const params = getQuery(event)
  const terms = queryTerms(String(params.q ?? '').slice(0, MAX_QUERY_LENGTH))
  if (!terms.length)
    return { results: [] }

  const locale = requestedLocale(params.locale)
  const registry = resolveRegistry((useAppConfig() as SearchAppConfig).search?.collections)
  const viewer = await getRequestViewer(event)

  const perCollection = await Promise.all(registry.map(async (entry) => {
    try {
      const rows = await queryRows(event, entry)
      // A localized collection holds every translation; keep the one this
      // reader would be shown, so its visibility is the one that decides.
      const candidates = entry.localized ? pickLocalizedEntries(rows, locale) : rows

      const matches: { score: number, result: SearchResult }[] = []
      for (const row of candidates) {
        if (!row.path || !canViewContent(row, viewer))
          continue
        const score = matchScore(row, entry, terms)
        if (!score)
          continue
        const path = entry.localized ? localizedContentUrl(row.path, locale) : routeFor(row.path, locale)
        const result = toSearchResult(row, entry, path)
        if (result)
          matches.push({ score, result })
      }
      return matches
    }
    catch (error) {
      console.error(`[search] leaving "${entry.collection}" out of this search; it failed to query:`, error)
      return []
    }
  }))

  const results = perCollection.flat()
    .sort((a, b) => b.score - a.score || a.result.title.localeCompare(b.result.title))
    .slice(0, MAX_RESULTS)
    .map(({ result }) => result)

  return { results }
})
