<template>
  <div ref="containerRef" class="bar-chart">
    <div v-if="title || subtitle" class="mb-4">
      <p v-if="subtitle" class="text-xs text-muted uppercase mb-1">
        {{ subtitle }}
      </p>
      <p v-if="title" class="text-3xl text-highlighted font-semibold">
        {{ title }}
      </p>
      <p v-else class="text-3xl text-highlighted font-semibold">
        {{ formatNumber(total) }}
      </p>
    </div>

    <vis-x-y-container
      :data="data"
      :padding="{ top: 20 }"
      :style="{ height: `${height}px` }"
      :width="width"
    >
      <vis-stacked-bar
        :x="x"
        :y="y"
        color="var(--ui-primary)"
        :bar-padding="0.2"
        :rounded-corners="4"
        :orientation="horizontal ? 'horizontal' : 'vertical'"
      ></vis-stacked-bar>
      <vis-axis
        type="x"
        :x="x"
        :tick-format="xTicks"
      ></vis-axis>
      <vis-axis type="y"></vis-axis>
      <vis-tooltip></vis-tooltip>
    </vis-x-y-container>
  </div>
</template>

<script setup lang="ts">
import { VisAxis, VisStackedBar, VisTooltip, VisXYContainer } from '@unovis/vue'

const props = withDefaults(defineProps<{
  title?: string
  subtitle?: string
  data: { label: string, value: number }[]
  height?: number
  horizontal?: boolean
}>(), {
  title: '',
  subtitle: '',
  height: 256,
  horizontal: false,
})

const containerRef = useTemplateRef<HTMLElement | null>('containerRef')

const { width } = useElementSize(containerRef)

// Accessor functions
const x = (_: { label: string, value: number }, i: number) => i
const y = (d: { label: string, value: number }) => d.value

// Total
const total = computed(() => props.data.reduce((acc, { value }) => acc + value, 0))

// Format number
const formatNumber = new Intl.NumberFormat('en').format

// X-axis tick formatter
function xTicks(i: number) {
  if (!props.data[i])
    return ''
  return props.data[i].label
}
</script>

<style scoped>
.bar-chart :deep(.unovis-xy-container) {
  --vis-axis-grid-color: var(--ui-border);
  --vis-axis-tick-color: var(--ui-border);
  --vis-axis-tick-label-color: var(--ui-text-dimmed);
  --vis-tooltip-background-color: var(--ui-bg);
  --vis-tooltip-border-color: var(--ui-border);
  --vis-tooltip-text-color: var(--ui-text-highlighted);
}
</style>
