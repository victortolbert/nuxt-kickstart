<template>
  <span class="inline-flex items-center gap-1 whitespace-nowrap align-middle">
    <u-icon
      :name="icon"
      :class="size === 'md' ? 'size-4' : 'size-3.5'"
      :style="{ color: colorVar }"
    ></u-icon>
    <span :class="size === 'md' ? 'text-sm' : 'text-xs'">{{ displayLabel }}</span>
  </span>
</template>

<script setup lang="ts">
/**
 * Subtle content-status indicator: a color-carrying icon + plain text label
 * (no badge pill). Color/icon come from the garden-status source of truth
 * (app/utils/garden-status.ts), so it stays consistent with filters + charts.
 */
const props = withDefaults(defineProps<{
  status?: string | null
  /** Optional label override (e.g. i18n). Defaults to formatLabel(status). */
  label?: string
  size?: 'sm' | 'md'
}>(), {
  size: 'sm',
})

const { resolveIcon } = useAppearance()

const icon = computed(() => resolveIcon(gardenStatus(props.status).icon))
const colorVar = computed(() => gardenStatusColorVar(props.status))
const displayLabel = computed(() =>
  props.label ?? (props.status ? formatLabel(props.status) : ''),
)
</script>
