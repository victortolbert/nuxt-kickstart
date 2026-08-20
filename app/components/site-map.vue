<template>
  <u-slideover
    v-model:open="isOpen"
    title="Site Map"
    description="Discover all pages and content in the site"
    side="right"
  >
    <template #body>
      <div class="p-4 space-y-4">
        <!-- Controls -->
        <div class="flex items-center justify-between">
          <p class="text-sm text-muted">
            Discover all pages and content
          </p>
          <div class="flex gap-2">
            <u-button
              size="xs"
              variant="ghost"
              color="neutral"
              @click="expandAll"
            >
              Expand All
            </u-button>
            <u-button
              size="xs"
              variant="ghost"
              color="neutral"
              @click="collapseAll"
            >
              Collapse All
            </u-button>
          </div>
        </div>

        <u-separator></u-separator>

        <!-- App Pages Section -->
        <div class="space-y-2">
          <h3 class="text-xs font-semibold uppercase text-muted tracking-wider">
            App Pages
          </h3>
          <div
            v-for="section in appSections"
            :key="section.label"
            class="border border-default rounded-lg overflow-hidden"
          >
            <!-- Section Header -->
            <button
              class="w-full p-3 flex items-center justify-between bg-muted hover:bg-accented focus-visible:ring-2 focus-visible:ring-(--color-primary-500) focus-visible:outline-none transition-colors"
              @click="toggleSection(section.label)"
            >
              <div class="flex items-center gap-2">
                <u-icon :name="section.icon" class="size-4"></u-icon>
                <span class="font-medium text-sm">{{ section.label }}</span>
                <u-badge color="neutral" size="sm">
                  {{ section.pages.length }}
                </u-badge>
              </div>
              <u-icon
                :name="isExpanded(section.label) ? resolveIcon('chevronUp') : resolveIcon('chevronDown')"
                class="size-4"
              ></u-icon>
            </button>

            <!-- Section Items -->
            <div v-if="isExpanded(section.label)" class="p-2 space-y-1">
              <nuxt-link
                v-for="page in section.pages"
                :key="page.to"
                :to="page.to"
                class="flex items-start gap-3 p-2 rounded hover:bg-muted transition-colors group"
                @click="isOpen = false"
              >
                <u-icon
                  :name="page.icon"
                  class="size-4 mt-0.5 text-muted group-hover:text-highlighted"
                ></u-icon>
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-medium group-hover:text-highlighted">
                    {{ page.label }}
                  </div>
                  <div v-if="page.description" class="text-xs text-muted truncate">
                    {{ page.description }}
                  </div>
                </div>
                <u-icon
                  :name="resolveIcon('arrowRight')"
                  class="size-4 opacity-0 group-hover:opacity-100 text-muted"
                ></u-icon>
              </nuxt-link>
            </div>
          </div>
        </div>

        <u-separator></u-separator>

        <!-- Content Collections -->
        <div class="space-y-4">
          <h3 class="text-xs font-semibold uppercase text-muted tracking-wider">
            Content Collections
          </h3>

          <div
            v-for="(cols, category) in collectionsByCategory"
            :key="category"
            class="space-y-2"
          >
            <!-- Category Header -->
            <button
              class="w-full flex items-center justify-between text-left focus-visible:ring-2 focus-visible:ring-(--color-primary-500) focus-visible:outline-none rounded"
              @click="toggleSection(category)"
            >
              <div class="flex items-center gap-2">
                <u-icon :name="categoryLabels[category]?.icon || resolveIcon('folder')" class="size-4 text-muted"></u-icon>
                <span class="text-sm font-medium">{{ categoryLabels[category]?.label || category }}</span>
                <u-badge color="neutral" size="sm">
                  {{ getCategoryCount(category) }}
                </u-badge>
              </div>
              <u-icon
                :name="isExpanded(category) ? resolveIcon('chevronUp') : resolveIcon('chevronDown')"
                class="size-4 text-muted"
              ></u-icon>
            </button>

            <!-- Collections in Category -->
            <div v-if="isExpanded(category)" class="pl-4 space-y-2">
              <div
                v-for="col in cols"
                :key="col.key"
                class="border border-default rounded-lg overflow-hidden"
              >
                <!-- Collection Header -->
                <button
                  class="w-full p-2 flex items-center justify-between bg-muted hover:bg-accented focus-visible:ring-2 focus-visible:ring-(--color-primary-500) focus-visible:outline-none transition-colors"
                  @click="toggleCollection(col.key)"
                >
                  <div class="flex items-center gap-2">
                    <u-icon :name="col.icon" class="size-4"></u-icon>
                    <span class="text-sm">{{ col.label }}</span>
                    <u-badge color="neutral" size="sm">
                      {{ getCollectionCount(col.key) }}
                    </u-badge>
                  </div>
                  <div class="flex items-center gap-2">
                    <nuxt-link
                      :to="col.basePath"
                      class="text-xs text-muted hover:text-highlighted"
                      @click.stop="isOpen = false"
                    >
                      View all
                    </nuxt-link>
                    <u-icon
                      :name="isCollectionExpanded(col.key) ? resolveIcon('chevronUp') : resolveIcon('chevronDown')"
                      class="size-4"
                    ></u-icon>
                  </div>
                </button>

                <!-- Collection Items -->
                <div v-if="isCollectionExpanded(col.key) && allContent?.[col.key]?.length" class="p-2 space-y-1 max-h-64 overflow-y-auto">
                  <nuxt-link
                    v-for="item in allContent[col.key]"
                    :key="item.path"
                    :to="item.path"
                    class="flex items-center gap-2 p-2 rounded hover:bg-muted transition-colors group text-sm"
                    @click="isOpen = false"
                  >
                    <u-icon :name="col.icon" class="size-3 text-muted"></u-icon>
                    <span class="flex-1 truncate group-hover:text-highlighted">
                      {{ item.title }}
                    </span>
                    <status-indicator
                      v-if="item.status"
                      :status="item.status"
                    ></status-indicator>
                  </nuxt-link>
                </div>
                <div v-else-if="isCollectionExpanded(col.key)" class="p-4 text-center text-sm text-muted">
                  No items yet
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats -->
        <div class="pt-4 border-t border-default">
          <div class="flex justify-between text-xs text-muted">
            <span>{{ totalAppPages }} app pages</span>
            <span>{{ totalContentItems }} content items</span>
          </div>
        </div>
      </div>
    </template>
  </u-slideover>
