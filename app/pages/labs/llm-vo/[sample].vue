<template>
  <div class="space-y-8">
    <nav class="flex items-center gap-2 text-sm text-muted">
      <nuxt-link to="/labs/llm-vo" class="hover:underline">
        LLM Optimizer
      </nuxt-link>
      <u-icon
        :name="resolveIcon('chevronRight')"
        class="size-4"
        aria-hidden="true"
      ></u-icon>
      <span>Scorecard</span>
    </nav>

    <llm-optimizer-scorecard-report :scorecard="scorecard"></llm-optimizer-scorecard-report>

    <div>
      <u-button
        to="/labs/llm-vo"
        variant="ghost"
        color="neutral"
        :icon="resolveIcon('arrowLeft')"
        label="Scan another site"
      ></u-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { sampleScorecard } from '#shared/llm-optimizer/samples'

// Re-run setup per sample so the resolved scorecard narrows cleanly (no reactive
// undefined to assert away) and param changes always re-resolve.
definePageMeta({ key: route => route.fullPath })

const route = useRoute()
const { resolveIcon } = useAppearance()

const slug = String(route.params.sample)
const scorecard = sampleScorecard(slug)

if (!scorecard) {
  throw createError({ statusCode: 404, statusMessage: `Unknown sample scorecard "${slug}"`, fatal: true })
}

useSeoMeta({
  title: `${scorecard.url} — Visibility Readout (${scorecard.grade})`,
  description: `LLM visibility scorecard: ${scorecard.visibilityScore}/100, grade ${scorecard.grade} — ${scorecard.gradeLabel}.`,
})
</script>
