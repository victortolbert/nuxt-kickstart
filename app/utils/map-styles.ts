/**
 * Theme-aware Google Maps styling.
 *
 * Instead of hard-coding a hex palette per theme (which drifts from the CSS and
 * can't represent the default/system theme), this reads the *active* theme's
 * CSS custom properties at runtime and converts them to hex for the Google Maps
 * style API. That means the map matches any theme — including the default — and
 * updates automatically when the theme or color mode changes.
 *
 * @see https://developers.google.com/maps/documentation/javascript/style-reference
 */

// Google Maps style type (subset of google.maps.MapTypeStyle)
interface MapTypeStyle {
  elementType?: string
  featureType?: string
  stylers: Array<{ [key: string]: string | number }>
}

// Resolved (hex) colors used to build the map style + overlays.
interface ThemePalette {
  bg: string
  bgElevated: string
  bgMuted: string
  text: string
  textMuted: string
  textDimmed: string
  primary: string
  primaryMuted: string
  /** Water geometry — a light/dark tint of the theme's primary hue. */
  water: string
}

// Neutral fallback used on the server / before the DOM is available. The map is
// client-only, so this is never actually rendered — it just keeps the computed
// styles valid during SSR setup.
const FALLBACK_PALETTE: ThemePalette = {
  bg: '#0f172a',
  bgElevated: '#1e293b',
  bgMuted: '#334155',
  text: '#f8fafc',
  textMuted: '#94a3b8',
  textDimmed: '#64748b',
  primary: '#3b82f6',
  primaryMuted: '#93c5fd',
  water: '#1e3a5f',
}

const FALLBACK_CHART = ['#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#ef4444']

// Reusable canvas context for normalizing any CSS color (incl. oklch) to hex.
let _ctx: CanvasRenderingContext2D | null | undefined

function getCtx(): CanvasRenderingContext2D | null {
  if (_ctx !== undefined)
    return _ctx
  _ctx = (import.meta.client && typeof document !== 'undefined')
    ? document.createElement('canvas').getContext('2d')
    : null
  return _ctx
}

/**
 * Normalize any CSS color string (hex, rgb, oklch, …) to a `#rrggbb` hex string
 * that the Google Maps style API accepts. Uses a canvas, which resolves modern
 * color spaces for us. Returns `fallback` if conversion isn't possible.
 */
export function cssColorToHex(input: string, fallback = '#808080'): string {
  const color = input.trim()
  if (!color)
    return fallback
  const ctx = getCtx()
  if (!ctx)
    return fallback
  try {
    // Paint a pixel and read its bytes back: getImageData always returns sRGB,
    // so this reliably flattens oklch / wide-gamut colors to a #rrggbb hex.
    // (Reading `fillStyle` back is unreliable — Chromium echoes oklch as-is.)
    ctx.clearRect(0, 0, 1, 1)
    ctx.fillStyle = color
    ctx.fillRect(0, 0, 1, 1)
    const data = ctx.getImageData(0, 0, 1, 1).data
    if ((data[3] ?? 255) === 0)
      return fallback
    const hex = (n: number | undefined) => (n ?? 0).toString(16).padStart(2, '0')
    return `#${hex(data[0])}${hex(data[1])}${hex(data[2])}`
  }
  catch {
    return fallback
  }
}

