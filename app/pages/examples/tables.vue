<template>
  <div class="space-y-8">
    <div>
      <div class="flex items-center gap-2 text-sm text-muted mb-2">
        <nuxt-link to="/examples" class="hover:underline">
          {{ t('nav.examples') }}
        </nuxt-link>
        <u-icon :name="resolveIcon('chevronRight')" class="size-4"></u-icon>
        <span>{{ t('nav.tables') }}</span>
      </div>
      <h1 class="text-3xl font-bold">
        {{ t('pages.examples.tablesDemo.title') }}
      </h1>
      <p class="text-muted mt-2">
        {{ t('pages.examples.tablesDemo.description') }}
      </p>
    </div>

    <!-- Simple Table -->
    <u-card>
      <template #header>
        <div class="flex items-center gap-2">
          <u-icon :name="resolveIcon('table')" class="size-5"></u-icon>
          <h2 class="text-xl font-semibold">
            {{ t('pages.examples.tablesDemo.simpleTable.title') }}
          </h2>
        </div>
        <p class="text-sm text-muted mt-1">
          {{ t('pages.examples.tablesDemo.simpleTable.description') }}
        </p>
      </template>

      <u-table :columns="simpleColumns" :data="projects.slice(0, 5)">
        <template #status-cell="{ row }">
          <status-indicator
            :status="row.original.status"
            :label="statusLabel(row.original.status)"
          ></status-indicator>
        </template>
        <template #domain-cell="{ row }">
          {{ domainLabel(row.original.domain) }}
        </template>
        <template #progress-cell="{ row }">
          <div class="flex items-center gap-2">
            <u-progress
              :model-value="row.original.progress"
              size="sm"
              class="w-20"
            ></u-progress>
            <span class="text-sm text-muted">{{ row.original.progress }}%</span>
          </div>
        </template>
      </u-table>
    </u-card>

    <!-- Advanced Table with Filters -->
    <u-card>
      <template #header>
        <div class="flex items-center gap-2">
          <u-icon :name="resolveIcon('filter')" class="size-5"></u-icon>
          <h2 class="text-xl font-semibold">
            {{ t('pages.examples.tablesDemo.advancedTable.title') }}
          </h2>
        </div>
        <p class="text-sm text-muted mt-1">
          {{ t('pages.examples.tablesDemo.advancedTable.description') }}
        </p>
      </template>

      <!-- Filters: single column on mobile, two-up on tablet, one row on desktop.
           The multi-select shows a count so the trigger never grows. -->
      <div class="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-end">
        <u-form-field :label="t('common.search')" class="sm:col-span-2 lg:col-span-1">
          <u-input
            v-model="search"
            :placeholder="t('pages.examples.tablesDemo.filters.searchPlaceholder')"
            :icon="resolveIcon('filter')"
            class="w-full"
          ></u-input>
        </u-form-field>

        <u-form-field :label="t('pages.examples.status')">
          <u-select-menu
            v-model="statusFilter"
            :items="statusOptions"
            multiple
            value-key="value"
            class="w-full"
          >
            <template #default>
              <span v-if="!statusFilter.length" class="text-dimmed">{{ t('pages.examples.tablesDemo.filters.allStatuses') }}</span>
              <span v-else-if="statusFilter.length === 1" class="truncate">{{ statusLabel(statusFilter[0]!) }}</span>
              <span v-else>{{ t('pages.examples.tablesDemo.selectedCount', statusFilter.length) }}</span>
            </template>
          </u-select-menu>
        </u-form-field>

        <u-form-field :label="t('pages.examples.tablesDemo.columns.domain')">
          <u-select-menu
            v-model="domainFilter"
            :items="domainOptions"
            :placeholder="t('pages.examples.tablesDemo.filters.allDomains')"
            value-key="value"
            class="w-full"
          ></u-select-menu>
        </u-form-field>

        <u-button
          :label="t('pages.examples.tablesDemo.filters.clear')"
          color="neutral"
          variant="ghost"
          :icon="resolveIcon('close')"
          :disabled="!search && !statusFilter.length && !domainFilter"
          class="justify-self-start"
          @click="clearFilters"
        ></u-button>
      </div>

      <!-- Results count -->
      <div class="text-sm text-muted mb-3">
        {{ t('pages.examples.tablesDemo.showingResults', { shown: paginatedProjects.length, total: filteredProjects.length }) }}
      </div>

      <!-- Table -->
      <u-table :columns="advancedColumns" :data="paginatedProjects">
        <template #name-header>
          <button
            class="flex items-center gap-1 hover:text-default"
            :aria-label="nameSortAriaLabel"
            @click="handleSort('name')"
          >
            {{ t('pages.examples.project') }}
            <u-icon
              v-if="sortColumn === 'name'"
              :name="sortDirection === 'asc' ? resolveIcon('chevronUp') : resolveIcon('chevronDown')"
              class="size-4"
            ></u-icon>
          </button>
        </template>

        <template #name-cell="{ row }">
          <span class="font-medium">{{ row.original.name }}</span>
        </template>

        <template #status-cell="{ row }">
          <status-indicator
            :status="row.original.status"
            :label="statusLabel(row.original.status)"
          ></status-indicator>
        </template>

        <template #domain-cell="{ row }">
          {{ domainLabel(row.original.domain) }}
        </template>

        <template #tech-cell="{ row }">
          <div class="flex flex-wrap items-center gap-2.5">
            <tech-badge
              v-for="tech in row.original.tech.slice(0, 3)"
              :key="tech"
              :slug="tech"
              size="md"
              mode="icon"
            ></tech-badge>
            <span v-if="row.original.tech.length > 3" class="text-xs text-muted">
              +{{ row.original.tech.length - 3 }}
            </span>
          </div>
        </template>

        <template #progress-cell="{ row }">
          <div class="flex items-center gap-2">
            <u-progress
              :model-value="row.original.progress"
              size="sm"
              class="w-16"
            ></u-progress>
            <span class="text-sm text-muted w-8">
              {{ row.original.progress }}%
            </span>
          </div>
        </template>

        <template #priority-cell="{ row }">
          <u-badge
            :label="priorityLabel(row.original.priority)"
            :color="getPriorityColor(row.original.priority)"
            size="sm"
            variant="subtle"
          ></u-badge>
        </template>

        <template #lastUpdated-cell="{ row }">
          <span class="text-sm text-muted">{{ row.original.lastUpdated }}</span>
        </template>
      </u-table>

      <!-- Pagination -->
      <div class="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-default">
        <div class="flex items-center gap-2">
          <span class="text-sm text-muted">{{ t('pages.examples.tablesDemo.rowsPerPage') }}</span>
          <u-select-menu
            v-model="pageSize"
            :items="pageSizeOptions"
            class="w-20"
          ></u-select-menu>
        </div>

        <u-pagination
          v-model:page="page"
          :total="filteredProjects.length"
          :items-per-page="pageSize"
          show-edges
        ></u-pagination>

        <div class="text-sm text-muted">
          {{ t('pages.examples.tablesDemo.pageOf', { page, total: totalPages }) }}
        </div>
      </div>
    </u-card>

    <!-- Row Selection Table -->
    <u-card>
      <template #header>
        <div class="flex items-center gap-2">
          <u-icon :name="resolveIcon('checkbox')" class="size-5"></u-icon>
          <h2 class="text-xl font-semibold">
            {{ t('pages.examples.tablesDemo.rowSelection.title') }}
          </h2>
        </div>
        <p class="text-sm text-muted mt-1">
          {{ t('pages.examples.tablesDemo.rowSelection.description') }}
        </p>
      </template>

      <examples-selectable-table :projects="projects.slice(0, 6)"></examples-selectable-table>
    </u-card>
  </div>
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { UiColor } from '#shared/types/appearance'
import type { SampleProject } from '~/composables/use-sample-data'

