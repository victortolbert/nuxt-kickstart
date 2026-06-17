/**
 * Token parser utility
 * Parses and normalizes any token JSON format for Style Dictionary
 */

import type { TokenFormat } from './token-detector'
import type { HeliumMetadata } from './token-normalizer'
import { detectTokenFormat } from './token-detector'
import { normalizeHeliumTokens } from './token-normalizer'

const LINE_NUMBER_RE = /line (\d+)/i
const POSITION_RE = /position (\d+)/i

export interface ParsedTokens {
  tokens: Record<string, unknown>
  format: TokenFormat
  metadata?: HeliumMetadata
  tokenCount: number
}

export interface ParseError {
  error: string
  line?: number
}

/**
 * Parses a JSON string and normalizes tokens for Style Dictionary
 * Handles JSON parse errors with line number reporting
 * Auto-detects format and normalizes Helium tokens
 *
 * @param json - JSON string to parse
 * @returns Parsed tokens with format, metadata, and count
 * @throws ParseError with line number if JSON is invalid
 */
export function parseTokens(json: string): ParsedTokens {
  // Parse JSON with error handling
  let parsed: unknown
  try {
    parsed = JSON.parse(json)
  }
  catch (error) {
    // Extract line number from error message if available
    const errorMessage = error instanceof Error ? error.message : String(error)
    const lineMatch = errorMessage.match(LINE_NUMBER_RE) || errorMessage.match(POSITION_RE)
    const line = lineMatch?.[1] ? Number.parseInt(lineMatch[1], 10) : undefined

    const parseError: ParseError = {
      error: `Invalid JSON: ${errorMessage}`,
      line,
    }
    throw parseError
  }

  // Detect format
  const format = detectTokenFormat(parsed)

  // Handle Helium format - normalize tokens
  if (format === 'helium') {
    const normalized = normalizeHeliumTokens(parsed)
    return {
      tokens: normalized.tokens,
      format,
      metadata: normalized.metadata,
      tokenCount: countTokens(normalized.tokens),
    }
  }

  // For DTCG and legacy formats, return as-is
  if (format === 'dtcg' || format === 'legacy') {
    const tokens = parsed as Record<string, unknown>
    return {
      tokens,
      format,
      tokenCount: countTokens(tokens),
    }
  }

  // Unknown format
  return {
    tokens: {},
    format: 'unknown',
    tokenCount: 0,
  }
}

/**
 * Counts the number of leaf token nodes in a token object
 * A leaf token is an object with $type/$value (DTCG) or type/value (legacy) keys
 *
 * @param tokens - Token object to count
 * @returns Number of leaf tokens
 */
export function countTokens(tokens: unknown): number {
  if (!tokens || typeof tokens !== 'object' || Array.isArray(tokens)) {
    return 0
  }

  const obj = tokens as Record<string, unknown>
  let count = 0

  // Check if this is a token leaf node
  const isDTCGToken = '$type' in obj && '$value' in obj
  const isLegacyToken = 'type' in obj && 'value' in obj

  if (isDTCGToken || isLegacyToken) {
    return 1
  }

  // Recursively count tokens in nested objects
  for (const value of Object.values(obj)) {
    if (typeof value === 'object' && value !== null) {
      count += countTokens(value)
    }
  }

  return count
}

/**
 * Gets all token paths in dot notation
 * Example: ['color.primary.500', 'spacing.sm', 'typography.heading.h1']
 *
 * @param tokens - Token object to traverse
 * @param prefix - Current path prefix (used internally for recursion)
 * @returns Array of token paths
 */
export function getTokenPaths(tokens: unknown, prefix: string = ''): string[] {
  if (!tokens || typeof tokens !== 'object' || Array.isArray(tokens)) {
    return []
  }

  const obj = tokens as Record<string, unknown>
  const paths: string[] = []

  // Check if this is a token leaf node
  const isDTCGToken = '$type' in obj && '$value' in obj
  const isLegacyToken = 'type' in obj && 'value' in obj

  if (isDTCGToken || isLegacyToken) {
    return prefix ? [prefix] : []
  }

  // Recursively collect paths from nested objects
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && value !== null) {
      const currentPath = prefix ? `${prefix}.${key}` : key
      const childPaths = getTokenPaths(value, currentPath)
      paths.push(...childPaths)
    }
  }

  return paths
}
