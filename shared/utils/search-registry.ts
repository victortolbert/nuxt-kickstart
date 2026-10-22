import { z } from 'zod'

/**
 * The search registry: which collections site search covers, and the fields to
 * match each on.
 *
 * A collection registers itself in app config, under `search.collections`, from
 * whichever app config owns it — the template's own in `app/app.config.ts`, a
 * layer's in `layers/<name>/app/app.config.ts`, a project's beside the
 * template's. Nuxt merges app config across layers by concatenating arrays, so
 * every registration arrives in one list and there is no central list to edit.
 * Deleting a layer folder deletes its registrations with it.
 *
 * `/api/search` reads the merged list (`server/api/search.get.ts`). So do the
 * surfaces built on it — the ⌘K palette now, the AI index and the MCP search
 * tool later — which is how they cannot disagree about what is searchable.
 */

export interface SearchableCollection {
  /** The Nuxt Content collection name. */
  collection: string
  /** The fields a query is matched against. Each is selected from the collection; so is any field a role names, which is matched too. */
  fields: string[]
  /**
   * Which field plays which part in a result. `title` defaults to `title` and
   * `body` (the result's one-line description) to `description`; `aliases` are
   * alternative names, matched like the title. A glossary maps `body` to
   * `definitions`; an organization maps `title` to `name`.
   */
  roles?: {
    title?: string
    body?: string
    aliases?: string
  }
  /**
   * Every locale lives in this one collection under a locale-prefixed path
   * (`/en/guides/x`, `/es/guides/x`). Results then prefer the reader's locale,
   * fall back to English, and appear once per page.
   */
  localized?: boolean
}

export interface SearchResult {
  collection: string
  title: string
  /** The route that renders the document in the reader's locale. */
  path: string
  description?: string
}

/** The search-registry shape app config holds (`search.collections`). */
export interface SearchAppConfig {
  search?: {
    collections?: SearchableCollection[]
  }
}

const fieldName = z.string().min(1)

const searchableCollection = z.object({
  collection: fieldName,
  fields: z.array(fieldName).min(1),
  roles: z.object({
    title: fieldName.optional(),
    body: fieldName.optional(),
    aliases: fieldName.optional(),
  }).optional(),
  localized: z.boolean().optional(),
})

/** The fields the visibility rules read; every search query selects them. */
export const VISIBILITY_FIELDS = ['path', 'visibility', 'reviewed', 'status'] as const

/**
 * The usable registrations, in priority order, one per collection.
 *
 * An entry that does not parse is dropped with a warning rather than failing
 * the request. When a collection is registered twice (a project overriding a
 * layer), the first registration stands: Nuxt puts the higher-priority app
 * config first when it concatenates.
 */
export function resolveRegistry(entries: unknown): SearchableCollection[] {
  if (!Array.isArray(entries))
    return []

  const seen = new Set<string>()
  const registry: SearchableCollection[] = []
  for (const entry of entries) {
    const parsed = searchableCollection.safeParse(entry)
    if (!parsed.success) {
      console.warn('[search] ignoring an unusable search registration:', JSON.stringify(entry))
      continue
    }
    if (seen.has(parsed.data.collection))
      continue
    seen.add(parsed.data.collection)
    registry.push(parsed.data)
  }
  return registry
}

/** The fields a query is matched against: the registered ones plus any field named in a role. */
export function matchFields(entry: SearchableCollection): string[] {
  const roles = Object.values(entry.roles ?? {}).filter((field): field is string => !!field)
  return [...new Set([...entry.fields, ...roles])]
}

/** Every field a registration needs selected: its match fields and the visibility fields. */
export function selectedFields(entry: SearchableCollection): string[] {
  return [...new Set([...matchFields(entry), ...VISIBILITY_FIELDS])]
}

/** The lowercase terms of a query; empty for a blank one. */
export function queryTerms(query: string): string[] {
  return query.toLowerCase().split(/\s+/).filter(Boolean)
}

/** The searchable text of a field value: a string, or the strings in an array. */
function textOf(value: unknown): string {
  if (typeof value === 'string')
    return value
  if (Array.isArray(value))
    return value.filter(item => typeof item === 'string').join(' ')
  return ''
}

function firstText(value: unknown): string | undefined {
  if (typeof value === 'string')
    return value || undefined
  if (Array.isArray(value))
    return value.find((item): item is string => typeof item === 'string' && item.length > 0)
  return undefined
}

/**
 * How well a row matches, or 0 when it does not. Every term must appear in one
 * of the registered fields. A term found in the title or an alias scores
 * higher than one found elsewhere, so a title match ranks first.
 */
export function matchScore(row: Record<string, unknown>, entry: SearchableCollection, terms: string[]): number {
  if (!terms.length)
    return 0

  // A field named in a role is matched whether or not `fields` repeats it.
  const matched = matchFields(entry)
  const titleField = entry.roles?.title ?? 'title'
  const aliasField = entry.roles?.aliases
  const prominent = matched
    .filter(field => field === titleField || field === aliasField)
    .map(field => textOf(row[field]).toLowerCase())
    .join(' ')
  const rest = matched
    .filter(field => field !== titleField && field !== aliasField)
    .map(field => textOf(row[field]).toLowerCase())
    .join(' ')

  let score = 0
  for (const term of terms) {
    if (prominent.includes(term))
      score += 2
    else if (rest.includes(term))
      score += 1
    else return 0
  }
  return score
}

/**
 * The result a matched row becomes — or `null` when it cannot be shown, which
 * is how a row with no title or no path is dropped rather than half-rendered.
 * None of the visibility fields are carried over: a result says what it is,
 * not what tier it sits at.
 */
export function toSearchResult(row: Record<string, unknown>, entry: SearchableCollection, path: string): SearchResult | null {
  const title = firstText(row[entry.roles?.title ?? 'title'])
  if (!title || !path)
    return null

  const description = firstText(row[entry.roles?.body ?? 'description'])
  return description
    ? { collection: entry.collection, title, path, description }
    : { collection: entry.collection, title, path }
}
