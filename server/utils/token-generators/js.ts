import type { GeneratedFile } from './shared'
import { buildCombinedTokens, normalizeTokenKeys, unwrapHelium } from './shared'

/**
 * JavaScript ES module (`export default { ... }`).
 */
export function generateJSModule(tokens: Record<string, any>, _options: Record<string, any>): GeneratedFile {
  const combinedTokens = buildCombinedTokens(unwrapHelium(tokens))
  const content = `export default ${JSON.stringify(normalizeTokenKeys(combinedTokens), null, 2)};`
  return { ext: 'js', content }
}

/**
 * TypeScript declarations (`declare const tokens: { ... }`).
 */
export function generateTSDeclarations(tokens: Record<string, any>, _options: Record<string, any>): GeneratedFile {
  const combinedTokens = buildCombinedTokens(unwrapHelium(tokens))
  const content = `declare const tokens: ${JSON.stringify(normalizeTokenKeys(combinedTokens), null, 2)};\nexport default tokens;`
  return { ext: 'd.ts', content }
}
