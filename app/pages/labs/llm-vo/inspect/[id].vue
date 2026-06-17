<template>
  <div class="space-y-8">
    <nav class="flex items-center gap-2 text-sm text-muted">
      <nuxt-link to="/labs/llm-vo" class="hover:underline">
        {{ t('pages.llmOptimizer.breadcrumb') }}
      </nuxt-link>
      <u-icon
        :name="resolveIcon('chevronRight')"
        class="size-4"
        aria-hidden="true"
      ></u-icon>
      <nuxt-link :to="`/labs/llm-vo/sites/${siteId}`" class="hover:underline">
        {{ siteName ?? t('pages.llmOptimizer.sites.crumb') }}
      </nuxt-link>
      <u-icon
        :name="resolveIcon('chevronRight')"
        class="size-4"
        aria-hidden="true"
      ></u-icon>
      <span>{{ t('pages.llmOptimizer.inspect.crumb') }}</span>
    </nav>

    <section class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-pretty">
          {{ t('pages.llmOptimizer.inspect.title') }}
        </h1>
        <p class="text-muted mt-1">
          {{ t('pages.llmOptimizer.inspect.subtitle') }}
        </p>
      </div>
      <u-button
        color="primary"
        :loading="running"
        :disabled="running"
        :icon="resolveIcon('reload')"
        :label="running ? t('pages.llmOptimizer.inspect.running') : t('pages.llmOptimizer.inspect.run')"
        @click="run"
      ></u-button>
    </section>

    <p
      v-if="running"
      class="text-sm text-muted"
      aria-live="polite"
    >
      {{ t('pages.llmOptimizer.inspect.runningHint') }}
    </p>

    <u-alert
      v-if="errorMessage && !running"
      color="error"
      variant="subtle"
      :title="t('pages.llmOptimizer.inspect.errorTitle')"
      :description="errorMessage"
      :icon="resolveIcon('alert-circle')"
    ></u-alert>

    <template v-if="data && data.pagesDiscovered > 0">
      <!-- Summary stats -->
      <dl class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <u-card variant="subtle">
          <dt class="text-xs font-medium uppercase tracking-widest text-dimmed">
            {{ t('pages.llmOptimizer.inspect.pagesDiscovered') }}
          </dt>
          <dd class="mt-1.5 text-3xl font-bold tabular-nums">
            {{ data.pagesDiscovered }}
          </dd>
        </u-card>
        <u-card variant="subtle">
          <dt class="text-xs font-medium uppercase tracking-widest text-dimmed">
            {{ t('pages.llmOptimizer.inspect.avgScore') }}
          </dt>
          <dd class="mt-1.5 text-3xl font-bold tabular-nums">
            {{ data.averageScore.toFixed(1) }}
          </dd>
        </u-card>
        <u-card variant="subtle">
          <dt class="text-xs font-medium uppercase tracking-widest text-dimmed">
            {{ t('pages.llmOptimizer.inspect.highestScore') }}
          </dt>
          <dd
            class="mt-1.5 text-3xl font-bold tabular-nums"
            :style="{ color: gradeColorVar(gradeFor(data.highestScore)) }"
          >
            {{ data.highestScore.toFixed(1) }}
          </dd>
        </u-card>
        <u-card variant="subtle">
          <dt class="text-xs font-medium uppercase tracking-widest text-dimmed">
            {{ t('pages.llmOptimizer.inspect.lowestScore') }}
          </dt>
          <dd
            class="mt-1.5 text-3xl font-bold tabular-nums"
            :style="{ color: gradeColorVar(gradeFor(data.lowestScore)) }"
          >
            {{ data.lowestScore.toFixed(1) }}
          </dd>
        </u-card>
      </dl>

      <!-- Sort controls -->
      <div class="flex flex-wrap items-center gap-2">
        <span class="text-sm text-muted">{{ t('pages.llmOptimizer.inspect.sortBy') }}</span>
        <u-button
          v-for="opt in sortOptions"
          :key="opt.key"
          size="xs"
          :color="sortKey === opt.key ? 'primary' : 'neutral'"
          :variant="sortKey === opt.key ? 'solid' : 'subtle'"
          :label="opt.label"
          :aria-pressed="sortKey === opt.key"
          @click="sortKey = opt.key"
        ></u-button>
      </div>

      <!-- Page-level table -->
      <u-card variant="subtle" aria-label="Page-level visibility">
        <h2 class="text-xs font-medium uppercase tracking-widest text-dimmed">
          {{ t('pages.llmOptimizer.inspect.pageLevel') }}
        </h2>
        <p class="mt-1.5 mb-4 text-sm text-dimmed">
          {{ t('pages.llmOptimizer.inspect.pageLevelHint') }}
        </p>
        <div class="overflow-x-auto">
          <table class="w-full tabular-nums">
            <thead>
              <tr>
                <th
                  scope="col"
                  class="text-start text-xs font-medium uppercase text-dimmed py-2 whitespace-nowrap"
                >
                  {{ t('pages.llmOptimizer.inspect.pageUrl') }}
                </th>
                <th
                  scope="col"
                  class="text-end text-xs font-medium uppercase text-dimmed py-2 whitespace-nowrap"
                >
                  {{ t('pages.llmOptimizer.inspect.score') }}
                </th>
                <th
                  scope="col"
                  class="text-end text-xs font-medium uppercase text-dimmed py-2 whitespace-nowrap"
                >
                  {{ t('pages.llmOptimizer.inspect.grade') }}
                </th>
                <th
                  scope="col"
                  class="text-end text-xs font-medium uppercase text-dimmed py-2 whitespace-nowrap"
                >
                  {{ t('pages.llmOptimizer.inspect.issues') }}
                </th>
                <th
                  v-for="col in CATEGORY_COLUMNS"
                  :key="col.slug"
                  scope="col"
                  class="text-end text-xs font-medium uppercase text-dimmed py-2 whitespace-nowrap"
                >
                  {{ col.label }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="page in sortedPages" :key="page.url">
                <th
                  scope="row"
                  class="text-start font-normal py-2.5 border-t border-default text-sm truncate max-w-[18rem]"
                >
                  {{ displayPath(page.url) }}
                </th>
                <td
                  class="py-2.5 border-t border-default text-sm text-end tabular-nums font-semibold"
                  :style="{ color: gradeColorVar(page.grade) }"
                >
                  {{ page.visibilityScore.toFixed(1) }}
                </td>
                <td class="py-2.5 border-t border-default text-sm text-end tabular-nums">
                  <span class="font-bold" :style="{ color: gradeColorVar(page.grade) }">{{ page.grade }}</span>
                </td>
                <td class="py-2.5 border-t border-default text-sm text-end tabular-nums text-muted">
                  {{ page.issueCount }}
                </td>
                <td
                  v-for="col in CATEGORY_COLUMNS"
                  :key="col.slug"
                  class="py-2.5 border-t border-default text-sm text-end tabular-nums"
                >
                  {{ earnedFor(page, col.slug) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </u-card>
    </template>

    <p v-else-if="!running" class="text-muted">
      {{ t('pages.llmOptimizer.inspect.empty') }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { CategorySlug, PageInspection, SiteInspection } from '#shared/types/llm-optimizer'
import { gradeFor } from '#shared/llm-optimizer/scoring'

const { t } = useI18n()
const { resolveIcon } = useAppearance()
const route = useRoute()
const siteId = computed(() => String(route.params.id))

// The 6 weighted dimensions shown per page (the AI-Standards bonus is omitted).
const CATEGORY_COLUMNS: { slug: CategorySlug, label: string }[] = [
  { slug: 'structured-data', label: 'Structured' },
  { slug: 'content-structure', label: 'Content' },
  { slug: 'crawlability', label: 'Crawl' },
  { slug: 'technical-performance', label: 'Tech' },
  { slug: 'eeat', label: 'E-E-A-T' },
  { slug: 'semantic-metadata', label: 'Metadata' },
]

// Site name for the breadcrumb (the inspection POST is on-demand).
const { data: siteData } = await useFetch<{ site: { name: string } }>(
  () => `/api/llm-optimizer/sites/${siteId.value}`,
  { lazy: true },
)
const siteName = computed(() => siteData.value?.site?.name ?? null)

const data = ref<SiteInspection | null>(null)
const running = ref(false)
const errorMessage = ref('')

async function run() {
  running.value = true
  errorMessage.value = ''
  try {
    data.value = await $fetch<SiteInspection>(`/api/llm-optimizer/sites/${siteId.value}/inspect`, { method: 'POST' })
  }
  catch (err) {
    errorMessage.value = (err as { data?: { message?: string } })?.data?.message
      || (err as { statusMessage?: string })?.statusMessage
      || t('pages.llmOptimizer.inspect.error')
  }
  finally {
    running.value = false
  }
}

type SortKey = 'score' | 'issues' | 'url'
const sortKey = ref<SortKey>('score')
const sortOptions = computed<{ key: SortKey, label: string }[]>(() => [
  { key: 'score', label: t('pages.llmOptimizer.inspect.sortScore') },
  { key: 'issues', label: t('pages.llmOptimizer.inspect.sortIssues') },
  { key: 'url', label: t('pages.llmOptimizer.inspect.sortUrl') },
])

const sortedPages = computed(() => {
  const pages = [...(data.value?.pages ?? [])]
  if (sortKey.value === 'url')
    return pages.sort((a, b) => a.url.localeCompare(b.url))
  if (sortKey.value === 'issues')
    return pages.sort((a, b) => b.issueCount - a.issueCount)
  return pages.sort((a, b) => b.visibilityScore - a.visibilityScore)
})

function earnedFor(page: PageInspection, slug: CategorySlug): string {
  const cat = page.categories.find(c => c.slug === slug)
  return cat ? cat.earned.toFixed(1) : '—'
}

const displayPath = (url: string): string => url.replace(/^https?:\/\//, '').replace(/\/$/, '')

useSeoMeta({ title: () => t('pages.llmOptimizer.inspect.title') })
</script>
