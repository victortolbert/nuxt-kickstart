import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { setDevVisibilityMode, useDevVisibility } from '../../app/composables/use-visibility-filter'

describe('use-visibility-filter', () => {
  const DEV_VISIBILITY_KEY = 'kickstart-dev-visibility'

  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('setDevVisibilityMode', () => {
    it('stores mode in localStorage', () => {
      setDevVisibilityMode('bypass')
      expect(localStorage.getItem(DEV_VISIBILITY_KEY)).toBe('bypass')

      setDevVisibilityMode('public')
      expect(localStorage.getItem(DEV_VISIBILITY_KEY)).toBe('public')

      setDevVisibilityMode('internal')
      expect(localStorage.getItem(DEV_VISIBILITY_KEY)).toBe('internal')

      setDevVisibilityMode('admin')
      expect(localStorage.getItem(DEV_VISIBILITY_KEY)).toBe('admin')
    })
  })

  describe('useDevVisibility composable', () => {
    it('returns expected properties', () => {
      const result = useDevVisibility()

      expect(result).toHaveProperty('mode')
      expect(result).toHaveProperty('setMode')
      expect(result).toHaveProperty('modes')
      expect(result).toHaveProperty('isDev')
      expect(result).toHaveProperty('isActive')
    })

    it('has 4 visibility modes', () => {
      const { modes } = useDevVisibility()

      expect(modes).toHaveLength(4)
      expect(modes.map(m => m.value)).toEqual(['bypass', 'public', 'internal', 'admin'])
    })

    it('each mode has required properties', () => {
      const { modes } = useDevVisibility()

      for (const mode of modes) {
        expect(mode).toHaveProperty('value')
        expect(mode).toHaveProperty('label')
        expect(mode).toHaveProperty('description')
        expect(typeof mode.value).toBe('string')
        expect(typeof mode.label).toBe('string')
        expect(typeof mode.description).toBe('string')
      }
    })
  })

  // Note: useVisibilityFilter tests require a full Nuxt environment
  // with import.meta.dev and proper session/route mocking to work correctly.
  // The visibility filtering logic is best tested in an e2e or integration context.
})
