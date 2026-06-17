/**
 * Token validation utilities for Design Tokens
 */

// Color validation patterns
const HEX_COLOR_RE = /^#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i
const RGBA_COLOR_RE = /^rgba?\([^)]+\)$/i
const HSLA_COLOR_RE = /^hsla?\([^)]+\)$/i
const NAMED_COLOR_RE = /^[a-z]+$/i

// Dimension validation patterns
const DIMENSION_KEYWORD_RE = /^(?:auto|inherit|initial|unset|none|0)$/i
const DIMENSION_VALUE_RE = /^-?\d+(?:\.\d+)?(?:px|rem|em|%|vh|vw|vmin|vmax|pt|pc|in|cm|mm)$/

// Shadow/border validation
const CSS_NO_SEMICOLON_RE = /^[^;]+$/

// Font weight validation
const FONT_WEIGHT_KEYWORD_RE = /^(?:normal|bold|bolder|lighter)$/i

// Duration validation
const DURATION_RE = /^\d+(?:\.\d+)?(?:ms|s)$/

// Cubic bezier validation
const CUBIC_BEZIER_RE = /^cubic-bezier\([^)]+\)$/

// Layout validation
const DIRECTION_RE = /^(?:row|column|row-reverse|column-reverse)$/i
const JUSTIFY_RE = /^(?:flex-start|flex-end|center|space-between|space-around|space-evenly|start|end)$/i
const TEXT_CASE_RE = /^(?:none|uppercase|lowercase|capitalize)$/i

export interface TokenError {
  path: string[]
  message: string
  line: number | null
}

export interface ValidationResult {
  valid: boolean
  errors: TokenError[]
}

type TokenFormat = 'dtcg' | 'legacy' | 'helium' | 'unknown'

/**
 * Validates a color value
 */
function isValidColor(value: unknown): boolean {
  if (typeof value !== 'string')
    return false

  // Hex colors: #RGB, #RRGGBB, #RRGGBBAA
  if (HEX_COLOR_RE.test(value))
    return true

  // RGB/RGBA
  if (RGBA_COLOR_RE.test(value))
    return true

  // HSL/HSLA
  if (HSLA_COLOR_RE.test(value))
    return true

  // Named colors (basic check)
  if (NAMED_COLOR_RE.test(value))
    return true

  return false
}

/**
 * Validates a dimension value
 */
function isValidDimension(value: unknown): boolean {
  if (typeof value !== 'string')
    return false

  // Special keyword values (auto, inherit, etc.)
  if (DIMENSION_KEYWORD_RE.test(value))
    return true

  // px, rem, em, %, vh, vw, etc.
  return DIMENSION_VALUE_RE.test(value)
}

/**
 * Validates a typography token
 */
function isValidTypography(value: unknown): boolean {
  if (typeof value !== 'object' || value === null)
    return false

  const obj = value as Record<string, unknown>

  // Basic typography structure check
  return (
    (typeof obj.fontFamily === 'string' || obj.fontFamily === undefined)
    && (typeof obj.fontSize === 'string' || obj.fontSize === undefined)
    && (typeof obj.fontWeight === 'string' || typeof obj.fontWeight === 'number' || obj.fontWeight === undefined)
    && (typeof obj.lineHeight === 'string' || typeof obj.lineHeight === 'number' || obj.lineHeight === undefined)
  )
}

/**
 * Validates a shadow value
 */
function isValidShadow(value: unknown): boolean {
  if (typeof value === 'string') {
    // CSS shadow syntax
    return CSS_NO_SEMICOLON_RE.test(value)
  }

  if (typeof value === 'object' && value !== null) {
    const obj = value as Record<string, unknown>
    return (
      (typeof obj.offsetX === 'string' || obj.offsetX === undefined)
      && (typeof obj.offsetY === 'string' || obj.offsetY === undefined)
      && (typeof obj.blur === 'string' || obj.blur === undefined)
      && (typeof obj.spread === 'string' || obj.spread === undefined)
      && (typeof obj.color === 'string' || obj.color === undefined)
    )
  }

  return false
}

/**
 * Validates a border value
 */
function isValidBorder(value: unknown): boolean {
  if (typeof value === 'string') {
    // CSS border shorthand
    return CSS_NO_SEMICOLON_RE.test(value)
  }

  if (typeof value === 'object' && value !== null) {
    const obj = value as Record<string, unknown>
    return (
      (typeof obj.width === 'string' || obj.width === undefined)
      && (typeof obj.style === 'string' || obj.style === undefined)
      && (typeof obj.color === 'string' || obj.color === undefined)
    )
  }

  return false
}

/**
 * Validates a fontFamily value
 */
function isValidFontFamily(value: unknown): boolean {
  if (typeof value === 'string')
    return true
  if (Array.isArray(value)) {
    return value.every(v => typeof v === 'string')
  }
  return false
}

/**
 * Validates a fontWeight value
 */
