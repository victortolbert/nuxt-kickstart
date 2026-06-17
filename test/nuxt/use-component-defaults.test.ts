import { describe, expect, it } from 'vitest'
import { useComponentDefaults } from '../../app/composables/use-component-defaults'

describe('use-component-defaults', () => {
  describe('useComponentDefaults', () => {
    it('returns component defaults object', () => {
      const defaults = useComponentDefaults()

      expect(defaults).toBeDefined()
      expect(defaults).toHaveProperty('color')
      expect(defaults).toHaveProperty('variant')
      expect(defaults).toHaveProperty('size')
    })

    it('returns valid color value', () => {
      const defaults = useComponentDefaults()

      // Should be one of the valid ComponentColor values
      expect(typeof defaults.color).toBe('string')
      expect(defaults.color.length).toBeGreaterThan(0)
    })

    it('returns valid variant value', () => {
      const defaults = useComponentDefaults()

      // Should be one of the valid ComponentVariant values
      expect(typeof defaults.variant).toBe('string')
      expect(defaults.variant.length).toBeGreaterThan(0)
    })

    it('returns valid size value', () => {
      const defaults = useComponentDefaults()

      // Should be one of the valid ComponentSize values
      expect(typeof defaults.size).toBe('string')
      expect(defaults.size.length).toBeGreaterThan(0)
    })
  })

  describe('fallback values', () => {
    // Note: In the Nuxt test environment, inject returns undefined
    // so we test that the fallback values are returned

    it('fallback color is primary', () => {
      const defaults = useComponentDefaults()
      // Fallback value when no injection is available
      expect(defaults.color).toBe('primary')
    })

    it('fallback variant is solid', () => {
      const defaults = useComponentDefaults()
      expect(defaults.variant).toBe('solid')
    })

    it('fallback size is md', () => {
      const defaults = useComponentDefaults()
      expect(defaults.size).toBe('md')
    })
  })

  describe('componentDefaults interface', () => {
    it('has exactly three properties', () => {
      const defaults = useComponentDefaults()
      const keys = Object.keys(defaults)

      expect(keys).toHaveLength(3)
      expect(keys).toContain('color')
      expect(keys).toContain('variant')
      expect(keys).toContain('size')
    })
  })
})
