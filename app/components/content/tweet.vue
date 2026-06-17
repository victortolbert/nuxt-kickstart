<template>
  <client-only>
    <div
      class="tweet-embed not-prose my-6"
      :class="`text-${align}`"
      @vue:mounted="onClientMounted"
    >
      <div
        ref="container"
        class="tweet-container inline-block min-h-25"
        :style="containerStyle"
      >
        <div v-if="!loaded" class="tweet-loading w-75 h-37.5 bg-muted rounded-xl flex items-center justify-center">
          <div class="text-center text-muted">
            <u-icon name="i-tabler-brand-x" class="size-8 mb-2 animate-pulse"></u-icon>
            <p class="text-sm">
              Loading tweet...
            </p>
          </div>
        </div>
      </div>
      <div v-if="error && loaded" class="tweet-error inline-block w-75 p-4 bg-muted rounded-xl">
        <div class="text-center text-muted">
          <u-icon name="i-tabler-brand-x" class="size-8 mb-2"></u-icon>
          <p class="text-sm mb-2">
            Could not load tweet
          </p>
          <a
            :href="`https://x.com/i/status/${id}`"
            target="_blank"
            rel="noopener noreferrer"
            class="text-xs text-primary hover:underline"
          >
            View on X →
          </a>
        </div>
      </div>
    </div>
    <template #fallback>
      <div class="tweet-ssr-fallback not-prose my-6 p-4 bg-muted rounded-xl inline-block">
        <a
          :href="`https://x.com/i/status/${id}`"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-2 text-primary hover:underline"
        >
          <u-icon name="i-tabler-brand-x" class="size-5"></u-icon>
          <span>View tweet on X</span>
        </a>
      </div>
    </template>
  </client-only>
</template>

<script setup lang="ts">
/**
 * Twitter/X Tweet Embed Component
 *
 * Usage in markdown:
 * ::tweet{id="20"}
 * ::
 */
import { computed, nextTick, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  id: string | number
  conversation?: 'none' | 'all'
  cards?: 'hidden' | 'visible'
  align?: 'left' | 'center' | 'right'
  width?: number
  scale?: number
}>(), {
  conversation: 'none',
  cards: 'visible',
  align: 'center',
  width: 550,
  scale: 1,
})

const containerStyle = computed(() => {
  if (props.scale === 1)
    return {}
  return {
    transform: `scale(${props.scale})`,
    transformOrigin: props.align === 'left' ? 'left top' : props.align === 'right' ? 'right top' : 'center top',
  }
})

const colorMode = useColorMode()
const container = ref<HTMLElement | null>(null)
const loaded = ref(false)
const error = ref(false)
const mounted = ref(false)
const isCreating = ref(false)

declare global {
  interface Window {
    twttr?: {
      widgets?: {
        createTweet: (
          id: string,
          container: HTMLElement,
          options: Record<string, any>,
        ) => Promise<HTMLElement | undefined>
        load: () => void
      }
      _e?: Array<() => void>
    }
  }
}

function loadTwitterScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.twttr?.widgets?.createTweet) {
      resolve()
      return
    }

    const existingScript = document.getElementById('twitter-wjs')
    if (existingScript) {
      const waitForLoad = () => {
        if (window.twttr?.widgets?.createTweet) {
          resolve()
        }
        else {
          setTimeout(waitForLoad, 100)
        }
      }
      waitForLoad()
      return
    }

    window.twttr = window.twttr || { _e: [] }

    const script = document.createElement('script')
    script.id = 'twitter-wjs'
    script.src = 'https://platform.twitter.com/widgets.js'
    script.async = true
    script.charset = 'utf-8'

    script.onload = () => {
      const waitForTwttr = () => {
        if (window.twttr?.widgets?.createTweet) {
          resolve()
        }
        else {
          setTimeout(waitForTwttr, 100)
        }
      }
      waitForTwttr()
    }

    script.onerror = () => {
      reject(new Error('Failed to load Twitter widgets script'))
    }

    document.head.appendChild(script)
  })
}

async function createTweet() {
  // Prevent concurrent creation
  if (isCreating.value)
    return
  isCreating.value = true

  // Wait for next tick to ensure DOM is ready
  await nextTick()

  if (!container.value) {
    isCreating.value = false
    return
  }

  container.value.innerHTML = ''
  loaded.value = false
  error.value = false

  try {
    await loadTwitterScript()

    if (!window.twttr?.widgets?.createTweet) {
      throw new Error('Twitter widgets API not available')
    }

    const element = await window.twttr.widgets.createTweet(
      String(props.id),
      container.value,
      {
        theme: colorMode.value === 'dark' ? 'dark' : 'light',
        conversation: props.conversation,
        cards: props.cards,
        align: props.align,
        width: props.width,
        dnt: true,
      },
    )

    loaded.value = true
    isCreating.value = false

    if (!element) {
      error.value = true
    }
  }
  catch {
    error.value = true
    loaded.value = true
    isCreating.value = false
  }
}

// Watch for container to become available
watch(container, (newContainer) => {
  if (newContainer && mounted.value) {
    createTweet()
  }
})

// Track when component is mounted on client
function onClientMounted() {
  mounted.value = true
  if (container.value) {
    createTweet()
  }
}

// Re-render when color mode changes
watch(() => colorMode.value, () => {
  if (container.value && mounted.value) {
    createTweet()
  }
})
</script>

<style scoped>
.tweet-container :deep(iframe) {
  border-radius: 12px;
  overflow: hidden;
}

@media print {
  .tweet-embed {
    page-break-inside: avoid;
    break-inside: avoid;
  }
}
</style>
