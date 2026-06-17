<template>
  <div class="container mx-auto max-w-5xl px-4 py-8">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-default mb-2">
        {{ t('appearance.page.title') }}
      </h1>
      <p class="text-muted">
        {{ t('appearance.page.description') }}
      </p>
    </div>

    <!-- Tabs -->
    <u-tabs :items="tabItems" class="w-full">
      <template #themes>
        <u-card>
          <appearance-controls section="themes" wide></appearance-controls>
        </u-card>
      </template>

      <template #icons>
        <u-card>
          <appearance-controls section="icons" wide></appearance-controls>
        </u-card>
      </template>

      <template #components>
        <u-card>
          <appearance-controls section="components" wide></appearance-controls>
        </u-card>
      </template>
    </u-tabs>
  </div>
</template>

<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'

const { t } = useI18n()

const { resolveIcon } = useAppearance()

useHead({
  title: () => t('appearance.page.title'),
})

useSeoMeta({
  description: () => t('appearance.page.description'),
})

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
