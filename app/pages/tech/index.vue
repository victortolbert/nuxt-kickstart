<template>
  <div class="space-y-6">
    <h1 class="sr-only">
      {{ t('nav.tech') }}
    </h1>

    <!-- Filters and view toggle -->
    <div class="flex flex-col gap-4">
      <div class="flex items-center gap-4">
        <u-input
          v-model="searchQuery"
          type="search"
          :icon="resolveIcon('filter')"
          size="sm"
          class="flex-1"
          :placeholder="t('pages.tech.filterPlaceholder')"
          :aria-label="t('pages.tech.filterPlaceholder')"
        ></u-input>

        <!-- View toggle -->
        <div class="flex items-center gap-1 border border-default rounded-md p-0.5">
          <u-button
            :icon="resolveIcon('layoutGrid')"
            :color="viewMode === 'grid' ? 'primary' : 'neutral'"
            :variant="viewMode === 'grid' ? 'solid' : 'ghost'"
            size="sm"
            square
            :aria-label="t('pages.tech.gridView')"
            :aria-pressed="viewMode === 'grid'"
            @click="viewMode = 'grid'"
          ></u-button>
          <u-button
            :icon="resolveIcon('list')"
            :color="viewMode === 'list' ? 'primary' : 'neutral'"
            :variant="viewMode === 'list' ? 'solid' : 'ghost'"
            size="sm"
            square
            :aria-label="t('pages.tech.listView')"
            :aria-pressed="viewMode === 'list'"
            @click="viewMode = 'list'"
          ></u-button>
        </div>
      </div>

      <!-- Category bucket filter -->
      <div v-if="availableBucketOptions.length > 1" class="flex items-center gap-2">
        <span class="text-sm text-muted">{{ t('pages.tech.typeFilterLabel') }}</span>
        <div class="flex flex-wrap gap-1">
          <u-button
            v-for="bucket in availableBucketOptions"
            :key="bucket.value"
            :label="bucket.label"
            :icon="bucket.icon"
            :color="selectedBuckets.includes(bucket.value) ? 'primary' : 'neutral'"
            :variant="selectedBuckets.includes(bucket.value) ? 'subtle' : 'ghost'"
            size="xs"
            @click="toggleBucket(bucket.value)"
          ></u-button>
        </div>
      </div>
    </div>

    <!-- Result count -->
    <div v-if="tech?.length" class="text-sm text-muted">
      {{ t('pages.tech.showing', { count: filtered.length, total: tech.length }, tech.length) }}
    </div>

    <!-- Grid view -->
    <template v-if="viewMode === 'grid'">
      <div v-if="groupedBuckets.length" class="space-y-8">
        <div v-for="group in groupedBuckets" :key="group.id">
          <h2 class="text-lg font-semibold mb-4">
            {{ bucketLabel(group.id) }}
          </h2>
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <nuxt-link
              v-for="item in group.items"
              :key="item.path"
              :to="item.path"
              class="block rounded-lg focus-visible:outline-2 focus-visible:outline-primary"
            >
              <u-card class="h-full hover:ring-2 hover:ring-primary transition-shadow">
                <div class="flex items-start gap-3">
                  <div class="size-10 shrink-0 flex items-center justify-center bg-elevated border border-default">
                    <u-icon
                      v-if="item.icon?.name"
                      :name="item.icon.name"
                      class="size-6"
                    ></u-icon>
                    <u-icon
                      v-else
                      :name="resolveIcon('code')"
                      class="size-4 text-dimmed"
                    ></u-icon>
                  </div>
                  <div class="min-w-0">
                    <div class="font-medium">
                      {{ item.displayName || item.title }}
                    </div>
                    <div v-if="item.description" class="text-sm text-muted line-clamp-2">
                      {{ item.description }}
                    </div>
                  </div>
                </div>
              </u-card>
            </nuxt-link>
          </div>
        </div>
      </div>

      <u-card v-else>
        <p class="text-muted text-center py-8">
          {{ t('pages.tech.empty') }}
        </p>
      </u-card>
    </template>

    <!-- List/table view -->
    <template v-else>
      <u-card v-if="filtered.length" :ui="{ body: 'p-0' }">
        <u-table
          :data="filtered"
          :columns="columns"
          :ui="{
            tr: 'cursor-pointer hover:bg-elevated',
          }"
          @select="handleRowClick"
        ></u-table>
      </u-card>

      <u-card v-else>
        <p class="text-muted text-center py-8">
          {{ t('pages.tech.empty') }}
        </p>
      </u-card>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { Component } from 'vue'
