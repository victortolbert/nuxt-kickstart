<template>
  <div
    v-if="showIconFallback"
    class="app-image-fallback"
    :class="[props.class]"
    role="img"
    :aria-label="alt"
  >
    <u-icon :name="fallbackIconClass"></u-icon>
  </div>
  <nuxt-img
    v-else
    :src="currentSrc"
    :alt="alt"
    :width="width"
    :height="height"
    :sizes="sizes"
    :loading="loading"
    :format="format"
    :class="props.class"
    @error="handleError"
  ></nuxt-img>
</template>

<script setup lang="ts">
/**
 * AppImage - Generic image component with fallback handling
 *
 * Wraps NuxtImg with graceful error handling for missing images.
 * Supports fallback image or icon rendering to prevent 404 errors.
 *
 * @example
 * <AppImage src="/img/person.jpg" fallback="/img/default-avatar.jpg" alt="Profile" />
 * <AppImage src="/img/missing.jpg" fallback-icon="i-tabler-user" alt="User" />
 */

interface Props {
  /** Primary image source */
  src: string
  /** Fallback image source (used if primary fails to load) */
  fallback?: string
  /** Fallback icon class (used if no fallback image provided) */
  fallbackIcon?: string
  /** Alt text for the image */
  alt: string
  /** Image width (passed to NuxtImg) */
  width?: number
  /** Image height (passed to NuxtImg) */
  height?: number
  /** Responsive sizes (passed to NuxtImg) */
  sizes?: string
  /** Loading strategy (passed to NuxtImg) */
  loading?: 'lazy' | 'eager'
  /** Image format (passed to NuxtImg) */
  format?: string
  /** Additional CSS classes */
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  fallback: undefined,
  fallbackIcon: undefined,
  width: undefined,
  height: undefined,
  sizes: undefined,
  loading: 'lazy',
  format: undefined,
  class: '',
})

const { resolveIcon } = useAppearance()

// Fallback icon class (prop override or appearance-aware default)
const fallbackIconClass = computed(() => props.fallbackIcon || resolveIcon('photoOff'))

// Track error state
const hasError = ref(false)

// Current source to display
const currentSrc = ref(props.src)

// Whether to show icon fallback
const showIconFallback = computed(() => hasError.value && !props.fallback)

/**
 * Handle image load error
 * Switch to fallback source or show icon
 */
function handleError() {
  if (!hasError.value && props.fallback) {
    // First error: try fallback image
    hasError.value = true
    currentSrc.value = props.fallback
  }
  else {
    // Second error or no fallback: show icon
    hasError.value = true
  }
}

/**
 * Reset error state when src changes
 */
watch(() => props.src, (newSrc) => {
  hasError.value = false
  currentSrc.value = newSrc
})
</script>

<style scoped>
.app-image-fallback {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: var(--ui-bg-muted);
  color: var(--ui-text-muted);
  min-width: 3rem;
  min-height: 3rem;
}

.app-image-fallback span {
  font-size: 1.5rem;
}
</style>
