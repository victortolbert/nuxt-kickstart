<template>
  <div class="space-y-8">
    <nav class="flex items-center gap-2 text-sm text-muted">
      <nuxt-link to="/labs/llm-vo/sites" class="hover:underline">
        {{ t('pages.llmOptimizer.sites.crumb') }}
      </nuxt-link>
      <u-icon
        :name="resolveIcon('chevronRight')"
        class="size-4"
        aria-hidden="true"
      ></u-icon>
      <span>{{ data?.site.name ?? '…' }}</span>
    </nav>

    <u-alert
      v-if="error || !data"
      color="error"
      variant="subtle"
      :icon="resolveIcon('error')"
      :title="t('pages.llmOptimizer.sites.notFound')"
    >
      <template #actions>
        <u-button
          to="/labs/llm-vo/sites"
          color="error"
          variant="link"
          size="xs"
          :label="t('pages.llmOptimizer.sites.crumb')"
        ></u-button>
      </template>
    </u-alert>

    <template v-else>
      <header class="flex flex-wrap items-center justify-between gap-4">
        <div class="min-w-0">
          <h1 class="text-3xl font-bold tracking-tight text-pretty">
            {{ data.site.name }}
          </h1>
          <a
            :href="data.site.baseUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm text-muted hover:underline"
          >{{ displayHost(data.site.baseUrl) }}</a>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <u-button
            :to="{ path: '/labs/llm-vo/scan', query: { url: data.site.baseUrl } }"
            color="primary"
            :icon="resolveIcon('rocket')"
            :label="t('pages.llmOptimizer.sites.scanThis')"
          ></u-button>
          <u-button
            :to="`/labs/llm-vo/compare/${data.site.id}`"
            color="neutral"
            variant="subtle"
            :icon="resolveIcon('chartBar')"
            :label="t('pages.llmOptimizer.compare.crumb')"
          ></u-button>
          <u-button
            :to="`/labs/llm-vo/inspect/${data.site.id}`"
            color="neutral"
            variant="subtle"
            :icon="resolveIcon('search')"
            :label="t('pages.llmOptimizer.inspect.crumb')"
          ></u-button>
          <u-button
            :to="`/labs/llm-vo/brand/${data.site.id}`"
            color="neutral"
            variant="subtle"
            :icon="resolveIcon('sparkles')"
            :label="t('pages.llmOptimizer.brand.crumb')"
          ></u-button>
          <u-button
            color="neutral"
            variant="ghost"
            :icon="resolveIcon('trash')"
            :aria-label="t('common.delete')"
            @click="deleteOpen = true"
          ></u-button>
        </div>
      </header>

      <llm-optimizer-score-trend :url="data.site.baseUrl"></llm-optimizer-score-trend>

      <u-card variant="subtle" aria-label="Scan history">
        <h2 class="mb-4 text-xs font-medium uppercase tracking-widest text-dimmed">
          {{ t('pages.llmOptimizer.sites.history') }}
        </h2>
        <ol v-if="data.scans.length" class="border-t border-default divide-y divide-default">
          <li v-for="scan in data.scans" :key="scan.id">
            <nuxt-link
              :to="`/labs/llm-vo/result/${scan.id}`"
              class="grid grid-cols-[1.5rem_minmax(0,1fr)_auto_auto] items-center gap-3 py-2.5 transition-colors hover:text-highlighted"
            >
              <span class="font-bold tabular-nums" :style="{ color: gradeColorVar(scan.grade) }">{{ scan.grade }}</span>
              <span class="truncate text-sm">{{ displayHost(scan.url) }}</span>
              <span class="text-xs text-dimmed tabular-nums whitespace-nowrap">{{ shortDate(scan.scannedAt) }}</span>
              <span class="text-xs text-dimmed tabular-nums">{{ scan.visibilityScore }}</span>
            </nuxt-link>
          </li>
        </ol>
        <p v-else class="text-muted">
          {{ t('pages.llmOptimizer.sites.noScans') }}
        </p>
      </u-card>
    </template>

    <u-modal
      v-model:open="deleteOpen"
      :title="t('pages.llmOptimizer.sites.deleteTitle')"
      :description="t('pages.llmOptimizer.sites.deleteDesc')"
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
import type { ScanSummary, Site } from '#shared/types/llm-optimizer'

definePageMeta({ key: route => route.fullPath })

const route = useRoute()
const { t } = useI18n()
const { resolveIcon } = useAppearance()
const id = String(route.params.id)

const { data, error } = await useFetch<{ site: Site, scans: ScanSummary[] }>(`/api/llm-optimizer/sites/${id}`)

const deleteOpen = ref(false)
const deleting = ref(false)
async function confirmDelete() {
  deleting.value = true
  try {
    await $fetch(`/api/llm-optimizer/sites/${id}`, { method: 'DELETE' })
    await navigateTo('/labs/llm-vo/sites')
  }
  finally {
    deleting.value = false
  }
}

const displayHost = (url: string): string => url.replace(/^https?:\/\//, '').replace(/\/$/, '')
const shortDate = (iso: string): string => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

useSeoMeta({ title: () => data.value ? `${data.value.site.name} — ${t('pages.llmOptimizer.sites.crumb')}` : t('pages.llmOptimizer.sites.crumb') })
</script>
