import { describe, expect, it } from 'vitest'
import { locales } from '../../app/composables/use-app-locale'

describe('use-app-locale', () => {
  describe('locales array', () => {
    it('exports 2 locale configurations', () => {
      expect(locales).toHaveLength(2)
    })

    it('contains expected locale ids', () => {
      const localeIds = locales.map(l => l.id)
      expect(localeIds).toContain('en')
      expect(localeIds).toContain('es')
    })

    it('each locale has required properties', () => {
      for (const locale of locales) {
        expect(locale).toHaveProperty('id')
        expect(locale).toHaveProperty('label')
        expect(locale).toHaveProperty('nativeLabel')
        expect(locale).toHaveProperty('icon')
        expect(locale).toHaveProperty('direction')
        expect(typeof locale.id).toBe('string')
        expect(typeof locale.label).toBe('string')
        expect(typeof locale.nativeLabel).toBe('string')
        expect(locale.direction).toBe('ltr')
      }
    })

    it('english is the default locale (first in array)', () => {
      expect(locales[0]?.id).toBe('en')
      expect(locales[0]?.label).toBe('English')
    })
  })

  describe('locale properties', () => {
    it('english locale has correct properties', () => {
      const en = locales.find(l => l.id === 'en')
      expect(en?.label).toBe('English')
      expect(en?.nativeLabel).toBe('English')
    })

    it('spanish locale has correct properties', () => {
      const es = locales.find(l => l.id === 'es')
      expect(es?.label).toBe('Spanish')
      expect(es?.nativeLabel).toBe('Español')
    })
  })
})
