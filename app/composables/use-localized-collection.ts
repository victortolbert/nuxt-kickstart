import { queryCollection, useAsyncData, useI18n, useLazyAsyncData } from '#imports'
import { localizedContentUrl, pickLocalizedEntries } from '~/utils/localized-collection'

/**
 * The Localized Collection module.
 *
 * Some collections store every locale in one collection with locale-prefixed
 * paths (e.g. /en/guides/x, /es/guides/x — see schemas/publishing/guides.ts).
 * This module owns everything callers previously had to know:
 *
 * - which collections are locale-aware (the registry below)
 * - fallback ordering (current locale first, English otherwise)
 * - deduplication (one entry per slug)
 * - URL resolution (locale-prefixed routes per prefix_except_default)
 *
 * Use `fetchLocalizedEntries` / `fetchLocalizedEntry` in plain async code
 * (generic loops, custom useAsyncData setups) and the `use*` wrappers in
 * component setup for SSR-safe, locale-reactive data.
 */

/** Collections whose sources include every locale. Add yours here. */
export const LOCALIZED_COLLECTIONS = new Set(['guides'])

export function isLocalizedCollection(name: string): boolean {
  return LOCALIZED_COLLECTIONS.has(name)
}

export interface LocalizedEntryBase {
  path?: string
  title?: string
}

/** Default entry shape: base fields plus whatever the collection schema adds. */
export type LocalizedEntry = LocalizedEntryBase & Record<string, any>

// Nuxt Content's generated types don't support dynamic collection names;
// this is the module's single cast (callers no longer need their own).
const query = queryCollection as unknown as (name: string) => {
  all: () => Promise<LocalizedEntryBase[]>
  path: (p: string) => { first: () => Promise<LocalizedEntryBase | null> }
}

/**
 * All entries of a localized collection: one per slug, current locale
 * preferred, English fallback, `path` resolved to a route URL.
 */
export async function fetchLocalizedEntries<T extends LocalizedEntryBase = LocalizedEntry>(
  collection: string,
  locale: string,
): Promise<T[]> {
  const all = await query(collection).all()
  return pickLocalizedEntries(all, locale)
    .map(entry => ({ ...entry, path: localizedContentUrl(entry.path, locale) })) as T[]
}

/**
 * A single entry by slug with locale fallback. `isFallback` is true when the
 * visitor's locale had no translation and English content is shown (feed it
 * to <TranslationDisclaimer>).
 */
export async function fetchLocalizedEntry<T extends LocalizedEntryBase = LocalizedEntry>(
  collection: string,
  slug: string,
  locale: string,
): Promise<{ entry: T | null, isFallback: boolean }> {
  if (locale !== 'en') {
    const localized = await query(collection).path(`/${locale}/${collection}/${slug}`).first()
    if (localized)
      return { entry: localized as T, isFallback: false }
  }
  const english = await query(collection).path(`/en/${collection}/${slug}`).first()
  return { entry: english as T | null, isFallback: !!english && locale !== 'en' }
}

/** SSR-safe, locale-reactive list of a localized collection. */
export function useLocalizedEntries<T extends LocalizedEntryBase = LocalizedEntry>(
  collection: string,
  options: { lazy?: boolean } = {},
) {
  const { locale } = useI18n()
  const asyncData = options.lazy ? useLazyAsyncData : useAsyncData
  return asyncData<T[]>(
    `localized-${collection}`,
    () => fetchLocalizedEntries<T>(collection, locale.value),
    { watch: [locale], default: () => [] as T[] },
  )
}
