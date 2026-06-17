<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold">
        Email Drafts
      </h1>
      <p class="text-muted mt-1">
        Manage your draft, scheduled, and sent emails
      </p>
    </div>

    <!-- Filter tabs -->
    <div class="mb-6">
      <u-radio-group
        v-model="statusFilter"
        :items="tabs"
        orientation="horizontal"
      ></u-radio-group>
    </div>

    <!-- Loading state -->
    <div v-if="status === 'pending'" class="flex justify-center py-12">
      <u-icon :name="resolveIcon('loading')" class="animate-spin size-8 text-muted"></u-icon>
    </div>

    <!-- Empty state -->
    <div v-else-if="!drafts.length" class="text-center py-12">
      <u-icon :name="resolveIcon('inbox')" class="size-12 text-muted mx-auto mb-4"></u-icon>
      <p class="text-muted">
        No {{ statusFilter === 'all' ? '' : statusFilter }} emails found
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

    <!-- Drafts table -->
    <u-card v-else>
      <table class="w-full">
        <thead>
          <tr class="border-b border-border">
            <th class="text-left py-3 px-4">
              Subject
            </th>
            <th class="text-left py-3 px-4">
              Status
            </th>
            <th class="text-left py-3 px-4">
              Recipients
            </th>
            <th class="text-left py-3 px-4">
              Scheduled
            </th>
            <th class="text-left py-3 px-4">
              Created
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="draft in drafts"
            :key="draft.path"
            class="border-b border-border last:border-0 hover:bg-muted cursor-pointer"
            @click="openDraft(draft)"
          >
            <td class="py-3 px-4">
              {{ draft.subject || 'Untitled' }}
            </td>
            <td class="py-3 px-4">
              <u-badge :color="getStatusColor(draft.status || 'draft')">
                {{ draft.status || 'draft' }}
              </u-badge>
            </td>
            <td class="py-3 px-4">
              <u-icon :name="resolveIcon('users')" class="size-4 inline mr-1"></u-icon>
              {{ getRecipientCount(draft) }}
            </td>
            <td class="py-3 px-4">
              {{ formatDate(draft.scheduledAt) }}
            </td>
            <td class="py-3 px-4 text-muted">
              {{ formatDate(draft.createdAt) }}
            </td>
          </tr>
        </tbody>
      </table>
    </u-card>
  </div>
</template>

<script setup lang="ts">
// Email draft item type
interface EmailDraft {
  path: string
  subject?: string
  status?: string
  recipients?: string[]
  scheduledAt?: string
  createdAt?: string
}

definePageMeta({
  middleware: 'admin',
})

const router = useRouter()
const { resolveIcon } = useAppearance()

// Filter tabs state
const statusFilter = ref<'all' | 'draft' | 'scheduled' | 'sent'>('all')

// Query all drafts
const { data: allDrafts, status } = await useAsyncData(
  'emailDrafts',
  () => queryCollection('emailDrafts').order('createdAt', 'DESC').all(),
)

// Filtered drafts based on selected tab
const drafts = computed(() => {
  if (!allDrafts.value)
    return []
  if (statusFilter.value === 'all')
    return allDrafts.value
  return allDrafts.value.filter(draft => draft.status === statusFilter.value)
})

// Tab items
const tabs = [
  { value: 'all', label: 'All' },
  { value: 'draft', label: 'Drafts' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'sent', label: 'Sent' },
]

// Navigate to compose page with draft ID
function openDraft(draft: EmailDraft) {
  const draftId = draft.path.split('/').pop()?.replace('.md', '')
  router.push(`/admin/email/compose?draft=${draftId}`)
}

// Get recipient count
function getRecipientCount(draft: EmailDraft): number {
  return draft.recipients?.length || 0
}

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

// Status badge color
function getStatusColor(status: string): 'neutral' | 'warning' | 'success' {
  switch (status) {
    case 'scheduled':
      return 'warning'
    case 'sent':
      return 'success'
    default:
      return 'neutral'
  }
}
</script>
