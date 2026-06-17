import { describe, expect, it } from 'vitest'
import { getUiLocale, SUPPORTED_UI_LOCALES } from '../../app/utils/ui-locale'

describe('uI locale utilities', () => {
  describe('sUPPORTED_UI_LOCALES', () => {
    it('contains all supported i18n locales', () => {
      expect(SUPPORTED_UI_LOCALES).toContain('en')
      expect(SUPPORTED_UI_LOCALES).toContain('es')
      expect(SUPPORTED_UI_LOCALES).toHaveLength(2)
    })
  })

  describe('getUiLocale', () => {
    it('returns English locale for "en"', () => {
      const locale = getUiLocale('en')
      expect(locale.code).toBe('en')
      expect(locale.name).toBe('English')
    })

    it('returns Spanish locale for "es"', () => {
      const locale = getUiLocale('es')
      expect(locale.code).toBe('es')
    })

    it('returns English locale for unknown locale codes', () => {
      const locale = getUiLocale('xx')
      expect(locale.code).toBe('en')
    })

    it('returns locale with correct direction', () => {
      expect(getUiLocale('en').dir).toBe('ltr')
      expect(getUiLocale('es').dir).toBe('ltr')
    })
  })
})
