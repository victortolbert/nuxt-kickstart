/**
 * Token normalizer utility
 * Normalizes Helium format tokens for Style Dictionary processing
 */

export interface HeliumMetadata {
  brand: string
  franchise: string
}

export interface NormalizedHeliumResult {
  tokens: Record<string, unknown>
  metadata: HeliumMetadata
}

/**
 * Extracts metadata from Helium format JSON
 * @param json - The Helium format token object
 * @returns Object with brand and franchise
 */
export function extractHeliumMetadata(json: unknown): HeliumMetadata {
  if (!json || typeof json !== 'object' || Array.isArray(json)) {
    return { brand: '', franchise: '' }
  }

  const obj = json as Record<string, unknown>

  if (!('metadata' in obj) || typeof obj.metadata !== 'object' || obj.metadata === null) {
    return { brand: '', franchise: '' }
  }

  const metadata = obj.metadata as Record<string, unknown>

  return {
    brand: typeof metadata.brand === 'string' ? metadata.brand : '',
    franchise: typeof metadata.franchise === 'string' ? metadata.franchise : '',
  }
}

/**
 * Normalizes Helium format tokens to Style Dictionary format
 * Flattens component.variant.tokenName structure to component.variant.tokenName path
 * Preserves $type and $value on each token
 *
 * @param json - The Helium format token object
 * @returns Normalized tokens and metadata
 */
export function normalizeHeliumTokens(json: unknown): NormalizedHeliumResult {
  const metadata = extractHeliumMetadata(json)

  if (!json || typeof json !== 'object' || Array.isArray(json)) {
    return { tokens: {}, metadata }
  }

  const obj = json as Record<string, unknown>

  if (!('tokens' in obj) || typeof obj.tokens !== 'object' || obj.tokens === null) {
    return { tokens: {}, metadata }
  }

  const heliumTokens = obj.tokens as Record<string, unknown>
  const normalizedTokens: Record<string, unknown> = {}

  // Extract tokens from components
  if ('components' in heliumTokens && typeof heliumTokens.components === 'object' && heliumTokens.components !== null) {
    const components = heliumTokens.components as Record<string, unknown>

    for (const [componentName, componentValue] of Object.entries(components)) {
      if (typeof componentValue !== 'object' || componentValue === null) {
        continue
      }

      // Each component has variants
      const variants = componentValue as Record<string, unknown>

      for (const [variantName, variantValue] of Object.entries(variants)) {
        if (typeof variantValue !== 'object' || variantValue === null) {
          continue
        }

        // Create nested structure: components > componentName > variantName > tokens
        if (!normalizedTokens.components) {
          normalizedTokens.components = {}
        }

        const componentsObj = normalizedTokens.components as Record<string, unknown>

        if (!componentsObj[componentName]) {
          componentsObj[componentName] = {}
        }

        const componentObj = componentsObj[componentName] as Record<string, unknown>
        componentObj[variantName] = variantValue
      }
    }
  }

  // Extract tokens from primitives (if present)
  if ('primitives' in heliumTokens && typeof heliumTokens.primitives === 'object' && heliumTokens.primitives !== null) {
    const primitives = heliumTokens.primitives as Record<string, unknown>

    if (Object.keys(primitives).length > 0) {
      normalizedTokens.primitives = primitives
    }
  }

  // Extract tokens from rte (if present)
  if ('rte' in heliumTokens && typeof heliumTokens.rte === 'object' && heliumTokens.rte !== null) {
    const rte = heliumTokens.rte as Record<string, unknown>

    if (Object.keys(rte).length > 0) {
      normalizedTokens.rte = rte
    }
  }

  return {
    tokens: normalizedTokens,
    metadata,
  }
}
