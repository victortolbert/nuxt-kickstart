<template>
  <div class="space-y-8">
    <section class="max-w-3xl">
      <h1 class="text-4xl font-bold tracking-tight text-balance">
        {{ t('pages.labs.title') }}
      </h1>
      <p class="mt-3 text-lg text-muted leading-relaxed text-pretty">
        {{ t('pages.labs.subtitle') }}
      </p>
    </section>

    <div class="grid gap-4 sm:gap-6 grid-cols-[repeat(auto-fill,minmax(min(100%,18rem),1fr))]">
      <u-page-card
        v-for="lab in labs"
        :key="lab.slug"
        :to="lab.to"
        :title="t(lab.titleKey)"
        :description="t(lab.descKey)"
        :icon="resolveIcon(lab.icon)"
        variant="subtle"
        spotlight
      ></u-page-card>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const { resolveIcon } = useAppearance()

// Wrapped in computed() so the icons follow the user's icon-collection setting.
const labs = computed(() => [
  { slug: 'broadsheet', icon: 'news', to: '/labs/broadsheet', titleKey: 'nav.broadsheetLayout', descKey: 'pages.labs.broadsheet.desc' },
])

useSeoMeta({
  title: () => t('pages.labs.title'),
  description: () => t('pages.labs.subtitle'),
})
</script>
