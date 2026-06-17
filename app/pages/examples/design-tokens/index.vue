<template>
  <u-container>
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold">
            Design Tokens Transformer
          </h1>
          <p class="mt-2 text-muted">
            Transform Design Tokens JSON files into platform-specific output formats
          </p>
        </div>
        <u-button
          :icon="resolveIcon('help')"
          variant="ghost"
          to="/guides/design-tokens"
          target="_blank"
        >
          Help
        </u-button>
      </div>
    </div>

    <!-- Error Display -->
    <u-alert
      v-if="error"
      color="error"
      variant="soft"
      :title="error"
      :close-button="{ icon: resolveIcon('close'), color: 'error', variant: 'ghost' }"
      class="mb-6"
      @close="error = null"
    ></u-alert>

    <!-- Main Content: Two-column layout on large screens, stacked on mobile -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- Left Column: Input -->
      <u-card>
        <template #header>
          <h2 class="text-lg font-semibold">
            Input
          </h2>
        </template>

        <div class="space-y-4">
          <tokens-input-tabs
            :tokens="tokens"
            :detected-format="detectedFormat"
            @tokens-loaded="handleTokensLoaded"
          ></tokens-input-tabs>

          <!-- Metadata Display (Helium format only) -->
          <tokens-metadata-display
            v-if="isHeliumFormat && metadata"
            :metadata="metadata"
          ></tokens-metadata-display>

          <!-- Token Structure Tree -->
          <div v-if="tokens" class="mt-4">
            <div class="mb-2 flex items-center justify-between">
              <h3 class="text-sm font-medium">
                Token Structure
              </h3>
            </div>
            <tokens-token-tree
              :tokens="tokens as Record<string, unknown>"
              :expanded="false"
            ></tokens-token-tree>
          </div>
        </div>
      </u-card>

      <!-- Right Column: Output -->
      <u-card>
        <template #header>
          <h2 class="text-lg font-semibold">
            Output
          </h2>
        </template>

        <div class="space-y-4">
          <!-- Format Picker -->
          <div>
            <p class="mb-2 block text-sm font-medium">
              Select Output Formats
            </p>
            <tokens-format-picker
              v-model="selectedFormats"
              :disabled="!tokens"
              :is-helium-format="isHeliumFormat"
            ></tokens-format-picker>
          </div>

          <!-- Format Options (for first selected format) -->
          <tokens-format-options
            v-if="selectedFormats.length > 0 && selectedFormats[0]"
            v-model="firstFormatOptions"
            :format-id="selectedFormats[0]"
            :is-helium-format="isHeliumFormat"
          ></tokens-format-options>

          <!-- Style Dictionary Toggle -->
          <div class="flex items-center justify-between rounded-lg border border-dashed p-3" style="border-color: var(--ui-border)">
            <div class="flex items-center gap-2">
              <u-icon
                :name="resolveIcon('wand')"
                class="h-5 w-5"
                style="color: var(--ui-text-muted)"
              ></u-icon>
              <div>
                <p class="text-sm font-medium">
                  Use Style Dictionary
                </p>
                <p class="text-xs" style="color: var(--ui-text-muted)">
                  Transform using Amazon Style Dictionary library
                </p>
              </div>
            </div>
            <u-switch v-model="useStyleDictionary"></u-switch>
          </div>

          <!-- Output Preview (Tabbed for multiple formats) -->
          <div>
            <p class="mb-2 block text-sm font-medium">
              Preview
            </p>
            <tokens-output-preview-tabs
              :files="files"
              :selected-formats="selectedFormats"
              :loading="loading"
              :error="error"
            ></tokens-output-preview-tabs>
          </div>

          <!-- Transform Button -->
          <u-button
            v-if="tokens && selectedFormats.length > 0"
            :loading="loading"
            :disabled="!tokens || selectedFormats.length === 0"
            color="primary"
            block
            @click="transform"
          >
            Transform All Formats
          </u-button>

          <!-- Download Button -->
          <tokens-download-button
            :files="files"
            :disabled="!files.length || loading"
          ></tokens-download-button>
        </div>
      </u-card>
    </div>

    <!-- Footer: History and Saved Configs -->
    <div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
      <u-card>
        <tokens-history-panel @restore="handleHistoryRestore"></tokens-history-panel>
      </u-card>

      <u-card>
        <tokens-config-manager
          :formats="selectedFormats"
          :options="options"
          :disabled="!tokens || selectedFormats.length === 0"
          @load="handleConfigLoad"
        ></tokens-config-manager>
      </u-card>
    </div>
  </u-container>