function hexToRgb(hex: string): { r: number, g: number, b: number } | null {
  const m = /^#([0-9a-f]{6})$/i.exec(hex.trim())
  if (!m || !m[1])
    return null
  const n = Number.parseInt(m[1], 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

function rgbToHex(r: number, g: number, b: number): string {
  const h = (x: number) => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, '0')
  return `#${h(r)}${h(g)}${h(b)}`
}

/**
 * Linearly blend two `#rrggbb` colors. `t` is the weight of `b`
 * (0 → all `a`, 1 → all `b`). Returns `a` if either input can't be parsed.
 */
export function mixHex(a: string, b: string, t: number): string {
  const ca = hexToRgb(a)
  const cb = hexToRgb(b)
  if (!ca || !cb)
    return a
  const m = (x: number, y: number) => x + (y - x) * t
  return rgbToHex(m(ca.r, cb.r), m(ca.g, cb.g), m(ca.b, cb.b))
}

/**
 * Read the active theme's resolved colors from CSS custom properties.
 * Client-only; returns the fallback palette on the server.
 */
export function readThemePalette(isDark: boolean): ThemePalette {
  if (!import.meta.client || typeof document === 'undefined')
    return FALLBACK_PALETTE

  const cs = getComputedStyle(document.documentElement)
  const v = (name: string, fb: string) => cssColorToHex(cs.getPropertyValue(name), fb)

  const bg = v('--ui-bg', FALLBACK_PALETTE.bg)
  const bgMuted = v('--ui-bg-muted', FALLBACK_PALETTE.bgMuted)

  // Water keeps the theme's primary hue but is blended toward the map's own
  // neutral tones so warm-primary themes (amber default, coral Carnival) don't
  // render a stark yellow/brown ocean. Light water mutes toward the land color;
  // dark water deepens toward the base background (so it reads as deep water,
  // not "orange"). The blend amounts are the knobs to tune the look.
  const water = isDark
    ? mixHex(v('--color-primary-900', FALLBACK_PALETTE.water), bg, 0.5)
    : mixHex(v('--color-primary-200', FALLBACK_PALETTE.water), bgMuted, 0.45)

  return {
    bg,
    bgElevated: v('--ui-bg-elevated', FALLBACK_PALETTE.bgElevated),
    bgMuted,
    text: v('--ui-text', FALLBACK_PALETTE.text),
    textMuted: v('--ui-text-muted', FALLBACK_PALETTE.textMuted),
    textDimmed: v('--ui-text-dimmed', FALLBACK_PALETTE.textDimmed),
    primary: v('--color-primary-500', FALLBACK_PALETTE.primary),
    primaryMuted: v('--color-primary-300', FALLBACK_PALETTE.primaryMuted),
    water,
  }
}

/**
 * Read the theme's chart colors (`--color-chart-1..5`) for theming markers.
 * Client-only; returns sensible fallbacks on the server.
 */
export function readChartColors(): string[] {
  if (!import.meta.client || typeof document === 'undefined')
    return [...FALLBACK_CHART]

  const cs = getComputedStyle(document.documentElement)
  return [1, 2, 3, 4, 5].map((n, i) =>
    cssColorToHex(cs.getPropertyValue(`--color-chart-${n}`), FALLBACK_CHART[i] ?? '#808080'))
}

/**
 * Build a Google Maps style array from a resolved palette. Pure — no DOM — so
 * it's unit-testable; the runtime readers above feed it the live theme colors.
 */
export function createMapStyles(palette: ThemePalette): MapTypeStyle[] {
  return [
    // Base geometry
    { elementType: 'geometry', stylers: [{ color: palette.bgMuted }] },
    { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: palette.textMuted }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: palette.bg }] },

    // Administrative
    { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: palette.bgElevated }] },
    { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: palette.textDimmed }] },
    { featureType: 'administrative.country', elementType: 'labels.text.fill', stylers: [{ color: palette.textMuted }] },
    { featureType: 'administrative.land_parcel', elementType: 'labels.text.fill', stylers: [{ color: palette.textDimmed }] },
    { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: palette.text }] },

    // Landscape
    { featureType: 'landscape.natural', elementType: 'geometry', stylers: [{ color: palette.bgMuted }] },
    { featureType: 'landscape.man_made', elementType: 'geometry', stylers: [{ color: palette.bgElevated }] },

    // POI
    { featureType: 'poi', elementType: 'geometry', stylers: [{ color: palette.bgElevated }] },
    { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: palette.textDimmed }] },
    { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: palette.bgMuted }] },
    { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: palette.textMuted }] },

    // Roads
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: palette.bg }] },
    { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: palette.textMuted }] },
    { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: palette.primaryMuted }] },
    { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: palette.primary }] },
    { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: palette.text }] },
    { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: palette.bgElevated }] },
    { featureType: 'road.local', elementType: 'geometry', stylers: [{ color: palette.bg }] },

    // Transit
    { featureType: 'transit', elementType: 'geometry', stylers: [{ color: palette.bgMuted }] },
    { featureType: 'transit.line', elementType: 'geometry', stylers: [{ color: palette.textDimmed }] },
    { featureType: 'transit.station', elementType: 'geometry', stylers: [{ color: palette.bgElevated }] },

    // Water - uses theme's primary hue for cohesion
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: palette.water }] },
    { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: palette.textDimmed }] },
  ]
}

/**
 * Build a theme-colored map pin as an SVG data-URI for use as a marker `icon`.
 * The tip sits at the bottom-center of the SVG, which matches Google's default
 * marker anchor — so the tip lands exactly on the coordinate.
 */
export function createPinDataUri(fillColor: string, dotColor = '#ffffff'): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">`
    + `<path d="M14 0C6.27 0 0 6.27 0 14c0 10.5 14 22 14 22s14-11.5 14-22C28 6.27 21.73 0 14 0z" fill="${fillColor}" stroke="rgba(0,0,0,0.25)" stroke-width="1"/>`
    + `<circle cx="14" cy="14" r="5" fill="${dotColor}" fill-opacity="0.95"/>`
    + `</svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

// Export types
export type { MapTypeStyle, ThemePalette }
