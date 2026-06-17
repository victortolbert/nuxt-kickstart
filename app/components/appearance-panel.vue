<template>
  <u-slideover
    v-model:open="open"
    :title="t('appearance.title')"
    :description="t('appearance.description')"
  >
    <template #body>
      <u-tabs :items="tabItems" class="w-full">
        <template #themes>
          <div class="p-4 space-y-6">
            <!-- Color Mode Selector -->
            <u-radio-group
              v-model="colorMode.preference"
              :legend="t('appearance.colorMode.label')"
              :items="colorModeItems"
              orientation="horizontal"
              variant="card"
            ></u-radio-group>

            <!-- Theme Grid -->
            <fieldset class="space-y-2">
              <legend class="text-sm font-medium text-default">
                {{ t('appearance.theme.label') }}
              </legend>
              <div class="grid grid-cols-1 gap-3">
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
        </template>

        <template #icons>
          <div class="p-4">
            <appearance-controls section="icons"></appearance-controls>
          </div>
        </template>

        <template #components>
          <div class="p-4">
            <appearance-controls section="components"></appearance-controls>
          </div>
        </template>
      </u-tabs>
    </template>
  </u-slideover>
</template>

<script setup lang="ts">
import type { RadioGroupItem, TabsItem } from '@nuxt/ui'

const open = defineModel<boolean>('open', { default: false })

const { t } = useI18n()

const { theme, themes, setTheme, colorMode } = useTheme()
const { resolveIcon } = useAppearance()

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

const tabItems = computed<TabsItem[]>(() => [
  {
    label: t('appearance.tabs.themes'),
    icon: resolveIcon('palette'),
    slot: 'themes',
  },
  {
    label: t('appearance.tabs.icons'),
    icon: resolveIcon('icons'),
    slot: 'icons',
  },
  {
    label: t('appearance.tabs.components'),
    icon: resolveIcon('components'),
    slot: 'components',
  },
])
</script>
