<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-3xl font-bold">
          {{ t('nav.overview') }}
        </h1>
        <p class="text-muted mt-1">
          {{ t('pages.examples.subtitle') }}
        </p>
      </div>
      <div class="flex flex-wrap gap-2">
        <u-button
          to="/examples/tables"
          :label="t('nav.tables')"
          color="neutral"
          variant="soft"
          :icon="resolveIcon('table')"
        ></u-button>
        <u-button
          to="/examples/charts"
          :label="t('nav.charts')"
          color="neutral"
          variant="soft"
          :icon="resolveIcon('chartLine')"
        ></u-button>
        <u-button
          to="/examples/calendar"
          :label="t('nav.calendar')"
          color="neutral"
          variant="soft"
          :icon="resolveIcon('calendar')"
        ></u-button>
        <u-button
          to="/examples/maps"
          :label="t('nav.maps')"
          color="neutral"
          variant="soft"
          :icon="resolveIcon('map')"
        ></u-button>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <u-card v-for="stat in stats" :key="stat.label">
        <div class="flex items-center gap-4">
          <div
            class="flex items-center justify-center p-3 rounded-lg"
            :class="statTone[stat.color]?.chip"
          >
            <u-icon
              :name="stat.icon"
              class="size-6 shrink-0"
              :class="statTone[stat.color]?.icon"
            ></u-icon>
          </div>
          <div>
            <p class="text-3xl font-bold">
              {{ stat.value }}
            </p>
            <p class="text-sm text-muted">
              {{ stat.label }}
            </p>
          </div>
        </div>
      </u-card>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Activity Overview -->
      <u-card class="lg:col-span-2">
        <template #header>
          <div class="flex items-center gap-2">
            <u-icon :name="resolveIcon('chartLine')" class="size-5"></u-icon>
            <h2 class="font-semibold">
              {{ t('pages.examples.activityOverview') }}
            </h2>
          </div>
        </template>

        <charts-line-chart
          :data="activityData"
          :subtitle="t('pages.examples.totalActivity')"
          :height="256"
        ></charts-line-chart>
      </u-card>

      <!-- Content Status -->
      <u-card>
        <template #header>
          <div class="flex items-center gap-2">
            <u-icon :name="resolveIcon('chartDonut')" class="size-5"></u-icon>
            <h2 class="font-semibold">
              {{ t('pages.examples.contentStatus') }}
            </h2>
          </div>
        </template>

        <charts-donut-chart
          :data="contentByStatus"
          :size="160"
        ></charts-donut-chart>
      </u-card>
    </div>

    <!-- Second Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Projects Table -->
      <u-card>
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <u-icon :name="resolveIcon('folder')" class="size-5"></u-icon>
              <h2 class="font-semibold">
                {{ t('pages.examples.recentProjects') }}
              </h2>
            </div>
            <nuxt-link
              to="/examples/tables"
              class="text-sm text-primary hover:underline"
            >
              {{ t('pages.examples.viewAll') }} →
            </nuxt-link>
          </div>
        </template>

        <u-table :columns="recentProjectColumns" :data="recentProjects">
          <template #name-cell="{ row }">
            <div class="flex items-center gap-2">
              <div class="flex items-center gap-1">
                <tech-badge
                  v-for="tech in row.original.tech.slice(0, 2)"
                  :key="tech"
                  :slug="tech"
                  size="xs"
                  mode="icon"
                ></tech-badge>
              </div>
              <span class="font-medium">{{ row.original.name }}</span>
            </div>
          </template>
          <template #status-cell="{ row }">
            <status-indicator :status="row.original.status"></status-indicator>
          </template>
          <template #progress-cell="{ row }">
            <div class="flex items-center gap-2">
              <u-progress
                :model-value="row.original.progress"
                size="sm"
                class="w-16"
              ></u-progress>
              <span class="text-xs text-muted">{{ row.original.progress }}%</span>
            </div>
          </template>
        </u-table>
      </u-card>

      <!-- Upcoming Events -->
      <u-card>
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <u-icon :name="resolveIcon('calendarEvent')" class="size-5"></u-icon>
              <h2 class="font-semibold">
                {{ t('pages.examples.upcomingEvents') }}
              </h2>
            </div>
            <nuxt-link
              to="/examples/calendar"
              class="text-sm text-primary hover:underline"
            >
              {{ t('pages.examples.openCalendar') }} →
            </nuxt-link>
          </div>
        </template>

        <client-only>
          <div class="space-y-3">
            <div
              v-for="event in upcomingEvents"
              :key="event.id"
              class="flex items-center gap-3 p-3 rounded border border-default"
            >
              <div
                class="w-1 h-10 rounded-full"
                :style="{ backgroundColor: eventColor(event) }"
              />
              <div class="flex-1 min-w-0">
                <p class="font-medium truncate">
                  {{ event.title }}
                </p>
                <p class="text-sm text-muted">
                  {{ formatEventDate(event.start) }}
                  <span v-if="!event.allDay">
                    · {{ formatEventTime(event.start) }}
                  </span>
                </p>
              </div>
              <u-badge
                v-if="event.allDay"
                :label="t('pages.examples.allDay')"
                size="sm"
                color="neutral"
                variant="subtle"
              ></u-badge>
            </div>

            <p
              v-if="upcomingEvents.length === 0"
              class="text-center text-muted py-4"
            >
              {{ t('pages.examples.noUpcomingEvents') }}
            </p>
          </div>
          <template #fallback>
            <div class="space-y-3">
              <div
                v-for="i in 3"
                :key="i"
                class="h-16 bg-muted/20 rounded animate-pulse"
              />
            </div>
          </template>
        </client-only>
      </u-card>
    </div>

    <!-- Quick Links -->
    <u-card>
      <template #header>
        <div class="flex items-center gap-2">
          <u-icon :name="resolveIcon('apps')" class="size-5"></u-icon>
          <h2 class="font-semibold">
            {{ t('pages.examples.componentExamples') }}
          </h2>
        </div>
      </template>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <nuxt-link
          to="/examples/tables"
          class="flex flex-col items-center gap-2 p-4 rounded border border-default hover:bg-elevated transition-colors"
        >
          <u-icon :name="resolveIcon('table')" class="size-8 text-success"></u-icon>
          <span class="font-medium">{{ t('nav.tables') }}</span>
          <span class="text-xs text-muted">{{ t('pages.examples.tablesTagline') }}</span>
        </nuxt-link>

        <nuxt-link
          to="/examples/charts"
          class="flex flex-col items-center gap-2 p-4 rounded border border-default hover:bg-elevated transition-colors"
        >
          <u-icon :name="resolveIcon('chartLine')" class="size-8 text-primary"></u-icon>
          <span class="font-medium">{{ t('nav.charts') }}</span>
          <span class="text-xs text-muted">{{ t('pages.examples.chartsTagline') }}</span>
        </nuxt-link>

        <nuxt-link
          to="/examples/calendar"
          class="flex flex-col items-center gap-2 p-4 rounded border border-default hover:bg-elevated transition-colors"
        >
          <u-icon :name="resolveIcon('calendar')" class="size-8 text-warning"></u-icon>
          <span class="font-medium">{{ t('nav.calendar') }}</span>
          <span class="text-xs text-muted">{{ t('pages.examples.calendarTagline') }}</span>
        </nuxt-link>

        <nuxt-link
          to="/examples/maps"
          class="flex flex-col items-center gap-2 p-4 rounded border border-default hover:bg-elevated transition-colors"
        >
          <u-icon :name="resolveIcon('map')" class="size-8 text-info"></u-icon>
          <span class="font-medium">{{ t('nav.maps') }}</span>
          <span class="text-xs text-muted">{{ t('pages.examples.mapsTagline') }}</span>
        </nuxt-link>
      </div>
    </u-card>
  </div>
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { SampleProject } from '~/composables/use-sample-data'

