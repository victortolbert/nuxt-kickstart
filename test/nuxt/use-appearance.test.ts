import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { useAppearance } from '../../app/composables/use-appearance'

describe('useAppearance', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('provides default state', () => {
    const appearance = useAppearance()

    expect(appearance.iconSet.value).toBe('tabler')
    expect(appearance.iconVariant.value).toBe('outline')
    expect(appearance.defaultColor.value).toBe('primary')
    expect(appearance.defaultVariant.value).toBe('solid')
    expect(appearance.defaultSize.value).toBe('md')
  })

  it('resolves icon names correctly', () => {
    const appearance = useAppearance()

    const iconClass = appearance.resolveIcon('search')
    expect(iconClass).toBe('i-tabler-search')
  })

  it('changes icon set and resets variant to default', () => {
    const appearance = useAppearance()

    appearance.setIconSet('phosphor')
    expect(appearance.iconSet.value).toBe('phosphor')
    expect(appearance.iconVariant.value).toBe('regular') // Phosphor's default variant
  })

  it('changes icon variant if valid for current set', () => {
    const appearance = useAppearance()

    appearance.setIconSet('tabler')
    appearance.setIconVariant('filled')
    expect(appearance.iconVariant.value).toBe('filled')

    // Try invalid variant for tabler (should be ignored)
    appearance.setIconVariant('solid' as any)
    expect(appearance.iconVariant.value).toBe('filled') // Should remain unchanged
  })

  it('changes default color', () => {
    const appearance = useAppearance()

    appearance.setDefaultColor('success')
    expect(appearance.defaultColor.value).toBe('success')
  })

  it('changes default variant', () => {
    const appearance = useAppearance()

    appearance.setDefaultVariant('outline')
    expect(appearance.defaultVariant.value).toBe('outline')
  })

  it('changes default size', () => {
    const appearance = useAppearance()

    appearance.setDefaultSize('lg')
    expect(appearance.defaultSize.value).toBe('lg')
  })

  it('resolves icons with different icon sets', () => {
    const appearance = useAppearance()

    // Reset to default state
    appearance.setIconSet('tabler')

    // Tabler (default variant is outline, which has no suffix)
    expect(appearance.resolveIcon('close')).toBe('i-tabler-x')

    // Lucide
    appearance.setIconSet('lucide')
    expect(appearance.resolveIcon('close')).toBe('i-lucide-x')

    // Phosphor
    appearance.setIconSet('phosphor')
    expect(appearance.resolveIcon('close')).toBe('i-ph-x')

    // Heroicons
    appearance.setIconSet('heroicons')
    expect(appearance.resolveIcon('close')).toBe('i-heroicons-x-mark')

    // Remix
    appearance.setIconSet('remix')
    expect(appearance.resolveIcon('close')).toBe('i-ri-close-line')
  })

  it('resolves icons with variants', () => {
    const appearance = useAppearance()

    // Tabler filled
    appearance.setIconSet('tabler')
    appearance.setIconVariant('filled')
    expect(appearance.resolveIcon('check')).toBe('i-tabler-check-filled')

    // Phosphor filled
    appearance.setIconSet('phosphor')
    appearance.setIconVariant('filled')
    expect(appearance.resolveIcon('check')).toBe('i-ph-check-fill')

    // Heroicons solid
    appearance.setIconSet('heroicons')
    appearance.setIconVariant('solid')
    expect(appearance.resolveIcon('check')).toBe('i-heroicons-check-solid')

    // Remix filled
    appearance.setIconSet('remix')
    appearance.setIconVariant('filled')
    expect(appearance.resolveIcon('check')).toBe('i-ri-check-fill')
  })
})
