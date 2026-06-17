<template>
  <div ref="cardRef" class="line-chart">
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
      :padding="{ top: 40 }"
      :style="{ height: `${height}px` }"
      :width="width"
    >
      <vis-line
        :x="x"
        :y="y"
        color="var(--ui-primary)"
      ></vis-line>
      <vis-area
        v-if="showArea"
        :x="x"
        :y="y"
        color="var(--ui-primary)"
        :opacity="0.1"
      ></vis-area>
      <vis-axis
        type="x"
        :x="x"
        :tick-format="xTicks"
      ></vis-axis>
      <vis-crosshair color="var(--ui-primary)" :template="template"></vis-crosshair>
      <vis-tooltip></vis-tooltip>
    </vis-x-y-container>
  </div>
</template>

<script setup lang="ts">
import { VisArea, VisAxis, VisCrosshair, VisLine, VisTooltip, VisXYContainer } from '@unovis/vue'

const props = withDefaults(defineProps<{
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

const cardRef = useTemplateRef<HTMLElement | null>('cardRef')

const { width } = useElementSize(cardRef)

// Unovis accessor functions
const x = (_: { label: string, value: number }, i: number) => i
const y = (d: { label: string, value: number }) => d.value

// Total value
const total = computed(() => props.data.reduce((acc, { value }) => acc + value, 0))

// Format number for display
const formatNumber = new Intl.NumberFormat('en').format

// X-axis tick formatter
function xTicks(i: number) {
  if (i === 0 || i === props.data.length - 1 || !props.data[i]) {
    return ''
  }
  return props.data[i].label
}

// Tooltip template
const template = (d: { label: string, value: number }) => `${d.label}: ${formatNumber(d.value)}`
</script>

<style scoped>
.line-chart :deep(.unovis-xy-container) {
  --vis-crosshair-line-stroke-color: var(--ui-primary);
  --vis-crosshair-circle-stroke-color: var(--ui-bg);
  --vis-axis-grid-color: var(--ui-border);
  --vis-axis-tick-color: var(--ui-border);
  --vis-axis-tick-label-color: var(--ui-text-dimmed);
  --vis-tooltip-background-color: var(--ui-bg);
  --vis-tooltip-border-color: var(--ui-border);
  --vis-tooltip-text-color: var(--ui-text-highlighted);
}
</style>
