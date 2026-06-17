<template>
  <div
    v-if="showBanner"
    class="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-2 bg-primary/10 px-4 py-1.5 text-xs text-primary backdrop-blur-sm"
  >
    <u-icon :name="resolveIcon('eye')" class="size-3.5"></u-icon>
    <span>Viewing public version</span>
    <button
      class="underline hover:no-underline font-medium"
      @click="switchToAppView"
    >
      Switch to app view
    </button>
  </div>
</template>

<script setup lang="ts">
import { authClient } from '~/lib/auth-client'

const props = withDefaults(defineProps<{
  /** Temporarily hide the banner without removing the component */
  hidden?: boolean
}>(), {
  hidden: false,
})

const route = useRoute()
const { resolveIcon } = useAppearance()
const session = authClient.useSession()
const loggedIn = computed(() => !!session.value.data?.user)

// Show banner only for authenticated users viewing in landing layout
const isLandingLayout = computed(() => {
  return route.meta.layout === 'landing' || (!route.meta.layout && route.query.view !== 'app')
})

const showBanner = computed(() => !props.hidden && loggedIn.value && isLandingLayout.value)

function switchToAppView() {
  navigateTo({ path: route.path, query: { ...route.query, view: 'app' } })
}
</script>
