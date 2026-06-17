<template>
  <div class="p-6 max-w-7xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">
      {{ t('settings.title') }}
    </h1>

    <!-- Appearance Section -->
    <section class="mb-8">
      <h2 class="text-lg font-semibold mb-4">
        {{ t('appearance.title') }}
      </h2>

      <!-- Color Mode -->
      <div class="mb-6">
        <h3 :id="colorModeLabelId" class="text-sm font-medium text-muted mb-3">
          {{ t('appearance.colorMode.label') }}
        </h3>
        <div
          role="group"
          :aria-labelledby="colorModeLabelId"
          class="flex gap-2"
        >
          <u-button
            :variant="colorMode.preference === 'light' ? 'solid' : 'outline'"
            color="neutral"
            :icon="resolveIcon('light')"
            :aria-pressed="colorMode.preference === 'light'"
            @click="setColorMode('light')"
          >
            {{ t('appearance.colorMode.light') }}
          </u-button>
          <u-button
            :variant="colorMode.preference === 'dark' ? 'solid' : 'outline'"
            color="neutral"
            :icon="resolveIcon('dark')"
            :aria-pressed="colorMode.preference === 'dark'"
            @click="setColorMode('dark')"
          >
            {{ t('appearance.colorMode.dark') }}
          </u-button>
          <u-button
            :variant="colorMode.preference === 'system' ? 'solid' : 'outline'"
            color="neutral"
            :icon="resolveIcon('system')"
            :aria-pressed="colorMode.preference === 'system'"
            @click="setColorMode('system')"
          >
            {{ t('appearance.colorMode.system') }}
          </u-button>
        </div>
      </div>

      <!-- Theme Selection -->
      <div>
        <h3 :id="themeLabelId" class="text-sm font-medium text-muted mb-3">
          {{ t('appearance.theme.label') }}
        </h3>
        <div
          role="group"
          :aria-labelledby="themeLabelId"
          class="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <button
            v-for="themeOption in themes"
            :key="themeOption.id"
            type="button"
            :aria-pressed="theme === themeOption.id"
            class="p-4 border rounded-(--ui-radius) text-left transition-all hover:border-(--color-primary-500) focus-visible:ring-2 focus-visible:ring-(--color-primary-500) focus-visible:outline-none"
            :class="[
              theme === themeOption.id
                ? 'border-(--color-primary-500) bg-accented'
                : 'border-default',
            ]"
            @click="selectTheme(themeOption.id)"
          >
            <div class="flex items-center gap-2 mb-2">
              <u-icon :name="themeOption.icon" class="size-5"></u-icon>
              <span class="font-medium">{{ t(`theme.labels.${themeOption.id}`) }}</span>
            </div>
            <p v-if="themeOption.description" class="text-xs text-muted">
              {{ t(`theme.descriptions.${themeOption.id}`) }}
            </p>
            <div
              v-if="theme === themeOption.id"
              class="mt-2 text-xs text-(--color-primary-500) font-medium"
            >
              {{ t('settings.active') }}
            </div>
          </button>
        </div>
      </div>
    </section>

    <!-- Preview Section -->
    <section class="mb-8">
      <h2 class="text-lg font-semibold mb-4">
        {{ t('appearance.components.preview') }}
      </h2>
      <div class="p-6 border rounded-(--ui-radius) border-default bg-elevated">
        <div class="flex flex-wrap gap-2 mb-4">
          <u-button color="primary">
            {{ t('appearance.colors.primary') }}
          </u-button>
          <u-button color="neutral">
            {{ t('appearance.colors.neutral') }}
          </u-button>
          <u-button color="primary" variant="outline">
            {{ t('appearance.variants.outline') }}
          </u-button>
          <u-button color="primary" variant="ghost">
            {{ t('appearance.variants.ghost') }}
          </u-button>
        </div>
        <div class="flex flex-wrap gap-2 mb-4">
          <u-badge color="primary">
            {{ t('settings.preview.badge') }}
          </u-badge>
          <u-badge color="success">
            {{ t('appearance.colors.success') }}
          </u-badge>
          <u-badge color="warning">
            {{ t('appearance.colors.warning') }}
          </u-badge>
          <u-badge color="error">
            {{ t('appearance.colors.error') }}
          </u-badge>
        </div>
        <div class="space-y-2">
          <p class="text-default">
            {{ t('settings.preview.defaultText') }}
          </p>
          <p class="text-muted">
            {{ t('settings.preview.mutedText') }}
          </p>
          <p class="text-dimmed">
            {{ t('settings.preview.dimmedText') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Developer Section (only in dev mode) -->
    <section v-if="isDev">
      <div class="flex items-center gap-2 mb-4">
        <u-icon :name="resolveIcon('code')" class="size-5 text-warning"></u-icon>
        <h2 class="text-lg font-semibold">
          {{ t('settings.developer.title') }}
        </h2>
        <u-badge
          color="warning"
          variant="subtle"
          size="sm"
        >
          {{ t('settings.developer.devOnly') }}
        </u-badge>
      </div>

      <!-- Visibility Mode -->
      <div class="mb-6">
        <h3 :id="visibilityLabelId" class="text-sm font-medium text-muted mb-2">
          {{ t('settings.developer.visibilityMode') }}
        </h3>

        <!-- Show hint when dev bypass is not active -->
        <u-alert
          v-if="!isDevActive"
          color="info"
          variant="subtle"
          :icon="resolveIcon('info')"
          class="mb-4"
        >
          <template #title>
            {{ t('settings.developer.bypassDisabledTitle') }}
          </template>
          <template #description>
            <i18n-t keypath="settings.developer.bypassDisabledDescription" scope="global">
              <template #code>
                <code class="px-1 py-0.5 bg-elevated font-mono text-xs">?dev=true</code>
              </template>
            </i18n-t>
          </template>
        </u-alert>

        <p class="text-xs text-muted mb-3">
          {{ t('settings.developer.visibilityHint') }}
        </p>
        <div
          role="group"
          :aria-labelledby="visibilityLabelId"
          class="grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          <button
            v-for="vm in visibilityModes"
            :key="vm.value"
            type="button"
            :disabled="!isDevActive"
            :aria-pressed="currentVisibilityMode === vm.value && isDevActive"
            class="p-3 border rounded-(--ui-radius) text-left transition-all focus-visible:ring-2 focus-visible:ring-(--color-primary-500) focus-visible:outline-none"
            :class="[
              !isDevActive
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:border-(--color-primary-500)',
              currentVisibilityMode === vm.value && isDevActive
                ? 'border-(--color-primary-500) bg-accented'
                : 'border-default',
            ]"
            @click="isDevActive && handleVisibilityModeChange(vm.value)"
          >
            <div class="font-medium text-sm mb-1">
              {{ vm.label }}
            </div>
            <p class="text-xs text-muted">
              {{ vm.description }}
            </p>
            <div
              v-if="currentVisibilityMode === vm.value && isDevActive"
              class="mt-2 text-xs text-(--color-primary-500) font-medium"
            >
              {{ t('settings.active') }}
            </div>
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { ThemeId } from '~~/shared/types/theme'
import type { DevVisibilityMode } from '~/composables/use-visibility-filter'

definePageMeta({
  layout: 'default',
})

const { t } = useI18n()

useHead({
  title: () => t('settings.title'),
})

useSeoMeta({
  description: () => t('settings.seoDescription'),
})

const { theme, themes, setTheme, colorMode } = useTheme()
const { mode: devVisibilityMode, setMode: setDevVisibilityMode, modes: visibilityModes, isDev, isActive: isDevActive } = useDevVisibility()
const { resolveIcon } = useAppearance()

const colorModeLabelId = useId()
const themeLabelId = useId()
const visibilityLabelId = useId()

function selectTheme(id: ThemeId) {
  setTheme(id)
}

function setColorMode(mode: 'light' | 'dark' | 'system') {
  colorMode.preference = mode
}

// Force reactivity on visibility mode change
const currentVisibilityMode = ref(devVisibilityMode.value)
watch(devVisibilityMode, (newMode) => {
  currentVisibilityMode.value = newMode
})

function handleVisibilityModeChange(mode: string) {
  const validMode = mode as DevVisibilityMode
  setDevVisibilityMode(validMode)
  currentVisibilityMode.value = validMode
  // Refresh to apply changes
  refreshNuxtData()
}
</script>
