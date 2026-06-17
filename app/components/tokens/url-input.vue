<template>
  <div class="url-input-container">
    <div class="flex gap-2">
      <div class="flex-1">
        <u-input
          v-model="urlInput"
          type="url"
          placeholder="https://example.com/tokens.json"
          :disabled="loading"
          :error="!!urlError"
          size="md"
          :icon="resolveIcon('link')"
          @keyup.enter="handleFetch"
        ></u-input>
        <p
          v-if="urlError"
          class="text-xs text-red-500 mt-1"
        >
          {{ urlError }}
        </p>
      </div>
      <u-button
        :loading="loading"
        :disabled="!isValidUrl || loading"
        @click="handleFetch"
      >
        <template v-if="loading">
          <u-icon :name="resolveIcon('loading')" class="animate-spin"></u-icon>
          <span class="ml-2">Fetching...</span>
        </template>
        <template v-else>
          <u-icon :name="resolveIcon('download')"></u-icon>
          <span class="ml-2">Fetch</span>
        </template>
      </u-button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: string
  loading?: boolean
}>(), {
  modelValue: '',
  loading: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'fetch': []
}>()

const { resolveIcon } = useAppearance()

const urlInput = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const urlError = ref<string | null>(null)

function validateUrl(url: string): boolean {
  if (!url.trim()) {
    urlError.value = null
    return false
  }

  try {
    const parsedUrl = new URL(url)
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      urlError.value = 'URL must use http:// or https:// protocol'
      return false
    }
    urlError.value = null
    return true
  }
  catch {
    urlError.value = 'Invalid URL format'
    return false
  }
}

const isValidUrl = computed(() => validateUrl(props.modelValue))

function handleFetch() {
  if (isValidUrl.value && !props.loading) {
    emit('fetch')
  }
}

watch(() => props.modelValue, (newValue) => {
  if (newValue.trim()) {
    validateUrl(newValue)
  }
  else {
    urlError.value = null
  }
})
</script>
