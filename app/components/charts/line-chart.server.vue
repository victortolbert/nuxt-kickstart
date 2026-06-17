<template>
  <div class="line-chart-placeholder">
    <div v-if="title || subtitle" class="mb-4">
      <p v-if="subtitle" class="text-xs text-muted uppercase mb-1">
        {{ subtitle }}
      </p>
      <p class="text-3xl text-highlighted font-semibold">
        ---
      </p>
    </div>
    <div
      class="bg-muted/10 rounded animate-pulse"
      :style="{ height: `${height}px` }"
    />
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  subtitle?: string
  data: { label: string, value: number }[]
  showArea?: boolean
  height?: number
}>(), {
  title: '',
  subtitle: '',
  showArea: true,
  height: 256,
})
</script>
