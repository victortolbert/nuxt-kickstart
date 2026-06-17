<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold">
        Email Analytics
      </h1>
      <p class="text-muted mt-1">
        View engagement stats for sent emails
      </p>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <u-icon :name="resolveIcon('loading')" class="animate-spin size-8 text-muted"></u-icon>
    </div>

    <!-- Empty state -->
    <div v-else-if="!emailStats.length" class="text-center py-12">
      <u-icon :name="resolveIcon('chartBar')" class="size-12 text-muted mx-auto mb-4"></u-icon>
      <p class="text-muted">
        No sent emails found
      </p>
      <u-button
        to="/app/admin/email/compose"
        color="primary"
        class="mt-4"
      >
        <u-icon :name="resolveIcon('pencil')"></u-icon>
        Compose Email
      </u-button>
    </div>

    <!-- Analytics table -->
    <u-card v-else>
      <table class="w-full">
        <thead>
          <tr class="border-b border-border">
            <th class="text-left py-3 px-4">
              Subject
            </th>
            <th class="text-left py-3 px-4">
              Sent Date
            </th>
            <th class="text-right py-3 px-4">
              Recipients
            </th>
            <th class="text-right py-3 px-4">
              Opens
            </th>
            <th class="text-right py-3 px-4">
              Clicks
            </th>
            <th class="text-right py-3 px-4">
              Open Rate
            </th>
            <th class="text-right py-3 px-4">
              Click Rate
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="stat in emailStats"
            :key="stat.emailId"
            class="border-b border-border last:border-0 hover:bg-muted cursor-pointer"
            @click="$router.push(`/admin/email/analytics/${stat.emailId}`)"
          >
            <td class="py-3 px-4">
              {{ stat.subject }}
            </td>
            <td class="py-3 px-4 text-muted">
              {{ formatDate(stat.sentAt) }}
            </td>
            <td class="py-3 px-4 text-right">
              {{ stat.recipientCount }}
            </td>
            <td class="py-3 px-4 text-right">
              {{ stat.uniqueOpens }}
            </td>
            <td class="py-3 px-4 text-right">
              {{ stat.totalClicks }}
            </td>
            <td class="py-3 px-4 text-right">
              {{ formatPercent(stat.openRate) }}
            </td>
            <td class="py-3 px-4 text-right">
              {{ formatPercent(stat.clickRate) }}
            </td>
          </tr>
        </tbody>
      </table>
    </u-card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'admin',
})

const { resolveIcon } = useAppearance()

// Query sent drafts
const { data: sentDrafts, status: draftsStatus } = await useAsyncData(
  'sentEmailDrafts',
  () => queryCollection('emailDrafts')
    .where('status', '=', 'sent')
    .order('sentAt', 'DESC')
    .all(),
)

// Query all analytics
const { data: allAnalytics, status: analyticsStatus } = await useAsyncData(
  'emailAnalytics',
  () => queryCollection('emailAnalytics').all(),
)

// Compute analytics for each sent email
const emailStats = computed(() => {
  if (!sentDrafts.value || !allAnalytics.value)
    return []

  return sentDrafts.value.map((draft) => {
    // Extract email ID from draft path (e.g., "email-1234567890" or "draft-1234567890")
    const emailId = draft.path.split('/').pop()?.replace('.md', '') || ''

    // Find all analytics records for this email
    const analytics = (allAnalytics.value || []).filter(a => a.emailId === emailId)

    // Count unique recipients who opened (has at least one open event)
    const uniqueOpens = new Set(
      analytics.filter(a => a.opens && a.opens.length > 0).map(a => a.recipient),
    ).size

    // Count total clicks across all recipients
    const totalClicks = analytics.reduce(
      (sum, a) => sum + (a.clicks?.length || 0),
      0,
    )

    // Get recipient count
    const recipientCount = draft.recipients?.length || 0

    // Calculate rates
    const openRate = recipientCount > 0 ? (uniqueOpens / recipientCount) * 100 : 0
    const clickRate = recipientCount > 0 ? (totalClicks / recipientCount) * 100 : 0

    return {
      emailId,
      subject: draft.subject || 'Untitled',
      sentAt: draft.sentAt,
      recipientCount,
      uniqueOpens,
      totalClicks,
      openRate,
      clickRate,
    }
  })
})

// Format date
function formatDate(dateStr?: string): string {
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

// Format percentage
function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`
}

const isLoading = computed(() => draftsStatus.value === 'pending' || analyticsStatus.value === 'pending')
</script>
