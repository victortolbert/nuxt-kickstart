import { describe, expect, it } from 'vitest'
import { localizedContentUrl, pickLocalizedEntries } from '../../app/utils/localized-collection'

describe('localized collection (pure helpers)', () => {
  const entries = [
    { path: '/en/guides/getting-started', title: 'Getting Started' },
    { path: '/es/guides/getting-started', title: 'Primeros Pasos' },
    { path: '/en/guides/architecture', title: 'Architecture' },
  ]

  describe('pickLocalizedEntries', () => {
    it('prefers the requested locale over English for the same slug', () => {
      const picked = pickLocalizedEntries(entries, 'es')
      const started = picked.find(e => e.path?.includes('getting-started'))
      expect(started?.title).toBe('Primeros Pasos')
    })

    it('falls back to English when no translation exists', () => {
      const picked = pickLocalizedEntries(entries, 'es')
      const architecture = picked.find(e => e.path?.includes('architecture'))
      expect(architecture?.title).toBe('Architecture')
    })

    it('returns one entry per slug', () => {
      expect(pickLocalizedEntries(entries, 'es')).toHaveLength(2)
      expect(pickLocalizedEntries(entries, 'en')).toHaveLength(2)
    })

    it('ignores entries from other non-English locales', () => {
      const withFrench = [...entries, { path: '/fr/guides/getting-started', title: 'Premiers Pas' }]
      const picked = pickLocalizedEntries(withFrench, 'es')
      expect(picked.find(e => e.title === 'Premiers Pas')).toBeUndefined()
    })

    it('preference wins regardless of input order', () => {
      const reversed = [...entries].reverse()
      const picked = pickLocalizedEntries(reversed, 'es')
      expect(picked.find(e => e.path?.includes('getting-started'))?.title).toBe('Primeros Pasos')
    })

    it('handles null/undefined input', () => {
      expect(pickLocalizedEntries(null, 'en')).toEqual([])
      expect(pickLocalizedEntries(undefined, 'es')).toEqual([])
    })

    it('skips entries without locale-prefixed paths', () => {
      const mixed = [...entries, { path: '/tech/nuxt', title: 'Nuxt' }, { title: 'No path' }]
      const picked = pickLocalizedEntries(mixed, 'en')
      expect(picked.find(e => e.title === 'Nuxt')).toBeUndefined()
    })
  })

  describe('localizedContentUrl', () => {
    it('strips the locale prefix for English (prefix_except_default)', () => {
      expect(localizedContentUrl('/en/guides/x', 'en')).toBe('/guides/x')
    })

    it('prefixes the active locale for non-English', () => {
      expect(localizedContentUrl('/es/guides/x', 'es')).toBe('/es/guides/x')
      expect(localizedContentUrl('/en/guides/x', 'es')).toBe('/es/guides/x')
    })

    it('handles missing paths', () => {
      expect(localizedContentUrl(undefined, 'en')).toBe('/')
    })
  })
})
