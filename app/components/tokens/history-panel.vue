<template>
  <div class="history-panel">
    <div class="panel-header">
      <h3 class="m-0 flex-1">
        <button
          type="button"
          class="flex w-full items-center gap-2 text-left cursor-pointer"
          :aria-expanded="isOpen"
          @click="isOpen = !isOpen"
        >
          <u-icon :name="isOpen ? resolveIcon('chevronDown') : resolveIcon('chevronRight')" class="text-lg"></u-icon>
          <span class="font-semibold">
            Transformation History
          </span>
          <u-badge
            v-if="history.length > 0"
            color="neutral"
            size="xs"
          >
            {{ history.length }}
          </u-badge>
        </button>
      </h3>
      <u-button
        v-if="history.length > 0"
        color="error"
        variant="ghost"
        size="xs"
        :icon="resolveIcon('trash')"
        @click.stop="handleClear"
      >
        Clear
      </u-button>
    </div>

    <div v-if="isOpen" class="panel-content">
      <div v-if="history.length === 0" class="empty-state">
        <u-icon
          :name="resolveIcon('clock')"
          class="text-4xl"
          style="color: var(--ui-text-muted)"
        ></u-icon>
        <p style="color: var(--ui-text-muted)">
          No transformation history yet
        </p>
      </div>

      <div v-else class="history-list">
        <div
          v-for="entry in history"
          :key="entry.id"
          class="history-entry"
          role="button"
          tabindex="0"
          :aria-label="`Restore ${entry.format.toUpperCase()} transformation from ${formatTimestamp(entry.timestamp)}`"
          @click="handleRestore(entry)"
          @keydown.enter.prevent="handleRestore(entry)"
          @keydown.space.prevent="handleRestore(entry)"
        >
          <div class="entry-header">
            <div class="flex items-center gap-2">
              <u-badge :color="getFormatBadgeColor(entry.format)" size="sm">
                {{ entry.format.toUpperCase() }}
              </u-badge>
              <span class="text-xs" style="color: var(--ui-text-muted)">
                {{ getSourceLabel(entry.source) }}
              </span>
            </div>
            <span class="text-xs" style="color: var(--ui-text-dimmed)">
              {{ formatTimestamp(entry.timestamp) }}
            </span>
          </div>

          <div class="entry-details">
            <span class="text-sm">{{ entry.tokenCount }} tokens</span>
            <span class="text-sm" style="color: var(--ui-text-muted)">
              → {{ entry.formats.length }} format{{ entry.formats.length > 1 ? 's' : '' }}
            </span>
          </div>

          <div class="entry-formats">
            <span
              v-for="format in entry.formats.slice(0, 3)"
              :key="format"
              class="format-tag"
            >
              {{ format }}
            </span>
            <span v-if="entry.formats.length > 3" class="format-tag">
              +{{ entry.formats.length - 3 }} more
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Clear Confirmation Modal -->
    <u-modal
      v-model:open="showClearConfirm"
      title="Clear History"
      description="This action cannot be undone."
    >
      <template #body>
        <p style="color: var(--ui-text-muted)">
          Are you sure you want to clear all transformation history?
        </p>
      </template>

      <template #footer>
        <div class="flex justify-end gap-2">
          <u-button
            color="neutral"
            variant="ghost"
            @click="cancelClear"
          >
            Cancel
          </u-button>
          <u-button color="error" @click="confirmClear">
            Clear History
          </u-button>
        </div>
      </template>
    </u-modal>
  </div>
</template>

<script setup lang="ts">
import type { UiColor } from '#shared/types/appearance'
import type { HistoryEntry } from '~/composables/use-token-history'

// Deep readonly type for entries from Vue's readonly() ref
interface ReadonlyHistoryEntry {
  readonly id: string
  readonly timestamp: number
  readonly source: 'upload' | 'url' | 'paste' | 'example'
  readonly formats: readonly string[]
  readonly tokenCount: number
  readonly format: 'dtcg' | 'legacy' | 'helium' | 'unknown'
}

const emit = defineEmits<{
  restore: [entry: HistoryEntry]
}>()

const { history, clearHistory } = useTokenHistory()
const { resolveIcon } = useAppearance()

const isOpen = ref(false)
const showClearConfirm = ref(false)

// Accept deep readonly entry from history and create mutable copy for emit
function handleRestore(entry: ReadonlyHistoryEntry) {
  const mutableEntry: HistoryEntry = {
    id: entry.id,
    timestamp: entry.timestamp,
    source: entry.source,
    formats: [...entry.formats],
    tokenCount: entry.tokenCount,
    format: entry.format,
  }
  emit('restore', mutableEntry)
}

function handleClear() {
  showClearConfirm.value = true
}

function confirmClear() {
  clearHistory()
  showClearConfirm.value = false
}

function cancelClear() {
  showClearConfirm.value = false
}

function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) {
    return 'Just now'
  }
  if (diffMins < 60) {
    return `${diffMins}m ago`
  }
  if (diffHours < 24) {
    return `${diffHours}h ago`
  }
  if (diffDays < 7) {
    return `${diffDays}d ago`
  }
  return date.toLocaleDateString()
}

function getFormatBadgeColor(format: string): UiColor {
  switch (format) {
    case 'dtcg':
      return 'primary'
    case 'helium':
      return 'info'
    case 'legacy':
      return 'neutral'
    default:
      return 'neutral'
  }
}

function getSourceLabel(source: string): string {
  switch (source) {
    case 'upload':
      return 'File Upload'
    case 'url':
      return 'URL Fetch'
    case 'paste':
      return 'Pasted'
    case 'example':
      return 'Example'
    default:
      return source
  }
}
</script>

<style scoped>
.history-panel {
  border: 1px solid var(--ui-border);
  border-radius: 0.5rem;
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: var(--ui-bg);
  transition: background-color 0.2s;
}

.panel-header:hover {
  background-color: var(--ui-bg-elevated);
}

.panel-content {
  border-top: 1px solid var(--ui-border);
  max-height: 400px;
  overflow-y: auto;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  gap: 0.5rem;
}

.history-list {
  display: flex;
  flex-direction: column;
}

.history-entry {
  padding: 1rem;
  border-bottom: 1px solid var(--ui-border);
  cursor: pointer;
  transition: background-color 0.2s;
}

.history-entry:last-child {
  border-bottom: none;
}

.history-entry:hover {
  background-color: var(--ui-bg-elevated);
}

.entry-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.entry-details {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.entry-formats {
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
}

.format-tag {
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  background-color: var(--ui-bg-muted);
  border-radius: 0.25rem;
  color: var(--ui-text-muted);
}
</style>
