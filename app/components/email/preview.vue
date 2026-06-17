<template>
  <div class="email-preview h-full">
    <!-- Loading state -->
    <div
      v-if="isLoading"
      class="flex min-h-112.5 h-full flex-col items-center justify-center gap-3 bg-(--ui-bg-muted)/30"
    >
      <div class="flex flex-col items-center gap-3 p-6">
        <u-icon :name="resolveIcon('loading')" class="h-8 w-8 animate-spin text-(--color-primary-500)"></u-icon>
        <p class="text-sm text-ui-text-muted">
          Generating preview…
        </p>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="!hasContent"
      class="flex min-h-112.5 h-full flex-col items-center justify-center gap-4 bg-(--ui-bg-muted)/30"
    >
      <div class="flex flex-col items-center gap-3 p-6 text-center">
        <div class="flex h-12 w-12 items-center justify-center rounded-full bg-elevated]">
          <u-icon :name="resolveIcon('mail')" class="h-6 w-6 text-ui-text-dimmed"></u-icon>
        </div>
        <div class="space-y-1">
          <p class="text-sm font-medium text-ui-text-muted">
            No preview yet
          </p>
          <p class="text-xs text-ui-text-dimmed">
            Start typing to see your email preview
          </p>
        </div>
      </div>
    </div>

    <!-- Rendered state -->
    <iframe
      v-else
      :srcdoc="html"
      sandbox="allow-same-origin"
      class="min-h-112.5 h-full w-full border-0 bg-white"
      title="Email Preview"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  html: string
  isLoading: boolean
  hasContent: boolean
}>()

const { resolveIcon } = useAppearance()
</script>

<style scoped>
.email-preview {
  display: flex;
  flex-direction: column;
}
</style>
