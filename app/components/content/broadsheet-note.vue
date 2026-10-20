<template>
  <div class="bs-note" :class="{ caution }">
    <span class="bs-note-label">{{ label }}</span>
    <div class="bs-note-body">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * A labeled box — deliberately not a left-stripe card. The inset accent stripe
 * reads as "active row" elsewhere in this design system, so the label gets its
 * own header strip instead.
 *
 * ::broadsheet-note{label="The key habit"}
 * `log.set()` merges — call it five times and you still get one event.
 * ::
 */
withDefaults(defineProps<{
  label?: string
  /** Turns the label warn-colored. For things that bite in production. */
  caution?: boolean
}>(), {
  label: 'Note',
  caution: false,
})
</script>
