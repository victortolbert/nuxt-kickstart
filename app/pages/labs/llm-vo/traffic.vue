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
      <span>{{ t('pages.llmOptimizer.traffic.crumb') }}</span>
    </nav>

    <section class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <div class="flex items-center gap-3">
          <h1 class="text-3xl font-bold text-pretty">
            {{ t('pages.llmOptimizer.traffic.title') }}
          </h1>
          <u-badge
            color="warning"
            variant="subtle"
            :label="t('pages.llmOptimizer.traffic.demoData')"
          ></u-badge>
        </div>
        <p class="text-muted mt-1">
          {{ t('pages.llmOptimizer.traffic.subtitle') }}
        </p>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <u-button
          v-for="opt in rangeOptions"
          :key="opt.days"
          size="xs"
          :color="days === opt.days ? 'primary' : 'neutral'"
          :variant="days === opt.days ? 'solid' : 'subtle'"
          :label="opt.label"
          :aria-pressed="days === opt.days"
          @click="days = opt.days"
        ></u-button>
        <u-button
          color="neutral"
          variant="ghost"
          size="xs"
          :icon="resolveIcon('reload')"
          :loading="status === 'pending'"
          :label="t('pages.llmOptimizer.traffic.refresh')"
          @click="refresh()"
        ></u-button>
      </div>
    </section>

    <template v-if="data">
      <!-- Headline stats -->
      <dl class="grid gap-4 sm:grid-cols-2">
        <u-card variant="subtle">
          <dt class="text-xs font-medium uppercase tracking-wider text-dimmed">
            {{ t('pages.llmOptimizer.traffic.totalInteractions') }}
          </dt>
          <dd class="mt-1.5 text-4xl font-bold tabular-nums">
            {{ numberFmt.format(data.totalInteractions) }}
          </dd>
          <p class="mt-1 text-sm text-dimmed">
            {{ t('pages.llmOptimizer.traffic.acrossProperties') }}
          </p>
        </u-card>
        <u-card variant="subtle">
          <dt class="text-xs font-medium uppercase tracking-wider text-dimmed">
            {{ t('pages.llmOptimizer.traffic.successRate') }}
          </dt>
          <dd class="mt-1.5 text-4xl font-bold tabular-nums">
            {{ data.successRate.toFixed(1) }}%
          </dd>
          <p class="mt-1 text-sm text-dimmed">
            {{ t('pages.llmOptimizer.traffic.hitWeighted') }}
          </p>
        </u-card>
      </dl>

      <!-- Agentic vs Human -->
      <u-card variant="subtle" aria-label="Agentic vs human traffic">
        <h2 class="text-xs font-medium uppercase tracking-widest text-dimmed">
          {{ t('pages.llmOptimizer.traffic.agenticVsHuman') }}
        </h2>
        <p class="mt-1.5 mb-4 text-sm text-dimmed">
          {{ t('pages.llmOptimizer.traffic.agenticVsHumanHint') }}
        </p>
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="flex flex-col gap-1 rounded-[calc(var(--ui-radius)*1.5)] bg-elevated p-4">
            <span class="text-sm text-muted">{{ t('pages.llmOptimizer.traffic.aiBot') }}</span>
            <span class="text-2xl font-bold tabular-nums">{{ numberFmt.format(data.agentic.count) }}</span>
            <span class="text-sm text-dimmed tabular-nums">{{ data.agentic.share.toFixed(2) }}% {{ t('pages.llmOptimizer.traffic.share') }}</span>
          </div>
          <div class="flex flex-col gap-1 rounded-[calc(var(--ui-radius)*1.5)] bg-elevated p-4">
            <span class="text-sm text-muted">{{ t('pages.llmOptimizer.traffic.human') }}</span>
            <span class="text-2xl font-bold tabular-nums">{{ numberFmt.format(data.human.count) }}</span>
            <span class="text-sm text-dimmed tabular-nums">{{ data.human.share.toFixed(2) }}% {{ t('pages.llmOptimizer.traffic.share') }}</span>
          </div>
        </div>
        <p class="mt-4 text-sm text-dimmed tabular-nums">
          {{ t('pages.llmOptimizer.traffic.otherBots') }}: {{ numberFmt.format(data.otherBots) }}
          · {{ t('pages.llmOptimizer.traffic.internal') }}: {{ numberFmt.format(data.internal) }}
          · {{ t('pages.llmOptimizer.traffic.totalEvents') }}: {{ numberFmt.format(data.totalEvents) }}
        </p>
      </u-card>

      <!-- Charts -->
      <div class="grid gap-6 lg:grid-cols-2 items-start">
        <u-card variant="subtle" aria-label="Traffic trend">
          <h2 class="mb-4 text-xs font-medium uppercase tracking-widest text-dimmed">
            {{ t('pages.llmOptimizer.traffic.trend') }}
          </h2>
          <charts-line-chart :data="data.trend" :height="240"></charts-line-chart>
        </u-card>
        <u-card variant="subtle" aria-label="Agent type distribution">
          <h2 class="mb-4 text-xs font-medium uppercase tracking-widest text-dimmed">
            {{ t('pages.llmOptimizer.traffic.agentDistribution') }}
          </h2>
          <charts-bar-chart
            :data="data.agentTypes"
            :height="320"
            horizontal
          ></charts-bar-chart>
        </u-card>
      </div>

      <!-- Interaction distribution -->
      <u-card variant="subtle" aria-label="Interaction distribution">
        <h2 class="text-xs font-medium uppercase tracking-widest text-dimmed">
          {{ t('pages.llmOptimizer.traffic.interactionDistribution') }}
        </h2>
        <p class="mt-1.5 mb-4 text-sm text-dimmed">
          {{ t('pages.llmOptimizer.traffic.interactionDistributionHint') }}
        </p>
        <charts-bar-chart :data="interactionData" :height="260"></charts-bar-chart>
      </u-card>

      <!-- Traffic records -->
      <u-card variant="subtle" aria-label="Traffic records">
        <h2 class="text-xs font-medium uppercase tracking-widest text-dimmed">
          {{ t('pages.llmOptimizer.traffic.records') }}
        </h2>
        <p class="mt-1.5 mb-4 text-sm text-dimmed">
          {{ t('pages.llmOptimizer.traffic.recordsHint', { count: numberFmt.format(data.totalInteractions) }) }}
        </p>
        <div class="overflow-x-auto">
          <table class="w-full whitespace-nowrap">
            <thead>
              <tr>
                <th scope="col" class="text-start text-xs font-medium uppercase text-dimmed py-2 whitespace-nowrap">
                  {{ t('pages.llmOptimizer.traffic.colDomain') }}
                </th>
                <th scope="col" class="text-start text-xs font-medium uppercase text-dimmed py-2 whitespace-nowrap">
                  {{ t('pages.llmOptimizer.traffic.colUri') }}
                </th>
                <th scope="col" class="text-start text-xs font-medium uppercase text-dimmed py-2 whitespace-nowrap">
                  {{ t('pages.llmOptimizer.traffic.colAgent') }}
                </th>
                <th scope="col" class="text-start text-xs font-medium uppercase text-dimmed py-2 whitespace-nowrap">
                  {{ t('pages.llmOptimizer.traffic.colMarket') }}
                </th>
                <th scope="col" class="text-start text-xs font-medium uppercase text-dimmed py-2 whitespace-nowrap">
                  {{ t('pages.llmOptimizer.traffic.colCategory') }}
                </th>
                <th scope="col" class="text-center text-xs font-medium uppercase text-dimmed py-2 whitespace-nowrap">
                  {{ t('pages.llmOptimizer.traffic.colStatus') }}
                </th>
                <th scope="col" class="text-end text-xs font-medium uppercase text-dimmed py-2 whitespace-nowrap">
                  {{ t('pages.llmOptimizer.traffic.colHits') }}
                </th>
                <th scope="col" class="text-end text-xs font-medium uppercase text-dimmed py-2 whitespace-nowrap">
                  {{ t('pages.llmOptimizer.traffic.colSuccess') }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(r, i) in data.records" :key="`${r.domain}-${r.agent}-${i}`">
                <td class="py-2.5 border-t border-default text-sm">
                  {{ r.domain }}
                </td>
                <td class="py-2.5 border-t border-default text-sm text-muted">
                  {{ r.uri }}
                </td>
                <td class="py-2.5 border-t border-default text-sm">
                  {{ r.agent }}
                </td>
                <td class="py-2.5 border-t border-default text-sm text-muted">
                  {{ r.market }}
                </td>
                <td class="py-2.5 border-t border-default text-sm text-muted">
                  {{ r.category }}
                </td>
                <td class="py-2.5 border-t border-default text-sm text-center">
                  <u-badge
                    variant="subtle"
                    :color="statusColor(r.status)"
                    :label="String(r.status)"
                  ></u-badge>
                </td>
                <td class="py-2.5 border-t border-default text-sm text-end tabular-nums">
                  {{ numberFmt.format(r.hits) }}
                </td>
                <td class="py-2.5 border-t border-default text-sm text-end tabular-nums">
                  {{ r.successPct.toFixed(1) }}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </u-card>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { TrafficIntelligence } from '#shared/types/llm-optimizer'

const { t, locale } = useI18n()
const { resolveIcon } = useAppearance()

const days = ref(7)
const rangeOptions = computed(() => [
  { days: 7, label: t('pages.llmOptimizer.traffic.range7') },
  { days: 14, label: t('pages.llmOptimizer.traffic.range14') },
  { days: 30, label: t('pages.llmOptimizer.traffic.range30') },
])

const { data, status, refresh } = await useFetch<TrafficIntelligence>('/api/llm-optimizer/traffic', {
  query: { days },
})

const numberFmt = computed(() => new Intl.NumberFormat(locale.value))

const interactionData = computed(() => {
  if (!data.value)
    return []
  return [
    { label: t('pages.llmOptimizer.traffic.human'), value: data.value.human.count },
    { label: t('pages.llmOptimizer.traffic.aiBot'), value: data.value.agentic.count },
    { label: t('pages.llmOptimizer.traffic.otherBots'), value: data.value.otherBots },
    { label: t('pages.llmOptimizer.traffic.internal'), value: data.value.internal },
  ]
})

function statusColor(status: number): 'success' | 'warning' | 'error' {
  if (status >= 500)
    return 'error'
  if (status >= 400)
    return 'warning'
  return 'success'
}

useSeoMeta({ title: () => t('pages.llmOptimizer.traffic.title') })
</script>
