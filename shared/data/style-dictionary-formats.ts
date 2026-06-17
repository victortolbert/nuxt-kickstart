/**
 * Style Dictionary format configurations
 * Defines all supported output formats for design token transformation
 */

export interface FormatConfig {
  id: string
  label: string
  ext: string
  transform: string
  category: 'web' | 'ios' | 'android' | 'data'
  description: string
  heliumOnly?: boolean
  /** Which options this format supports */
  supportedOptions?: {
    prefix?: boolean
    selector?: boolean
    outputReferences?: boolean
    themeMode?: boolean
  }
}

export type ThemeOutputMode = 'merged' | 'separate' | 'nested'

export interface FormatOptions {
  prefix?: string
  outputReferences?: boolean
  selector?: string
  themeMode?: ThemeOutputMode
}

export const themeOutputModes: Record<ThemeOutputMode, { label: string, description: string }> = {
  merged: {
    label: 'Merged',
    description: 'All theme variants merged into single file',
  },
  separate: {
    label: 'Separate Files',
    description: 'Each theme variant as separate file',
  },
  nested: {
    label: 'Nested Selectors',
    description: 'Theme variants as nested CSS selectors',
  },
}

export const formats: FormatConfig[] = [
  // Web formats
  {
    id: 'css',
    label: 'CSS Variables',
    ext: 'css',
    transform: 'css/variables',
    category: 'web',
    description: 'CSS custom properties (--token-name)',
    supportedOptions: { prefix: true, selector: true, outputReferences: true },
  },
  {
    id: 'css-components',
    label: 'CSS Components',
    ext: 'css',
    transform: 'css/components',
    category: 'web',
    description: 'Component-scoped CSS variables for Helium tokens',
    heliumOnly: true,
    supportedOptions: { prefix: true, outputReferences: true },
  },
  {
    id: 'helium-css',
    label: 'Helium CSS (Nova)',
    ext: 'css',
    transform: 'css/helium',
    category: 'web',
    description: 'Nova-style CSS with typography classes and component variables',
    heliumOnly: true,
    supportedOptions: { themeMode: true },
  },
  {
    id: 'scss-vars',
    label: 'SCSS Variables',
    ext: 'scss',
    transform: 'scss/variables',
    category: 'web',
    description: 'SCSS variables ($token-name)',
    supportedOptions: { prefix: true, outputReferences: true },
  },
  {
    id: 'scss-map',
    label: 'SCSS Map',
    ext: 'scss',
    transform: 'scss/map-flat',
    category: 'web',
    description: 'Nested SCSS map structure',
    supportedOptions: {},
  },
  {
    id: 'tailwind',
    label: 'Tailwind Config',
    ext: 'js',
    transform: 'javascript/tailwind',
    category: 'web',
    description: 'Tailwind theme configuration object',
    supportedOptions: {},
  },

  // iOS formats
  {
    id: 'ios-swift',
    label: 'iOS Swift',
    ext: 'swift',
    transform: 'ios-swift/class.swift',
    category: 'ios',
    description: 'Swift class with static properties',
    supportedOptions: { prefix: true },
  },

  // Android formats
  {
    id: 'android-xml',
    label: 'Android XML',
    ext: 'xml',
    transform: 'android/resources',
    category: 'android',
    description: 'Android resource XML files',
    supportedOptions: { outputReferences: true },
  },
  {
    id: 'android-compose',
    label: 'Android Compose',
    ext: 'kt',
    transform: 'compose/object',
    category: 'android',
    description: 'Jetpack Compose theme object',
    supportedOptions: { prefix: true },
  },

  // Data formats
  {
    id: 'js-esm',
    label: 'JavaScript (ESM)',
    ext: 'js',
    transform: 'javascript/es6',
    category: 'data',
    description: 'ES6 module exports',
    supportedOptions: {},
  },
  {
    id: 'ts',
    label: 'TypeScript',
    ext: 'ts',
    transform: 'typescript/es6-declarations',
    category: 'data',
    description: 'TypeScript declarations with types',
    supportedOptions: {},
  },
  {
    id: 'json-flat',
    label: 'JSON (Flat)',
    ext: 'json',
    transform: 'json/flat',
    category: 'data',
    description: 'Flat JSON object with dot-notation keys',
    supportedOptions: {},
  },
  {
    id: 'json-nested',
    label: 'JSON (Nested)',
    ext: 'json',
    transform: 'json/nested',
    category: 'data',
    description: 'Nested JSON object structure',
    supportedOptions: {},
  },
]

export const formatOptions: Record<string, FormatOptions> = {
  'css': {
    selector: ':root',
    outputReferences: true,
  },
  'css-components': {
    selector: '.component',
    outputReferences: true,
    themeMode: 'nested',
  },
  'helium-css': {
    selector: '.cmp',
    outputReferences: true,
    themeMode: 'nested',
  },
  'scss-vars': {
    outputReferences: true,
  },
  'scss-map': {
    outputReferences: false,
  },
  'tailwind': {
    outputReferences: false,
  },
  'ios-swift': {
    prefix: 'Token',
  },
  'android-xml': {
    outputReferences: true,
  },
  'android-compose': {
    prefix: 'Token',
  },
  'js-esm': {
    outputReferences: false,
  },
  'ts': {
    outputReferences: false,
  },
  'json-flat': {
    outputReferences: false,
  },
  'json-nested': {
    outputReferences: false,
  },
}

/**
 * Get format configuration by ID
 */
export function getFormatById(id: string): FormatConfig | undefined {
  return formats.find(format => format.id === id)
}

/**
 * Get formats by category
 */
export function getFormatsByCategory(category: FormatConfig['category']): FormatConfig[] {
  return formats.filter(format => format.category === category)
}

/**
 * Get available formats based on token format
 * When isHeliumFormat is true, Helium-specific formats are moved to the top
 */
export function getAvailableFormats(isHeliumFormat: boolean): FormatConfig[] {
  if (isHeliumFormat) {
    // Put Helium-only formats first, then the rest
    const heliumFormats = formats.filter(format => format.heliumOnly)
    const otherFormats = formats.filter(format => !format.heliumOnly)
    return [...heliumFormats, ...otherFormats]
  }
  return formats.filter(format => !format.heliumOnly)
}

/**
 * Get the default format ID to auto-select for Helium tokens
 */
export function getDefaultHeliumFormat(): string {
  return 'helium-css'
}
