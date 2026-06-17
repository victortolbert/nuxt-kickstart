<template>
  <div class="donut-chart-placeholder">
    <div v-if="title" class="text-sm font-medium text-muted mb-4">
      {{ title }}
    </div>

    <div class="flex items-center gap-6">
      <div
        class="rounded-full bg-muted/10 animate-pulse"
        :style="{ width: `${size}px`, height: `${size}px` }"
      />

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
          <span class="font-medium">---</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  data: { name: string, value: number, color: string, icon?: string }[]
  size?: number
  showLegend?: boolean
}>(), {
  title: '',
  size: 200,
  showLegend: true,
})
</script>
