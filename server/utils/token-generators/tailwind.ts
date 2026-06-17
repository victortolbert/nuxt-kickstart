import type { GeneratedFile } from './shared'
import { JSON_KEY_QUOTE_RE, unwrapHelium } from './shared'

/**
 * Tailwind config — maps DTCG token types to `theme.extend` buckets.
 */
export function generateTailwindConfig(tokens: Record<string, any>, _options: Record<string, any>): GeneratedFile {
  const innerTokens = unwrapHelium(tokens)

  const theme: Record<string, any> = {
    extend: {},
  }

  const colors: Record<string, string> = {}
  const spacing: Record<string, string> = {}
  const borderRadius: Record<string, string> = {}
  const fontFamily: Record<string, string[]> = {}
  const fontSize: Record<string, string> = {}

  function processTokens(obj: Record<string, any>, path: string[] = []) {
    for (const [key, value] of Object.entries(obj)) {
      if (key === '$extensions')
        continue

      if (value && typeof value === 'object' && '$value' in value) {
        const tokenType = value.$type
        const tokenValue = value.$value
        const tokenName = [...path, key].map(s => s.replaceAll(' ', '-').toLowerCase()).join('-')

        switch (tokenType) {
          case 'color':
            colors[tokenName] = tokenValue
            break
          case 'dimension':
          case 'spacing':
            spacing[tokenName] = tokenValue
            break
          case 'borderRadius':
            borderRadius[tokenName] = tokenValue
            break
          case 'fontFamily':
            fontFamily[tokenName] = [tokenValue]
            break
          case 'fontSize':
            fontSize[tokenName] = tokenValue
            break
        }
      }
      else if (value && typeof value === 'object') {
        processTokens(value, [...path, key])
      }
    }
  }

  if (innerTokens.primitives)
    processTokens(innerTokens.primitives, ['primitives'])
  if (innerTokens.rte)
    processTokens(innerTokens.rte, ['rte'])
  if (innerTokens.components)
    processTokens(innerTokens.components)

  if (Object.keys(colors).length > 0)
    theme.extend.colors = colors
  if (Object.keys(spacing).length > 0)
    theme.extend.spacing = spacing
  if (Object.keys(borderRadius).length > 0)
    theme.extend.borderRadius = borderRadius
  if (Object.keys(fontFamily).length > 0)
    theme.extend.fontFamily = fontFamily
  if (Object.keys(fontSize).length > 0)
    theme.extend.fontSize = fontSize

  const content = `/** @type {import('tailwindcss').Config} */
export default {
  theme: ${JSON.stringify(theme, null, 4).replace(JSON_KEY_QUOTE_RE, '$1:')},
}`

  return { ext: 'js', content }
}
