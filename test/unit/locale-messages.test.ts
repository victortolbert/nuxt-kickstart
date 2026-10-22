import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { layers } from '../helpers/layers'

const LOCALES_DIR = resolve(__dirname, '../../i18n/locales')
const SUPPORTED_LOCALES = ['en', 'es'] as const

// Required namespaces and their minimum expected keys
const REQUIRED_NAMESPACES = {
  nav: [
    // Base navigation
    'home',
    'tech',
    // Admin navigation
    'adminDashboard',
    'users',
    // User menu items
    'appearance',
    'siteMap',
    'componentCatalog',
  ],
  common: ['loading', 'error', 'save', 'cancel', 'delete', 'edit', 'close'],
  search: [
    'placeholder',
    'noResults',
    'searching',
    // Command palette group labels
    'pages',
    'actions',
    'themes',
    // Action labels
    'openSiteMap',
    'openComponentCatalog',
    'switchToTheme',
    'active',
  ],
  theme: ['label', 'light', 'dark', 'system'],
  auth: ['signIn', 'signOut', 'profile'],
  translation: ['fallbackMessage', 'machineTranslatedMessage', 'contributeLink', 'dismiss'],
}

type LocaleMessages = Record<string, Record<string, string>>

function loadLocaleFile(locale: string): LocaleMessages | null {
  const filePath = resolve(LOCALES_DIR, `${locale}.json`)
  if (!existsSync(filePath)) {
    return null
  }
  try {
    const content = readFileSync(filePath, 'utf-8')
    return JSON.parse(content)
  }
  catch {
    return null
  }
}

describe('locale message files', () => {
  describe('file existence', () => {
    it('locales directory exists', () => {
      expect(existsSync(LOCALES_DIR)).toBe(true)
    })

    it.each(SUPPORTED_LOCALES)('%s.json file exists', (locale) => {
      const filePath = resolve(LOCALES_DIR, `${locale}.json`)
      expect(existsSync(filePath)).toBe(true)
    })
  })

  describe('jSON validity', () => {
    it.each(SUPPORTED_LOCALES)('%s.json is valid JSON', (locale) => {
      const messages = loadLocaleFile(locale)
      expect(messages).not.toBeNull()
      expect(typeof messages).toBe('object')
    })
  })

  describe('required namespaces', () => {
    it.each(SUPPORTED_LOCALES)('%s.json has all required namespaces', (locale) => {
      const messages = loadLocaleFile(locale)
      expect(messages).not.toBeNull()

      for (const namespace of Object.keys(REQUIRED_NAMESPACES)) {
        expect(messages).toHaveProperty(namespace)
        expect(typeof messages![namespace]).toBe('object')
      }
    })
  })

  describe('required keys within namespaces', () => {
    for (const [namespace, keys] of Object.entries(REQUIRED_NAMESPACES)) {
      describe(`${namespace} namespace`, () => {
        it.each(SUPPORTED_LOCALES)(`%s.json has all ${namespace}.* keys`, (locale) => {
          const messages = loadLocaleFile(locale)
          expect(messages).not.toBeNull()
          expect(messages).toHaveProperty(namespace)

          for (const key of keys) {
            expect(messages![namespace]).toHaveProperty(key)
            expect(typeof messages![namespace][key]).toBe('string')
            expect(messages![namespace][key].length).toBeGreaterThan(0)
          }
        })
      })
    }
  })

  describe('key parity across locales', () => {
    it('all locales have the same keys as English', () => {
      const enMessages = loadLocaleFile('en')
      expect(enMessages).not.toBeNull()

      const enKeys = new Set<string>()
      for (const [namespace, values] of Object.entries(enMessages!)) {
        for (const key of Object.keys(values)) {
          enKeys.add(`${namespace}.${key}`)
        }
      }

      for (const locale of SUPPORTED_LOCALES.filter(l => l !== 'en')) {
        const messages = loadLocaleFile(locale)
        expect(messages).not.toBeNull()

        const localeKeys = new Set<string>()
        for (const [namespace, values] of Object.entries(messages!)) {
          for (const key of Object.keys(values)) {
            localeKeys.add(`${namespace}.${key}`)
          }
        }

        // Check that locale has all English keys
        for (const key of enKeys) {
          expect(localeKeys.has(key), `${locale}.json missing key: ${key}`).toBe(true)
        }
      }
    })
  })
})

/** Every leaf key of a message tree, as a dotted path. */
function leafKeys(tree: unknown, prefix = ''): string[] {
  if (!tree || typeof tree !== 'object')
    return [prefix]
  return Object.entries(tree).flatMap(([key, value]) => leafKeys(value, prefix ? `${prefix}.${key}` : key))
}

function readMessages(file: string): unknown {
  return JSON.parse(readFileSync(file, 'utf-8'))
}

/**
 * A layer ships its own messages in `layers/<name>/i18n/locales/`, merged into
 * the app's by @nuxtjs/i18n and deleted with the folder. They are held to the
 * same parity as the base files, in both directions, so a string added in one
 * locale is never missing from the other.
 *
 * A machine-translated file says so in the same place the guides do it — a
 * flag the reader can see — here as `translation.machineTranslated: "true"`
 * (vue-i18n messages are strings). English is the authoring locale and never
 * carries it.
 */
describe('layer locale messages', () => {
  const localized = layers().filter(layer => layer.locales)

  it.each(localized.map(layer => [layer.name, layer.locales!] as const))('%s ships every supported locale', (_name, dir) => {
    for (const locale of SUPPORTED_LOCALES)
      expect(existsSync(resolve(dir, `${locale}.json`)), `${dir}/${locale}.json`).toBe(true)
  })

  it.each(localized.map(layer => [layer.name, layer.locales!] as const))('%s has the same keys in every locale', (_name, dir) => {
    const english = leafKeys(readMessages(resolve(dir, 'en.json'))).filter(key => key !== 'translation.machineTranslated').sort()
    for (const locale of SUPPORTED_LOCALES.filter(l => l !== 'en')) {
      const keys = leafKeys(readMessages(resolve(dir, `${locale}.json`))).filter(key => key !== 'translation.machineTranslated').sort()
      expect(keys, `${dir}/${locale}.json`).toEqual(english)
    }
  })

  it.each(localized.map(layer => [layer.name, layer.locales!] as const))('%s marks machine translation with the string flag, never in English', (_name, dir) => {
    for (const locale of SUPPORTED_LOCALES) {
      const flag = (readMessages(resolve(dir, `${locale}.json`)) as { translation?: { machineTranslated?: unknown } }).translation?.machineTranslated
      if (locale === 'en')
        expect(flag, `${dir}/en.json`).toBeUndefined()
      else if (flag !== undefined)
        expect(flag, `${dir}/${locale}.json`).toBe('true')
    }
  })

  it('reads a layer\'s keys the way the parity check needs', () => {
    // A detector that matches nothing is indistinguishable from a broken one.
    expect(leafKeys({ planner: { title: 'x', empty: { heading: 'y' } } })).toEqual(['planner.title', 'planner.empty.heading'])
  })
})
