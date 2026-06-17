<template>
  <div>
    <!-- Bulk actions toolbar -->
    <div
      v-if="selected.length > 0"
      class="flex items-center gap-4 mb-4 p-3 bg-primary/10 rounded"
    >
      <span class="text-sm font-medium" aria-live="polite">{{ t('pages.examples.tablesDemo.selectedCount', selected.length) }}</span>
      <div class="flex gap-2">
        <u-button
          :label="t('pages.examples.tablesDemo.bulk.archive')"
          size="sm"
          color="neutral"
          variant="soft"
          :icon="resolveIcon('archive')"
          @click="handleBulkAction(t('pages.examples.tablesDemo.bulk.archive'))"
        ></u-button>
        <u-button
          :label="t('pages.examples.tablesDemo.bulk.export')"
          size="sm"
          color="neutral"
          variant="soft"
          :icon="resolveIcon('download')"
          @click="handleBulkAction(t('pages.examples.tablesDemo.bulk.export'))"
        ></u-button>
        <u-button
          :label="t('common.delete')"
          size="sm"
          color="error"
          variant="soft"
          :icon="resolveIcon('trash')"
          @click="handleBulkAction(t('common.delete'))"
        ></u-button>
      </div>
      <u-button
        :label="t('pages.examples.tablesDemo.bulk.clearSelection')"
        size="sm"
        variant="ghost"
        @click="selected = []"
      ></u-button>
    </div>

    <u-table :columns="columns" :data="projects">
      <template #select-header>
        <u-checkbox
          :model-value="allSelected"
          :indeterminate="someSelected"
          :aria-label="t('pages.examples.tablesDemo.aria.selectAllRows')"
          @update:model-value="toggleAll"
        ></u-checkbox>
      </template>

      <template #select-cell="{ row }">
        <u-checkbox
          :model-value="isSelected(row.original)"
          :aria-label="t('pages.examples.tablesDemo.aria.selectRow', { name: row.original.name })"
          @update:model-value="toggleRow(row.original)"
        ></u-checkbox>
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

      <template #actions-cell>
        <u-dropdown-menu :items="rowActionItems">
          <u-button
            :icon="resolveIcon('dotsVertical')"
            color="neutral"
            variant="ghost"
            size="sm"
            :aria-label="t('pages.examples.tablesDemo.aria.rowActions')"
          ></u-button>
        </u-dropdown-menu>
      </template>
    </u-table>
  </div>
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { SampleProject } from '~/composables/use-sample-data'

const props = defineProps<{
  projects: SampleProject[]
}>()

const { resolveIcon } = useAppearance()
const { t } = useI18n()

const selected = ref<SampleProject[]>([])

const columns = computed<TableColumn<SampleProject>[]>(() => [
  { accessorKey: 'select', header: '' },
  { accessorKey: 'name', header: t('pages.examples.project') },
  { accessorKey: 'status', header: t('pages.examples.status') },
  { accessorKey: 'owner', header: t('pages.examples.tablesDemo.columns.owner') },
  { accessorKey: 'actions', header: '' },
])

const allSelected = computed(() =>
  selected.value.length === props.projects.length,
)

const someSelected = computed(() =>
  selected.value.length > 0 && selected.value.length < props.projects.length,
)

function toggleAll() {
  if (allSelected.value) {
    selected.value = []
  }
  else {
    selected.value = [...props.projects]
  }
}

function toggleRow(project: SampleProject) {
  const index = selected.value.findIndex(p => p.id === project.id)
  if (index >= 0) {
    selected.value.splice(index, 1)
  }
  else {
    selected.value.push(project)
  }
}

function isSelected(project: SampleProject) {
  return selected.value.some(p => p.id === project.id)
}

const statusLabels: Record<string, string> = {
  seed: 'pages.examples.tablesDemo.status.seed',
  sprout: 'pages.examples.tablesDemo.status.sprout',
  evergreen: 'pages.examples.tablesDemo.status.evergreen',
  wilted: 'pages.examples.tablesDemo.status.wilted',
}

function statusLabel(value: string): string {
  const key = statusLabels[value]
  return key ? t(key) : formatLabel(value)
}

const rowActionItems = computed(() => [
  [
    { label: t('common.view'), icon: resolveIcon('eye') },
    { label: t('common.edit'), icon: resolveIcon('edit') },
  ],
  [
    { label: t('common.delete'), icon: resolveIcon('trash'), color: 'error' as const },
  ],
])

const toast = useToast()

function handleBulkAction(action: string) {
  toast.add({
    title: t('pages.examples.tablesDemo.bulk.toastTitle', { action }, selected.value.length),
    description: t('pages.examples.tablesDemo.bulk.toastDescription', { names: selected.value.map(p => p.name).join(', ') }),
  })
}
</script>
