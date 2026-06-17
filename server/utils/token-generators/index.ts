import type { GeneratedFile } from './shared'
import { generateCSSComponents, generateCSSVariables, generateHeliumCSS } from './css'
import { generateJSModule, generateTSDeclarations } from './js'
import { generateFlatJSON, generateNestedJSON } from './json'
import { generateAndroidCompose, generateAndroidXML, generateIOSSwift } from './mobile'
import { generateSCSSMap, generateSCSSVariables } from './scss'
import { WHITESPACE_RE } from './shared'
import { generateTailwindConfig } from './tailwind'

type Generator = (tokens: Record<string, any>, options: Record<string, any>) => GeneratedFile

/**
 * Registry mapping each export format id to its generator. Adding a format is
 * one entry here plus its generator function in the matching family module.
 */
export const tokenGenerators: Record<string, Generator> = {
  'css': generateCSSVariables,
  'css-components': generateCSSComponents,
  'helium-css': generateHeliumCSS,
  'scss-vars': generateSCSSVariables,
  'scss-map': generateSCSSMap,
  'tailwind': generateTailwindConfig,
  'js-esm': generateJSModule,
  'ts': generateTSDeclarations,
  'json-flat': tokens => generateFlatJSON(tokens),
  'json-nested': tokens => generateNestedJSON(tokens),
  'ios-swift': generateIOSSwift,
  'android-xml': generateAndroidXML,
  'android-compose': generateAndroidCompose,
}

/** Format ids backed by a custom (non-Style-Dictionary) generator. */
export const SUPPORTED_FORMATS = Object.keys(tokenGenerators)

/**
 * Generate the output filename. Helium formats use
 * `tokens-<brand>-<franchise>.<ext>` when metadata is available.
 */
export function generateFilename(
  formatId: string,
  ext: string,
  metadata?: { brand?: string, franchise?: string },
): string {
  const isHeliumFormat = ['helium-css', 'css-components'].includes(formatId)

  if (isHeliumFormat && metadata?.brand && metadata?.franchise) {
    const brand = metadata.brand.toLowerCase().replaceAll(WHITESPACE_RE, '-')
    const franchise = metadata.franchise.toLowerCase().replaceAll(WHITESPACE_RE, '-')
    return `tokens-${brand}-${franchise}.${ext}`
  }

  return `tokens.${ext}`
}

/**
 * Transform tokens to a single format via the custom generators. Throws on an
 * unsupported format. The `/api/tokens/transform` endpoint is a thin adapter
 * over this; it also offers the Style Dictionary path separately.
 */
export function transformTokens(
  tokens: Record<string, any>,
  formatId: string,
  options: Record<string, any> = {},
  metadata?: { brand?: string, franchise?: string },
): { filename: string, content: string, format: string } {
  const generator = tokenGenerators[formatId]
  if (!generator) {
    throw new Error(`Unsupported format: ${formatId}`)
  }

  const { ext, content } = generator(tokens, options)
  const filename = generateFilename(formatId, ext, metadata)

  return { filename, content, format: formatId }
}