</template>

<script setup lang="ts">
const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const isOpen = computed({
  get: () => props.open,
  set: value => emit('update:open', value),
})

const { resolveIcon } = useAppearance()

// Static app pages (non-content routes)
interface AppPage {
  label: string
  to: string
  icon: string
  description?: string
}

interface AppSection {
  label: string
  icon: string
  pages: AppPage[]
}

const appSections = computed<AppSection[]>(() => [
  {
    label: 'Main',
    icon: resolveIcon('home'),
    pages: [
      { label: 'Home', to: '/', icon: resolveIcon('home'), description: 'Landing page' },
    ],
  },
  {
    label: 'System',
    icon: resolveIcon('adjustments'),
    pages: [
      { label: 'Settings', to: '/settings', icon: resolveIcon('settings'), description: 'App preferences' },
      { label: 'Login', to: '/login', icon: resolveIcon('login'), description: 'Authentication' },
      { label: 'Auth Demo', to: '/auth-demo', icon: resolveIcon('shield'), description: 'Authorization examples' },
    ],
  },
])

// Content collection configuration
interface CollectionConfig {
  key: string
  label: string
  icon: string
  basePath: string
  category: 'registries' | 'content' | 'meta' | 'docs' | 'agent'
}

const collections = computed<CollectionConfig[]>(() => [
  // Registries
  { key: 'tech', label: 'Tech', icon: resolveIcon('cpu'), basePath: '/tech', category: 'registries' },
  // Content
  { key: 'posts', label: 'Posts', icon: resolveIcon('fileText'), basePath: '/posts', category: 'content' },
  // Docs
  { key: 'guides', label: 'Guides', icon: resolveIcon('book'), basePath: '/guides', category: 'docs' },
])

