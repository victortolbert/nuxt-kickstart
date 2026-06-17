import type { GeneratedFile } from './shared'
import { buildCombinedTokens, normalizeTokenKeys, unwrapHelium } from './shared'

/**
 * Flat JSON — dotted keys mapping to raw token values.
 */
export function generateFlatJSON(tokens: Record<string, any>): GeneratedFile {
  const flat: Record<string, any> = {}
  const innerTokens = unwrapHelium(tokens)

  function flatten(obj: Record<string, any>, path: string[] = []) {
    for (const [key, value] of Object.entries(obj)) {
      if (key === '$extensions')
        continue

      const normalizedKey = key.replaceAll(' ', '-').toLowerCase()
      if (value && typeof value === 'object' && ('$value' in value || 'value' in value)) {
        const tokenValue = value.$value || value.value
        const flatKey = [...path, normalizedKey].join('.')
        flat[flatKey] = tokenValue
      }
      else if (value && typeof value === 'object') {
        flatten(value, [...path, normalizedKey])
      }
    }
  }

  if (innerTokens.rte && typeof innerTokens.rte === 'object') {
    flatten(innerTokens.rte, ['rte'])
  }
  if (innerTokens.primitives && typeof innerTokens.primitives === 'object' && Object.keys(innerTokens.primitives).length > 0) {
    flatten(innerTokens.primitives, ['primitives'])
  }
  if (innerTokens.components && typeof innerTokens.components === 'object') {
    flatten(innerTokens.components, ['components'])
  }

  return { ext: 'json', content: JSON.stringify(flat, null, 2) }
}

/**
 * Nested JSON — normalized combined token tree.
 */
export function generateNestedJSON(tokens: Record<string, any>): GeneratedFile {
  const combinedTokens = buildCombinedTokens(unwrapHelium(tokens))
  return { ext: 'json', content: JSON.stringify(normalizeTokenKeys(combinedTokens), null, 2) }
}
