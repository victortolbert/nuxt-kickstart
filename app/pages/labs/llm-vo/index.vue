<template>
  <div class="space-y-10">
    <section class="max-w-3xl">
      <p class="text-xs font-medium uppercase tracking-widest text-dimmed">
        {{ t('pages.llmOptimizer.eyebrow') }}
      </p>
      <h1 class="mt-2 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
        {{ t('pages.llmOptimizer.heroTitle') }}
      </h1>
      <p class="mt-4 text-muted text-pretty">
        {{ t('pages.llmOptimizer.heroLead') }}
      </p>
      <div class="mt-3 -ml-2 flex flex-wrap items-center gap-x-1">
        <u-button
          to="/labs/llm-vo/dashboard"
          variant="link"
          color="primary"
          size="sm"
          :trailing-icon="resolveIcon('arrowRight')"
          :label="t('pages.llmOptimizer.dashboard.title')"
        ></u-button>
        <u-button
          to="/labs/llm-vo/sites"
          variant="link"
          color="primary"
          size="sm"
          :trailing-icon="resolveIcon('arrowRight')"
          :label="t('pages.llmOptimizer.sites.title')"
        ></u-button>
        <u-button
          to="/labs/llm-vo/traffic"
          variant="link"
          color="primary"
          size="sm"
          :trailing-icon="resolveIcon('arrowRight')"
          :label="t('pages.llmOptimizer.traffic.title')"
        ></u-button>
        <u-button
          v-if="isAdmin"
          to="/labs/llm-vo/admin"
          variant="link"
          color="primary"
          size="sm"
          :trailing-icon="resolveIcon('arrowRight')"
          :label="t('pages.llmOptimizer.admin.title')"
        ></u-button>
      </div>
    </section>

    <llm-optimizer-scan-form></llm-optimizer-scan-form>

    <u-card variant="subtle" aria-label="What gets measured">
      <h2 class="mb-4 text-xs font-medium uppercase tracking-widest text-dimmed">
        {{ t('pages.llmOptimizer.whatGetsMeasured') }}
      </h2>
      <ol class="border-t border-default divide-y divide-default">
        <li
          v-for="c in categories"
          :key="c.slug"
          class="flex items-center gap-3 py-2.5"
        >
          <u-icon
            :name="resolveIcon(categoryIcon[c.slug])"
            class="size-4 text-muted shrink-0"
            aria-hidden="true"
          ></u-icon>
          <span class="text-sm min-w-0 break-words">{{ c.label }}</span>
          <span class="ml-auto text-xs text-dimmed tabular-nums whitespace-nowrap">{{ c.bonus ? 'bonus' : `${Math.round(c.weight * 100)}%` }}</span>
        </li>
      </ol>
    </u-card>

    <llm-optimizer-recent-scans></llm-optimizer-recent-scans>
  </div>
</template>

<script setup lang="ts">
import { SCORECARD_CATALOG } from '#shared/llm-optimizer/scorecard-catalog'

const { t } = useI18n()
const { resolveIcon } = useAppearance()
const { isAdmin } = useSessionState()

const categories = SCORECARD_CATALOG

useSeoMeta({
  title: () => t('pages.llmOptimizer.eyebrow'),
  description: () => t('pages.llmOptimizer.heroLead'),
})
</script>
