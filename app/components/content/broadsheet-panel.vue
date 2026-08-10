<template>
  <div class="bs-panel">
    <div v-if="label || path || $slots.label" class="bs-panel-head">
      <slot name="label">
        <span>{{ label }}</span>
      </slot>
      <span v-if="path" class="path">{{ path }}</span>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
/**
 * Bordered box with a label strip. The building block of the broadsheet layout.
 *
 * ::broadsheet-panel{label="Emitted event" path="pretty mode · dev default"}
 * ```ts
 * const log = useLogger(event)
 * ```
 * ::
 */
defineProps<{
  /** Uppercase mono label, left of the strip. */
  label?: string
  /** Dimmed file path or qualifier, right of the strip. */
  path?: string
}>()
</script>
