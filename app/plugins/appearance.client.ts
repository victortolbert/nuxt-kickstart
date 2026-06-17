import type { ComputedRef, InjectionKey } from 'vue'
import type { ComponentColor, ComponentSize, ComponentVariant } from '#shared/types/appearance'
import { computed, defineNuxtPlugin, useAppearance } from '#imports'

export interface ComponentDefaults {
  color: ComponentColor
  variant: ComponentVariant
  size: ComponentSize
}

export const ComponentDefaultsKey: InjectionKey<ComputedRef<ComponentDefaults>> = Symbol('component-defaults')

export default defineNuxtPlugin({
  name: 'appearance',
  enforce: 'pre',
  setup() {
    const { defaultColor, defaultVariant, defaultSize } = useAppearance()

    const componentDefaults = computed<ComponentDefaults>(() => ({
      color: defaultColor.value,
      variant: defaultVariant.value,
      size: defaultSize.value,
    }))

    return {
      provide: {
        [ComponentDefaultsKey]: componentDefaults,
      },
    }
  },
})
