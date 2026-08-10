import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { themes, useTheme } from '../../app/composables/use-theme'

describe('useTheme', () => {
  const STORAGE_KEY = 'kickstart-theme'

  beforeEach(() => {
    localStorage.clear()
    delete document.documentElement.dataset.theme
  })

  afterEach(() => {
    localStorage.clear()
    delete document.documentElement.dataset.theme
  })

  describe('themes array', () => {
    it('exports 7 theme configurations', () => {
      expect(themes).toHaveLength(7)
    })

    it('contains expected theme ids', () => {
      const themeIds = themes.map(t => t.id)
      expect(themeIds).toContain('system')
      expect(themeIds).toContain('lyra')
      expect(themeIds).toContain('nord')
      expect(themeIds).toContain('dracula')
      expect(themeIds).toContain('catppuccin')
      expect(themeIds).toContain('carnival')
      expect(themeIds).toContain('broadsheet')
    })

    it('each theme has required properties', () => {
      for (const theme of themes) {
        expect(theme).toHaveProperty('id')
        expect(theme).toHaveProperty('label')
        expect(theme).toHaveProperty('icon')
        expect(typeof theme.id).toBe('string')
        expect(typeof theme.label).toBe('string')
        expect(typeof theme.icon).toBe('string')
      }
    })
  })

  describe('useTheme composable', () => {
    it('returns expected properties', () => {
      const result = useTheme()

      expect(result).toHaveProperty('theme')
      expect(result).toHaveProperty('themes')
      expect(result).toHaveProperty('currentTheme')
      expect(result).toHaveProperty('setTheme')
      expect(result).toHaveProperty('cycleTheme')
      expect(result).toHaveProperty('colorMode')
    })

    it('initializes with system theme by default', () => {
      const { theme } = useTheme()

      expect(theme.value).toBe('system')
    })

    it('themes array matches exported themes', () => {
      const { themes: composableThemes } = useTheme()

      expect(composableThemes).toBe(themes)
    })
  })

  describe('setTheme', () => {
    it('changes theme state', () => {
      const { theme, setTheme } = useTheme()

      setTheme('nord')
      expect(theme.value).toBe('nord')

      setTheme('dracula')
      expect(theme.value).toBe('dracula')
    })

    it('persists theme to localStorage', () => {
      const { setTheme } = useTheme()

      setTheme('catppuccin')
      expect(localStorage.getItem(STORAGE_KEY)).toBe('catppuccin')
    })

    it('sets data-theme attribute on document element', () => {
      const { setTheme } = useTheme()

      setTheme('lyra')
      expect(document.documentElement.dataset.theme).toBe('lyra')

      setTheme('nord')
      expect(document.documentElement.dataset.theme).toBe('nord')
    })

    it('removes data-theme attribute when setting system theme', () => {
      const { setTheme } = useTheme()

      setTheme('dracula')
      expect(document.documentElement.dataset.theme).toBe('dracula')

      setTheme('system')
      expect(document.documentElement.dataset.theme).toBeUndefined()
    })
  })

  describe('cycleTheme', () => {
    it('cycles through themes in order', () => {
      const { theme, cycleTheme } = useTheme()

      // Start at system (index 0)
      expect(theme.value).toBe('system')

      // Cycle to lyra (index 1)
      cycleTheme()
      expect(theme.value).toBe('lyra')

      // Cycle to nord (index 2)
      cycleTheme()
      expect(theme.value).toBe('nord')

      // Cycle to dracula (index 3)
      cycleTheme()
      expect(theme.value).toBe('dracula')

      // Cycle to catppuccin (index 4)
      cycleTheme()
      expect(theme.value).toBe('catppuccin')

      // Cycle to carnival (index 5)
      cycleTheme()
      expect(theme.value).toBe('carnival')

      // Cycle to broadsheet (index 6)
      cycleTheme()
      expect(theme.value).toBe('broadsheet')

      // Cycle back to system (index 0)
      cycleTheme()
      expect(theme.value).toBe('system')
    })
  })

  describe('currentTheme computed', () => {
    it('returns the correct theme config for current theme', () => {
      const { currentTheme, setTheme } = useTheme()

      setTheme('nord')
      expect(currentTheme.value?.id).toBe('nord')
      expect(currentTheme.value?.label).toBe('Nord')

      setTheme('dracula')
      expect(currentTheme.value?.id).toBe('dracula')
      expect(currentTheme.value?.label).toBe('Dracula')
    })

    it('falls back to first theme if theme not found', () => {
      const { theme, currentTheme } = useTheme()

      // Force an invalid theme value (this shouldn't happen in normal use)
      theme.value = 'invalid-theme' as any
      expect(currentTheme.value).toBe(themes[0])
    })
  })

  describe('localStorage initialization', () => {
    it('initializes from localStorage if valid theme saved', () => {
      localStorage.setItem(STORAGE_KEY, 'dracula')

      const { theme } = useTheme()
      expect(theme.value).toBe('dracula')
    })

    it('ignores invalid localStorage value', () => {
      localStorage.setItem(STORAGE_KEY, 'invalid-theme')

      const { theme } = useTheme()
      expect(theme.value).toBe('system')
    })

    it('sets data-theme attribute from localStorage on init', () => {
      localStorage.setItem(STORAGE_KEY, 'catppuccin')

      useTheme()
      expect(document.documentElement.dataset.theme).toBe('catppuccin')
    })

    it('removes data-theme attribute when system theme in localStorage', () => {
      document.documentElement.dataset.theme = 'something'
      localStorage.setItem(STORAGE_KEY, 'system')

      useTheme()
      expect(document.documentElement.dataset.theme).toBeUndefined()
    })
  })
})
