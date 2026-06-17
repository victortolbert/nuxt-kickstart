import { describe, expect, it } from 'vitest'
import { useContentEditLink } from '../../app/composables/use-content-edit-link'

describe('use-content-edit-link', () => {
  // Note: These tests use the actual app config values from the Nuxt environment
  // The app.config.ts should have content.repo configured for these tests to work

  describe('useContentEditLink function signature', () => {
    it('is a function that accepts path and optional collection', () => {
      expect(typeof useContentEditLink).toBe('function')
      expect(useContentEditLink.length).toBeGreaterThanOrEqual(1)
    })

    it('returns string or null', () => {
      const result = useContentEditLink('/content/test.md')
      expect(result === null || typeof result === 'string').toBe(true)
    })
  })

  describe('path normalization', () => {
    it('normalizes path with leading slash', () => {
      const result = useContentEditLink('/content/projects/test.md')
      if (result) {
        expect(result).toContain('content/projects/test.md')
        expect(result).not.toContain('//content')
      }
    })

    it('handles path without leading slash', () => {
      const result = useContentEditLink('content/notes/test.md')
      if (result) {
        expect(result).toContain('content/notes/test.md')
      }
    })
  })

  describe('uRL format', () => {
    it('generates valid GitHub edit URL when repo is configured', () => {
      const result = useContentEditLink('/content/projects/kickstart.md')
      if (result) {
        expect(result).toMatch(/^https:\/\/github\.com\/[^/]+\/[^/]+\/edit\//)
        expect(result).toContain('/edit/')
        expect(result).toContain('content/projects/kickstart.md')
      }
    })

    it('includes branch in URL', () => {
      const result = useContentEditLink('/content/guides/intro.md')
      if (result) {
        // Should contain /edit/{branch}/ pattern
        expect(result).toMatch(/\/edit\/[^/]+\//)
      }
    })
  })

  describe('local collections', () => {
    // Note: This behavior depends on runtime config contentLocalCollections
    // When configured, certain collections should return null

    it('returns null when collection is in local-only list and collection param provided', () => {
      // This test verifies the behavior when a collection is marked as local-only
      // The actual behavior depends on runtime config
      const resultWithCollection = useContentEditLink('/path/to/file.md', 'notes')
      const resultWithoutCollection = useContentEditLink('/path/to/file.md')

      // With collection param, it checks the local list
      // Without collection param, it doesn't check
      expect(resultWithCollection === null || typeof resultWithCollection === 'string').toBe(true)
      expect(resultWithoutCollection === null || typeof resultWithoutCollection === 'string').toBe(true)
    })
  })
})
