<template>
  <div>
    <!-- Header with back button -->
    <div class="mb-6">
      <u-button
        to="/app/admin/email/analytics"
        variant="ghost"
        color="neutral"
        class="mb-4"
      >
        <u-icon :name="resolveIcon('arrowLeft')"></u-icon>
        Back to Analytics
      </u-button>

      <h1 class="text-2xl font-bold">
        {{ draft?.subject || 'Email Analytics Detail' }}
      </h1>
      <p class="text-muted mt-1">
        Sent {{ formatDate(draft?.sentAt) }}
      </p>
    </div>

    <!-- Recipients table -->
    <u-card class="mb-6">
      <template #header>
        <h2 class="text-lg font-semibold">
          Recipients ({{ recipientStats.length }})
        </h2>
      </template>

      <table class="w-full">
        <thead>
          <tr class="border-b border-border">
            <th class="text-left py-3 px-4">
              Email
            </th>
            <th class="text-left py-3 px-4">
              Opened
            </th>
            <th class="text-right py-3 px-4">
              Clicks
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="stat in recipientStats"
            :key="stat.email"
            class="border-b border-border last:border-0"
          >
            <td class="py-3 px-4">
              {{ stat.email }}
            </td>
            <td class="py-3 px-4">
              <div v-if="stat.opened" class="flex items-center gap-2">
                <u-icon :name="resolveIcon('check')" class="text-success"></u-icon>
                <span class="text-muted text-sm">
                  {{ formatDate(stat.firstOpenTime) }}
                </span>
              </div>
              <div v-else class="flex items-center gap-2">
                <u-icon :name="resolveIcon('close')" class="text-muted"></u-icon>
                <span class="text-muted text-sm">Not opened</span>
              </div>
            </td>
            <td class="py-3 px-4 text-right">
              {{ stat.clickCount }}
            </td>
          </tr>
        </tbody>
      </table>
    </u-card>

    <!-- Clicked URLs -->
    <u-card v-if="clickedUrls.length > 0">
      <template #header>
        <h2 class="text-lg font-semibold">
          Clicked Links ({{ clickedUrls.length }})
        </h2>
      </template>

      <div class="space-y-3">
        <div
          v-for="urlStat in clickedUrls"
          :key="urlStat.url"
          class="flex items-center justify-between py-2 px-4 bg-muted rounded"
        >
          <a
            :href="urlStat.url"
            target="_blank"
            rel="noopener noreferrer"
            class="text-primary hover:underline truncate flex-1 mr-4"
          >
            {{ urlStat.url }}
          </a>
          <u-badge color="neutral">
            {{ urlStat.count }} {{ urlStat.count === 1 ? 'click' : 'clicks' }}
          </u-badge>
        </div>
      </div>
    </u-card>

    <!-- No clicks state -->
    <u-card v-else>
      <template #header>
        <h2 class="text-lg font-semibold">
          Clicked Links
        </h2>
      </template>

      <div class="text-center py-8">
        <u-icon :name="resolveIcon('linkOff')" class="size-12 text-muted mx-auto mb-4"></u-icon>
        <p class="text-muted">
          No links have been clicked yet
        </p>
      </div>
    </u-card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'admin',
})

const route = useRoute()
const { resolveIcon } = useAppearance()
const emailId = route.params.id as string

// Query the specific draft
const { data: draft } = await useAsyncData(
  `emailDraft-${emailId}`,
  () => queryCollection('emailDrafts')
    .where('path', '=', `email-drafts/${emailId}.md`)
    .first(),
)

// Query analytics for this email
const { data: analytics } = await useAsyncData(
  `emailAnalytics-${emailId}`,
  () => queryCollection('emailAnalytics')
    .where('emailId', '=', emailId)
    .all(),
)

// Compute per-recipient stats
const recipientStats = computed(() => {
  if (!analytics.value || !draft.value)
    return []

  const recipientMap = new Map()

  // Initialize all recipients from draft
  draft.value.recipients?.forEach((email) => {
    recipientMap.set(email, {
      email,
      opened: false,
      firstOpenTime: null as string | null,
      clickCount: 0,
    })
  })

  // Add analytics data
  analytics.value.forEach((record) => {
    const stat = recipientMap.get(record.recipient)
    if (stat) {
      // Track opens
      if (record.opens && record.opens.length > 0) {
        stat.opened = true
        stat.firstOpenTime = record.opens[0]?.timestamp || null
      }

      // Track clicks
      stat.clickCount = record.clicks?.length || 0
    }
  })

  return [...recipientMap.values()]
})

// Compute clicked URLs
const clickedUrls = computed(() => {
  if (!analytics.value)
    return []

  const urlMap = new Map<string, number>()

  analytics.value.forEach((record) => {
    record.clicks?.forEach((click) => {
      const url = click.url
      urlMap.set(url, (urlMap.get(url) || 0) + 1)
    })
  })

  return Array.from(urlMap.entries(), ([url, count]) => ({ url, count }))
    .sort((a, b) => b.count - a.count)
})

// Format date
function formatDate(dateStr?: string | null): string {
  if (!dateStr)
    return 'N/A'
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>
