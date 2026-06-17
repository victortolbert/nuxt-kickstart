/**
 * Icon set identifiers for supported icon libraries
 */
export type IconSetId = 'tabler' | 'lucide' | 'phosphor' | 'heroicons' | 'remix'

/**
 * Icon style variants available across different icon sets
 */
export type IconVariant = 'outline' | 'filled' | 'solid' | 'regular' | 'duotone'

/**
 * Single source of truth for the component default option sets. The runtime
 * tuples drive both validation (use-appearance) and the appearance pickers
 * (appearance-controls); the types are derived from them, so adding a value
 * is one edit here. Order is the order pickers display.
 */
export const COMPONENT_COLORS = ['primary', 'secondary', 'success', 'info', 'warning', 'error', 'neutral'] as const
export const COMPONENT_VARIANTS = ['solid', 'outline', 'soft', 'subtle', 'ghost', 'link'] as const
export const COMPONENT_SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const

/**
 * The Nuxt UI semantic sets — canonical types for any `color` / `variant` /
 * `size` prop across the app (badges, buttons, status chips, tech kinds, …).
 * Sourced from the tuples above. Prefer these over re-declaring the literal
 * unions locally. The `Component*` aliases are the appearance-default flavor
 * of the same types.
 */
export type UiColor = typeof COMPONENT_COLORS[number]
export type UiVariant = typeof COMPONENT_VARIANTS[number]
export type UiSize = typeof COMPONENT_SIZES[number]

/** Appearance default color. Alias of {@link UiColor}. */
export type ComponentColor = UiColor
/** Appearance default variant. Alias of {@link UiVariant}. */
export type ComponentVariant = UiVariant
/** Appearance default size. Alias of {@link UiSize}. */
export type ComponentSize = UiSize

/**
 * Configuration for a single icon set
 */
export interface IconSetConfig {
  id: IconSetId
  label: string
  prefix: string
  variants: IconVariant[]
  defaultVariant: IconVariant
}

/**
 * Complete appearance state for the application
 */
export interface AppearanceState {
  iconSet: IconSetId
  iconVariant: IconVariant
  defaultColor: ComponentColor
  defaultVariant: ComponentVariant
  defaultSize: ComponentSize
}
