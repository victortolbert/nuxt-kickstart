import { describe, expect, it } from 'vitest'
import { buildIconClass, iconMappings, iconSets } from '../../app/utils/icon-sets'

describe('iconSets', () => {
  it('has 5 icon sets', () => {
    expect(iconSets).toHaveLength(5)
  })

  it('has correct icon set configurations', () => {
    const tabler = iconSets.find(set => set.id === 'tabler')
    expect(tabler).toMatchObject({
      id: 'tabler',
      label: 'Tabler',
      prefix: 'tabler',
      variants: ['outline', 'filled'],
      defaultVariant: 'outline',
    })

    const lucide = iconSets.find(set => set.id === 'lucide')
    expect(lucide).toMatchObject({
      id: 'lucide',
      label: 'Lucide',
      prefix: 'lucide',
      variants: ['outline'],
      defaultVariant: 'outline',
    })

    const phosphor = iconSets.find(set => set.id === 'phosphor')
    expect(phosphor).toMatchObject({
      id: 'phosphor',
      label: 'Phosphor',
      prefix: 'ph',
      variants: ['regular', 'filled', 'duotone'],
      defaultVariant: 'regular',
    })

    const heroicons = iconSets.find(set => set.id === 'heroicons')
    expect(heroicons).toMatchObject({
      id: 'heroicons',
      label: 'Heroicons',
      prefix: 'heroicons',
      variants: ['outline', 'solid'],
      defaultVariant: 'outline',
    })

    const remix = iconSets.find(set => set.id === 'remix')
    expect(remix).toMatchObject({
      id: 'remix',
      label: 'Remix',
      prefix: 'ri',
      variants: ['outline', 'filled'],
      defaultVariant: 'outline',
    })
  })
})

describe('iconMappings', () => {
  it('has 184 semantic icon names', () => {
    expect(Object.keys(iconMappings)).toHaveLength(184)
  })

  it('maps all semantic names to all 5 icon sets', () => {
    Object.entries(iconMappings).forEach(([_name, mapping]) => {
      expect(mapping).toHaveProperty('tabler')
      expect(mapping).toHaveProperty('lucide')
      expect(mapping).toHaveProperty('phosphor')
      expect(mapping).toHaveProperty('heroicons')
      expect(mapping).toHaveProperty('remix')
    })
  })
})

describe('buildIconClass', () => {
  it('builds correct Tabler icon class with default variant', () => {
    expect(buildIconClass('tabler', 'check')).toBe('i-tabler-check')
  })

  it('builds correct Tabler icon class with filled variant', () => {
    expect(buildIconClass('tabler', 'check', 'filled')).toBe('i-tabler-check-filled')
  })

  it('builds correct Lucide icon class', () => {
    expect(buildIconClass('lucide', 'check')).toBe('i-lucide-check')
  })

  it('builds correct Phosphor icon class with regular variant', () => {
    expect(buildIconClass('phosphor', 'check', 'regular')).toBe('i-ph-check')
  })

  it('builds correct Phosphor icon class with filled variant', () => {
    expect(buildIconClass('phosphor', 'check', 'filled')).toBe('i-ph-check-fill')
  })

  it('builds correct Phosphor icon class with duotone variant', () => {
    expect(buildIconClass('phosphor', 'check', 'duotone')).toBe('i-ph-check-duotone')
  })

  it('builds correct Heroicons icon class with outline variant', () => {
    expect(buildIconClass('heroicons', 'check', 'outline')).toBe('i-heroicons-check')
  })

  it('builds correct Heroicons icon class with solid variant', () => {
    expect(buildIconClass('heroicons', 'check', 'solid')).toBe('i-heroicons-check-solid')
  })

  it('builds correct Remix icon class with outline variant', () => {
    expect(buildIconClass('remix', 'check', 'outline')).toBe('i-ri-check-line')
  })

  it('builds correct Remix icon class with filled variant', () => {
    expect(buildIconClass('remix', 'check', 'filled')).toBe('i-ri-check-fill')
  })

  it('throws error for unknown icon set', () => {
    expect(() => buildIconClass('unknown' as any, 'check')).toThrow('Unknown icon set: unknown')
  })

  it('throws error for unknown icon name', () => {
    expect(() => buildIconClass('tabler', 'nonexistent')).toThrow('Unknown icon name: nonexistent')
  })

  it('handles all semantic icons correctly', () => {
    const semanticNames = Object.keys(iconMappings)
    semanticNames.forEach((name) => {
      expect(() => buildIconClass('tabler', name)).not.toThrow()
      expect(() => buildIconClass('lucide', name)).not.toThrow()
      expect(() => buildIconClass('phosphor', name)).not.toThrow()
      expect(() => buildIconClass('heroicons', name)).not.toThrow()
      expect(() => buildIconClass('remix', name)).not.toThrow()
    })
  })
})
