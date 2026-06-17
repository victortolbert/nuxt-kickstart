<template>
  <section class="relative overflow-hidden bg-linear-to-b from-default to-muted py-24 sm:py-32">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-3xl text-center">
        <!-- Headline -->
        <h1 class="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          {{ t('landing.hero.title') }}
        </h1>

        <!-- Subheadline -->
        <p class="mt-6 text-lg text-muted sm:text-xl">
          {{ t('landing.hero.subtitle') }}
        </p>

        <!-- CTA Buttons -->
        <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <u-button
            :label="t('landing.hero.getStarted')"
            to="/guides/getting-started"
            size="lg"
            color="primary"
            :trailing-icon="resolveIcon('arrowRight')"
          ></u-button>
          <u-button
            :label="t('landing.hero.whatsInside')"
            size="lg"
            color="neutral"
            variant="outline"
            :trailing-icon="resolveIcon('chevronDown')"
            @click="scrollToFeatures"
          ></u-button>
        </div>

        <!-- Visual Element: Code Snippet -->
        <div class="mt-16 rounded-lg border border-default bg-elevated p-6 text-left shadow-sm">
          <div class="flex items-center gap-2 mb-4">
            <div class="flex gap-1.5">
              <div class="size-3 rounded-full bg-red-500" />
              <div class="size-3 rounded-full bg-yellow-500" />
              <div class="size-3 rounded-full bg-green-500" />
            </div>
            <span class="text-xs text-muted font-mono">{{ t('landing.hero.terminal') }}</span>
          </div>
          <pre class="text-sm font-mono text-muted overflow-x-auto"><code><span class="text-green-400">$</span> pnpm install
<span class="text-green-400">$</span> pnpm run init      <span class="text-gray-500"># rename the template to your project</span>
<span class="text-green-400">$</span> pnpm dev           <span class="text-gray-500"># auth, admin, email, i18n — ready</span></code></pre>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t } = useI18n()
const { resolveIcon } = useAppearance()

// Scroll to the features section
function scrollToFeatures() {
  const featuresSection = document.getElementById('features')
  if (featuresSection) {
    featuresSection.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>
