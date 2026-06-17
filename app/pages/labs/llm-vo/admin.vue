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
      <span>{{ t('pages.llmOptimizer.admin.crumb') }}</span>
    </nav>

    <section>
      <h1 class="text-3xl font-bold text-pretty">
        {{ t('pages.llmOptimizer.admin.title') }}
      </h1>
      <p class="text-muted mt-1">
        {{ t('pages.llmOptimizer.admin.subtitle') }}
      </p>
    </section>

    <template v-if="data">
      <div class="grid gap-4 sm:grid-cols-3">
        <u-card
          v-for="stat in stats"
          :key="stat.label"
          variant="subtle"
        >
          <p class="text-xs font-medium uppercase tracking-wider text-dimmed">
            {{ stat.label }}
          </p>
          <p class="mt-1.5 text-3xl font-bold tabular-nums">
            {{ stat.value }}
          </p>
        </u-card>
      </div>

      <u-card variant="subtle" aria-label="System health">
        <h2 class="mb-4 text-xs font-medium uppercase tracking-widest text-dimmed">
          {{ t('pages.llmOptimizer.admin.system') }}
        </h2>
        <dl>
          <div class="flex items-center justify-between gap-3 py-2.5 border-t border-default text-sm">
            <dt class="text-muted">
              {{ t('pages.llmOptimizer.admin.aiProviders') }}
            </dt>
            <dd>
              <span v-if="data.providers.length" class="inline-flex flex-wrap gap-1.5">
                <u-badge
                  v-for="p in data.providers"
                  :key="p.provider"
                  color="neutral"
                  variant="subtle"
                  :label="p.label"
                ></u-badge>
              </span>
              <span v-else class="text-dimmed">{{ t('pages.llmOptimizer.admin.none') }}</span>
            </dd>
          </div>
          <div class="flex items-center justify-between gap-3 py-2.5 border-t border-default text-sm">
            <dt class="text-muted">
              {{ t('pages.llmOptimizer.admin.renderEngine') }}
            </dt>
            <dd>
              <u-badge
                :color="data.renderEnabled ? 'success' : 'neutral'"
                variant="subtle"
                :label="data.renderEnabled ? t('pages.llmOptimizer.admin.enabled') : t('pages.llmOptimizer.admin.disabled')"
              ></u-badge>
            </dd>
          </div>
        </dl>
      </u-card>

      <u-card variant="subtle" aria-label="User management">
        <h2 class="mb-4 text-xs font-medium uppercase tracking-widest text-dimmed">
          {{ t('pages.llmOptimizer.admin.userManagement') }}
        </h2>
        <p class="text-sm text-dimmed mb-4">
          {{ t('pages.llmOptimizer.admin.userManagementHint') }}
        </p>
        <u-button
          to="/app/admin/users"
          color="neutral"
          variant="subtle"
          :icon="resolveIcon('users')"
          :trailing-icon="resolveIcon('arrowRight')"
          :label="t('pages.llmOptimizer.admin.openUsers')"
        ></u-button>
      </u-card>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { AdminOverview } from '#shared/types/llm-optimizer'

definePageMeta({ middleware: 'admin' })

const { t, locale } = useI18n()
const { resolveIcon } = useAppearance()

const { data } = await useFetch<AdminOverview>('/api/llm-optimizer/admin/overview')

const numberFmt = computed(() => new Intl.NumberFormat(locale.value))

const stats = computed(() => {
  const d = data.value
  if (!d)
    return []
  return [
    { label: t('pages.llmOptimizer.admin.totalScans'), value: numberFmt.value.format(d.totalScans) },
    { label: t('pages.llmOptimizer.admin.totalSites'), value: numberFmt.value.format(d.totalSites) },
    { label: t('pages.llmOptimizer.admin.totalCompetitors'), value: numberFmt.value.format(d.totalCompetitors) },
  ]
})

useSeoMeta({ title: () => t('pages.llmOptimizer.admin.title') })
</script>
