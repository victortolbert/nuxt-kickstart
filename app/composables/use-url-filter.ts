import type { WritableComputedRef } from 'vue'
import { computed, useRoute, useRouter } from '#imports'

type FilterValue = string | string[] | number | null | undefined

interface UseUrlFilterOptions<T extends FilterValue> {
  /** Default value when query param is missing */
  defaultValue: T
  /** Transform from URL string to filter value */
  parse?: (value: string | null) => T
  /** Transform from filter value to URL string */
  serialize?: (value: T) => string | null
}

/**
 * Syncs a filter value with a URL query parameter.
 * Changes to the filter update the URL, and URL changes update the filter.
 *
 * @example
 * // String filter
 * const search = useUrlFilter('search', { defaultValue: '' })
 *
 * // Single select (nullable)
 * const kind = useUrlFilter('kind', { defaultValue: null })
 *
 * // Multi-select array
 * const statuses = useUrlFilter('statuses', {
 *   defaultValue: [],
 *   parse: (v) => v ? v.split(',') : [],
 *   serialize: (v) => v.length > 0 ? v.join(',') : null,
 * })
 */
export function useUrlFilter<T extends FilterValue>(
  key: string,
  options: UseUrlFilterOptions<T>,
): WritableComputedRef<T> {
  const route = useRoute()
  const router = useRouter()

  const { defaultValue, parse, serialize } = options

  // Default parse/serialize for common types
  const defaultParse = (value: string | null): T => {
    if (value === null || value === undefined || value === '') {
      return defaultValue
    }

    // Handle array default
    if (Array.isArray(defaultValue)) {
      return value.split(',') as T
    }

    return value as T
  }

  const defaultSerialize = (value: T): string | null => {
    if (value === null || value === undefined || value === '') {
      return null
    }

    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(',') : null
    }

    return String(value)
  }

  const parseFn = parse ?? defaultParse
  const serializeFn = serialize ?? defaultSerialize

  return computed<T>({
    get() {
      const queryValue = route.query[key]
      const stringValue = Array.isArray(queryValue) ? queryValue[0] : queryValue
      return parseFn(stringValue as string | null)
    },
    set(value: T) {
      const serialized = serializeFn(value)
      const newQuery = { ...route.query }

      if (serialized === null) {
        delete newQuery[key]
      }
      else {
        newQuery[key] = serialized
      }

      // Use replace to avoid polluting history with every filter change
      router.replace({ query: newQuery })
    },
  })
}

/**
 * Convenience wrapper for string filters
 */
export function useUrlStringFilter(key: string, defaultValue = ''): WritableComputedRef<string> {
  return useUrlFilter(key, { defaultValue })
}

/**
 * Convenience wrapper for nullable single-select filters
 */
export function useUrlSelectFilter(key: string): WritableComputedRef<string | undefined> {
  return useUrlFilter(key, { defaultValue: undefined })
}

/**
 * Convenience wrapper for multi-select array filters
 */
export function useUrlArrayFilter(key: string): WritableComputedRef<string[]> {
  return useUrlFilter(key, {
    defaultValue: [],
    parse: v => v ? v.split(',') : [],
    serialize: v => v.length > 0 ? v.join(',') : null,
  })
}

/**
 * Convenience wrapper for numeric filters
 */
export function useUrlNumberFilter(key: string, defaultValue = 1): WritableComputedRef<number> {
  return useUrlFilter(key, {
    defaultValue,
    parse: v => v ? Number.parseInt(v, 10) || defaultValue : defaultValue,
    serialize: v => v !== defaultValue ? String(v) : null,
  })
}
