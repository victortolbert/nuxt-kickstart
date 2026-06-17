<template>
  <u-app>
    <main class="min-h-svh flex flex-col items-center justify-center gap-8 px-6 py-16 text-center bg-default">
      <app-logo size="md"></app-logo>

      <div class="space-y-3">
        <p class="font-mono text-6xl sm:text-7xl font-bold text-highlighted tabular-nums">
          {{ statusCode }}
        </p>
        <h1 class="text-xl font-semibold text-highlighted">
          {{ heading }}
        </h1>
        <p class="max-w-md text-muted">
          {{ description }}
        </p>
      </div>

      <div class="flex flex-wrap items-center justify-center gap-3">
        <u-button
          :icon="resolveIcon('home')"
          color="primary"
          size="lg"
          @click="goHome"
        >
          {{ t('error.goHome') }}
        </u-button>
        <u-button
          :icon="resolveIcon('arrowLeft')"
          color="neutral"
          variant="ghost"
          size="lg"
          @click="goBack"
        >
          {{ t('error.goBack') }}
        </u-button>
      </div>

      <!-- Easter egg: a random cat to soften the landing (image + caption hide together if it fails) -->
      <client-only>
        <random-image
          type="cat"
          :caption="t('error.catReward')"
          class="mx-auto max-h-56 w-auto rounded-(--ui-radius) border border-default"
        ></random-image>
      </client-only>
    </main>
  </u-app>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

/**
 * Root error page (Nuxt renders this in place of the app on a fatal error, so
 * it deliberately keeps dependencies minimal — no data fetching, only known
 * semantic icons — to stay robust when the rest of the app has failed).
 */
const props = defineProps<{
  error: NuxtError
}>()

const { t, locale } = useI18n()
const { resolveIcon } = useAppearance()

// Locale-aware home (prefix_except_default): '/' for en, '/<locale>' otherwise
const homePath = computed(() => (locale.value === 'en' ? '/' : `/${locale.value}`))

const isNotFound = computed(() => props.error?.statusCode === 404)
const statusCode = computed(() => props.error?.statusCode || 500)

const heading = computed(() =>
  isNotFound.value ? t('error.notFound.title') : t('error.generic.title'),
)
const description = computed(() =>
  isNotFound.value
    ? t('error.notFound.description')
    : props.error?.message || t('error.generic.description'),
)

useHead({ htmlAttrs: { lang: () => locale.value } })
useSeoMeta({ title: () => heading.value })

function goHome() {
  clearError({ redirect: homePath.value })
}

function goBack() {
  if (import.meta.client && window.history.length > 1) {
    clearError()
    window.history.back()
  }
  else {
    goHome()
  }
}
</script>
