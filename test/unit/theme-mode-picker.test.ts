import type { ThemeOutputMode } from '../../shared/data/style-dictionary-formats'
import { describe, expect, it } from 'vitest'
import { themeOutputModes } from '../../shared/data/style-dictionary-formats'

describe('theme-mode-picker component logic', () => {
  it('exports all theme output modes', () => {
    expect(themeOutputModes).toBeDefined()
    expect(Object.keys(themeOutputModes)).toEqual(['merged', 'separate', 'nested'])
  })

  it('each theme mode has label and description', () => {
    const modes: ThemeOutputMode[] = ['merged', 'separate', 'nested']

    modes.forEach((mode) => {
      expect(themeOutputModes[mode]).toBeDefined()
      expect(themeOutputModes[mode].label).toBeTruthy()
      expect(themeOutputModes[mode].description).toBeTruthy()
    })
  })

  it('has correct labels', () => {
    expect(themeOutputModes.merged.label).toBe('Merged')
    expect(themeOutputModes.separate.label).toBe('Separate Files')
    expect(themeOutputModes.nested.label).toBe('Nested Selectors')
  })

  it('has correct descriptions', () => {
    expect(themeOutputModes.merged.description).toBe('All theme variants merged into single file')
    expect(themeOutputModes.separate.description).toBe('Each theme variant as separate file')
    expect(themeOutputModes.nested.description).toBe('Theme variants as nested CSS selectors')
  })

  it('can map theme modes to options format', () => {
    const options = Object.entries(themeOutputModes).map(([value, config]) => ({
      value: value as ThemeOutputMode,
      label: config.label,
      description: config.description,
    }))

    expect(options).toHaveLength(3)
    expect(options[0].value).toBe('merged')
    expect(options[0].label).toBe('Merged')
    expect(options[1].value).toBe('separate')
    expect(options[2].value).toBe('nested')
  })
})
