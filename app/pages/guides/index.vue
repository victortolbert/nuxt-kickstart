<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2">
        {{ t('nav.guides') }}
      </h1>
      <p class="text-muted">
        {{ t('pages.guides.subtitle') }}
      </p>
    </div>

    <u-card class="mb-8">
      <collection-filters
        :statuses="[...statuses]"
        :visibilities="[...visibilities]"
        :show-search="true"
        @update:filters="updateFilters"
      ></collection-filters>
    </u-card>

    <div class="space-y-8">
      <section v-for="category in sortedCategories" :key="category.name">
        <h2 class="text-xl font-semibold mb-4">
          {{ categoryLabel(category.name) }}
        </h2>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <nuxt-link
            v-for="guide in category.guides"
            :key="guide.path"
            :to="guide.path"
            class="block rounded-lg focus-visible:outline-2 focus-visible:outline-primary"
          >
            <u-card class="h-full hover:ring-2 hover:ring-primary transition-shadow">
              <div class="flex flex-col gap-2">
                <div class="flex items-start justify-between gap-2">
                  <h3 class="font-medium">
                    {{ guide.title }}
                  </h3>
                  <u-badge
                    v-if="guide.difficulty"
                    :label="difficultyLabel(guide.difficulty)"
                    :color="getDifficultyColor(guide.difficulty)"
                    size="sm"
                    variant="soft"
                    class="shrink-0"
                  ></u-badge>
                </div>
                <p v-if="guide.description" class="text-sm text-muted line-clamp-2">
                  {{ guide.description }}
                </p>
                <status-indicator
                  v-if="guide.status"
                  :status="guide.status"
                  class="self-start mt-1"
                ></status-indicator>
              </div>
            </u-card>
          </nuxt-link>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UiColor } from '#shared/types/appearance'

const { t, te } = useI18n()

useHead({
  title: () => t('nav.guides'),
})

interface GuideEntry {
  path?: string
  title: string
  description?: string
  category?: string
  difficulty?: string
  order?: number
  status?: string
  visibility?: 'public' | 'internal' | 'private'
}

// One entry per guide: current locale preferred, English fallback, URLs resolved
const { data: guides } = await useLocalizedEntries<GuideEntry>('guides')

// Status / visibility / search filters (URL-synced), shared with /blocks
const { statuses, visibilities, updateFilters, applyFilters } = useCollectionFilters()

const filtered = computed(() => {
  if (!guides.value)
    return []
  const ordered = [...guides.value].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  const visible = useVisibilityFilter(ordered)
  return applyFilters.value(visible)
})

const categories = computed(() => {
  const cats = new Map<string, typeof guides.value>()
  for (const guide of filtered.value ?? []) {
    const cat = guide.category || 'other'
    if (!cats.has(cat))
      cats.set(cat, [])
    cats.get(cat)!.push(guide)
  }
  return cats
})

const categoryOrder = ['getting-started', 'content', 'authentication', 'customization', 'deployment', 'other']

const sortedCategories = computed(() => {
  return categoryOrder
    .filter(cat => categories.value.has(cat))
    .map(cat => ({ name: cat, guides: categories.value.get(cat)! }))
})

function toCamelCase(slug: string): string {
  return slug.replace(/-(\w)/g, (_, c: string) => c.toUpperCase())
}

function categoryLabel(name: string): string {
  const key = `pages.guides.categories.${toCamelCase(name)}`
  return te(key) ? t(key) : formatLabel(name)
}

function difficultyLabel(difficulty: string): string {
  const key = `pages.guides.difficulty.${difficulty}`
  return te(key) ? t(key) : formatLabel(difficulty)
}

function getDifficultyColor(difficulty: string): UiColor {
  const colors: Record<string, UiColor> = {
    beginner: 'success',
    intermediate: 'warning',
    advanced: 'error',
  }
  return colors[difficulty] ?? 'neutral'
}

useSeoMeta({
  description: () => t('pages.guides.subtitle'),
})
</script>
