<template>
  <div class="bs-compare">
    <div class="bs-panel">
      <div class="bs-panel-head">
        <span class="bs-tag now">{{ nowLabel }}</span>
        <span v-if="nowPath || path" class="path">{{ nowPath || path }}</span>
      </div>
      <slot name="now" />
    </div>

    <div class="bs-panel">
      <div class="bs-panel-head">
        <span class="bs-tag next">{{ nextLabel }}</span>
        <span v-if="nextPath || path" class="path">{{ nextPath || path }}</span>
      </div>
      <slot name="next" />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Before / after two-up. Reach for this instead of prose describing a
 * difference — the diff is the argument.
 *
 * ::broadsheet-compare{now-label="Today" next-label="With a logger" path="run-scan.ts"}
 *   :::div{#now}
 *   ```ts
 *   console.error('Failed to persist scan:', err)
 *   ```
 *   :::
 *   :::div{#next}
 *   ```ts
 *   log.error(err)
 *   ```
 *   :::
 * ::
 */
withDefaults(defineProps<{
  nowLabel?: string
  nextLabel?: string
  /** File path shown on both strips. Use nowPath/nextPath when they differ. */
  path?: string
  nowPath?: string
  nextPath?: string
}>(), {
  nowLabel: 'Today',
  nextLabel: 'After',
})
</script>
