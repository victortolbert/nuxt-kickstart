<template>
  <u-card
    class="animate-fade-in animate-delay-180"
    :ui="{
      root: 'sticky bottom-4 shadow-lg',
      body: 'p-4',
    }"
  >
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <!-- Left side - Copy action -->
      <div class="hidden sm:block">
        <u-button
          color="neutral"
          variant="ghost"
          size="md"
          :disabled="!hasContent"
          @click="emit('copy-jira')"
        >
          <template #leading>
            <u-icon :name="resolveIcon('clipboardText')" class="w-4 h-4"></u-icon>
          </template>
          Copy as Jira
        </u-button>
      </div>

      <!-- Right side - Main actions -->
      <div class="flex items-center gap-3 sm:ml-auto">
        <!-- Copy as Jira (mobile) -->
        <u-button
          class="sm:hidden"
          color="neutral"
          variant="ghost"
          size="md"
          :disabled="!hasContent"
          @click="emit('copy-jira')"
        >
          <template #leading>
            <u-icon :name="resolveIcon('clipboardText')" class="w-4 h-4"></u-icon>
          </template>
          <span class="sr-only">Copy as Jira</span>
        </u-button>

        <!-- Schedule -->
        <u-button
          color="neutral"
          size="lg"
          variant="outline"
          :disabled="!canSend || isScheduling"
          @click="emit('schedule')"
        >
          <template #leading>
            <u-icon :name="resolveIcon('clock')" class="w-4 h-4"></u-icon>
          </template>
          Schedule
          <u-kbd class="hidden lg:inline ml-2">
            ⇧⌘S
          </u-kbd>
        </u-button>

        <!-- Send Now -->
        <u-button
          color="primary"
          size="lg"
          :disabled="!canSend || isSending"
          :loading="isSending"
          @click="emit('send')"
        >
          <template #leading>
            <u-icon :name="resolveIcon('send')" class="w-4 h-4"></u-icon>
          </template>
          Send Now
          <u-kbd class="hidden lg:inline ml-2" variant="outline">
            ⌘↵
          </u-kbd>
        </u-button>
      </div>
    </div>
  </u-card>
</template>

<script setup lang="ts">
defineProps<{
  canSend: boolean
  isSending: boolean
  isScheduling: boolean
  hasContent: boolean
}>()

const emit = defineEmits<{
  'copy-jira': []
  'schedule': []
  'send': []
}>()

const { resolveIcon } = useAppearance()
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 250ms ease-out;
  animation-fill-mode: both;
}

.animate-delay-180 {
  animation-delay: 180ms;
}

@media (prefers-reduced-motion: reduce) {
  .animate-fade-in {
    animation: none;
    opacity: 1;
    transform: none;
  }
}
</style>
