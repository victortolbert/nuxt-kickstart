<template>
  <u-alert
    v-if="shouldShow && !isDismissed"
    color="info"
    variant="subtle"
    :icon="resolveIcon('language')"
    :title="message"
    close
    class="mb-4"
    @update:open="dismiss"
  >
    <template v-if="contributionUrl" #actions>
      <u-button
        :to="contributionUrl"
        target="_blank"
        rel="noopener noreferrer"
        color="info"
        variant="link"
        size="xs"
        :icon="resolveIcon('external')"
      >
        {{ t('translation.contributeLink') }}
      </u-button>
    </template>
  </u-alert>
</template>

<script setup lang="ts">
/**
 * Translation Disclaimer Banner
 *
 * Shows a dismissible banner when content is:
 * - A fallback from English (locale-specific version not available)
 * - Machine translated (may contain errors)
 *
 * Dismissal state is stored in sessionStorage keyed by the current path.
 */

const props = defineProps<{
  /** Whether the content is a fallback from English */
  isFallback: boolean
  /** Whether the content was machine translated */
  isMachineTranslated: boolean
  /** URL for contributing translations (e.g., GitHub repo) */
  contributionUrl?: string
}>()

const { t } = useI18n()
const route = useRoute()
const { resolveIcon } = useAppearance()

// Determine if the banner should show
const shouldShow = computed(() => props.isFallback || props.isMachineTranslated)

// Track dismissal state
const isDismissed = ref(false)

// Storage key for dismissal (per-page)
const storageKey = computed(() => `i18n-dismissed-${route.path}`)

// Check if dismissed on mount (client-side only)
onMounted(() => {
  if (import.meta.client) {
    isDismissed.value = sessionStorage.getItem(storageKey.value) === 'true'
  }
})

// Handle dismissal
function dismiss() {
  isDismissed.value = true
  if (import.meta.client) {
    sessionStorage.setItem(storageKey.value, 'true')
  }
}

// Get appropriate message based on state
const message = computed(() => {
  if (props.isMachineTranslated) {
    return t('translation.machineTranslatedMessage')
  }
  if (props.isFallback) {
    return t('translation.fallbackMessage')
  }
  return ''
})
</script>