const { projects } = useSampleData()
const { resolveIcon } = useAppearance()
const { t } = useI18n()

// Simple table columns
const simpleColumns = computed<TableColumn<SampleProject>[]>(() => [
  { accessorKey: 'name', header: t('pages.examples.project') },
  { accessorKey: 'status', header: t('pages.examples.status') },
  { accessorKey: 'domain', header: t('pages.examples.tablesDemo.columns.domain') },
  { accessorKey: 'progress', header: t('pages.examples.progress') },
])

// Advanced table state
const search = ref('')
const statusFilter = ref<string[]>([])

const domainFilter = ref<string | null>(null)
const sortColumn = ref<keyof SampleProject>('lastUpdated')
const sortDirection = ref<'asc' | 'desc'>('desc')
const page = ref(1)
const pageSize = ref(10)

// Available options for filters
const statusOptions = computed(() => [
  { label: t('pages.examples.tablesDemo.status.seed'), value: 'seed' },
  { label: t('pages.examples.tablesDemo.status.sprout'), value: 'sprout' },
  { label: t('pages.examples.tablesDemo.status.evergreen'), value: 'evergreen' },
  { label: t('pages.examples.tablesDemo.status.wilted'), value: 'wilted' },
])

function statusLabel(value: string): string {
  return statusOptions.value.find(o => o.value === value)?.label ?? value
}

