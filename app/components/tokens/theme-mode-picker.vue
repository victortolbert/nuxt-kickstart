<template>
  <fieldset class="theme-mode-picker">
    <legend class="block text-sm font-medium mb-2" style="color: var(--ui-text)">
      Theme Output Mode
    </legend>

    <div class="space-y-2">
      <div
        v-for="option in options"
        :key="option.value"
        class="flex items-start gap-3"
      >
        <input
          :id="`theme-mode-${option.value}`"
          type="radio"
          :value="option.value"
          :checked="modelValue === option.value"
          :disabled="disabled"
          class="mt-1 h-4 w-4 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          style="accent-color: var(--color-primary-500)"
          @change="handleUpdate(option.value)"
        >
        <label
          :for="`theme-mode-${option.value}`"
          class="flex-1 cursor-pointer disabled:cursor-not-allowed"
          :class="{ 'opacity-50': disabled }"
        >
          <div class="flex items-center gap-2">
            <span class="font-medium" style="color: var(--ui-text)">
              {{ option.label }}
            </span>
            <u-tooltip :text="option.description">
              <u-icon
                :name="resolveIcon('info')"
                class="h-4 w-4"
                style="color: var(--ui-text-muted)"
              ></u-icon>
            </u-tooltip>
          </div>
          <p class="text-sm mt-1" style="color: var(--ui-text-muted)">
            {{ option.description }}
          </p>
        </label>
      </div>
    </div>
  </fieldset>
</template>

<script setup lang="ts">
import type { ThemeOutputMode } from '#shared/data/style-dictionary-formats'
import { themeOutputModes } from '#shared/data/style-dictionary-formats'

interface Props {
  modelValue: ThemeOutputMode
  disabled?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: ThemeOutputMode): void
}

withDefaults(defineProps<Props>(), {
  disabled: false,
})

const emit = defineEmits<Emits>()

const { resolveIcon } = useAppearance()

const options = Object.entries(themeOutputModes).map(([value, config]) => ({
  value: value as ThemeOutputMode,
  label: config.label,
  description: config.description,
}))

function handleUpdate(value: ThemeOutputMode) {
  emit('update:modelValue', value)
}
</script>

<style scoped>
.theme-mode-picker {
  padding: 0.5rem 0;
  /* Reset native <fieldset> chrome so the group renders like a plain block */
  border: 0;
  margin: 0;
  min-inline-size: 0;
}
</style>
