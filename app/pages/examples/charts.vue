<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">
          Charts
        </h1>
        <p class="text-muted mt-1">
          Interactive charts powered by Unovis
        </p>
      </div>
      <u-button
        to="/examples"
        label="Back to Examples"
        color="neutral"
        variant="soft"
        :icon="resolveIcon('arrowLeft')"
      ></u-button>
    </div>

    <!-- Line Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <u-card>
        <template #header>
          <div class="flex items-center gap-2">
            <u-icon :name="resolveIcon('chartLine')" class="size-5 text-primary"></u-icon>
            <h2 class="font-semibold">
              Line Chart with Area
            </h2>
          </div>
        </template>

        <charts-line-chart
          :data="revenueData"
          subtitle="Annual Revenue"
          :height="280"
          :show-area="true"
        ></charts-line-chart>
      </u-card>

      <u-card>
        <template #header>
          <div class="flex items-center gap-2">
            <u-icon :name="resolveIcon('chartLine')" class="size-5 text-primary"></u-icon>
            <h2 class="font-semibold">
              Line Chart (No Area)
            </h2>
          </div>
        </template>

        <charts-line-chart
          :data="visitsData"
          subtitle="Weekly Visits"
          :height="280"
          :show-area="false"
        ></charts-line-chart>
      </u-card>
    </div>

    <!-- Donut Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <u-card>
        <template #header>
          <div class="flex items-center gap-2">
            <u-icon :name="resolveIcon('chartDonut')" class="size-5 text-success"></u-icon>
            <h2 class="font-semibold">
              Donut Chart
            </h2>
          </div>
        </template>

        <charts-donut-chart
          title="Content by Status"
          :data="statusData"
          :size="180"
        ></charts-donut-chart>
      </u-card>

      <u-card>
        <template #header>
          <div class="flex items-center gap-2">
            <u-icon :name="resolveIcon('chartDonut')" class="size-5 text-success"></u-icon>
            <h2 class="font-semibold">
              Browser Usage
            </h2>
          </div>
        </template>

        <charts-donut-chart
          title="Visitors by Browser"
          :data="browserData"
          :size="180"
        ></charts-donut-chart>
      </u-card>
    </div>

    <!-- Bar Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <u-card>
        <template #header>
          <div class="flex items-center gap-2">
            <u-icon :name="resolveIcon('chartBar')" class="size-5 text-warning"></u-icon>
            <h2 class="font-semibold">
              Bar Chart
            </h2>
          </div>
        </template>

        <charts-bar-chart
          :data="salesByCategory"
          subtitle="Sales by Category"
          :height="280"
        ></charts-bar-chart>
      </u-card>

      <u-card>
        <template #header>
          <div class="flex items-center gap-2">
            <u-icon :name="resolveIcon('chartBar')" class="size-5 text-warning"></u-icon>
            <h2 class="font-semibold">
              Weekly Performance
            </h2>
          </div>
        </template>

        <charts-bar-chart
          :data="visitsData"
          subtitle="Visits per Day"
          :height="280"
        ></charts-bar-chart>
      </u-card>
    </div>

    <!-- Info Card -->
    <u-card>
      <div class="flex items-start gap-4">
        <div class="p-3 rounded-lg bg-info/10">
          <u-icon :name="resolveIcon('info')" class="size-6 text-info"></u-icon>
        </div>
        <div>
          <h3 class="font-semibold mb-1">
            About These Charts
          </h3>
          <p class="text-muted text-sm mb-3">
            These charts are built with
            <a
              href="https://unovis.dev/"
              target="_blank"
              class="text-primary hover:underline"
            >Unovis</a>, a modular data visualization library. The same library is used by the official Nuxt UI dashboard template.
          </p>
          <div class="flex flex-wrap gap-2">
            <u-badge
              label="@unovis/vue"
              color="primary"
              variant="subtle"
            ></u-badge>
            <u-badge
              label="@unovis/ts"
              color="primary"
              variant="subtle"
            ></u-badge>
            <u-badge
              label="SSR Compatible"
              color="success"
              variant="subtle"
            ></u-badge>
          </div>
        </div>
      </div>
    </u-card>
  </div>
</template>

<script setup lang="ts">
const { resolveIcon } = useAppearance()

// Sample data for charts
const revenueData = computed(() => [
  { label: 'Jan', value: 4500 },
  { label: 'Feb', value: 3800 },
  { label: 'Mar', value: 5200 },
  { label: 'Apr', value: 4100 },
  { label: 'May', value: 6300 },
  { label: 'Jun', value: 5800 },
  { label: 'Jul', value: 7200 },
  { label: 'Aug', value: 6500 },
  { label: 'Sep', value: 8100 },
  { label: 'Oct', value: 7400 },
  { label: 'Nov', value: 9200 },
  { label: 'Dec', value: 8800 },
])

const visitsData = computed(() => [
  { label: 'Mon', value: 1200 },
  { label: 'Tue', value: 1800 },
  { label: 'Wed', value: 2100 },
  { label: 'Thu', value: 1600 },
  { label: 'Fri', value: 2400 },
  { label: 'Sat', value: 900 },
  { label: 'Sun', value: 700 },
])

const statusData = [
  { name: 'Seed', value: 12, color: 'oklch(0.7 0.1 250)' },
  { name: 'Sprout', value: 28, color: 'oklch(0.7 0.15 145)' },
  { name: 'Evergreen', value: 45, color: 'oklch(0.6 0.18 200)' },
  { name: 'Wilted', value: 8, color: 'oklch(0.7 0.15 50)' },
]

const browserData = [
  { name: 'Chrome', value: 62, color: 'oklch(0.65 0.15 145)' },
  { name: 'Safari', value: 19, color: 'oklch(0.65 0.12 220)' },
  { name: 'Firefox', value: 11, color: 'oklch(0.65 0.18 30)' },
  { name: 'Edge', value: 8, color: 'oklch(0.65 0.1 200)' },
]

const salesByCategory = computed(() => [
  { label: 'Electronics', value: 4200 },
  { label: 'Clothing', value: 3100 },
  { label: 'Books', value: 1800 },
  { label: 'Home', value: 2400 },
  { label: 'Sports', value: 1500 },
])
</script>
