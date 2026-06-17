<template>
  <header class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div>
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-500/10">
          <u-icon :name="resolveIcon('mailForward')" class="h-5 w-5 text-(--color-primary-500)"></u-icon>
        </div>
        <div>
          <h1 class="text-xl font-semibold text-ui-text">
            Compose Email
          </h1>
          <p class="text-sm text-ui-text-muted">
            Write and preview your email before sending
          </p>
        </div>
      </div>
    </div>

    <!-- Draft Saved Indicator -->
    <div v-if="lastSavedAt || isSaving" class="flex items-center gap-2 text-sm">
      <div v-if="isSaving" class="flex items-center gap-2 text-ui-text-muted">
        <u-icon :name="resolveIcon('loading')" class="h-4 w-4 animate-spin"></u-icon>
        <span>Saving draft…</span>
      </div>
      <div v-else-if="lastSavedAt" class="flex items-center gap-2 text-(--color-success-500)">
        <u-icon :name="resolveIcon('check')" class="h-4 w-4"></u-icon>
        <span>Saved {{ formatTimeAgo(lastSavedAt) }}</span>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  lastSavedAt: Date | null
  isSaving: boolean
  draftId: string
}>()

const { resolveIcon } = useAppearance()

// Format time ago helper
function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)

  if (seconds < 60)
    return 'just now'
  if (seconds < 3600)
    return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400)
    return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}
</script>