const { t, locale } = useI18n()

const { projects, calendarEvents, contentByStatus } = useSampleData()
const { resolveIcon } = useAppearance()

// Generate activity data for the line chart — values seeded once so the
// chart doesn't reshuffle on locale switch; labels stay locale-aware
const activityValues = useState('examples-activity-values', () =>
  Array.from({ length: 6 }, () => Math.floor(Math.random() * 50) + 20))

const activityData = computed(() => {
  const monthFormatter = new Intl.DateTimeFormat(locale.value, { month: 'short' })
  const now = new Date()

  return activityValues.value.map((value, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1)
    return { label: monthFormatter.format(date), value }
  })
})

// Static map so Tailwind sees full literal class names
const statTone: Record<string, { chip: string, icon: string }> = {
  primary: { chip: 'bg-primary/10', icon: 'text-primary' },
  success: { chip: 'bg-success/10', icon: 'text-success' },
  info: { chip: 'bg-info/10', icon: 'text-info' },
  warning: { chip: 'bg-warning/10', icon: 'text-warning' },
}

// Quick stats
const stats = computed(() => [
  { label: t('pages.examples.totalProjects'), value: projects.length, icon: resolveIcon('folder'), color: 'primary' },
  { label: t('pages.examples.active'), value: projects.filter(p => p.status === 'sprout').length, icon: resolveIcon('sprout'), color: 'success' },
  { label: t('pages.examples.completed'), value: projects.filter(p => p.status === 'evergreen').length, icon: resolveIcon('check'), color: 'info' },
  { label: t('pages.examples.upcomingEvents'), value: calendarEvents.length, icon: resolveIcon('calendar'), color: 'warning' },
])

// Recent projects for quick table
const recentProjects = projects.slice(0, 5)

// Table columns
const recentProjectColumns = computed<TableColumn<SampleProject>[]>(() => [
  { accessorKey: 'name', header: t('pages.examples.project') },
  { accessorKey: 'status', header: t('pages.examples.status') },
  { accessorKey: 'progress', header: t('pages.examples.progress') },
])

// Upcoming events (next 7 days) - computed on client to avoid hydration mismatch
const upcomingEvents = ref<typeof calendarEvents>([])

onMounted(() => {
  const now = new Date()
  const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
  upcomingEvents.value = calendarEvents
    .filter((e) => {
      const eventDate = new Date(e.start)
      return eventDate >= now && eventDate <= weekFromNow
    })
    .slice(0, 4)
})

// Map calendar classNames to the theme color they render with in FullCalendar
const EVENT_CLASS_COLORS: Record<string, string> = {
  'fc-event-primary': 'var(--color-primary-500)',
  'fc-event-accent-1': 'var(--color-chart-1)',
  'fc-event-accent-2': 'var(--color-chart-2)',
  'fc-event-accent-3': 'var(--color-chart-3)',
}

function eventColor(event: { backgroundColor?: string, classNames?: string[] }) {
  if (event.backgroundColor)
    return event.backgroundColor
  const cls = event.classNames?.find(c => EVENT_CLASS_COLORS[c])
  return cls ? EVENT_CLASS_COLORS[cls] : 'var(--color-primary-500)'
}

// Helper to format event date (only used client-side)
function formatEventDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString(locale.value, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

function formatEventTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString(locale.value, {
    hour: 'numeric',
    minute: '2-digit',
  })
}
</script>
