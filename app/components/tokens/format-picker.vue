<template>
  <div class="space-y-6">
    <!-- Helium-specific formats (shown first when Helium detected) -->
    <div v-if="heliumFormats.length > 0">
      <h3
        class="mb-3 text-sm font-medium flex items-center gap-2"
        :style="{ color: 'var(--ui-text)' }"
      >
        <u-icon :name="resolveIcon('star')" class="text-amber-500"></u-icon>
        Helium (Recommended)
      </h3>
      <div class="space-y-2 p-3 rounded-lg border-2 border-amber-500/30 bg-amber-500/5">
        <label
          v-for="format in heliumFormats"
          :key="format.id"
          :for="`helium-${format.id}`"
          class="flex items-start gap-3 cursor-pointer group"
          :class="{ 'opacity-50 cursor-not-allowed': disabled }"
        >
          <u-checkbox
            :id="`helium-${format.id}`"
            :model-value="isSelected(format.id)"
            :disabled="disabled"
            @update:model-value="toggleFormat(format.id)"
          ></u-checkbox>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <span
                class="text-sm font-medium"
                :style="{ color: 'var(--ui-text)' }"
              >
                {{ format.label }}
              </span>
              <u-badge
                size="sm"
                color="warning"
                variant="subtle"
              >
                Helium
              </u-badge>
            </div>
            <p
              class="text-xs mt-0.5"
              :style="{ color: 'var(--ui-text-muted)' }"
            >
              {{ format.description }}
            </p>
          </div>
        </label>
      </div>
    </div>

    <!-- Standard formats by category -->
    <div
      v-for="(categoryFormats, category) in formatsByCategory"
      :key="category"
    >
      <h3
        v-if="categoryFormats.length > 0"
        class="mb-3 text-sm font-medium"
        :style="{ color: 'var(--ui-text)' }"
      >
        {{ categoryLabels[category] }}
      </h3>
      <div class="space-y-2">
        <label
          v-for="format in categoryFormats"
          :key="format.id"
          :for="`format-${format.id}`"
          class="flex items-start gap-3 cursor-pointer group"
          :class="{ 'opacity-50 cursor-not-allowed': disabled }"
        >
          <u-checkbox
            :id="`format-${format.id}`"
            :model-value="isSelected(format.id)"
            :disabled="disabled"
            @update:model-value="toggleFormat(format.id)"
          ></u-checkbox>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <span
                class="text-sm font-medium"
                :style="{ color: 'var(--ui-text)' }"
              >
                {{ format.label }}
              </span>
              <u-tooltip
                v-if="format.description"
                :text="format.description"
              >
                <u-icon
                  :name="resolveIcon('info')"
                  class="text-sm"
                  :style="{ color: 'var(--ui-text-muted)' }"
                ></u-icon>
              </u-tooltip>
            </div>
            <p
              class="text-xs mt-0.5"
              :style="{ color: 'var(--ui-text-muted)' }"
            >
              {{ format.description }}
            </p>
          </div>
        </label>
      </div>
    </div>

    <div
      v-if="availableFormats.length === 0"
      class="text-sm text-center py-8"
      :style="{ color: 'var(--ui-text-muted)' }"
    >
      No formats available
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormatConfig } from '#shared/data/style-dictionary-formats'
import { getAvailableFormats } from '#shared/data/style-dictionary-formats'

interface Props {
  modelValue: string[]
  disabled?: boolean
  isHeliumFormat?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string[]): void
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  isHeliumFormat: false,
})

const emit = defineEmits<Emits>()

const { resolveIcon } = useAppearance()

// Get available formats based on token format
const availableFormats = computed(() => getAvailableFormats(props.isHeliumFormat))

// Helium-specific formats (shown first when Helium format detected)
const heliumFormats = computed(() => {
  if (!props.isHeliumFormat)
    return []
  return availableFormats.value.filter(f => f.heliumOnly)
})

// Non-Helium formats grouped by category
const formatsByCategory = computed(() => {
  const categories: Record<FormatConfig['category'], FormatConfig[]> = {
    web: [],
    ios: [],
    android: [],
    data: [],
  }

  // Filter out Helium-only formats when showing by category (they're shown separately)
  const formatsToGroup = props.isHeliumFormat
    ? availableFormats.value.filter(f => !f.heliumOnly)
    : availableFormats.value

  formatsToGroup.forEach((format) => {
    categories[format.category].push(format)
  })

  return categories
})

// Category labels for display
const categoryLabels: Record<string, string> = {
  web: 'Web',
  ios: 'iOS',
  android: 'Android',
  data: 'Data',
}

// Check if a format is selected
function isSelected(formatId: string): boolean {
  return props.modelValue.includes(formatId)
}

// Toggle format selection
function toggleFormat(formatId: string) {
  if (props.disabled)
    return

  const currentValue = [...props.modelValue]
  const index = currentValue.indexOf(formatId)

  if (index > -1) {
    currentValue.splice(index, 1)
  }
  else {
    currentValue.push(formatId)
  }

  emit('update:modelValue', currentValue)
}
</script>
