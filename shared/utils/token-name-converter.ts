/**
 * Token Name Converter
 * Converts space-separated Helium token names to valid identifiers
 */

const WHITESPACE_RE = /\s+/g

/**
 * Converts a token name to kebab-case
 * @param name - Token name (e.g., 'border top', 'text a background')
 * @returns Kebab-case identifier (e.g., 'border-top', 'text-a-background')
 */
export function toKebabTokenName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(WHITESPACE_RE, '-')
}

/**
 * Converts a token name to camelCase
 * @param name - Token name (e.g., 'border top', 'text a background')
 * @returns CamelCase identifier (e.g., 'borderTop', 'textABackground')
 */
export function toCamelTokenName(name: string): string {
  const words = name.trim().toLowerCase().split(WHITESPACE_RE)
  if (words.length === 0)
    return ''

  return words[0] + words.slice(1).map(word =>
    word.charAt(0).toUpperCase() + word.slice(1),
  ).join('')
}

/**
 * Converts a token name to snake_case
 * @param name - Token name (e.g., 'border top', 'text a background')
 * @returns Snake_case identifier (e.g., 'border_top', 'text_a_background')
 */
export function toSnakeTokenName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(WHITESPACE_RE, '_')
}

/**
 * Naming format for token conversion
 */
export type TokenNamingFormat = 'kebab' | 'camel' | 'snake'

/**
 * Recursively converts all token names in a token object
 * @param tokens - Token object with potentially space-separated names
 * @param format - Target naming format (kebab, camel, or snake)
 * @returns New token object with converted names
 */
export function convertTokenNames(
  tokens: Record<string, any>,
  format: TokenNamingFormat,
): Record<string, any> {
  const converter = format === 'kebab'
    ? toKebabTokenName
    : format === 'camel'
      ? toCamelTokenName
      : toSnakeTokenName

  const result: Record<string, any> = {}

  for (const [key, value] of Object.entries(tokens)) {
    const convertedKey = converter(key)

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      // If the value is an object and has $type or $value, it's a token leaf
      if ('$type' in value || '$value' in value || 'type' in value || 'value' in value) {
        result[convertedKey] = value
      }
      else {
        // Otherwise, recursively convert nested objects
        result[convertedKey] = convertTokenNames(value, format)
      }
    }
    else {
      result[convertedKey] = value
    }
  }

  return result
}
