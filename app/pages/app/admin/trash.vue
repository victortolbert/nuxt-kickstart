<template>
  <div class="p-4 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">
          Trash
        </h1>
        <p class="text-sm text-muted mt-1">
          {{ totalItems }} {{ totalItems === 1 ? 'item' : 'items' }} in trash
        </p>
      </div>

      <u-button
        to="/admin"
        variant="ghost"
        size="sm"
        :icon="resolveIcon('arrowLeft')"
      >
        Back
      </u-button>
    </div>

    <!-- Empty state -->
    <div
      v-if="totalItems === 0"
      class="flex flex-col items-center justify-center py-12 text-center"
    >
      <u-icon :name="resolveIcon('trash')" class="text-6xl text-muted mb-4"></u-icon>
      <h2 class="text-lg font-semibold mb-2">
        Trash is empty
      </h2>
      <p class="text-sm text-muted">
        Deleted items will appear here
      </p>
    </div>

    <!-- Grouped items -->
    <div
      v-else
      class="space-y-6"
    >
      <div
        v-for="(items, collection) in groupedItems"
        :key="collection"
      >
        <div
          v-if="items.length > 0"
          class="space-y-2"
        >
          <h2 class="text-lg font-semibold flex items-center gap-2">
            {{ formatLabel(collection) }}
            <u-badge
              size="sm"
              :color="getCollectionColor(collection)"
            >
              {{ items.length }}
            </u-badge>
          </h2>

          <div class="space-y-2">
            <div
              v-for="item in items"
              :key="`${item.collection}/${item.slug}`"
              class="flex items-center justify-between p-4 rounded-lg border border-[var(--ui-border)] bg-[var(--ui-bg-elevated)]"
            >
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <p class="font-medium truncate">
                    {{ item.slug }}
                  </p>
                  <u-badge
                    size="sm"
                    :color="getCollectionColor(item.collection)"
                  >
                    {{ formatLabel(item.collection) }}
                  </u-badge>
                </div>
                <p class="text-xs text-muted">
                  Deleted {{ formatDate(item.deletedAt) }}
                </p>
              </div>

              <div class="flex items-center gap-2 ml-4">
                <u-button
                  size="sm"
                  variant="ghost"
                  :icon="resolveIcon('restore')"
                  @click="handleRestore(item)"
                >
                  Restore
                </u-button>
                <u-button
                  size="sm"
                  variant="ghost"
                  color="error"
                  :icon="resolveIcon('trashX')"
                  @click="handlePermanentDelete(item)"
                >
                  Delete
                </u-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UiColor } from '#shared/types/appearance'

definePageMeta({
  middleware: 'admin',
})

interface TrashItem {
  slug: string
  collection: string
  deletedAt: string
  originalPath: string
  exists: boolean
}

const { data: trashItems, refresh } = await useAsyncData('trash-items', async () => {
  try {
    const response = await $fetch<TrashItem[]>('/api/content/trash')
    return response
  }
  catch (error) {
    console.error('Failed to fetch trash items:', error)
    return []
  }
})

const toast = useToast()
const confirm = useConfirmDialog()
const { resolveIcon } = useAppearance()

// Group items by collection
const groupedItems = computed(() => {
  const items = trashItems.value ?? []
  const groups: Record<string, TrashItem[]> = {
    notes: [],
    people: [],
    logs: [],
  }

  for (const item of items) {
    const collection = item.collection as 'guides' | 'posts'
    if (groups[collection]) {
      groups[collection].push(item)
    }
  }

  return groups
})

const totalItems = computed(() => (trashItems.value ?? []).length)

async function handleRestore(item: TrashItem) {
  try {
    await $fetch(`/api/content/trash/restore/${item.collection}/${item.slug}`, {
      method: 'POST',
    })
    toast.add({
      title: 'Restored',
      description: `${formatLabel(item.collection)} restored successfully`,
      color: 'success',
    })
    await refresh()
  }
  catch (error) {
    toast.add({
      title: 'Error',
      description: error instanceof Error ? error.message : 'Failed to restore item',
      color: 'error',
    })
  }
}

async function handlePermanentDelete(item: TrashItem) {
  const confirmed = await confirm({
    title: 'Permanently delete?',
    description: `This will permanently delete "${item.slug}". This cannot be undone.`,
    confirmLabel: 'Delete',
    confirmColor: 'error',
    icon: resolveIcon('trashX'),
  })

  if (!confirmed)
    return

  try {
    await $fetch(`/api/content/trash/${item.collection}/${item.slug}`, {
      method: 'DELETE',
    })
    toast.add({
      title: 'Deleted',
      description: 'Item permanently deleted',
      color: 'success',
    })
    await refresh()
  }
  catch (error) {
    toast.add({
      title: 'Error',
      description: error instanceof Error ? error.message : 'Failed to delete item',
      color: 'error',
    })
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function getCollectionColor(collection: string): UiColor {
  const colors: Record<string, UiColor> = {
    notes: 'info',
    people: 'success',
    logs: 'secondary',
  }
  return colors[collection] || 'neutral'
}
</script>
