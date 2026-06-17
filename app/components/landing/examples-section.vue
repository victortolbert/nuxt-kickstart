<template>
  <section id="examples" class="py-16 sm:py-24">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section header -->
      <div class="mb-12 text-center">
        <h2 class="text-3xl font-bold sm:text-4xl">
          {{ t('landing.examples.title') }}
        </h2>
        <p class="mt-4 text-lg text-muted">
          {{ t('landing.examples.subtitle') }}
        </p>
      </div>

      <!-- Examples grid -->
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <u-card
          v-for="example in examples"
          :key="example.to"
          class="group flex flex-col transition-shadow hover:shadow-lg"
        >
          <div class="flex flex-1 flex-col">
            <div class="flex items-center gap-3">
              <div class="flex items-center justify-center size-10 shrink-0 rounded-sm bg-primary/10">
                <u-icon :name="example.icon" class="size-5 text-primary"></u-icon>
              </div>
              <h3 class="text-lg font-semibold">
                {{ example.title }}
              </h3>
            </div>
            <p class="mt-3 text-sm text-muted">
              {{ example.description }}
            </p>

            <!-- Tech badges -->
            <div class="mt-4 flex flex-wrap gap-2">
              <tech-badge
                v-for="techSlug in example.tech"
                :key="techSlug"
                :slug="techSlug"
                size="sm"
              ></tech-badge>
            </div>

            <!-- View link -->
            <div class="mt-auto pt-4">
              <nuxt-link
                :to="example.to"
                class="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                {{ t(example.cta ?? 'landing.examples.open') }}
                <u-icon :name="resolveIcon('arrowRight')" class="size-4"></u-icon>
              </nuxt-link>
            </div>
          </div>
        </u-card>
      </div>

      <!-- View all examples link -->
      <div class="mt-12 text-center">
        <u-button
          to="/examples"
          size="lg"
          color="neutral"
          variant="outline"
          :trailing-icon="resolveIcon('arrowRight')"
        >
          {{ t('landing.examples.viewAll') }}
        </u-button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t } = useI18n()
const { resolveIcon } = useAppearance()

interface LandingExample {
  key: string
  icon: string
  to: string
  tech: string[]
  /** Optional i18n key overriding the default "Open Example" link label. */
  cta?: string
}

// Bundled showcase — most link to a live demo route; email links to its guide
const examples = computed(() => ([
  {
    key: 'tokens',
    icon: resolveIcon('palette'),
    to: '/examples/design-tokens',
    tech: ['style-dictionary', 'tailwind'],
  },
  {
    key: 'blocks',
    icon: resolveIcon('components'),
    to: '/blocks',
    tech: ['nuxt', 'vue'],
  },
  {
    key: 'charts',
    icon: resolveIcon('chartBar'),
    to: '/examples/charts',
    tech: ['typescript', 'vue'],
  },
  {
    key: 'email',
    icon: resolveIcon('mailForward'),
    to: '/guides/email-campaigns',
    tech: ['nuxt', 'nodejs'],
    cta: 'landing.examples.readGuide',
  },
] as LandingExample[]).map(example => ({
  ...example,
  title: t(`landing.examples.${example.key}.title`),
  description: t(`landing.examples.${example.key}.description`),
})))
</script>
