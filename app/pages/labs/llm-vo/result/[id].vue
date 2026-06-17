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
      <span>{{ t('pages.llmOptimizer.savedScanCrumb') }}</span>
    </nav>

    <div
      v-if="pending"
      class="flex items-center gap-3 py-12 text-muted"
      aria-live="polite"
    >
      <u-icon
        :name="resolveIcon('loading')"
        class="size-5 animate-spin"
        aria-hidden="true"
      ></u-icon>
      <p>{{ t('pages.llmOptimizer.loadingSaved') }}</p>
    </div>

    <u-alert
      v-else-if="error || !data"
      color="error"
      variant="subtle"
      :icon="resolveIcon('error')"
      :title="t('pages.llmOptimizer.notFoundTitle')"
      :description="t('pages.llmOptimizer.notFoundDesc')"
    >
      <template #actions>
        <u-button
          to="/labs/llm-vo"
          color="error"
          variant="link"
          size="xs"
          :label="t('pages.llmOptimizer.runNew')"
        ></u-button>
      </template>
    </u-alert>

    <template v-else>
      <llm-optimizer-scorecard-report :scorecard="data"></llm-optimizer-scorecard-report>
      <llm-optimizer-ai-insight-panel v-if="data.id" :scan-id="data.id"></llm-optimizer-ai-insight-panel>
      <llm-optimizer-score-trend :url="data.url"></llm-optimizer-score-trend>
      <div>
        <u-button
          to="/labs/llm-vo"
          variant="ghost"
          color="neutral"
          :icon="resolveIcon('arrowLeft')"
          :label="t('pages.llmOptimizer.scanAnother')"
        ></u-button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Scorecard } from '#shared/types/llm-optimizer'

definePageMeta({ key: route => route.fullPath })

const route = useRoute()
const { t } = useI18n()
const { resolveIcon } = useAppearance()
const id = String(route.params.id)

const { data, error, pending } = await useFetch<Scorecard>(`/api/llm-optimizer/scans/${id}`)

useSeoMeta({
  title: () => data.value ? `${data.value.url} — Visibility Readout (${data.value.grade})` : 'Saved scan — LLM Optimizer',
})
</script>
