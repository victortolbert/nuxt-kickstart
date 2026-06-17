/**
 * Single source of truth for the digital-garden content lifecycle statuses.
 *
 * The four statuses form a "readiness traffic light": a piece of content moves
 * from a dormant idea (seed) through active development (sprout) to a mature,
 * relied-upon state (evergreen), and is eventually retired (wilted).
 *
 * - color: the Nuxt UI semantic color used for badges/indicators
 * - icon:  a semantic icon name for `resolveIcon()` (never a raw `i-*` class)
 *
 * Consume via `gardenStatus(status)` so every surface (tables, sitemap, filters,
 * dashboards, editor) stays consistent instead of redefining the mapping.
 */

export const GARDEN_STATUSES = ['seed', 'sprout', 'evergreen', 'wilted'] as const

export type GardenStatus = typeof GARDEN_STATUSES[number]

/** Nuxt UI semantic colors used by the status lifecycle. */
export type GardenStatusColor = 'neutral' | 'warning' | 'success' | 'error'

export interface GardenStatusMeta {
  /** Nuxt UI semantic color for badges/indicators. */
  color: GardenStatusColor
  /** Semantic icon name for `resolveIcon()`. */
  icon: string
}

export const gardenStatusMeta: Record<GardenStatus, GardenStatusMeta> = {
  // dormant — just an idea, not started
  seed: { color: 'neutral', icon: 'sparkles' },
  // growing — work in progress, ripening
  sprout: { color: 'warning', icon: 'sprout' },
  // mature — ready to rely on
  evergreen: { color: 'success', icon: 'evergreen' },
  // retired — deprecated, avoid
  wilted: { color: 'error', icon: 'archive' },
}

/**
 * Concrete CSS variable per status color, for contexts that need a real color
 * string rather than a Nuxt UI color name (charts, canvas, inline styles).
 * These resolve to the theme's semantic colors (consistent green/amber/red),
 * with a theme-tinted gray for the neutral `seed`.
 */
export const gardenStatusCssVar: Record<GardenStatusColor, string> = {
  neutral: 'var(--ui-text-muted)',
  warning: 'var(--ui-warning)',
  success: 'var(--ui-success)',
  error: 'var(--ui-error)',
}

export function isGardenStatus(value: unknown): value is GardenStatus {
  return typeof value === 'string' && (GARDEN_STATUSES as readonly string[]).includes(value)
}

/** A concrete CSS color (`var(...)`) for a status, for charts/inline styles. */
export function gardenStatusColorVar(status?: string | null): string {
  return gardenStatusCssVar[gardenStatus(status).color]
}

/**
 * Resolve a status string to its color + icon, defaulting to `seed` for unknown
 * or missing values.
 */
export function gardenStatus(status?: string | null): GardenStatusMeta {
  return isGardenStatus(status) ? gardenStatusMeta[status] : gardenStatusMeta.seed
}