const domainOptions = computed(() => [
  { label: t('pages.examples.tablesDemo.domains.all'), value: null },
  { label: t('pages.examples.tablesDemo.domains.healthcare'), value: 'healthcare' },
  { label: t('pages.examples.tablesDemo.domains.biopharma'), value: 'biopharma' },
  { label: t('pages.examples.tablesDemo.domains.insurtech'), value: 'insurtech' },
  { label: t('pages.examples.tablesDemo.domains.proptech'), value: 'proptech' },
  { label: t('pages.examples.tablesDemo.domains.nonprofit'), value: 'nonprofit' },
  { label: t('pages.examples.tablesDemo.domains.other'), value: 'other' },
])

function domainLabel(value: string): string {
  return domainOptions.value.find(o => o.value === value)?.label ?? formatLabel(value)
}

const pageSizeOptions = [5, 10, 25, 50]

// Advanced table columns with sorting
const advancedColumns = computed<TableColumn<SampleProject>[]>(() => [
  { accessorKey: 'name', header: t('pages.examples.project') },
  { accessorKey: 'status', header: t('pages.examples.status') },
  { accessorKey: 'domain', header: t('pages.examples.tablesDemo.columns.domain') },
  { accessorKey: 'tech', header: t('pages.examples.tablesDemo.columns.tech') },
  { accessorKey: 'progress', header: t('pages.examples.progress') },
  { accessorKey: 'priority', header: t('pages.examples.tablesDemo.columns.priority') },
  { accessorKey: 'owner', header: t('pages.examples.tablesDemo.columns.owner') },
  { accessorKey: 'lastUpdated', header: t('pages.examples.tablesDemo.columns.lastUpdated') },
])

// Filtered and sorted data
const filteredProjects = computed(() => {
  let result = [...projects]

  // Search filter
  if (search.value) {
    const searchLower = search.value.toLowerCase()
    result = result.filter(p =>
      p.name.toLowerCase().includes(searchLower)
      || p.owner.toLowerCase().includes(searchLower)
      || p.tech.some(t => t.toLowerCase().includes(searchLower)),
    )
  }

  // Status filter
  if (statusFilter.value.length > 0) {
    result = result.filter(p => statusFilter.value.includes(p.status))
  }

  // Domain filter
  if (domainFilter.value) {
    result = result.filter(p => p.domain === domainFilter.value)
  }

  // Sorting
  result.sort((a, b) => {
    const aVal = a[sortColumn.value]
    const bVal = b[sortColumn.value]

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDirection.value === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal)
    }

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection.value === 'asc' ? aVal - bVal : bVal - aVal
    }

    return 0
  })

  return result
})

// Paginated data
const paginatedProjects = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filteredProjects.value.slice(start, start + pageSize.value)
})

// Total pages
const totalPages = computed(() =>
  Math.ceil(filteredProjects.value.length / pageSize.value),
)

// Reset page when filters change
watch([search, statusFilter, domainFilter], () => {
  page.value = 1
})

// Handle sort
function handleSort(column: keyof SampleProject) {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  }
  else {
    sortColumn.value = column
    sortDirection.value = 'asc'
  }
}

// Priority color mapping
function getPriorityColor(priority: string): UiColor {
  const colors: Record<string, UiColor> = {
    low: 'neutral',
    medium: 'warning',
    high: 'error',
  }
  return colors[priority] || 'neutral'
}

const priorityLabels: Record<string, string> = {
  low: 'pages.examples.tablesDemo.priority.low',
  medium: 'pages.examples.tablesDemo.priority.medium',
  high: 'pages.examples.tablesDemo.priority.high',
}

function priorityLabel(value: string): string {
  const key = priorityLabels[value]
  return key ? t(key) : formatLabel(value)
}

// Sortable name column: aria-label reflects current sort state
const nameSortAriaLabel = computed(() => {
  const column = t('pages.examples.project')
  if (sortColumn.value !== 'name')
    return t('pages.examples.tablesDemo.sort.sortBy', { column })
  return sortDirection.value === 'asc'
    ? t('pages.examples.tablesDemo.sort.sortedAscending', { column })
    : t('pages.examples.tablesDemo.sort.sortedDescending', { column })
})

// Clear all filters
function clearFilters() {
  search.value = ''
  statusFilter.value = []
  domainFilter.value = null
  page.value = 1
}
</script>
