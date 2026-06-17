/**
 * Token format detector utility
 * Detects whether a token JSON object is DTCG, legacy, Helium, or unknown format
 */

export type TokenFormat = 'dtcg' | 'legacy' | 'helium' | 'unknown'

/**
 * Detects the format of a token JSON object
 * @param json - The token object to analyze
 * @returns The detected format: 'dtcg', 'legacy', 'helium', or 'unknown'
 */
export function detectTokenFormat(json: unknown): TokenFormat {
  if (!json || typeof json !== 'object' || Array.isArray(json)) {
    return 'unknown'
  }

  // Check for Helium format first (most specific)
  if (isHeliumFormat(json)) {
    return 'helium'
  }

  // Check for DTCG format (has $type and $value keys)
  if (hasDTCGTokens(json)) {
    return 'dtcg'
  }

  // Check for legacy format (nested objects with value keys)
  if (hasLegacyTokens(json)) {
    return 'legacy'
  }

  return 'unknown'
}

/**
 * Type guard to check if a JSON object is in Helium format
 * @param json - The object to check
 * @returns True if the object is in Helium format
 */
export function isHeliumFormat(json: unknown): json is { metadata: object, tokens: { components?: object } } {
  if (!json || typeof json !== 'object' || Array.isArray(json)) {
    return false
  }

  const obj = json as Record<string, unknown>

  // Helium format has 'metadata' and 'tokens' keys at root
  const hasMetadata = 'metadata' in obj && typeof obj.metadata === 'object'
  const hasTokens = 'tokens' in obj && typeof obj.tokens === 'object' && obj.tokens !== null

  if (!hasMetadata || !hasTokens) {
    return false
  }

  // Check if tokens has components, primitives, or rte
  const tokens = obj.tokens as Record<string, unknown>
  const hasComponents = 'components' in tokens

  return hasComponents
}

/**
 * Recursively checks if an object contains DTCG tokens ($type and $value)
 * @param obj - The object to check
 * @returns True if DTCG tokens are found
 */
function hasDTCGTokens(obj: unknown): boolean {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return false
  }

  const record = obj as Record<string, unknown>

  // Check if this object has both $type and $value
  if ('$type' in record && '$value' in record) {
    return true
  }

  // Recursively check nested objects
  for (const value of Object.values(record)) {
    if (typeof value === 'object' && value !== null) {
      if (hasDTCGTokens(value)) {
        return true
      }
    }
  }

  return false
}

/**
 * Recursively checks if an object contains legacy tokens (value key without $ prefix)
 * @param obj - The object to check
 * @returns True if legacy tokens are found
 */
function hasLegacyTokens(obj: unknown): boolean {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return false
  }

  const record = obj as Record<string, unknown>

  // Check if this object has a 'value' key (legacy format)
  if ('value' in record) {
    return true
  }

  // Recursively check nested objects, but skip $ prefixed keys
  for (const [key, value] of Object.entries(record)) {
    if (!key.startsWith('$') && typeof value === 'object' && value !== null) {
      if (hasLegacyTokens(value)) {
        return true
      }
    }
  }

  return false
}