const categoryLabels = computed<Record<string, { label: string, icon: string }>>(() => ({
  registries: { label: 'Registries', icon: resolveIcon('database') },
  content: { label: 'Content', icon: resolveIcon('files') },
  meta: { label: 'Meta', icon: resolveIcon('settings') },
  docs: { label: 'Documentation', icon: resolveIcon('book2') },
  agent: { label: 'Agent Context', icon: resolveIcon('robot') },
}))

// Content item type with optional fields
interface ContentItem {
  title?: string
  name?: string
  path?: string
  status?: string
  visibility?: string
  stem?: string
}

const { locale } = useI18n()

// Fetch all content collections
const { data: allContent } = await useAsyncData('site-map-content', async () => {
  const results: Record<string, Array<{ title: string, path: string, status?: string, visibility?: string }>> = {}

  for (const col of collections.value) {
    try {
      // Query collection without schema field selection to avoid typing issues
      // Nuxt Content typing doesn't handle dynamic collection names well
      // Locale-aware collections resolve through the Localized Collection module
      const items = isLocalizedCollection(col.key)
        ? await fetchLocalizedEntries(col.key, locale.value) as unknown[]
        : await queryCollection(col.key as 'tech').all() as unknown[]
      results[col.key] = items.map((item: unknown) => {
        const contentItem = item as ContentItem
        return {
          title: contentItem.title || contentItem.name || 'Untitled',
          path: contentItem.path || `${col.basePath}/${contentItem.stem}`,
          status: contentItem.status,
          visibility: contentItem.visibility,
        }
      })
    }
    catch {
      results[col.key] = []
    }
  }

  return results
}, { watch: [locale] })

// Group collections by category
const collectionsByCategory = computed(() => {
  const grouped: Record<string, CollectionConfig[]> = {}
  for (const col of collections.value) {
    if (!grouped[col.category]) {
      grouped[col.category] = []
    }
    grouped[col.category]!.push(col)
  }
  return grouped
})

// Expansion state
const expandedSections = ref<string[]>(['Main', 'content'])
const expandedCollections = ref<string[]>([])

function toggleSection(label: string) {
  const index = expandedSections.value.indexOf(label)
  if (index === -1) {
    expandedSections.value.push(label)
  }
  else {
    expandedSections.value.splice(index, 1)
  }
}

function toggleCollection(key: string) {
  const index = expandedCollections.value.indexOf(key)
  if (index === -1) {
    expandedCollections.value.push(key)
  }
  else {
    expandedCollections.value.splice(index, 1)
  }
}

function isExpanded(label: string) {
  return expandedSections.value.includes(label)
}

function isCollectionExpanded(key: string) {
  return expandedCollections.value.includes(key)
}

function expandAll() {
  expandedSections.value = [
    ...appSections.value.map(s => s.label),
    ...Object.keys(categoryLabels.value),
  ]
  expandedCollections.value = collections.value.map(c => c.key)
}

function collapseAll() {
  expandedSections.value = []
  expandedCollections.value = []
}

// Stats
const totalAppPages = computed(() => appSections.value.reduce((acc, s) => acc + s.pages.length, 0))
const totalContentItems = computed(() => {
  if (!allContent.value)
    return 0
  return Object.values(allContent.value).reduce((acc, items) => acc + items.length, 0)
})

function getCollectionCount(key: string): number {
  return allContent.value?.[key]?.length ?? 0
}

function getCategoryCount(category: string): number {
  const cols = collectionsByCategory.value[category] || []
  return cols.reduce((acc, col) => acc + getCollectionCount(col.key), 0)
}
</script>
