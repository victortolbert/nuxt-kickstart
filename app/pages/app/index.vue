<template>
  <div class="w-full px-4 py-8 flex flex-col gap-8 md:px-6 md:py-10">
    <!-- Greeting -->
    <section class="dash-fade dash-fade--1 flex flex-col gap-1">
      <h1 class="text-2xl font-bold">
        {{ greetingText || '&nbsp;' }}
      </h1>
      <p class="text-sm text-muted">
        {{ formattedDate || '&nbsp;' }}
      </p>
    </section>

    <!-- Stat cards -->
    <section class="dash-fade dash-fade--2 grid grid-cols-2 gap-4 lg:grid-cols-4">
      <nuxt-link
        v-for="stat in stats"
        :key="stat.label"
        :to="stat.to"
        class="rounded-lg focus-visible:outline-2 focus-visible:outline-primary"
      >
        <u-card class="h-full transition-shadow hover:ring-2 hover:ring-primary">
          <div class="flex items-center gap-4">
            <div class="flex items-center justify-center p-3 rounded-lg" :class="statTone[stat.tone]?.chip">
              <u-icon
                :name="stat.icon"
                class="size-6 shrink-0"
                :class="statTone[stat.tone]?.icon"
              ></u-icon>
            </div>
            <div>
              <p class="text-3xl font-bold tabular-nums">
                {{ stat.value }}
              </p>
              <p class="text-sm text-muted">
                {{ stat.label }}
              </p>
            </div>
          </div>
        </u-card>
      </nuxt-link>
    </section>

    <!-- Quick actions -->
    <section class="dash-fade dash-fade--2 flex flex-wrap gap-3">
      <u-button
        :icon="resolveIcon('search')"
        :label="t('pages.dashboard.search')"
        variant="soft"
        @click="openSearch"
      ></u-button>
      <u-button
        :icon="resolveIcon('apps')"
        :label="t('nav.examples')"
        variant="soft"
        to="/examples"
      ></u-button>
      <u-button
        :icon="resolveIcon('components')"
        :label="t('nav.blocks')"
        variant="soft"
        to="/blocks"
      ></u-button>
      <u-button
        v-if="isAdmin"
        :icon="resolveIcon('shieldLock')"
        :label="t('nav.groups.admin')"
        variant="soft"
        to="/app/admin"
      ></u-button>
    </section>

    <!-- Charts row -->
    <section class="dash-fade dash-fade--3 grid grid-cols-1 gap-6 lg:grid-cols-3">
      <u-card class="lg:col-span-2">
        <template #header>
          <div class="flex items-center gap-2">
            <u-icon :name="resolveIcon('chartLine')" class="size-5"></u-icon>
            <h2 class="font-semibold">
              {{ t('pages.dashboard.activity') }}
            </h2>
          </div>
        </template>
        <charts-line-chart
          :data="activityData"
          :subtitle="t('pages.dashboard.activitySubtitle')"
          :height="240"
        ></charts-line-chart>
      </u-card>

      <u-card>
        <template #header>
          <div class="flex items-center gap-2">
            <u-icon :name="resolveIcon('chartDonut')" class="size-5"></u-icon>
            <h2 class="font-semibold">
              {{ t('pages.dashboard.byStatus') }}
            </h2>
          </div>
        </template>
        <charts-donut-chart
          v-if="statusData.length"
          :data="statusData"
          :size="160"
        ></charts-donut-chart>
        <p v-else class="text-sm text-muted text-center py-8">
          {{ t('pages.dashboard.noContent') }}
        </p>
      </u-card>
    </section>

    <!-- Recent content table -->
    <section class="dash-fade dash-fade--4">
      <u-card>
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <u-icon :name="resolveIcon('clock')" class="size-5"></u-icon>
              <h2 class="font-semibold">
                {{ t('pages.dashboard.recentContent') }}
              </h2>
            </div>
          </div>
        </template>

        <u-table
          v-if="dashboard.recentContent.length"
          :columns="recentColumns"
          :data="dashboard.recentContent"
        >
          <template #title-cell="{ row }">
            <nuxt-link :to="row.original.path" class="font-medium hover:text-primary">
              {{ row.original.title }}
            </nuxt-link>
          </template>
          <template #type-cell="{ row }">
            <u-badge
              :label="row.original.type === 'guide' ? t('pages.dashboard.typeGuide') : t('pages.dashboard.typePost')"
              color="neutral"
              variant="subtle"
              size="sm"
            ></u-badge>
          </template>
          <template #status-cell="{ row }">
            <status-indicator
              :status="row.original.status ?? 'seed'"
              :label="statusLabel(row.original.status ?? 'seed')"
            ></status-indicator>
          </template>
          <template #updated-cell="{ row }">
            <span class="text-sm text-muted">{{ formatDate(row.original.updated ?? row.original.created) }}</span>
          </template>
        </u-table>
        <p v-else class="text-sm text-muted text-center py-8">
          {{ t('pages.dashboard.noContent') }}
        </p>
      </u-card>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { DashboardRecentItem } from '~/composables/use-dashboard-data'