import type { TechBucket } from '~/utils/tech-taxonomy'
import { h } from 'vue'
import { NuxtLink, UBadge, UIcon } from '#components'
import { TECH_BUCKETS, techBucket } from '~/utils/tech-taxonomy'

const { t, te } = useI18n()
const { resolveIcon } = useAppearance()

const { data: tech } = await useAsyncData('tech', () =>
  queryCollection('tech').order('title', 'ASC').all())

// URL-synced filters
const searchQuery = useUrlStringFilter('q')
const selectedBuckets = useUrlArrayFilter('bucket')
const viewMode = useUrlStringFilter('view', 'grid')

// Coarse category buckets → filter chips / section headings
const BUCKET_ICONS: Record<TechBucket, string> = {
  languages: 'code',
  frameworks: 'layout',
  libraries: 'package',
  tooling: 'tools',
  platforms: 'server',
  other: 'apps',
}
const bucketOptions = computed(() =>
  TECH_BUCKETS.map(b => ({
    value: b.id,
    label: bucketLabel(b.id),
    icon: resolveIcon(BUCKET_ICONS[b.id]),
  })))

function bucketLabel(id: string): string {
  const key = `pages.tech.buckets.${id}`
  return te(key) ? t(key) : formatLabel(id)
}

// Buckets actually present in the data
const usedBuckets = computed(() => {
  const set = new Set<string>()
  for (const item of tech.value ?? [])
    set.add(techBucket(item.category))
  return set
})

const availableBucketOptions = computed(() =>
  bucketOptions.value.filter(opt => usedBuckets.value.has(opt.value)))

// Filter tech items
const filtered = computed(() => {
  if (!tech.value)
    return []

  let items = useVisibilityFilter(tech.value)

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    items = items.filter(item =>
      item.title?.toLowerCase().includes(query)
      || item.displayName?.toLowerCase().includes(query)
      || item.description?.toLowerCase().includes(query)
      || item.category?.toLowerCase().includes(query)
      || item.ecosystem?.toLowerCase().includes(query),
    )
  }

  if (selectedBuckets.value.length > 0) {
    items = items.filter(item => selectedBuckets.value.includes(techBucket(item.category)))
  }

  return items
})

// Group by bucket for grid view, preserving TECH_BUCKETS order
const groupedBuckets = computed(() =>
  TECH_BUCKETS
    .map(b => ({ id: b.id, items: filtered.value.filter(item => techBucket(item.category) === b.id) }))
    .filter(g => g.items.length > 0))

function toggleBucket(bucket: string) {
  const current = [...selectedBuckets.value]
  const index = current.indexOf(bucket)
  if (index === -1)
    current.push(bucket)
  else
    current.splice(index, 1)
  selectedBuckets.value = current
}

// Table columns for list view
type TechItem = NonNullable<typeof tech.value>[number]

const columns = computed<TableColumn<TechItem>[]>(() => [
  {
    accessorKey: 'title',
    header: t('pages.tech.columns.name'),
    cell: ({ row }) => {
      const item = row.original
      // `NuxtLink as Component`: with typedPages + i18n, `to` is a union over every
      // generated route, and resolving it against the collection item type here trips
      // TS2590 (union too complex to represent).
      return h(NuxtLink as Component, { to: item.path, class: 'flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-[var(--color-primary-500)]' }, () => [
        h('div', { class: 'size-7 shrink-0 flex items-center justify-center bg-elevated border border-default' }, [
          item.icon?.name
            ? h(UIcon, { name: item.icon.name, class: 'size-4' })
            : h(UIcon, { name: resolveIcon('code'), class: 'size-3 text-dimmed' }),
        ]),
        h('span', { class: 'font-medium' }, item.displayName || item.title),
      ])
    },
  },
  {
    accessorKey: 'category',
    header: t('pages.tech.columns.type'),
    cell: ({ row }) => {
      const category = row.getValue('category') as string
      return h(UBadge, {
        label: category ? formatLabel(category) : '',
        variant: 'subtle',
        size: 'sm',
      })
    },
  },
  {
    accessorKey: 'description',
    header: t('pages.tech.columns.description'),
    cell: ({ row }) => {
      const desc = row.getValue('description') as string
      if (!desc)
        return ''
      return h('span', { class: 'text-muted line-clamp-1' }, desc)
    },
  },
])

// Row click handler for table
function handleRowClick(_e: Event, row: { original: TechItem }) {
  navigateTo(row.original.path)
}
</script>
