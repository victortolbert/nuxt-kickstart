<template>
  <div class="space-y-6">
    <h1 class="sr-only">
      {{ $t('nav.blocks') }}
    </h1>

    <u-card>
      <collection-filters
        :statuses="[...statuses]"
        :visibilities="[...visibilities]"
        :show-search="true"
        @update:filters="updateFilters"
      ></collection-filters>
    </u-card>

    <div v-if="visibilityFilteredBlocks.length" class="text-sm text-muted">
      Showing {{ filteredBlocks.length }} of {{ visibilityFilteredBlocks.length }} blocks
    </div>

    <div v-if="filteredBlocks.length" class="space-y-8">
      <div v-for="blockType in sortedTypes" :key="blockType">
        <h2 class="text-lg font-semibold mb-4">
          {{ typeLabels[blockType] || blockType }}
        </h2>
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <nuxt-link
            v-for="block in groupedByType[blockType]"
            :key="block.path"
            :to="block.path"
            class="block rounded-lg focus-visible:outline-2 focus-visible:outline-primary"
          >
            <u-card class="h-full hover:ring-2 hover:ring-primary transition-shadow">
              <div class="flex items-start justify-between gap-2">
                <h3 class="font-semibold">
                  {{ block.title }}
                </h3>
                <status-indicator
                  v-if="block.status"
                  :status="block.status"
                  class="shrink-0"
                ></status-indicator>
              </div>
              <p v-if="block.description" class="text-sm text-muted mt-2">
                {{ block.description }}
              </p>
              <div v-if="block.app" class="flex items-center gap-2 mt-3">
                <u-badge
                  :label="block.app"
                  size="sm"
                  variant="outline"
                ></u-badge>
              </div>
              <div v-if="block.platforms?.length" class="flex flex-wrap gap-1 mt-2">
                <u-badge
                  v-for="platform in block.platforms"
                  :key="platform"
                  :label="platform"
                  size="sm"
                  variant="subtle"
                ></u-badge>
              </div>
            </u-card>
          </nuxt-link>
        </div>
      </div>
    </div>

    <u-card v-else-if="visibilityFilteredBlocks.length">
      <p class="text-muted text-center py-8">
        No blocks match the selected filters.
      </p>
    </u-card>

    <u-card v-else>
      <p class="text-muted text-center py-8">
        No blocks yet.
      </p>
    </u-card>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Blocks' })
defineOgImage('NuxtSeoSatori')
useSeoMeta({
  description: 'Widgets, shortcuts, extensions, and integrations grouped by parent app.',
})

const { data: blocks } = await useAsyncData('blocks', () =>
  queryCollection('blocks').order('title', 'ASC').all())

const { statuses, visibilities, updateFilters, applyFilters } = useCollectionFilters()

const visibilityFilteredBlocks = computed(() => {
  if (!blocks.value)
    return []
  return useVisibilityFilter(blocks.value)
})

const filteredBlocks = computed(() => applyFilters.value(visibilityFilteredBlocks.value))

// Group by block type
const groupedByType = computed(() => {
  const groups: Record<string, typeof filteredBlocks.value> = {}
  for (const block of filteredBlocks.value) {
    const type = block.blockType || 'other'
    if (!groups[type])
      groups[type] = []
    groups[type].push(block)
  }
  return groups
})

const typeLabels: Record<string, string> = {
  'widget': 'Widgets',
  'shortcut-action': 'Shortcut Actions',
  'extension': 'Extensions',
  'share-sheet': 'Share Sheet',
  'menu-bar': 'Menu Bar',
  'integration': 'Integrations',
  'settings': 'Settings',
  'api': 'APIs',
  'other': 'Other',
}

const typeOrder = ['widget', 'shortcut-action', 'extension', 'share-sheet', 'menu-bar', 'integration', 'settings', 'api']
const sortedTypes = computed(() =>
  typeOrder.filter(t => groupedByType.value[t]?.length))
</script>