</template>

<script setup lang="ts">
import type { SavedConfig } from '~/composables/use-token-configs'
import type { HistoryEntry } from '~/composables/use-token-history'
import { getDefaultHeliumFormat } from '#shared/data/style-dictionary-formats'
import { countTokens } from '#shared/utils/token-parser'

definePageMeta({
  title: 'Design Tokens Transformer',
  description: 'Transform Design Tokens JSON files into platform-specific output formats',
})

useSeoMeta({
  title: 'Design Tokens Transformer',
  description: 'Transform Design Tokens JSON files into platform-specific output formats (CSS, SCSS, iOS, Android, JS/TS, Tailwind) with live preview',
})

const {
  tokens,
  selectedFormats,
  options,
  files,
  loading,
  error,
  metadata,
  detectedFormat,
  isHeliumFormat,
  useStyleDictionary,
  transform,
  validateTokens,
} = useTokenTransformer()

const { addEntry: addHistoryEntry } = useTokenHistory()
const { resolveIcon } = useAppearance()

// Track the current source for history entries
const currentSource = ref<'upload' | 'url' | 'paste' | 'example'>('paste')

// Ensure options are initialized for selected formats
watch(selectedFormats, (newFormats) => {
  newFormats.forEach((formatId) => {
    if (!options.value[formatId]) {
      options.value[formatId] = {}
    }
  })
}, { immediate: true })

// Computed writable ref for format options to handle undefined
const firstFormatOptions = computed({
  get: () => {
    const formatId = selectedFormats.value[0]
    if (!formatId)
      return {}
    return options.value[formatId] || {}
  },
  set: (value) => {
    const formatId = selectedFormats.value[0]
    if (formatId) {
      options.value[formatId] = value
    }
  },
})

// Handle tokens loaded from input tabs
async function handleTokensLoaded(payload: { tokens: object, source: string, format: string, metadata?: object }) {
  tokens.value = payload.tokens
  detectedFormat.value = payload.format as 'dtcg' | 'legacy' | 'helium' | 'unknown'

  // Map source string to HistoryEntry source type
  const sourceMap: Record<string, 'upload' | 'url' | 'paste' | 'example'> = {
    file: 'upload',
    url: 'url',
    paste: 'paste',
    example: 'example',
  }
  currentSource.value = sourceMap[payload.source] || 'paste'

  if (payload.metadata) {
    metadata.value = payload.metadata as { brand?: string, franchise?: string }
  }

  // Auto-select Helium format when Helium tokens are detected
  if (payload.format === 'helium') {
    const defaultHeliumFormat = getDefaultHeliumFormat()
    if (!selectedFormats.value.includes(defaultHeliumFormat)) {
      selectedFormats.value = [defaultHeliumFormat, ...selectedFormats.value.filter(f => f !== defaultHeliumFormat)]
    }
  }

  // Auto-validate tokens
  await validateTokens(payload.tokens)
}

// Watch for successful transformation and add to history
watch(files, (newFiles) => {
  if (newFiles.length > 0 && tokens.value) {
    addHistoryEntry({
      source: currentSource.value,
      formats: selectedFormats.value,
      tokenCount: countTokens(tokens.value),
      format: detectedFormat.value,
    })
  }
})

// Handle restoring from history
function handleHistoryRestore(entry: HistoryEntry) {
  // Note: History entries don't store tokens, only metadata about transformations
  // This just restores the format selection for now
  selectedFormats.value = [...entry.formats]
}

// Handle loading saved config
function handleConfigLoad(config: SavedConfig) {
  selectedFormats.value = [...config.formats]
  options.value = JSON.parse(JSON.stringify(config.options)) // Deep clone
}
</script>
