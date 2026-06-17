<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <u-tabs
        v-model="activeTab"
        :items="[
          { value: 'upload', label: 'Upload', icon: resolveIcon('upload') },
          { value: 'url', label: 'URL', icon: resolveIcon('link') },
          { value: 'paste', label: 'Paste', icon: resolveIcon('clipboard') },
        ]"
        :content="false"
      ></u-tabs>

      <u-badge
        v-if="tokens && detectedFormat !== 'unknown'"
        :color="getFormatBadgeColor(detectedFormat)"
        variant="subtle"
        size="sm"
      >
        {{ getFormatLabel(detectedFormat) }}
      </u-badge>
    </div>

    <div>
      <div v-show="activeTab === 'upload'">
        <tokens-drop-zone
          @file-selected="handleFileSelected"
          @error="handleFileError"
        ></tokens-drop-zone>
        <u-alert
          v-if="uploadError"
          color="warning"
          variant="soft"
          :title="uploadError"
          :close-button="{ icon: resolveIcon('close'), color: 'warning', variant: 'ghost' }"
          class="mt-4"
          @close="uploadError = null"
        ></u-alert>
      </div>

      <div v-show="activeTab === 'url'">
        <tokens-url-input
          v-model="urlValue"
          :loading="urlLoading"
          @fetch="handleUrlFetch"
        ></tokens-url-input>
      </div>

      <div v-show="activeTab === 'paste'">
        <tokens-json-editor
          :model-value="pasteContent"
          @update:model-value="handlePasteChange"
        ></tokens-json-editor>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UiColor } from '#shared/types/appearance'

defineProps<{
  tokens: object | null
  detectedFormat: string
}>()

const emit = defineEmits<{
  tokensLoaded: [payload: {
    tokens: object
    source: 'upload' | 'url' | 'paste'
    format: string
    metadata?: { brand?: string, franchise?: string }
  }]
}>()

const { resolveIcon } = useAppearance()

// Error state for displaying validation/parse errors
const uploadError = ref<string | null>(null)

const activeTab = ref<'upload' | 'url' | 'paste'>('upload')
const pasteContent = ref('')
const urlValue = ref('')
const urlLoading = ref(false)

async function handleFileSelected(file: File) {
  uploadError.value = null

  try {
    const text = await file.text()
    const tokens = JSON.parse(text)

    // Validate and detect format via API
    const response = await $fetch('/api/tokens/validate', {
      method: 'POST',
      body: { tokens: text },
    })

    // Type guard: check if response is successful
    if ('valid' in response) {
      // Emit tokens even if there are validation warnings - they're still usable
      emit('tokensLoaded', {
        tokens,
        source: 'upload',
        format: response.format,
        metadata: response.metadata,
      })

      // Show validation errors as warnings if any
      if (!response.valid && response.errors?.length > 0) {
        uploadError.value = `Validation warnings: ${response.errors.slice(0, 3).map(e => e.message).join(', ')}`
      }
    }
    else if ('error' in response) {
      uploadError.value = response.error as string
    }
  }
  catch (error) {
    uploadError.value = error instanceof Error ? error.message : 'Failed to parse JSON file'
  }
}

function handleFileError(errorMessage: string) {
  console.error('File error:', errorMessage)
}

async function handleUrlFetch() {
  if (!urlValue.value || urlLoading.value)
    return

  try {
    urlLoading.value = true

    // Fetch URL content via proxy
    const fetchResponse = await $fetch('/api/tokens/fetch-url', {
      method: 'POST',
      body: { url: urlValue.value },
    })

    // Type guard: check if fetch was successful
    if ('content' in fetchResponse) {
      // Parse and validate tokens
      const tokens = JSON.parse(fetchResponse.content)
      const validateResponse = await $fetch('/api/tokens/validate', {
        method: 'POST',
        body: { tokens },
      })

      // Type guard: check if validation was successful
      if ('valid' in validateResponse && validateResponse.valid) {
        emit('tokensLoaded', {
          tokens,
          source: 'url',
          format: validateResponse.format,
          metadata: validateResponse.metadata,
        })
      }
    }
  }
  catch (_error) {
    // Error handled silently - validation shown in UI
  }
  finally {
    urlLoading.value = false
  }
}

async function handlePasteChange(value: string) {
  pasteContent.value = value

  // Don't validate empty content
  if (!value.trim())
    return

  try {
    const tokens = JSON.parse(value)

    // Validate and detect format via API
    const response = await $fetch('/api/tokens/validate', {
      method: 'POST',
      body: { tokens: value },
    })

    // Type guard: check if validation was successful
    if ('valid' in response && response.valid) {
      emit('tokensLoaded', {
        tokens,
        source: 'paste',
        format: response.format,
        metadata: response.metadata,
      })
    }
  }
  catch {
    // Silent fail - validation error will be shown by JsonEditor
  }
}

function getFormatBadgeColor(format: string): UiColor {
  switch (format) {
    case 'dtcg': return 'primary'
    case 'legacy': return 'neutral'
    case 'helium': return 'info'
    default: return 'neutral'
  }
}

function getFormatLabel(format: string): string {
  switch (format) {
    case 'dtcg': return 'DTCG'
    case 'legacy': return 'Legacy'
    case 'helium': return 'Helium'
    default: return 'Unknown'
  }
}
</script>
