import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { sectionOf } from '../../app/composables/use-navigation-config'

// Behavioral tests for the pure placement rule, plus light structural checks
// on the composable file. Full reactive integration is covered by the e2e
// smoke suite (sidebar + single-h1 guards).

const COMPOSABLE_PATH = resolve(__dirname, '../../app/composables/use-navigation-config.ts')

describe('useNavigationConfig', () => {
  describe('sectionOf — sidebar placement rule', () => {
    it('defaults to main when section is omitted', () => {
      expect(sectionOf({})).toBe('main')
    })

    it('places groups that declare footer in the footer', () => {
      expect(sectionOf({ section: 'footer' })).toBe('footer')
    })

    it('keeps explicit main in main', () => {
      expect(sectionOf({ section: 'main' })).toBe('main')
    })

    it('falls back to main for an unknown/typo section (fails safe — never vanishes a group)', () => {
      // A new section value a template user might invent before wiring it up
      expect(sectionOf({ section: 'sidebar-bottom' as never })).toBe('main')
    })
  })

  // The item and group visibility rules moved to
  // shared/utils/navigation-visibility.ts and are covered, per tier, in
  // test/unit/navigation-visibility.test.ts.

  describe('file structure', () => {
    const content = readFileSync(COMPOSABLE_PATH, 'utf-8')

    it('composable file exists', () => {
      expect(existsSync(COMPOSABLE_PATH)).toBe(true)
    })

    it('exports useNavigationConfig and sectionOf', () => {
      expect(content).toContain('export function useNavigationConfig')
      expect(content).toContain('export function sectionOf')
    })

    it('loads navigation from the API', () => {
      expect(content).toContain('useFetch')
      expect(content).toContain('/api/navigation')
    })

    it('buckets the sidebar by section rather than hardcoded ids', () => {
      // Guard against the regression this refactor fixed: no group-id lists
      expect(content).not.toContain('mainSectionIds')
      expect(content).toContain('sectionOf(g)')
    })

    it('shares one visibility predicate between sidebar, palette, and isGroupVisible', () => {
      expect(content).toContain('function groupVisible')
      expect(content).toContain('return group ? groupVisible(group) : false')
    })

    it('reads the shared navigation rules rather than its own copy', () => {
      expect(content).toContain('#shared/utils/navigation-visibility')
      expect(content).not.toContain('function itemVisible')
    })

    it('resolves icons through the Appearance seam', () => {
      expect(content).toContain('resolveIcon(item.icon)')
    })
  })

  describe('return value', () => {
    const content = readFileSync(COMPOSABLE_PATH, 'utf-8')

    it('returns navigation, paletteGroups, getGroup, isGroupVisible', () => {
      expect(content).toContain('navigation,')
      expect(content).toContain('paletteGroups,')
      expect(content).toContain('getGroup,')
      expect(content).toContain('isGroupVisible,')
    })
  })
})
