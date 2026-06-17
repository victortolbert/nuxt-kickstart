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
      <span>{{ t('pages.llmOptimizer.scanCrumb') }}</span>
    </nav>

    <llm-optimizer-scan-progress
      v-if="phase === 'streaming' || phase === 'idle'"
      :stage="stage"
      :pct="pct"
    ></llm-optimizer-scan-progress>

    <u-alert
      v-else-if="phase === 'error'"
      color="error"
      variant="subtle"
      :icon="resolveIcon('error')"
      :title="t('pages.llmOptimizer.scanErrorTitle')"
      :description="errorMessage"
    >
      <template #actions>
        <u-button
          to="/labs/llm-vo"
          color="error"
          variant="link"
          size="xs"
          :label="t('pages.llmOptimizer.tryAnother')"
        ></u-button>
      </template>
    </u-alert>

    <template v-else-if="scorecard">
      <llm-optimizer-scorecard-report :scorecard="scorecard"></llm-optimizer-scorecard-report>
      <llm-optimizer-ai-insight-panel v-if="scorecard.id" :scan-id="scorecard.id"></llm-optimizer-ai-insight-panel>
      <llm-optimizer-score-trend :url="scorecard.url"></llm-optimizer-score-trend>
      <div class="flex flex-wrap items-center gap-2">
        <u-button
          to="/labs/llm-vo"
          variant="ghost"
          color="neutral"
          :icon="resolveIcon('arrowLeft')"
          :label="t('pages.llmOptimizer.scanAnother')"
        ></u-button>
        <u-button
          v-if="scorecard.id"
          :to="`/labs/llm-vo/result/${scorecard.id}`"
          variant="ghost"
          color="neutral"
          :icon="resolveIcon('link')"
          :label="t('pages.llmOptimizer.permalink')"
        ></u-button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { ScanStage, ScanStreamMessage, Scorecard } from '#shared/types/llm-optimizer'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const { resolveIcon } = useAppearance()

const url = computed(() => String(route.query.url ?? ''))
const displayUrl = computed(() => url.value.replace(/^https?:\/\//, ''))

const scorecard = ref<Scorecard | null>(null)
const stage = ref<ScanStage>('fetching')
const pct = ref(0)
const phase = ref<'idle' | 'streaming' | 'done' | 'error'>('idle')
const errorMessage = ref('')

let source: EventSource | null = null
function closeStream() {
  source?.close()
  source = null
}

// EventSource is a browser API — open the stream once mounted on the client.
onMounted(() => {
  if (!url.value) {
    router.replace('/labs/llm-vo')
    return
  }
  phase.value = 'streaming'
  source = new EventSource(`/api/llm-optimizer/scan-stream?url=${encodeURIComponent(url.value)}`)

  source.onmessage = (event) => {
    let msg: ScanStreamMessage
    try {
      msg = JSON.parse(event.data)
    }
    catch {
      return
    }
    if (msg.type === 'progress') {
      stage.value = msg.stage
      pct.value = msg.pct
    }
    else if (msg.type === 'result') {
      scorecard.value = msg.scorecard
      phase.value = 'done'
      closeStream()
    }
    else if (msg.type === 'error') {
      errorMessage.value = msg.message
      phase.value = 'error'
      closeStream()
    }
  }

  // A connection drop before a terminal message is an error — and closing here
  // prevents EventSource from auto-reconnecting and re-running the scan.
  source.onerror = () => {
    if (phase.value === 'streaming') {
      errorMessage.value = t('pages.llmOptimizer.scanErrorFallback')
      phase.value = 'error'
    }
    closeStream()
  }
})

onBeforeUnmount(closeStream)

useSeoMeta({
  title: () => url.value ? `${t('pages.llmOptimizer.scanCrumb')} — ${displayUrl.value}` : t('pages.llmOptimizer.scanCrumb'),
})
</script>
