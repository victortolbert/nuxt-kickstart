<template>
  <span class="inline-flex items-center gap-0.5 align-middle">
    <u-kbd
      v-for="(key, i) in keys"
      :key="i"
      :value="key"
      variant="subtle"
    ></u-kbd>
  </span>
</template>

<script setup lang="ts">
/**
 * Render a keyboard shortcut in MDC content using Nuxt UI's `UKbd`, matching the
 * sidebar command-palette styling (subtle variant). Pass keys separated by
 * space, `+`, or `_`. Named modifiers are platform-aware (`meta` → ⌘ on macOS,
 * Ctrl elsewhere).
 *
 * Usage in markdown: `:kbd-keys{value="meta_k"}` → ⌘ K
 */
const props = defineProps<{ value: string }>()

const keys = computed(() => props.value.split(/[\s+_]+/).filter(Boolean))
</script>
