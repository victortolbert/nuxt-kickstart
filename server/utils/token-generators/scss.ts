import type { GeneratedFile } from './shared'
import { buildCombinedTokens, collectVarTokens, DOUBLE_QUOTE_RE, normalizeTokenKeys, unwrapHelium } from './shared'

/**
 * SCSS variables (`$name: value;`).
 */
export function generateSCSSVariables(tokens: Record<string, any>, options: Record<string, any>): GeneratedFile {
  const prefix = options.prefix ? `${options.prefix}-` : ''
  const lines: string[] = []

  collectVarTokens(unwrapHelium(tokens), (varName, value) => {
    lines.push(`$${prefix}${varName}: ${value};`)
  })

  return { ext: 'scss', content: lines.join('\n') }
}

/**
 * SCSS map (`$tokens: ( ... );`).
 */
export function generateSCSSMap(tokens: Record<string, any>, _options: Record<string, any>): GeneratedFile {
  const combinedTokens = buildCombinedTokens(unwrapHelium(tokens))
  const content = `$tokens: ${JSON.stringify(normalizeTokenKeys(combinedTokens), null, 2).replace(DOUBLE_QUOTE_RE, '\'')};`
  return { ext: 'scss', content }
}
