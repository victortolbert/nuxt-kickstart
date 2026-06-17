<template>
  <!-- Themes: color mode + theme grid -->
  <div v-if="section === 'themes'" class="space-y-6">
    <u-radio-group
      v-model="colorMode.preference"
      :legend="t('appearance.colorMode.label')"
      :items="colorModeItems"
      orientation="horizontal"
      variant="card"
    ></u-radio-group>

    <fieldset class="space-y-2">
      <legend class="text-sm font-medium text-default">
        {{ t('appearance.theme.label') }}
      </legend>
      <div
        class="grid grid-cols-1 gap-3"
        :class="wide ? 'md:grid-cols-2' : ''"
      >
        <button
          v-for="themeOption in themes"
          :key="themeOption.id"
          type="button"
          :aria-pressed="theme === themeOption.id"
          class="flex items-start gap-3 p-3 rounded-(--ui-radius) border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary-500)"
          :class="[
            theme === themeOption.id
              ? 'border-primary bg-accented'
              : 'border-default hover:border-accented hover:bg-elevated',
          ]"
          @click="setTheme(themeOption.id)"
        >
          <icon
            :name="themeOption.icon"
            class="h-5 w-5 text-default shrink-0"
          ></icon>
          <div class="flex-1 text-left">
            <div class="font-medium text-sm text-default">
              {{ t(`theme.labels.${themeOption.id}`) }}
            </div>
            <div
              v-if="themeOption.description"
              class="text-xs text-muted mt-1"
            >
              {{ t(`theme.descriptions.${themeOption.id}`) }}
            </div>
          </div>
          <icon
            v-if="theme === themeOption.id"
            :name="resolveIcon('check')"
            class="h-5 w-5 text-primary shrink-0"
          ></icon>
        </button>
      </div>
    </fieldset>
  </div>

  <!-- Icons: icon set, variant, preview -->
  <div v-else-if="section === 'icons'" class="space-y-6">
    <fieldset class="space-y-2">
      <legend class="text-sm font-medium text-default">
        {{ t('appearance.iconSet.label') }}
      </legend>
      <div
        class="grid grid-cols-1 gap-3"
        :class="wide ? 'md:grid-cols-2' : ''"
      >
        <button
          v-for="iconSetOption in iconSets"
          :key="iconSetOption.id"
          type="button"
          :aria-pressed="iconSet === iconSetOption.id"
          class="flex items-center gap-3 p-3 rounded-(--ui-radius) border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary-500)"
          :class="[
            iconSet === iconSetOption.id
              ? 'border-primary bg-accented'
              : 'border-default hover:border-accented hover:bg-elevated',
          ]"
          @click="setIconSet(iconSetOption.id)"
        >
          <div class="flex-1 text-left">
            <div class="font-medium text-sm text-default">
              {{ iconSetOption.label }}
            </div>
            <div class="text-xs text-muted mt-1">
              {{ t('appearance.iconSet.variants', iconSetOption.variants.length) }}
            </div>
          </div>
          <icon
            v-if="iconSet === iconSetOption.id"
            :name="resolveIcon('check')"
            class="h-5 w-5 text-primary shrink-0"
          ></icon>
        </button>
      </div>
    </fieldset>

    <fieldset v-if="availableVariants.length > 1" class="space-y-2">
      <legend class="text-sm font-medium text-default">
        {{ t('appearance.iconSet.variant') }}
      </legend>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="variant in availableVariants"
          :key="variant"
          type="button"
          :aria-pressed="iconVariant === variant"
          class="px-3 py-2 rounded-(--ui-radius) border text-sm transition-colors capitalize focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary-500)"
          :class="[
            iconVariant === variant
              ? 'border-primary bg-accented text-primary'
              : 'border-default text-default hover:border-accented hover:bg-elevated',
          ]"
          @click="setIconVariant(variant)"
        >
          {{ variant }}
        </button>
      </div>
    </fieldset>

    <div
      role="group"
      :aria-labelledby="iconPreviewLabelId"
      class="space-y-2"
    >
      <div :id="iconPreviewLabelId" class="text-sm font-medium text-default">
        {{ t('appearance.iconSet.preview') }}
      </div>
      <div
        class="grid grid-cols-4 gap-3 p-4 rounded-(--ui-radius) border border-default bg-elevated"
        :class="wide ? 'md:grid-cols-6' : ''"
      >
        <div
          v-for="iconName in previewIcons"
          :key="iconName"
          class="flex flex-col items-center gap-2 p-2"
        >
          <icon
            :name="resolveIcon(iconName)"
            class="h-6 w-6 text-default"
          ></icon>
          <span class="text-xs text-muted text-center">
            {{ iconName }}
          </span>
        </div>
      </div>
    </div>
  </div>

  <!-- Components: default color/variant/size + live preview -->
  <div v-else class="space-y-6">
    <fieldset class="space-y-2">
      <legend class="text-sm font-medium text-default">
        {{ t('appearance.components.defaultColor') }}
      </legend>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="colorOption in colorOptions"
          :key="colorOption.value"
          type="button"
          :aria-pressed="defaultColor === colorOption.value"
          class="px-3 py-2 rounded-(--ui-radius) border text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary-500)"
          :class="[
            defaultColor === colorOption.value
              ? 'border-primary bg-accented text-primary'
              : 'border-default text-default hover:border-accented hover:bg-elevated',
          ]"
          @click="setDefaultColor(colorOption.value)"
        >
          {{ colorOption.label }}
        </button>
      </div>
    </fieldset>

    <fieldset class="space-y-2">
      <legend class="text-sm font-medium text-default">
        {{ t('appearance.components.defaultVariant') }}
      </legend>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="variantOption in variantOptions"
          :key="variantOption.value"
          type="button"
          :aria-pressed="defaultVariant === variantOption.value"
          class="px-3 py-2 rounded-(--ui-radius) border text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary-500)"
          :class="[
            defaultVariant === variantOption.value
              ? 'border-primary bg-accented text-primary'
              : 'border-default text-default hover:border-accented hover:bg-elevated',
          ]"
          @click="setDefaultVariant(variantOption.value)"
        >
          {{ variantOption.label }}
        </button>
      </div>
    </fieldset>

    <fieldset class="space-y-2">
      <legend class="text-sm font-medium text-default">
        {{ t('appearance.components.defaultSize') }}
      </legend>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="sizeOption in sizeOptions"
          :key="sizeOption.value"
          type="button"
          :aria-pressed="defaultSize === sizeOption.value"
          class="px-3 py-2 rounded-(--ui-radius) border text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary-500)"
          :class="[
            defaultSize === sizeOption.value
              ? 'border-primary bg-accented text-primary'
              : 'border-default text-default hover:border-accented hover:bg-elevated',
          ]"
          @click="setDefaultSize(sizeOption.value)"
        >
          {{ sizeOption.label }}
        </button>
      </div>
    </fieldset>

    <div
      role="group"
      :aria-labelledby="componentPreviewLabelId"
      class="space-y-2"
    >
      <div :id="componentPreviewLabelId" class="text-sm font-medium text-default">
        {{ t('appearance.components.preview') }}
      </div>
      <div class="p-4 rounded-(--ui-radius) border border-default bg-elevated space-y-4">
        <div class="space-y-2">
          <div class="text-xs text-muted">
            UButton
          </div>
          <u-button
            :color="(defaultColor as UiColor)"
            :variant="(defaultVariant as UiVariant)"
            :size="(defaultSize as UiSize)"
          >
            {{ t('appearance.components.sampleButton') }}
          </u-button>
        </div>
        <div class="space-y-2">
          <div class="text-xs text-muted">
            UBadge
          </div>
          <u-badge
            :color="(defaultColor as UiColor)"
            :variant="(defaultVariant as 'solid' | 'outline' | 'soft' | 'subtle')"
            :size="(defaultSize as UiSize)"
          >
            {{ t('appearance.components.sampleBadge') }}
          </u-badge>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RadioGroupItem } from '@nuxt/ui'
