<template>
  <!-- Only show if format has any configurable options -->
  <div v-if="hasAnyOptions" class="format-options">
    <button
      type="button"
      class="format-options-toggle"
      @click="isOpen = !isOpen"
    >
      <u-icon
        :name="isOpen ? resolveIcon('chevronDown') : resolveIcon('chevronRight')"
        class="h-4 w-4 transition-transform"
      ></u-icon>
      <span class="font-medium">Format Options</span>
      <span class="text-sm" style="color: var(--ui-text-muted)">
        {{ formatConfig?.label || formatId }}
      </span>
    </button>

    <div v-show="isOpen" class="format-options-panel">
      <!-- Prefix option -->
      <div v-if="supportsPrefix" class="option-group">
        <label class="option-label" for="format-opt-prefix">
          <span>Prefix</span>
          <u-tooltip text="Add a prefix to all token names (e.g., 'ds' produces --ds-token-name)">
            <u-icon
              :name="resolveIcon('info')"
              class="h-4 w-4"
              style="color: var(--ui-text-muted)"
            ></u-icon>
          </u-tooltip>
        </label>
        <u-input
          id="format-opt-prefix"
          v-model="prefix"
          placeholder="e.g., token, ds"
          @update:model-value="debouncedUpdateOptions"
          @blur="updateOptions"
        ></u-input>
      </div>

      <!-- Output References option -->
      <div v-if="supportsOutputReferences" class="option-group">
        <div class="option-label">
          <u-checkbox
            v-model="outputReferences"
            label="Output References"
            @update:model-value="updateOptions"
          ></u-checkbox>
          <u-tooltip text="Use variable references instead of raw values where possible">
            <u-icon
              :name="resolveIcon('info')"
              class="h-4 w-4"
              style="color: var(--ui-text-muted)"
            ></u-icon>
          </u-tooltip>
        </div>
      </div>

      <!-- CSS Selector option -->
      <div v-if="supportsSelector" class="option-group">
        <label class="option-label" for="format-opt-selector">
          <span>CSS Selector</span>
          <u-tooltip text="The CSS selector to use for variables (e.g., :root, .theme)">
            <u-icon
              :name="resolveIcon('info')"
              class="h-4 w-4"
              style="color: var(--ui-text-muted)"
            ></u-icon>
          </u-tooltip>
        </label>
        <u-input
          id="format-opt-selector"
          v-model="selector"
          placeholder=":root"
          @update:model-value="debouncedUpdateOptions"
          @blur="updateOptions"
        ></u-input>
      </div>

      <!-- Theme mode picker for Helium format -->
      <div v-if="supportsThemeMode" class="option-group">
        <tokens-theme-mode-picker
          v-model="themeMode"
          @update:model-value="updateOptions"
        ></tokens-theme-mode-picker>
      </div>

      <!-- Reset button -->
      <div class="option-group">
        <u-button
          variant="outline"
          size="sm"
          :icon="resolveIcon('reload')"
          @click="resetToDefaults"
        >
          Reset to Defaults
        </u-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormatOptions } from '#shared/data/style-dictionary-formats'
import { formatOptions as defaultFormatOptions, getFormatById } from '#shared/data/style-dictionary-formats'

interface Props {
  formatId: string
  modelValue: FormatOptions
  isHeliumFormat?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: FormatOptions): void
}

const props = withDefaults(defineProps<Props>(), {
  isHeliumFormat: false,
})

const emit = defineEmits<Emits>()

const { resolveIcon } = useAppearance()

const isOpen = ref(false)

// Get format configuration
const formatConfig = computed(() => getFormatById(props.formatId))

// Check which options the format supports
const supportedOptions = computed(() => formatConfig.value?.supportedOptions || {})
const supportsPrefix = computed(() => supportedOptions.value.prefix === true)
const supportsSelector = computed(() => supportedOptions.value.selector === true)
const supportsOutputReferences = computed(() => supportedOptions.value.outputReferences === true)
const supportsThemeMode = computed(() => supportedOptions.value.themeMode === true)

// Check if any options are available for this format
const hasAnyOptions = computed(() => {
  return supportsPrefix.value || supportsSelector.value || supportsOutputReferences.value || supportsThemeMode.value
})

// Local state for form inputs
const prefix = ref(props.modelValue.prefix || '')
const outputReferences = ref(props.modelValue.outputReferences ?? true)
const selector = ref(props.modelValue.selector || ':root')
const themeMode = ref(props.modelValue.themeMode || 'nested')

// Watch for external changes to modelValue
watch(() => props.modelValue, (newValue) => {
  prefix.value = newValue.prefix || ''
  outputReferences.value = newValue.outputReferences ?? true
  selector.value = newValue.selector || ':root'
  themeMode.value = newValue.themeMode || 'nested'
}, { deep: true })

// Debounced update for text inputs
let debounceTimeout: ReturnType<typeof setTimeout> | null = null
function debouncedUpdateOptions() {
  if (debounceTimeout) {
    clearTimeout(debounceTimeout)
  }
  debounceTimeout = setTimeout(() => {
    updateOptions()
  }, 300)
}

// Emit updates when local state changes
function updateOptions() {
  const options: FormatOptions = {}

  if (supportsOutputReferences.value) {
    options.outputReferences = outputReferences.value
  }

  if (supportsPrefix.value && prefix.value.trim()) {
    options.prefix = prefix.value.trim()
  }

  if (supportsSelector.value && selector.value.trim()) {
    options.selector = selector.value.trim()
  }

  if (supportsThemeMode.value) {
    options.themeMode = themeMode.value
  }

  emit('update:modelValue', options)
}

// Reset to default values for the current format
function resetToDefaults() {
  const defaults = defaultFormatOptions[props.formatId] || {}
  prefix.value = defaults.prefix || ''
  outputReferences.value = defaults.outputReferences ?? true
  selector.value = defaults.selector || ':root'
  themeMode.value = defaults.themeMode || 'nested'
  updateOptions()
}
</script>

<style scoped>
.format-options {
  border: 1px solid var(--ui-border);
  border-radius: 0.5rem;
  overflow: hidden;
}

.format-options-toggle {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--ui-bg);
  color: var(--ui-text);
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.format-options-toggle:hover {
  background: var(--ui-bg-elevated);
}

.format-options-panel {
  padding: 1rem;
  background: var(--ui-bg);
  border-top: 1px solid var(--ui-border);
}

.option-group {
  margin-bottom: 1rem;
}

.option-group:last-child {
  margin-bottom: 0;
}

.option-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--ui-text);
}
</style>
