import type { ComponentColor, ComponentSize, ComponentVariant } from '#shared/types/appearance'
import type { ComponentDefaults } from '~/plugins/appearance.client'
import { inject } from 'vue'
import { ComponentDefaultsKey } from '~/plugins/appearance.client'

/**
 * Composable to access component default appearance settings
 * Returns injected defaults from the appearance plugin or fallback values
 */
export function useComponentDefaults() {
  const defaults = inject(ComponentDefaultsKey)

  // Fallback values if plugin hasn't run (e.g., during SSR)
  const fallbackDefaults: ComponentDefaults = {
    color: 'primary' as ComponentColor,
    variant: 'solid' as ComponentVariant,
    size: 'md' as ComponentSize,
  }

  return defaults?.value ?? fallbackDefaults
}