import type { UiColor, UiSize, UiVariant } from '#shared/types/appearance'
import { COMPONENT_COLORS, COMPONENT_SIZES, COMPONENT_VARIANTS } from '#shared/types/appearance'
import { iconSets } from '~/utils/icon-sets'

const { section, wide = false } = defineProps<{
  /** Which control group to render */
  section: 'themes' | 'icons' | 'components'
  /** Use wider responsive grids (full-page layouts) */
  wide?: boolean
}>()

const { t } = useI18n()

const { theme, themes, setTheme, colorMode } = useTheme()
const {
  iconSet,
  iconVariant,
  defaultColor,
  defaultVariant,
  defaultSize,
  setIconSet,
  setIconVariant,
  setDefaultColor,
  setDefaultVariant,
  setDefaultSize,
  resolveIcon,
} = useAppearance()

const iconPreviewLabelId = useId()
const componentPreviewLabelId = useId()

const colorModeItems = computed<RadioGroupItem[]>(() => [
  {
    label: t('appearance.colorMode.light'),
    value: 'light',
  },
  {
    label: t('appearance.colorMode.dark'),
    value: 'dark',
  },
  {
    label: t('appearance.colorMode.system'),
    value: 'system',
  },
])

// Get available variants for current icon set
const currentIconSet = computed(() => iconSets.find(set => set.id === iconSet.value))
const availableVariants = computed(() => currentIconSet.value?.variants || [])

// Preview icons - semantic names to display in the preview grid
const previewIcons = [
  'check',
  'close',
  'search',
  'plus',
  'minus',
  'folder',
  'file',
  'external',
  'info',
  'warning',
  'success',
  'error',
]

// Component default options — values come from the single source in
// shared/types/appearance; labels are derived from each value's i18n key
const colorOptions = computed(() =>
  COMPONENT_COLORS.map(value => ({ value, label: t(`appearance.colors.${value}`) })),
)

const variantOptions = computed(() =>
  COMPONENT_VARIANTS.map(value => ({ value, label: t(`appearance.variants.${value}`) })),
)

const sizeOptions = computed(() =>
  COMPONENT_SIZES.map(value => ({ value, label: t(`appearance.sizes.${value}`) })),
)
</script>
