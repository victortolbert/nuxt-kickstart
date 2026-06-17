/**
 * Shared helpers for the token generators. These concentrate the patterns that
 * were copy-pasted across every format generator: Helium-wrapper unwrapping,
 * the combined rte/primitives/components builder, the CSS/SCSS variable walk,
 * and DTCG value formatting.
 */

/** The output of a single token generator: file extension + rendered content. */
export interface GeneratedFile {
  ext: string
  content: string
}

export const WHITESPACE_RE = /\s+/g
export const DOUBLE_QUOTE_RE = /"/g
export const JSON_KEY_QUOTE_RE = /"([^"]+)":/g
export const NUMERIC_PREFIX_RE = /^(-?\d+(?:\.\d+)?)/

/**
 * Unwrap the Helium token shape `{ metadata, tokens: {...} }` to its inner
 * `{ components, rte, primitives }`. Plain (already-inner) token objects pass
 * through unchanged.
 */
export function unwrapHelium(tokens: Record<string, any>): Record<string, any> {
  return tokens.tokens && typeof tokens.tokens === 'object' ? tokens.tokens : tokens
}

/**
 * Build a combined token object from the present sections (rte, primitives,
 * components), preserving the original "only include non-empty rte/primitives"
 * rule used by the JSON/JS/TS/SCSS-map generators.
 */
export function buildCombinedTokens(innerTokens: Record<string, any>): Record<string, any> {
  const combined: Record<string, any> = {}

  if (innerTokens.rte && typeof innerTokens.rte === 'object' && Object.keys(innerTokens.rte).length > 0) {
    combined.rte = innerTokens.rte
  }
  if (innerTokens.primitives && typeof innerTokens.primitives === 'object' && Object.keys(innerTokens.primitives).length > 0) {
    combined.primitives = innerTokens.primitives
  }
  if (innerTokens.components && typeof innerTokens.components === 'object') {
    combined.components = innerTokens.components
  }

  return combined
}

/**
 * Normalize a token path segment for CSS/SCSS variable names: lowercase,
 * spaces → dashes.
 */
export function normalizeVarNameSegment(segment: string): string {
  return segment.replaceAll(' ', '-').toLowerCase()
}

/**
 * Recursively normalize all keys in an object: spaces → dashes, lowercase.
 */
export function normalizeTokenKeys(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {}
  for (const [key, value] of Object.entries(obj)) {
    const normalizedKey = key.replaceAll(' ', '-').toLowerCase()
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      result[normalizedKey] = normalizeTokenKeys(value)
    }
    else {
      result[normalizedKey] = value
    }
  }
  return result
}

/**
 * Walk the rte/primitives/components sections and emit `(varName, value)` for
 * every DTCG or legacy token leaf. Shared by the CSS-variable and SCSS-variable
 * generators, which differ only in how they render the emitted pair.
 */
export function collectVarTokens(
  innerTokens: Record<string, any>,
  emit: (varName: string, value: string) => void,
): void {
  function walk(obj: Record<string, any>, path: string[] = []) {
    for (const [key, value] of Object.entries(obj)) {
      if (key === '$extensions')
        continue

      if (value && typeof value === 'object' && ('$value' in value || '$type' in value)) {
        // DTCG token
        const varName = [...path, key].map(normalizeVarNameSegment).join('-')
        emit(varName, formatTokenValue(value.$value))
      }
      else if (value && typeof value === 'object' && ('value' in value || 'type' in value)) {
        // Legacy token
        const varName = [...path, key].map(normalizeVarNameSegment).join('-')
        emit(varName, formatTokenValue(value.value))
      }
      else if (value && typeof value === 'object') {
        // Nested group
        walk(value, [...path, key])
      }
    }
  }

  if (innerTokens.rte && typeof innerTokens.rte === 'object') {
    walk(innerTokens.rte, ['rte'])
  }
  if (innerTokens.primitives && typeof innerTokens.primitives === 'object' && Object.keys(innerTokens.primitives).length > 0) {
    walk(innerTokens.primitives, ['primitives'])
  }
  if (innerTokens.components && typeof innerTokens.components === 'object') {
    walk(innerTokens.components)
  }
}

/**
 * Extract a value from a potentially nested `{ $value }` object.
 * `{ $type: 'dimension', $value: '0%' }` → `'0%'`.
 */
export function extractNestedValue(value: any): any {
  if (value && typeof value === 'object' && '$value' in value) {
    return value.$value
  }
  return value
}

/**
 * Format a token value for CSS output. Handles complex composite values
 * (typography, shadow, border); order matters — most specific first.
 */
export function formatTokenValue(value: any): string {
  if (value === null || value === undefined) {
    return 'inherit'
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return String(value)
  }

  if (typeof value !== 'object') {
    return String(value)
  }

  // Typography: {fontWeight} {fontSize}/{lineHeight} "{fontFamily}"
  if ('fontFamily' in value || 'fontSize' in value) {
    const fontWeight = extractNestedValue(value.fontWeight) || 400
    const fontSize = extractNestedValue(value.fontSize) || '16px'
    const lineHeight = extractNestedValue(value.lineHeight) || 'normal'
    const fontFamily = extractNestedValue(value.fontFamily) || 'sans-serif'
    return `${fontWeight} ${fontSize}/${lineHeight} "${fontFamily}"`
  }

  // Shadow (before border): offsetX offsetY blur spread color
  if (('offsetX' in value || 'x' in value || 'offsetY' in value || 'y' in value) && !('style' in value)) {
    const offsetX = extractNestedValue(value.offsetX ?? value.x) ?? '0px'
    const offsetY = extractNestedValue(value.offsetY ?? value.y) ?? '0px'
    const blur = extractNestedValue(value.blur) ?? '0px'
    const spread = extractNestedValue(value.spread) ?? '0px'
    const color = extractNestedValue(value.color) || 'rgba(0,0,0,0.1)'
    return `${offsetX} ${offsetY} ${blur} ${spread} ${color}`
  }

  // Border: width style color
  if ('style' in value || ('width' in value && 'color' in value)) {
    const width = extractNestedValue(value.width) || '1px'
    const style = extractNestedValue(value.style) || 'solid'
    const color = extractNestedValue(value.color) || 'currentColor'
    return `${width} ${style} ${color}`
  }

  // Fallback for unrecognized complex objects
  return JSON.stringify(value)
}
