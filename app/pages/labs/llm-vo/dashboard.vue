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
      <span>{{ t('pages.llmOptimizer.dashboard.crumb') }}</span>
    </nav>

    <section>
      <h1 class="text-3xl font-bold text-pretty">
        {{ t('pages.llmOptimizer.dashboard.title') }}
      </h1>
      <p class="text-muted mt-1">
        {{ t('pages.llmOptimizer.dashboard.subtitle') }}
      </p>
    </section>

    <template v-if="dashboard && dashboard.totalScans > 0">
      <!-- Stat cards -->
      <div class="grid gap-4 sm:grid-cols-3">
        <u-card
          v-for="stat in stats"
          :key="stat.label"
          variant="subtle"
        >
          <p class="text-xs font-medium uppercase tracking-wider text-dimmed">
            {{ stat.label }}
          </p>
          <p
            class="mt-1.5 text-3xl font-bold tabular-nums"
            :style="stat.color ? { color: stat.color } : undefined"
          >
            {{ stat.value }}
          </p>
        </u-card>
      </div>

      <div class="grid gap-6 md:grid-cols-2 items-start">
        <!-- Distribution histogram -->
        <u-card variant="subtle" aria-label="Score distribution">
          <h2 class="mb-4 text-xs font-medium uppercase tracking-widest text-dimmed">
            {{ t('pages.llmOptimizer.dashboard.distribution') }}
          </h2>
          <charts-bar-chart
            :data="distributionData"
            :subtitle="t('pages.llmOptimizer.dashboard.distributionSubtitle')"
            :title="numberFmt.format(dashboard.totalScans)"
            :height="240"
          ></charts-bar-chart>
        </u-card>

        <!-- Top issues -->
        <u-card
          v-if="dashboard.topIssues.length"
          variant="subtle"
          aria-label="Top issues"
        >
          <h2 class="mb-4 text-xs font-medium uppercase tracking-widest text-dimmed">
            {{ t('pages.llmOptimizer.dashboard.topIssues') }}
          </h2>
          <ol class="border-t border-default divide-y divide-default">
            <li
              v-for="issue in dashboard.topIssues"
              :key="issue.title"
              class="flex items-center justify-between gap-3 py-2.5"
            >
              <span class="text-sm min-w-0 break-words">{{ issue.title }}</span>
              <span class="text-xs text-dimmed tabular-nums whitespace-nowrap">
                {{ t('pages.llmOptimizer.dashboard.issueCount', { count: issue.count }) }}
              </span>
            </li>
          </ol>
        </u-card>
      </div>

      <!-- Recent scans -->
      <u-card
        v-if="dashboard.recentScans.length"
        variant="subtle"
        aria-label="Recent scans"
      >
        <div class="flex items-center justify-between gap-4 mb-2">
          <h2 class="text-xs font-medium uppercase tracking-widest text-dimmed">
            {{ t('pages.llmOptimizer.recentScans') }}
          </h2>
          <u-button
            to="/labs/llm-vo/sites"
            variant="link"
            color="primary"
            size="xs"
            :trailing-icon="resolveIcon('arrowRight')"
            :label="t('pages.llmOptimizer.dashboard.viewAll')"
          ></u-button>
        </div>
        <ol class="border-t border-default divide-y divide-default">
          <li v-for="scan in dashboard.recentScans" :key="scan.id">
            <nuxt-link
              :to="`/labs/llm-vo/result/${scan.id}`"
              class="grid grid-cols-[1.5rem_minmax(0,1fr)_auto_auto] items-center gap-3 py-2.5 transition-colors hover:text-highlighted"
            >
              <span class="font-bold tabular-nums" :style="{ color: gradeColorVar(scan.grade) }">{{ scan.grade }}</span>
              <span class="truncate text-sm">{{ displayUrl(scan.url) }}</span>
              <time
                class="text-xs text-dimmed tabular-nums whitespace-nowrap"
                :datetime="scan.scannedAt"
              >{{ dateFmt.format(new Date(scan.scannedAt)) }}</time>
              <span class="text-xs text-dimmed tabular-nums">{{ scan.visibilityScore }}</span>
            </nuxt-link>
          </li>
        </ol>
      </u-card>
    </template>

    <p v-else class="text-muted">
      {{ t('pages.llmOptimizer.dashboard.empty') }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { DashboardData } from '#shared/types/llm-optimizer'

const { t, locale } = useI18n()
const { resolveIcon } = useAppearance()

const { data: dashboard } = await useFetch<DashboardData>('/api/llm-optimizer/dashboard')

const numberFmt = computed(() => new Intl.NumberFormat(locale.value))
const dateFmt = computed(() => new Intl.DateTimeFormat(locale.value, { month: 'short', day: 'numeric', year: 'numeric' }))

const distributionData = computed(() =>
  (dashboard.value?.distribution ?? []).map(b => ({ label: b.band, value: b.count })),
)

const stats = computed(() => {
  const d = dashboard.value
  if (!d)
    return []
  return [
    { label: t('pages.llmOptimizer.dashboard.totalScans'), value: numberFmt.value.format(d.totalScans) },
    { label: t('pages.llmOptimizer.dashboard.averageScore'), value: numberFmt.value.format(d.averageScore) },
    { label: t('pages.llmOptimizer.dashboard.latestGrade'), value: d.latestGrade ?? '—', color: gradeColorVar(d.latestGrade) },
  ]
})

const displayUrl = (url: string): string => url.replace(/^https?:\/\//, '').replace(/\/$/, '')

useSeoMeta({ title: () => t('pages.llmOptimizer.dashboard.title') })
</script>
