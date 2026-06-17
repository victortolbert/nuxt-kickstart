import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

// Test the composable file exists and has correct structure
// Full integration testing requires actual Nuxt router context

const COMPOSABLE_PATH = resolve(__dirname, '../../app/composables/use-url-filter.ts')

describe('useUrlFilter composable', () => {
  describe('file structure', () => {
    it('composable file exists', () => {
      expect(existsSync(COMPOSABLE_PATH)).toBe(true)
    })

    it('exports useUrlFilter function', () => {
      const content = readFileSync(COMPOSABLE_PATH, 'utf-8')
      expect(content).toContain('export function useUrlFilter')
    })

    it('exports useUrlStringFilter function', () => {
      const content = readFileSync(COMPOSABLE_PATH, 'utf-8')
      expect(content).toContain('export function useUrlStringFilter')
    })

    it('exports useUrlSelectFilter function', () => {
      const content = readFileSync(COMPOSABLE_PATH, 'utf-8')
      expect(content).toContain('export function useUrlSelectFilter')
    })

    it('exports useUrlArrayFilter function', () => {
      const content = readFileSync(COMPOSABLE_PATH, 'utf-8')
      expect(content).toContain('export function useUrlArrayFilter')
    })

    it('exports useUrlNumberFilter function', () => {
      const content = readFileSync(COMPOSABLE_PATH, 'utf-8')
      expect(content).toContain('export function useUrlNumberFilter')
    })
  })

  describe('useUrlFilterOptions interface', () => {
    const content = readFileSync(COMPOSABLE_PATH, 'utf-8')

    it('has defaultValue property', () => {
      expect(content).toContain('defaultValue: T')
    })

    it('has optional parse function', () => {
      expect(content).toContain('parse?: (value: string | null) => T')
    })

    it('has optional serialize function', () => {
      expect(content).toContain('serialize?: (value: T) => string | null')
    })
  })

  describe('useUrlFilter implementation', () => {
    const content = readFileSync(COMPOSABLE_PATH, 'utf-8')

    it('uses useRoute for reading query params', () => {
      expect(content).toContain('const route = useRoute()')
    })

    it('uses useRouter for updating query params', () => {
      expect(content).toContain('const router = useRouter()')
    })

    it('returns a writable computed ref', () => {
      expect(content).toContain('return computed<T>')
    })

    it('uses router.replace to avoid polluting history', () => {
      expect(content).toContain('router.replace')
    })
  })

  describe('default parse function', () => {
    const content = readFileSync(COMPOSABLE_PATH, 'utf-8')

    it('handles null/undefined/empty values', () => {
      expect(content).toContain('value === null || value === undefined || value === \'\'')
    })

    it('handles array defaults by splitting on comma', () => {
      expect(content).toContain('value.split(\',\')')
    })
  })

  describe('default serialize function', () => {
    const content = readFileSync(COMPOSABLE_PATH, 'utf-8')

    it('returns null for empty values', () => {
      expect(content).toContain('if (value === null || value === undefined || value === \'\')')
      expect(content).toContain('return null')
    })

    it('handles arrays by joining with comma', () => {
      expect(content).toContain('value.join(\',\')')
    })
  })

  describe('useUrlStringFilter', () => {
    const content = readFileSync(COMPOSABLE_PATH, 'utf-8')

    it('has empty string as default', () => {
      expect(content).toContain('function useUrlStringFilter(key: string, defaultValue = \'\')')
    })
  })

  describe('useUrlSelectFilter', () => {
    const content = readFileSync(COMPOSABLE_PATH, 'utf-8')

    it('has undefined as default', () => {
      expect(content).toContain('defaultValue: undefined')
    })
  })

  describe('useUrlArrayFilter', () => {
    const content = readFileSync(COMPOSABLE_PATH, 'utf-8')

    it('has empty array as default', () => {
      expect(content).toContain('defaultValue: []')
    })

    it('parses comma-separated values', () => {
      expect(content).toContain('v.split(\',\')')
    })
  })

  describe('useUrlNumberFilter', () => {
    const content = readFileSync(COMPOSABLE_PATH, 'utf-8')

    it('has 1 as default', () => {
      expect(content).toContain('function useUrlNumberFilter(key: string, defaultValue = 1)')
    })

    it('parses integers', () => {
      expect(content).toContain('Number.parseInt(v, 10)')
    })
  })
})