// Dashboard home page (authenticated /app route)
useHead({ title: 'Dashboard' })
defineOgImage('NuxtSeoSatori')
useSeoMeta({
  description: 'Dashboard — recent content and real metrics for your workspace.',
  ogTitle: 'Dashboard',
  ogDescription: 'Recent content and real metrics for your workspace.',
})

const { t, te, locale } = useI18n()
const { resolveIcon } = useAppearance()

const dashboard = useDashboardData()
const { user, isAdmin } = useSessionState()

// Hydration-safe date: initialized on mount
const now = ref<Date | null>(null)
onMounted(() => {
  now.value = new Date()
})

const greeting = computed(() => {
  if (!now.value)
    return ''
  const hour = now.value.getHours()
  if (hour >= 5 && hour < 12)
    return t('pages.dashboard.goodMorning')
  if (hour >= 12 && hour < 17)
    return t('pages.dashboard.goodAfternoon')
  return t('pages.dashboard.goodEvening')
})

const greetingText = computed(() => {
  if (!greeting.value)
    return ''
  return user.value?.name ? `${greeting.value}, ${user.value.name}` : greeting.value
})

const formattedDate = computed(() => {
  if (!now.value)
    return ''
  return now.value.toLocaleDateString(locale.value, { weekday: 'long', month: 'long', day: 'numeric' })
})

// Stat cards — real counts, examples-style icon chips
const statTone: Record<string, { chip: string, icon: string }> = {
  primary: { chip: 'bg-primary/10', icon: 'text-primary' },
  success: { chip: 'bg-success/10', icon: 'text-success' },
  info: { chip: 'bg-info/10', icon: 'text-info' },
  warning: { chip: 'bg-warning/10', icon: 'text-warning' },
}

const stats = computed(() => [
  { label: t('nav.guides'), value: dashboard.value.counts.guides, icon: resolveIcon('book2'), tone: 'primary', to: '/guides' },
  { label: t('nav.posts'), value: dashboard.value.counts.posts, icon: resolveIcon('fileText'), tone: 'success', to: '/posts' },
  { label: t('nav.tech'), value: dashboard.value.counts.tech, icon: resolveIcon('cpu'), tone: 'info', to: '/tech' },
  { label: t('nav.blocks'), value: dashboard.value.counts.blocks, icon: resolveIcon('components'), tone: 'warning', to: '/blocks' },
])

// Real per-month activity → line chart
const monthFormatter = computed(() => new Intl.DateTimeFormat(locale.value, { month: 'short' }))
const activityData = computed(() =>
  dashboard.value.monthlyActivity.map(({ key, value }) => {
    const [y, m] = key.split('-').map(Number)
    return { label: monthFormatter.value.format(new Date(y!, m! - 1, 1)), value }
  }),
)

// Real status distribution → donut chart, colored + iconed by the garden
// lifecycle (see app/utils/garden-status.ts) so the ring + legend match the
// status badges used elsewhere.
function statusLabel(status: string): string {
  const key = `pages.dashboard.status.${status}`
  return te(key) ? t(key) : formatLabel(status)
}
const statusData = computed(() =>
  dashboard.value.statusBreakdown.map(({ status, value }) => ({
    name: statusLabel(status),
    value,
    color: gardenStatusColorVar(status),
    icon: resolveIcon(gardenStatus(status).icon),
  })),
)

const dateFormatter = computed(() => new Intl.DateTimeFormat(locale.value, { month: 'short', day: 'numeric', year: 'numeric' }))
function formatDate(dateStr: string | undefined): string {
  return dateStr ? dateFormatter.value.format(new Date(dateStr)) : ''
}

const recentColumns = computed<TableColumn<DashboardRecentItem>[]>(() => [
  { accessorKey: 'title', header: t('pages.dashboard.colTitle') },
  { accessorKey: 'type', header: t('pages.dashboard.colType') },
  { accessorKey: 'status', header: t('pages.dashboard.colStatus') },
  { accessorKey: 'updated', header: t('pages.dashboard.colUpdated') },
])

function openSearch() {
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', code: 'KeyK', metaKey: true, bubbles: true, cancelable: true }))
}
</script>

<style scoped>
.dash-fade {
  animation: dashFadeUp 0.4s ease-out both;
}
.dash-fade--1 { animation-delay: 0ms; }
.dash-fade--2 { animation-delay: 60ms; }
.dash-fade--3 { animation-delay: 120ms; }
.dash-fade--4 { animation-delay: 180ms; }

@keyframes dashFadeUp {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  .dash-fade { animation: none; opacity: 1; transform: none; }
}
</style>
