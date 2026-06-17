import type { AppearanceState, ComponentColor, ComponentSize, ComponentVariant, IconSetId, IconVariant } from '#shared/types/appearance'
import { computed, readonly, useState, watch } from '#imports'
import { COMPONENT_COLORS, COMPONENT_SIZES, COMPONENT_VARIANTS } from '#shared/types/appearance'
import { buildIconClass, iconSets } from '~/utils/icon-sets'

const STORAGE_KEY = 'kickstart-appearance'

/**
 * Default appearance state
 */
const defaultState: AppearanceState = {
  iconSet: 'tabler',
  iconVariant: 'outline',
  defaultColor: 'primary',
  defaultVariant: 'solid',
  defaultSize: 'md',
}

/**
 * Validate stored appearance state against known valid options
 */
function validateState(stored: Partial<AppearanceState>): AppearanceState {
  const validIconSetIds = iconSets.map(set => set.id)
  // Valid option sets come from the single source in shared/types/appearance
  const validColors = COMPONENT_COLORS as readonly ComponentColor[]
  const validVariants = COMPONENT_VARIANTS as readonly ComponentVariant[]
  const validSizes = COMPONENT_SIZES as readonly ComponentSize[]

  // Validate iconSet
  const iconSet = validIconSetIds.includes(stored.iconSet as IconSetId)
    ? (stored.iconSet as IconSetId)
    : defaultState.iconSet

  // Validate iconVariant against selected icon set
  const selectedIconSet = iconSets.find(set => set.id === iconSet)
  const validIconVariants = selectedIconSet?.variants || []
  const iconVariant = validIconVariants.includes(stored.iconVariant as IconVariant)
    ? (stored.iconVariant as IconVariant)
    : selectedIconSet?.defaultVariant || defaultState.iconVariant

  return {
    iconSet,
    iconVariant,
    defaultColor: validColors.includes(stored.defaultColor as ComponentColor)
      ? (stored.defaultColor as ComponentColor)
      : defaultState.defaultColor,
    defaultVariant: validVariants.includes(stored.defaultVariant as ComponentVariant)
      ? (stored.defaultVariant as ComponentVariant)
      : defaultState.defaultVariant,
    defaultSize: validSizes.includes(stored.defaultSize as ComponentSize)
      ? (stored.defaultSize as ComponentSize)
      : defaultState.defaultSize,
  }
}

/**
 * Load appearance state from localStorage
 */
function loadState(): AppearanceState {
  if (import.meta.server)
    return defaultState

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored)
      return defaultState

    const parsed = JSON.parse(stored) as Partial<AppearanceState>
    return validateState(parsed)
  }
  catch {
    return defaultState
  }
}

/**
 * Save appearance state to localStorage
 */
function saveState(state: AppearanceState): void {
  if (import.meta.server)
    return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }
  catch {
    // Silently fail if localStorage is unavailable
  }
}

/**
 * Composable for managing appearance customization state
 */
export function useAppearance() {
  // SSR-safe state using useState
  const state = useState<AppearanceState>('appearance', () => loadState())

  // Watch for changes and persist to localStorage (client-side only)
  if (import.meta.client) {
    watch(state, (newState: AppearanceState) => {
      saveState(newState)
    }, { deep: true })
  }

  /**
   * Resolve a semantic icon name to an Iconify class string
   */
  const resolveIcon = (semanticName: string): string => {
    return buildIconClass(state.value.iconSet, semanticName, state.value.iconVariant)
  }

  /**
   * Set the active icon set
   */
  const setIconSet = (iconSet: IconSetId): void => {
    const iconSetConfig = iconSets.find(set => set.id === iconSet)
    if (!iconSetConfig)
      return

    state.value = {
      ...state.value,
      iconSet,
      // Reset to default variant for the new icon set
      iconVariant: iconSetConfig.defaultVariant,
    }
  }

  /**
   * Set the icon variant (if valid for current icon set)
   */
  const setIconVariant = (iconVariant: IconVariant): void => {
    const iconSetConfig = iconSets.find(set => set.id === state.value.iconSet)
    if (!iconSetConfig || !iconSetConfig.variants.includes(iconVariant))
      return

    state.value = {
      ...state.value,
      iconVariant,
    }
  }

  /**
   * Set the default component color
   */
  const setDefaultColor = (defaultColor: ComponentColor): void => {
    state.value = {
      ...state.value,
      defaultColor,
    }
  }

  /**
   * Set the default component variant
   */
  const setDefaultVariant = (defaultVariant: ComponentVariant): void => {
    state.value = {
      ...state.value,
      defaultVariant,
    }
  }

  /**
   * Set the default component size
   */
  const setDefaultSize = (defaultSize: ComponentSize): void => {
    state.value = {
      ...state.value,
      defaultSize,
    }
  }

  return {
    // State
    state: readonly(state),
    iconSet: computed(() => state.value.iconSet),
    iconVariant: computed(() => state.value.iconVariant),
    defaultColor: computed(() => state.value.defaultColor),
    defaultVariant: computed(() => state.value.defaultVariant),
    defaultSize: computed(() => state.value.defaultSize),

    // Methods
    resolveIcon,
    setIconSet,
    setIconVariant,
    setDefaultColor,
    setDefaultVariant,
    setDefaultSize,
  }
}
