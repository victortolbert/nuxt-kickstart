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
      <span>{{ t('pages.llmOptimizer.brand.crumb') }}</span>
    </nav>

    <section class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-pretty">
          {{ running ? t('pages.llmOptimizer.brand.runningTitle') : t('pages.llmOptimizer.brand.title') }}
        </h1>
        <p class="text-muted mt-1">
          {{ t('pages.llmOptimizer.brand.subtitle') }}
        </p>
      </div>
      <u-button
        v-if="availableProviders.length"
        color="primary"
        :loading="running"
        :disabled="running"
        :icon="resolveIcon('sparkles')"
        :label="running ? t('pages.llmOptimizer.brand.running') : t('pages.llmOptimizer.brand.run')"
        @click="run"
      ></u-button>
    </section>

    <p
      v-if="!availableProviders.length"
      class="text-muted"
    >
      {{ t('pages.llmOptimizer.brand.notConfigured') }}
    </p>

    <ol
      v-else
      class="grid gap-3"
      aria-live="polite"
    >
      <li
        v-for="p in rows"
        :key="p.provider"
      >
        <u-card variant="subtle">
          <div class="flex items-center gap-2.5">
            <span
              class="size-2 shrink-0 rounded-full"
              :class="dotClass(p.status)"
              aria-hidden="true"
            />
            <span class="font-semibold">{{ p.label }}</span>
            <span
              class="ms-auto inline-flex items-center gap-1.5 text-sm"
              :class="p.status === 'error' ? 'text-error' : 'text-dimmed'"
            >
              <u-icon
                v-if="p.status === 'running'"
                :name="resolveIcon('loading')"
                class="size-4 animate-spin"
                aria-hidden="true"
              ></u-icon>
              {{ statusLabel(p) }}
            </span>
          </div>
          <div v-if="p.result" class="mt-3.5">
            <div class="mb-2.5 flex flex-wrap gap-1.5">
              <u-badge
                variant="subtle"
                :color="p.result.recognized ? 'success' : 'neutral'"
                :label="p.result.recognized ? t('pages.llmOptimizer.brand.recognized') : t('pages.llmOptimizer.brand.notRecognized')"
              ></u-badge>
              <u-badge
                v-if="p.result.recognized && p.result.sentiment !== 'unknown'"
                variant="subtle"
                :color="sentimentColor(p.result.sentiment)"
                :label="t(`pages.llmOptimizer.brand.sentiment.${p.result.sentiment}`)"
              ></u-badge>
            </div>
            <p class="text-sm leading-relaxed text-pretty">
              {{ p.result.summary }}
            </p>
          </div>
          <p v-else-if="p.status === 'error'" class="mt-2.5 text-sm text-error">
            {{ p.message }}
          </p>
        </u-card>
      </li>
    </ol>
  </div>
</template>

<script setup lang="ts">
import type { BrandMentionResult, BrandProviderId, BrandProviderInfo, BrandStreamMessage } from '#shared/types/llm-optimizer'

const { t } = useI18n()
const { resolveIcon } = useAppearance()
const route = useRoute()
const siteId = computed(() => String(route.params.id))

type RowStatus = 'idle' | 'pending' | 'running' | 'done' | 'error'
interface ProviderRow extends BrandProviderInfo {
  status: RowStatus
  result: BrandMentionResult | null
  message: string
}

// Site name for the breadcrumb + which providers are configured.
const { data: siteData } = await useFetch<{ site: { name: string } }>(
  () => `/api/llm-optimizer/sites/${siteId.value}`,
  { lazy: true },
)
const siteName = computed(() => siteData.value?.site?.name ?? null)

const { data: brandData } = await useFetch<{ providers: BrandProviderInfo[] }>(
  () => `/api/llm-optimizer/sites/${siteId.value}/brand`,
  { default: () => ({ providers: [] }) },
)
const availableProviders = computed(() => brandData.value?.providers ?? [])

const rows = ref<ProviderRow[]>([])
watchEffect(() => {
  if (!rows.value.length) {
    rows.value = availableProviders.value.map(p => ({ ...p, status: 'idle', result: null, message: '' }))
  }
})

function setRow(provider: BrandProviderId, patch: Partial<ProviderRow>) {
  const row = rows.value.find(r => r.provider === provider)
  if (row)
    Object.assign(row, patch)
}

function dotClass(status: RowStatus): string {
  if (status === 'running')
    return 'bg-primary'
  if (status === 'done')
    return 'bg-success'
  if (status === 'error')
    return 'bg-error'
  return 'bg-muted'
}

function sentimentColor(sentiment: BrandMentionResult['sentiment']): 'success' | 'error' | 'neutral' {
  if (sentiment === 'positive')
    return 'success'
  if (sentiment === 'negative')
    return 'error'
  return 'neutral'
}

function statusLabel(p: ProviderRow): string {
  if (p.status === 'running')
    return t('pages.llmOptimizer.brand.statusRunning')
  if (p.status === 'pending')
    return t('pages.llmOptimizer.brand.statusPending')
  if (p.status === 'error')
    return t('pages.llmOptimizer.brand.statusError')
  if (p.status === 'done')
    return ''
  return t('pages.llmOptimizer.brand.statusIdle')
}

const running = ref(false)
let source: EventSource | null = null

function closeStream() {
  source?.close()
  source = null
}

function run() {
  // Reset rows to pending and open the stream.
  rows.value = availableProviders.value.map(p => ({ ...p, status: 'pending', result: null, message: '' }))
  running.value = true
  source = new EventSource(`/api/llm-optimizer/sites/${siteId.value}/brand-stream`)

  source.onmessage = (event) => {
    let msg: BrandStreamMessage
    try {
      msg = JSON.parse(event.data)
    }
    catch {
      return
    }
    if (msg.type === 'pending')
      rows.value = msg.providers.map(p => ({ ...p, status: 'pending', result: null, message: '' }))
    else if (msg.type === 'running')
      setRow(msg.provider, { status: 'running' })
    else if (msg.type === 'result')
      setRow(msg.result.provider, { status: 'done', result: msg.result })
    else if (msg.type === 'error')
      setRow(msg.provider, { status: 'error', message: msg.message })
    else if (msg.type === 'done')
      finish()
  }

  source.onerror = () => {
    if (running.value)
      finish()
  }
}

function finish() {
  running.value = false
  closeStream()
}

onBeforeUnmount(closeStream)

useSeoMeta({ title: () => t('pages.llmOptimizer.brand.title') })
</script>