function isValidFontWeight(value: unknown): boolean {
  if (typeof value === 'number') {
    return value >= 100 && value <= 900
  }
  if (typeof value === 'string') {
    const numericWeight = Number.parseInt(value, 10)
    if (!Number.isNaN(numericWeight)) {
      return numericWeight >= 100 && numericWeight <= 900
    }
    // Named weights
    return FONT_WEIGHT_KEYWORD_RE.test(value)
  }
  return false
}

/**
 * Validates a duration value
 */
function isValidDuration(value: unknown): boolean {
  if (typeof value !== 'string')
    return false
  return DURATION_RE.test(value)
}

/**
 * Validates a cubic-bezier value
 */
function isValidCubicBezier(value: unknown): boolean {
  if (typeof value === 'string') {
    return CUBIC_BEZIER_RE.test(value)
  }
  if (Array.isArray(value)) {
    return value.length === 4 && value.every(v => typeof v === 'number')
  }
  return false
}

/**
 * Validates a direction value (row, column, etc.)
 */
function isValidDirection(value: unknown): boolean {
  if (typeof value !== 'string')
    return false
  return DIRECTION_RE.test(value)
}

/**
 * Validates a justify value (flex-start, center, etc.)
 */
function isValidJustify(value: unknown): boolean {
  if (typeof value !== 'string')
    return false
  return JUSTIFY_RE.test(value)
}

/**
 * Validates a textcase value (none, uppercase, lowercase, capitalize)
 */
function isValidTextCase(value: unknown): boolean {
  if (typeof value !== 'string')
    return false
  return TEXT_CASE_RE.test(value)
}

/**
 * Validates a token value based on its type
 */
function validateTokenValue(type: string, value: unknown): boolean {
  switch (type) {
    case 'color':
      return isValidColor(value)
    case 'dimension':
    case 'width':
    case 'height':
      return isValidDimension(value)
    case 'typography':
      return isValidTypography(value)
    case 'shadow':
      return isValidShadow(value)
    case 'border':
      return isValidBorder(value)
    case 'fontFamily':
      return isValidFontFamily(value)
    case 'fontWeight':
      return isValidFontWeight(value)
    case 'duration':
      return isValidDuration(value)
    case 'cubicBezier':
      return isValidCubicBezier(value)
    case 'direction':
      return isValidDirection(value)
    case 'justify':
      return isValidJustify(value)
    case 'textcase':
      return isValidTextCase(value)
    default:
      // Unknown types are valid by default (extensibility)
      return true
  }
}

/**
 * Recursively validates tokens in an object
 */
function validateTokensRecursive(
  obj: Record<string, unknown>,
  format: TokenFormat,
  path: string[] = [],
  errors: TokenError[] = [],
): void {
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = [...path, key]

    if (value === null || value === undefined) {
      errors.push({
        path: currentPath,
        message: 'Token value cannot be null or undefined',
        line: null,
      })
      continue
    }

    // Check if this is a token (has $value or value key)
    const isDtcgToken = typeof value === 'object' && value !== null && '$value' in value
    const isLegacyToken = typeof value === 'object' && value !== null && 'value' in value && !key.startsWith('$')

    if (isDtcgToken) {
      const token = value as Record<string, unknown>
      const tokenType = token.$type as string
      const tokenValue = token.$value

      if (!tokenType) {
        errors.push({
          path: currentPath,
          message: 'DTCG token missing $type field',
          line: null,
        })
      }
      else if (!validateTokenValue(tokenType, tokenValue)) {
        errors.push({
          path: currentPath,
          message: `Invalid value for type "${tokenType}"`,
          line: null,
        })
      }
    }
    else if (isLegacyToken) {
      const token = value as Record<string, unknown>
      const tokenType = token.type as string
      const tokenValue = token.value

      if (tokenType && !validateTokenValue(tokenType, tokenValue)) {
        errors.push({
          path: currentPath,
          message: `Invalid value for type "${tokenType}"`,
          line: null,
        })
      }
    }
    else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Recurse into nested objects
      validateTokensRecursive(value as Record<string, unknown>, format, currentPath, errors)
    }
  }
}

/**
 * Validates a tokens object and returns validation results
 *
 * @param json - The tokens object to validate
 * @param format - The detected token format
 * @returns Validation result with errors array
 */
export function validateTokens(json: unknown, format: TokenFormat): ValidationResult {
  const errors: TokenError[] = []

  if (typeof json !== 'object' || json === null) {
    errors.push({
      path: [],
      message: 'Tokens must be an object',
      line: null,
    })
    return { valid: false, errors }
  }

  if (Array.isArray(json)) {
    errors.push({
      path: [],
      message: 'Tokens cannot be an array',
      line: null,
    })
    return { valid: false, errors }
  }

  validateTokensRecursive(json as Record<string, unknown>, format, [], errors)

  return {
    valid: errors.length === 0,
    errors,
  }
}
