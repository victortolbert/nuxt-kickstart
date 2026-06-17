<template>
  <div v-if="guide" class="flex gap-8 lg:gap-16 sm:px-4 lg:px-8 pt-2 lg:pt-6 pb-16 print:p-0">
    <!-- Main content -->
    <article
      class="prose max-w-[80ch] min-w-0 flex-1"
      :data-page-url="`${$config.public.siteUrl || 'https://nuxt-kickstart.example.com'}${$route.fullPath}`"
    >
      <div class="not-prose mb-8 print:mb-0">
        <!-- Breadcrumb and actions - hidden in print -->
        <div class="flex items-center justify-between gap-3 mb-6 print:hidden">
          <nav aria-label="Breadcrumb" class="flex items-center gap-2 text-sm text-muted min-w-0">
            <nuxt-link to="/guides" class="shrink-0 whitespace-nowrap hover:underline">
              {{ t('nav.guides') }}
            </nuxt-link>
            <u-icon :name="resolveIcon('chevronRight')" class="size-4 shrink-0"></u-icon>
            <span class="truncate min-w-0" :title="guide.title">{{ guide.title }}</span>
          </nav>
          <div class="shrink-0">
            <content-actions :title="guide.title ?? ''" :description="guide.description ?? ''"></content-actions>
          </div>
        </div>

        <translation-disclaimer
          :is-fallback="resolved?.isFallback === true"
          :is-machine-translated="guide.machineTranslated === true"
          class="mb-4"
        ></translation-disclaimer>

        <div class="flex items-center justify-between mb-4">
          <h1 class="text-3xl font-bold">
            {{ guide.title }}
          </h1>
          <content-edit-link :path="`en/guides/${slug}.md`" collection="guides"></content-edit-link>
        </div>

        <p v-if="guide.description" class="text-lg text-muted mt-2">
          {{ guide.description }}
        </p>

        <!-- Status indicator -->
        <div v-if="guide.status" class="flex flex-wrap items-center gap-2 mt-4 print:hidden">
          <status-indicator :status="guide.status" size="md"></status-indicator>
        </div>

        <!-- Metadata badges - hidden in print -->
        <div class="hidden flex-wrap items-center gap-2 mt-4 print:hidden">
          <u-badge
            v-if="guide.category"
            :label="categoryLabel(guide.category)"
            variant="soft"
          ></u-badge>
          <u-badge
            v-if="guide.difficulty"
            :label="difficultyLabel(guide.difficulty)"
            :color="getDifficultyColor(guide.difficulty)"
            variant="soft"
          ></u-badge>
        </div>

        <!-- Prerequisites -->
        <div v-if="guide.prerequisites?.length" class="hidden mt-4 print:hidden">
          <p class="text-sm text-muted mb-2">
            {{ t('pages.guides.prerequisites') }}
          </p>
          <div class="flex flex-wrap gap-1">
            <u-badge
              v-for="prereq in guide.prerequisites"
              :key="prereq"
              :label="prereq"
              size="sm"
              variant="subtle"
            ></u-badge>
          </div>
        </div>

        <!-- Tags - hidden in print -->
        <div v-if="guide.tags?.length" class="flex flex-wrap gap-1 mt-4 print:hidden">
          <u-badge
            v-for="tag in guide.tags"
            :key="tag"
            :label="formatTag(tag)"
            size="sm"
            variant="soft"
          ></u-badge>
        </div>
        <u-separator class="mt-8 print:hidden"></u-separator>
      </div>

      <content-renderer :value="guide"></content-renderer>
    </article>

    <!-- Table of Contents sidebar -->
    <aside
      v-if="guide.body?.toc?.links?.length"
      class="hidden lg:block w-64 shrink-0 print:hidden"
    >
      <div class="sticky top-20">
        <u-content-toc
          :links="guide.body.toc.links"
          :title="$t('pages.toc')"
          highlight
          color="neutral"
          highlight-color="primary"
          :ui="{ link: 'text-xs', trigger: 'text-xs' }"
          @move="onTocMove"
        ></u-content-toc>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import type { UiColor } from '#shared/types/appearance'

const route = useRoute()
const { locale, t, te } = useI18n()
const { resolveIcon } = useAppearance()

// Content slug: route path minus locale prefix and /guides/
// (/es/guides/getting-started -> getting-started)
const slug = computed(() =>
  route.path.replace(/^\/\w{2}(?=\/)/, '').replace(/^\/guides\//, ''))

// Resolve current-locale content with English fallback (SSR-safe)
const { data: resolved } = await useAsyncData(
  `guide-${route.path}`,
  () => fetchLocalizedEntry('guides', slug.value, locale.value),
  { watch: [locale] },
)

const guide = computed(() => resolved.value?.entry ?? null)

if (!guide.value) {
  throw createError({ statusCode: 404, message: 'Guide not found' })
}

// Enforce visibility at the page level (internal → login redirect, private →
// 404), matching blocks + the catch-all page. Listings already hide these via
// useVisibilityFilter, but the detail route must guard direct navigation too.
const access = useContentAccess(
  guide.value as { visibility?: 'public' | 'internal' | 'private' } | null,
)
if (!access.canAccess) {
  if (access.redirectTo) {
    await navigateTo(access.redirectTo)
  }
  else {
    throw createError({ statusCode: access.errorCode ?? 404, message: 'Guide not found' })
  }
}

function toCamelCase(slug: string): string {
  return slug.replace(/-(\w)/g, (_, c: string) => c.toUpperCase())
}

function categoryLabel(name: string): string {
  const key = `pages.guides.categories.${toCamelCase(name)}`
  return te(key) ? t(key) : formatLabel(name)
}

function difficultyLabel(difficulty: string): string {
  const key = `pages.guides.difficulty.${difficulty}`
  return te(key) ? t(key) : formatLabel(difficulty)
}

function getDifficultyColor(difficulty: string): UiColor {
  const colors: Record<string, UiColor> = {
    beginner: 'success',
    intermediate: 'warning',
    advanced: 'error',
  }
  return colors[difficulty] ?? 'neutral'
}

// Handle TOC navigation - scroll to section
function onTocMove(id: string) {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

useHead({
  title: () => guide.value?.title ?? '',
})

useSeoMeta({
  description: () => guide.value?.description ?? '',
})
</script>
