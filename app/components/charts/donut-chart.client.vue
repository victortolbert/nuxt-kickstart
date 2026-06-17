<template>
  <div ref="containerRef" class="donut-chart">
    <div v-if="title" class="text-sm font-medium text-muted mb-4">
      {{ title }}
    </div>

    <div class="flex items-center gap-6">
      <div class="relative" :style="{ width: `${size}px`, height: `${size}px` }">
        <vis-single-container
          :data="data"
          :width="Math.min(width, size)"
          :height="size"
        >
          <vis-donut
            :value="value"
            :color="color"
            :arc-width="24"
            :corner-radius="4"
            :pad-angle="0.02"
          ></vis-donut>
        </vis-single-container>
        <!-- Center label -->
        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <span class="text-2xl font-bold">{{ formatNumber(total) }}</span>
          <span class="text-xs text-muted">Total</span>
        </div>
      </div>

      <!-- Legend -->
      <div v-if="showLegend" class="flex-1 space-y-2">
        <div
          v-for="item in data"
          :key="item.name"
          class="flex items-center justify-between gap-4"
        >
          <div class="flex items-center gap-2">
            <u-icon
              v-if="item.icon"
              :name="item.icon"
              class="size-4 shrink-0"
              :style="{ color: item.color }"
            ></u-icon>
            <div
              v-else
              class="size-3 rounded-full shrink-0"
              :style="{ backgroundColor: item.color }"
            />
            <span class="text-sm">{{ item.name }}</span>
          </div>
          <span class="font-medium tabular-nums">{{ item.value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { VisDonut, VisSingleContainer } from '@unovis/vue'

interface DonutDatum {
  name: string
  value: number
  color: string
  /** Optional resolved icon name (`i-*`) shown instead of the legend swatch. */
  icon?: string
}

const props = withDefaults(defineProps<{
  title?: string
  data: DonutDatum[]
  size?: number
  showLegend?: boolean
}>(), {
  title: '',
  size: 200,
  showLegend: true,
})

const containerRef = useTemplateRef<HTMLElement | null>('containerRef')

const { width } = useElementSize(containerRef)

// Accessor functions
const value = (d: DonutDatum) => d.value
const color = (d: DonutDatum) => d.color

// Calculate total
const total = computed(() => props.data.reduce((acc, d) => acc + d.value, 0))

// Format number
const formatNumber = new Intl.NumberFormat('en').format
</script>

<style scoped>
.donut-chart :deep(.unovis-single-container) {
  overflow: visible;
}
</style>
