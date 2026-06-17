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
        {{ site?.name ?? t('pages.llmOptimizer.sites.crumb') }}
      </nuxt-link>
      <u-icon
        :name="resolveIcon('chevronRight')"
        class="size-4"
        aria-hidden="true"
      ></u-icon>
      <span>{{ t('pages.llmOptimizer.compare.crumb') }}</span>
    </nav>

    <section class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-pretty">
          {{ t('pages.llmOptimizer.compare.title') }}
        </h1>
        <p class="text-muted mt-1">
          {{ t('pages.llmOptimizer.compare.subtitle', { count: scannedCount }) }}
        </p>
      </div>
      <u-button
        color="primary"
        :loading="running"
        :disabled="running"
        :icon="resolveIcon('reload')"
        :label="running ? t('pages.llmOptimizer.compare.running') : t('pages.llmOptimizer.compare.run')"
        @click="run"
      ></u-button>
    </section>

    <p
      v-if="running"
      class="text-sm text-muted"
      aria-live="polite"
    >
      {{ t('pages.llmOptimizer.compare.runningHint') }}
    </p>

    <!-- Competitor management -->
    <section class="space-y-4">
      <h2 class="text-xs font-medium uppercase tracking-widest text-dimmed mb-4">
        {{ t('pages.llmOptimizer.compare.competitors') }}
      </h2>

      <ul v-if="competitors.length" class="flex flex-wrap gap-2">
        <li
          v-for="c in competitors"
          :key="c.competitorId!"
          class="inline-flex items-center gap-2 px-3 py-1.5 bg-elevated rounded-md"
        >
          <span class="font-semibold text-sm">{{ c.name }}</span>
          <span class="text-xs text-dimmed">{{ c.host }}</span>
          <u-button
            color="neutral"
            variant="ghost"
            size="xs"
            :icon="resolveIcon('trash')"
            :aria-label="t('common.delete')"
            @click="askDelete(c)"
          ></u-button>
        </li>
      </ul>
      <p v-else class="text-muted text-sm">
        {{ t('pages.llmOptimizer.compare.empty') }}
      </p>

      <form class="flex flex-wrap items-end gap-3" @submit.prevent="add">
        <u-form-field
          :label="t('pages.llmOptimizer.compare.nameLabel')"
          name="name"
          class="flex-1 min-w-[14rem]"
        >
          <u-input
            v-model="form.name"
            name="name"
            :placeholder="t('pages.llmOptimizer.compare.namePlaceholder')"
            autocomplete="off"
          ></u-input>
        </u-form-field>
        <u-form-field
          :label="t('pages.llmOptimizer.compare.urlLabel')"
          name="baseUrl"
          class="flex-1 min-w-[14rem]"
        >
          <u-input
            v-model="form.baseUrl"
            name="baseUrl"
            type="url"
            inputmode="url"
            spellcheck="false"
            placeholder="https://competitor.com"
            autocomplete="off"
          ></u-input>
        </u-form-field>
        <u-button
          type="submit"
          color="neutral"
          :loading="adding"
          :disabled="!form.name.trim() || !form.baseUrl.trim()"
          :icon="resolveIcon('plus')"
          :label="t('pages.llmOptimizer.compare.add')"
        ></u-button>
      </form>
      <p
        v-if="formError"
        class="text-sm text-error"
        role="alert"
        aria-live="polite"
      >
        {{ formError }}
      </p>
    </section>

    <template v-if="scannedCount > 0">
      <!-- Radar overlay -->
      <u-card variant="subtle" aria-label="Score overlay">
        <h2 class="text-xs font-medium uppercase tracking-widest text-dimmed mb-4">
          {{ t('pages.llmOptimizer.compare.scoreOverlay') }}
        </h2>
        <llm-optimizer-competitor-radar :axes="axisLabels" :series="radarSeries"></llm-optimizer-competitor-radar>
      </u-card>

      <!-- Detailed scores table -->
      <u-card variant="subtle" aria-label="Detailed scores">
        <h2 class="text-xs font-medium uppercase tracking-widest text-dimmed mb-4">
          {{ t('pages.llmOptimizer.compare.detailedScores') }}
        </h2>
        <div class="overflow-x-auto">
          <table class="w-full border-collapse tabular-nums">
            <thead>
              <tr>
                <th scope="col" class="text-start font-medium text-sm py-2.5 whitespace-nowrap">
                  {{ t('pages.llmOptimizer.compare.category') }}
                </th>
                <th
                  v-for="(e, i) in entities"
                  :key="e.host"
                  scope="col"
                  class="text-end font-semibold text-sm py-2.5 whitespace-nowrap"
                  :style="{ color: entityColor(i) }"
                >
                  {{ e.host }}
                  <span v-if="!e.scanId" class="block">
                    <u-badge
                      color="neutral"
                      variant="subtle"
                      size="sm"
                    >{{ t('pages.llmOptimizer.compare.notScanned') }}</u-badge>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row" class="text-start font-medium text-sm py-2.5 whitespace-nowrap">
                  {{ t('pages.llmOptimizer.compare.composite') }}
                </th>
                <td
                  v-for="e in entities"
                  :key="e.host"
                  class="text-end tabular-nums py-2.5 border-t border-default"
                >
                  {{ e.visibilityScore?.toFixed(1) ?? '—' }}
                </td>
              </tr>
              <tr>
                <th scope="row" class="text-start font-medium text-sm py-2.5 whitespace-nowrap">
                  {{ t('pages.llmOptimizer.compare.grade') }}
                </th>
                <td
                  v-for="e in entities"
                  :key="e.host"
                  class="text-end tabular-nums py-2.5 border-t border-default"
                >
                  <span
                    v-if="e.grade"
                    :style="{ color: gradeColorVar(e.grade) }"
                    class="font-bold tabular-nums"
                  >{{ e.grade }}</span>
                  <span v-else>—</span>
                </td>
              </tr>
              <tr v-for="axis in axes" :key="axis.slug">
                <th scope="row" class="text-start font-medium text-sm py-2.5 whitespace-nowrap">
                  {{ axis.label }} <span class="text-dimmed text-xs">/ {{ axis.rawMax }}</span>
                </th>
                <td
                  v-for="e in entities"
                  :key="e.host"
                  class="text-end tabular-nums py-2.5 border-t border-default"
                >
                  {{ earnedFor(e, axis.slug) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </u-card>
    </template>

    <u-modal
      v-model:open="deleteOpen"
      :title="t('pages.llmOptimizer.compare.deleteTitle')"
      :description="t('pages.llmOptimizer.compare.deleteDesc')"
    >
      <template #footer>
        <u-button
          color="neutral"
          variant="ghost"
          :label="t('common.cancel')"
          @click="deleteOpen = false"
        ></u-button>
        <u-button
          color="error"
          :loading="deleting"
          :label="t('common.delete')"
          @click="confirmDelete"
        ></u-button>
      </template>
    </u-modal>
  </div>
</template>

<script setup lang="ts">
import type { CategorySlug, ComparisonEntity, ComparisonResult } from '#shared/types/llm-optimizer'
import { SCORECARD_CATALOG } from '#shared/llm-optimizer/scorecard-catalog'

const { t } = useI18n()
const { resolveIcon } = useAppearance()
const route = useRoute()
const siteId = computed(() => String(route.params.id))

// Short, radar-friendly category labels (domain data — English, like check labels).
const SHORT_LABELS: Record<CategorySlug, string> = {
  'structured-data': 'Structured Data',
  'content-structure': 'Content Structure',
  'crawlability': 'Crawlability',
  'technical-performance': 'Tech Performance',
  'eeat': 'E-E-A-T',
  'semantic-metadata': 'Semantic Metadata',
  'ai-standards': 'AI Standards',
}
const axes = SCORECARD_CATALOG.map(c => ({ slug: c.slug, label: SHORT_LABELS[c.slug], rawMax: c.rawMax }))
const axisLabels = axes.map(a => a.label)

const { data, refresh } = await useFetch<ComparisonResult>(() => `/api/llm-optimizer/sites/${siteId.value}/comparison`)

const entities = computed(() => data.value?.entities ?? [])
const site = computed(() => entities.value.find(e => e.competitorId === null) ?? null)
const competitors = computed(() => entities.value.filter(e => e.competitorId !== null))
const scannedCount = computed(() => entities.value.filter(e => e.scanId !== null).length)

// One stable chart color per entity (cycles through the 5 theme chart vars).
const entityColor = (i: number): string => `var(--color-chart-${(i % 5) + 1})`

const radarSeries = computed(() =>
  entities.value
    .map((e, i) => ({ e, i }))
    .filter(({ e }) => e.categories.length > 0)
    .map(({ e, i }) => ({
      name: e.host,
      color: entityColor(i),
      values: axes.map((a) => {
        const cat = e.categories.find(c => c.slug === a.slug)
        return cat && cat.rawMax > 0 ? (cat.earned / cat.rawMax) * 100 : 0
      }),
    })),
)

function earnedFor(entity: ComparisonEntity, slug: CategorySlug): string {
  const cat = entity.categories.find(c => c.slug === slug)
  return cat ? cat.earned.toFixed(1) : '—'
}

// --- Add competitor ---
const form = reactive({ name: '', baseUrl: '' })
const adding = ref(false)
const formError = ref('')

async function add() {
  if (!form.name.trim() || !form.baseUrl.trim())
    return
  adding.value = true
  formError.value = ''
  try {
    await $fetch(`/api/llm-optimizer/sites/${siteId.value}/competitors`, {
      method: 'POST',
      body: { name: form.name.trim(), baseUrl: form.baseUrl.trim() },
      signal: AbortSignal.timeout(WRITE_TIMEOUT_MS),
    })
    form.name = ''
    form.baseUrl = ''
    await refresh()
  }
  catch (err) {
    formError.value = isTimeoutError(err) ? t('common.requestTimeout') : t('pages.llmOptimizer.compare.formError')
  }
  finally {
    adding.value = false
  }
}

// --- Delete competitor ---
const deleteOpen = ref(false)
const deleting = ref(false)
const target = ref<ComparisonEntity | null>(null)

function askDelete(competitor: ComparisonEntity) {
  target.value = competitor
  deleteOpen.value = true
}

async function confirmDelete() {
  if (!target.value?.competitorId)
    return
  deleting.value = true
  try {
    await $fetch(`/api/llm-optimizer/competitors/${target.value.competitorId}`, {
      method: 'DELETE',
      signal: AbortSignal.timeout(WRITE_TIMEOUT_MS),
    })
    await refresh()
  }
  catch (err) {
    formError.value = isTimeoutError(err) ? t('common.requestTimeout') : t('pages.llmOptimizer.compare.formError')
  }
  finally {
    deleting.value = false
    deleteOpen.value = false
    target.value = null
  }
}

// --- Run comparison (scans every entity live) ---
const running = ref(false)

async function run() {
  running.value = true
  try {
    const result = await $fetch<ComparisonResult>(`/api/llm-optimizer/sites/${siteId.value}/compare`, { method: 'POST' })
    data.value = result
  }
  finally {
    running.value = false
  }
}

useSeoMeta({ title: () => t('pages.llmOptimizer.compare.title') })
</script>
