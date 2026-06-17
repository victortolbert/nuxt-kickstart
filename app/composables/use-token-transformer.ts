import type { FormatOptions } from '#shared/data/style-dictionary-formats'
import { computed, ref, watch } from 'vue'

export interface TokenMetadata {
  brand?: string
  franchise?: string
}

export interface TransformFile {
  filename: string
  content: string
  format: string
}

export function useTokenTransformer() {
  // State
  const tokens = ref<object | null>(null)
  const selectedFormats = ref<string[]>([])
  const options = ref<Record<string, FormatOptions>>({})
  const preview = ref<string>('')
  const files = ref<TransformFile[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const metadata = ref<TokenMetadata | null>(null)
  const detectedFormat = ref<'dtcg' | 'legacy' | 'helium' | 'unknown'>('unknown')
  /** Use Style Dictionary library for transformation instead of custom transformers */
  const useStyleDictionary = ref(false)

  // Computed
  const isHeliumFormat = computed(() => detectedFormat.value === 'helium')

  // Update preview for selected formats (transforms all for tabbed preview)
  const updatePreview = async () => {
    if (!tokens.value || selectedFormats.value.length === 0) {
      preview.value = ''
      files.value = []
      return
    }

    loading.value = true
    error.value = null

    try {
      // Transform all selected formats for tabbed preview
      const response = await $fetch<{ files: TransformFile[] } | { error: string }>('/api/tokens/transform', {
        method: 'POST',
        body: {
          tokens: tokens.value,
          formats: selectedFormats.value,
          options: options.value,
          useStyleDictionary: useStyleDictionary.value,
          metadata: metadata.value,
        },
      })

      if ('error' in response) {
        error.value = response.error
        preview.value = ''
        files.value = []
      }
      else {
        files.value = response.files
        // Keep preview for backwards compatibility
        if (response.files && response.files.length > 0 && response.files[0]) {
          preview.value = response.files[0].content
        }
      }
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to transform tokens'
      preview.value = ''
      files.value = []
    }
    finally {
      loading.value = false
    }
  }

  // Debounced preview update
  let previewTimeout: ReturnType<typeof setTimeout> | null = null
  const schedulePreviewUpdate = () => {
    if (previewTimeout) {
      clearTimeout(previewTimeout)
    }
    previewTimeout = setTimeout(async () => {
      await updatePreview()
    }, 300)
  }

  // Transform tokens for all selected formats
  const transform = async () => {
    if (!tokens.value || selectedFormats.value.length === 0) {
      error.value = 'Please load tokens and select at least one format'
      return
    }

    loading.value = true
    error.value = null
    files.value = []

    try {
      const response = await $fetch<{ files: TransformFile[] } | { error: string }>('/api/tokens/transform', {
        method: 'POST',
        body: {
          tokens: tokens.value,
          formats: selectedFormats.value,
          options: options.value,
          useStyleDictionary: useStyleDictionary.value,
          metadata: metadata.value,
        },
      })

      if ('error' in response) {
        error.value = response.error
        files.value = []
      }
      else {
        files.value = response.files
      }
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to transform tokens'
      files.value = []
    }
    finally {
      loading.value = false
    }
  }

  // Validate tokens
  const validateTokens = async (tokensData: string | object) => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<{
        valid: boolean
        format: 'dtcg' | 'legacy' | 'helium' | 'unknown'
        tokenCount: number
        metadata?: TokenMetadata
        errors: Array<{ path: string[], message: string, line: number | null }>
      } | { error: string }>('/api/tokens/validate', {
        method: 'POST',
        body: { tokens: tokensData },
      })

      if ('error' in response) {
        error.value = response.error
        return { valid: false, format: 'unknown' as const, tokenCount: 0 }
      }

      detectedFormat.value = response.format
      if (response.metadata) {
        metadata.value = response.metadata
      }

      if (!response.valid) {
        error.value = `Validation failed: ${response.errors.map(e => e.message).join(', ')}`
      }

      return response
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to validate tokens'
      return { valid: false, format: 'unknown' as const, tokenCount: 0 }
    }
    finally {
      loading.value = false
    }
  }

  // Fetch from URL
  const fetchFromUrl = async (url: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<{ content: string, contentType: string } | { error: string }>('/api/tokens/fetch-url', {
        method: 'POST',
        body: { url },
      })

      if ('error' in response) {
        error.value = response.error
        return null
      }

      return response.content
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch from URL'
      return null
    }
    finally {
      loading.value = false
    }
  }

  // Watch for changes that should trigger preview update
  watch([tokens, selectedFormats, options, useStyleDictionary], () => {
    schedulePreviewUpdate()
  }, { deep: true })

  return {
    // State
    tokens,
    selectedFormats,
    options,
    preview,
    files,
    loading,
    error,
    metadata,
    detectedFormat,
    useStyleDictionary,

    // Computed
    isHeliumFormat,

    // Methods
    transform,
    validateTokens,
    fetchFromUrl,
  }
}
