import { existsSync, readdirSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const CONTENT_DIR = resolve(__dirname, '../../content')
const SUPPORTED_LOCALES = ['en', 'es'] as const
const LOCALIZED_COLLECTIONS = ['guides', 'posts'] as const

describe('content locale directory structure', () => {
  describe('locale directories exist', () => {
    it.each(SUPPORTED_LOCALES)('content/%s/ directory exists', (locale) => {
      const localePath = resolve(CONTENT_DIR, locale)
      expect(existsSync(localePath), `content/${locale}/ directory should exist`).toBe(true)
      expect(statSync(localePath).isDirectory()).toBe(true)
    })
  })

  describe('localized collections in en/ locale', () => {
    it.each(LOCALIZED_COLLECTIONS)('content/en/%s/ directory exists', (collection) => {
      const collectionPath = resolve(CONTENT_DIR, 'en', collection)
      expect(existsSync(collectionPath), `content/en/${collection}/ directory should exist`).toBe(true)
      expect(statSync(collectionPath).isDirectory()).toBe(true)
    })

    it.each(LOCALIZED_COLLECTIONS)('content/en/%s/ has content files', (collection) => {
      const collectionPath = resolve(CONTENT_DIR, 'en', collection)
      const files = readdirSync(collectionPath)
      expect(files.length).toBeGreaterThan(0)
    })
  })

  describe('non-English locale directories have .gitkeep', () => {
    const nonEnglishLocales = SUPPORTED_LOCALES.filter(l => l !== 'en')

    it.each(nonEnglishLocales)('content/%s/ has .gitkeep file', (locale) => {
      const gitkeepPath = resolve(CONTENT_DIR, locale, '.gitkeep')
      expect(existsSync(gitkeepPath), `content/${locale}/.gitkeep should exist`).toBe(true)
    })
  })

  describe('localized collections NOT in root content/', () => {
    it.each(LOCALIZED_COLLECTIONS)('content/%s/ should not exist (moved to en/)', (collection) => {
      const rootPath = resolve(CONTENT_DIR, collection)
      expect(existsSync(rootPath), `content/${collection}/ should not exist in root`).toBe(false)
    })
  })
})
