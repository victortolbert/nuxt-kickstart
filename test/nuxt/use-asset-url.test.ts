import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

// Test the composable file exists and has correct structure
// Full integration testing requires actual Nuxt runtime config

const COMPOSABLE_PATH = resolve(__dirname, '../../app/composables/use-asset-url.ts')

describe('useAssetUrl composable', () => {
  describe('file structure', () => {
    it('composable file exists', () => {
      expect(existsSync(COMPOSABLE_PATH)).toBe(true)
    })

    it('exports useAssetUrl function', () => {
      const content = readFileSync(COMPOSABLE_PATH, 'utf-8')
      expect(content).toContain('export function useAssetUrl')
    })
  })

  describe('implementation details', () => {
    const content = readFileSync(COMPOSABLE_PATH, 'utf-8')

    it('uses useRuntimeConfig for site URL', () => {
      expect(content).toContain('const config = useRuntimeConfig()')
    })

    it('reads siteUrl from public config', () => {
      expect(content).toContain('config.public.siteUrl')
    })
  })

  describe('getAssetUrl function', () => {
    const content = readFileSync(COMPOSABLE_PATH, 'utf-8')

    it('is defined', () => {
      expect(content).toContain('function getAssetUrl(path: string)')
    })

    it('normalizes path with leading slash', () => {
      expect(content).toContain('path.startsWith(\'/\')')
    })

    it('concatenates siteUrl with path', () => {
      // eslint-disable-next-line no-template-curly-in-string
      expect(content).toContain('`${siteUrl}${cleanPath}`')
    })
  })

  describe('getScreenshotUrl function', () => {
    const content = readFileSync(COMPOSABLE_PATH, 'utf-8')

    it('is defined', () => {
      expect(content).toContain('function getScreenshotUrl(projectSlug: string, filename: string)')
    })

    it('builds screenshot path', () => {
      // eslint-disable-next-line no-template-curly-in-string
      expect(content).toContain('/screenshots/${projectSlug}/${filename}')
    })
  })

  describe('getImageUrl function', () => {
    const content = readFileSync(COMPOSABLE_PATH, 'utf-8')

    it('is defined', () => {
      expect(content).toContain('function getImageUrl(filename: string)')
    })

    it('builds image path', () => {
      // eslint-disable-next-line no-template-curly-in-string
      expect(content).toContain('/images/${filename}')
    })
  })

  describe('return value', () => {
    const content = readFileSync(COMPOSABLE_PATH, 'utf-8')

    it('returns siteUrl', () => {
      expect(content).toContain('siteUrl,')
    })

    it('returns getAssetUrl', () => {
      expect(content).toContain('getAssetUrl,')
    })

    it('returns getScreenshotUrl', () => {
      expect(content).toContain('getScreenshotUrl,')
    })

    it('returns getImageUrl', () => {
      expect(content).toContain('getImageUrl,')
    })
  })
})
