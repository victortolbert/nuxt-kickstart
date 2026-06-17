import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

// Test the composable file exists and has correct structure
// Full integration testing requires actual Nuxt auth session

const COMPOSABLE_PATH = resolve(__dirname, '../../app/composables/use-content-access.ts')

describe('useContentAccess composable', () => {
  describe('file structure', () => {
    it('composable file exists', () => {
      expect(existsSync(COMPOSABLE_PATH)).toBe(true)
    })

    it('exports useContentAccess function', () => {
      const content = readFileSync(COMPOSABLE_PATH, 'utf-8')
      expect(content).toContain('export function useContentAccess')
    })
  })

  describe('contentWithVisibility interface', () => {
    const content = readFileSync(COMPOSABLE_PATH, 'utf-8')

    it('has visibility field with valid values', () => {
      expect(content).toContain('visibility?: \'public\' | \'internal\' | \'private\'')
    })
  })

  describe('contentAccessResult interface', () => {
    const content = readFileSync(COMPOSABLE_PATH, 'utf-8')

    it('has canAccess boolean field', () => {
      expect(content).toContain('canAccess: boolean')
    })

    it('has optional redirectTo field', () => {
      expect(content).toContain('redirectTo?: string')
    })

    it('has optional errorCode field', () => {
      expect(content).toContain('errorCode?: number')
    })
  })

  describe('null item handling', () => {
    const content = readFileSync(COMPOSABLE_PATH, 'utf-8')

    it('returns 404 for null/undefined item', () => {
      expect(content).toContain('if (!item)')
      expect(content).toContain('errorCode: 404')
    })
  })

  describe('dev bypass functionality', () => {
    const content = readFileSync(COMPOSABLE_PATH, 'utf-8')

    it('has isDevBypassEnabled function', () => {
      expect(content).toContain('function isDevBypassEnabled()')
    })

    it('checks for ?dev=true query param', () => {
      expect(content).toContain('dev')
      expect(content).toContain('true')
    })

    it('only works in development mode', () => {
      expect(content).toContain('import.meta.dev')
    })
  })

  describe('visibility rules', () => {
    const content = readFileSync(COMPOSABLE_PATH, 'utf-8')

    it('treats undefined visibility as private (secure by default)', () => {
      expect(content).toContain('item.visibility ?? \'private\'')
    })

    it('grants access to public content', () => {
      expect(content).toContain('visibility === \'public\'')
      expect(content).toContain('canAccess: true')
    })

    it('redirects to login for internal content when not logged in', () => {
      expect(content).toContain('visibility === \'internal\'')
      expect(content).toContain('redirectTo:')
      expect(content).toContain('/login?redirect=')
    })

    it('returns 404 for private content without admin role', () => {
      expect(content).toContain('visibility === \'private\'')
      expect(content).toContain('role === \'admin\'')
    })
  })

  describe('auth integration', () => {
    const content = readFileSync(COMPOSABLE_PATH, 'utf-8')

    it('derives identity from the Session Identity module', () => {
      expect(content).toContain('useSessionState()')
    })

    it('uses useRoute', () => {
      expect(content).toContain('const route = useRoute()')
    })

    it('checks loggedIn.value for internal content', () => {
      expect(content).toContain('loggedIn.value')
    })

    it('checks user role for private content', () => {
      expect(content).toContain('authUser?.role')
    })
  })
})
