import type { ThemePalette } from '../../app/utils/map-styles'
import { describe, expect, it } from 'vitest'
import { createMapStyles, mixHex } from '../../app/utils/map-styles'

// The runtime readers (readThemePalette / readChartColors / cssColorToHex) read
// the live theme via the DOM + canvas, so they're exercised in the browser, not
// here. createMapStyles is pure, so it's the unit-testable surface.
const palette: ThemePalette = {
  bg: '#000000',
  bgElevated: '#111111',
  bgMuted: '#222222',
  text: '#ffffff',
  textMuted: '#cccccc',
  textDimmed: '#999999',
  primary: '#3b82f6',
  primaryMuted: '#93c5fd',
  water: '#1e3a5f',
}

describe('map styles', () => {
  it('builds a non-empty Google Maps style array from a palette', () => {
    const styles = createMapStyles(palette)
    expect(Array.isArray(styles)).toBe(true)
    expect(styles.length).toBeGreaterThan(0)
    expect(styles[0]).toMatchObject({
      elementType: 'geometry',
      stylers: [{ color: palette.bgMuted }],
    })
  })

  it('derives styler colors from the palette (incl. water + primary)', () => {
    const colors = createMapStyles(palette)
      .flatMap(s => s.stylers)
      .map(st => st.color)
      .filter(Boolean)

    expect(colors).toContain(palette.water)
    expect(colors).toContain(palette.primary)
    expect(colors).toContain(palette.bgMuted)
    expect(colors).toContain(palette.text)
  })

  it('reflects different palettes in the output', () => {
    const a = createMapStyles(palette)
    const b = createMapStyles({ ...palette, water: '#abcdef' })
    expect(a).not.toEqual(b)
    expect(b.flatMap(s => s.stylers).map(st => st.color)).toContain('#abcdef')
  })
})

describe('mixHex', () => {
  it('returns the endpoints at t=0 and t=1', () => {
    expect(mixHex('#000000', '#ffffff', 0)).toBe('#000000')
    expect(mixHex('#000000', '#ffffff', 1)).toBe('#ffffff')
  })

  it('blends linearly at the midpoint', () => {
    expect(mixHex('#000000', '#ffffff', 0.5)).toBe('#808080')
  })

  it('mutes a saturated color toward a neutral (lowers chroma)', () => {
    // amber primary blended toward a gray land → less saturated than the source
    const muted = mixHex('#fe9a00', '#888888', 0.45)
    expect(muted).toMatch(/^#[0-9a-f]{6}$/i)
    expect(muted).not.toBe('#fe9a00')
  })

  it('returns the first color when an input is unparseable', () => {
    expect(mixHex('#123456', 'not-a-hex', 0.5)).toBe('#123456')
  })
})
