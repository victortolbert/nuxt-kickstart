<template>
  <section id="tech" class="py-24 sm:py-32 bg-muted/30">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-2xl text-center mb-16">
        <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">
          {{ t('landing.techStack.title') }}
        </h2>
        <p class="mt-4 text-lg text-muted">
          {{ t('landing.techStack.subtitle') }}
        </p>
      </div>

      <div class="mx-auto max-w-5xl">
        <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="group in techCategories"
            :key="group.category"
            class="space-y-4"
          >
            <h3 class="text-sm font-semibold text-dimmed uppercase tracking-wider">
              {{ group.category }}
            </h3>
            <div class="flex flex-wrap gap-2">
              <tech-badge
                v-for="tech in group.techs"
                :key="tech"
                :slug="tech"
                mode="both"
                size="sm"
              ></tech-badge>
            </div>
          </div>
        </div>

        <div class="mt-12 text-center">
          <nuxt-link
            to="/tech"
            class="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            {{ t('landing.techStack.viewAll') }}
            <u-icon :name="resolveIcon('arrowRight')" class="size-4"></u-icon>
          </nuxt-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t } = useI18n()
const { resolveIcon } = useAppearance()

// Tech stack organized by category
const techCategories = computed(() => [
  {
    category: t('landing.techStack.categories.frontend'),
    techs: ['nuxt', 'vue', 'react', 'typescript', 'tailwind'],
  },
  {
    category: t('landing.techStack.categories.backend'),
    techs: ['supabase', 'postgresql', 'redis', 'python'],
  },
  {
    category: t('landing.techStack.categories.tools'),
    techs: ['docker', 'vercel', 'github', 'figma', 'playwright'],
  },
  {
    category: t('landing.techStack.categories.testing'),
    techs: ['vitest', 'playwright', 'cypress'],
  },
])
</script>
