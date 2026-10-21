/**
 * Helpers for collections that store every locale in one collection with
 * locale-prefixed paths (e.g. /en/guides/getting-started, /es/guides/getting-started).
 */

interface LocalizedEntry {
  path?: string
}

/**
 * Pick one entry per content slug, preferring the requested locale and
 * falling back to English when no translation exists.
 */
export function pickLocalizedEntries<T extends LocalizedEntry>(
  items: T[] | null | undefined,
  locale: string,
): T[] {
  if (!items)
    return []

  const bySuffix = new Map<string, T>()
  for (const item of items) {
    const match = /^\/(\w{2})\/(.+)$/.exec(item.path ?? '')
    if (!match)
      continue
    const [, entryLocale, suffix] = match
    if (entryLocale !== locale && entryLocale !== 'en')
      continue
    const existing = bySuffix.get(suffix!)
    if (!existing || entryLocale === locale)
      bySuffix.set(suffix!, item)
  }
  return [...bySuffix.values()]
}

/**
 * Convert a locale-prefixed content path into the route URL for the
 * current locale (prefix_except_default: English URLs are unprefixed).
 *
 * /en/guides/x + locale en -> /guides/x
 * /en/guides/x + locale es -> /es/guides/x (page falls back to English content)
 * /es/guides/x + locale es -> /es/guides/x
 */
export function localizedContentUrl(path: string | undefined, locale: string): string {
  if (!path)
    return '/'
  const suffix = path.replace(/^\/\w{2}/, '')
  return locale === 'en' ? suffix : `/${locale}${suffix}`
}
