<template>
  <div class="p-4 space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold">
        Admin Dashboard
      </h1>
      <p class="text-sm text-muted mt-1">
        System overview and user statistics
      </p>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <u-card v-for="i in 4" :key="i">
        <div class="animate-pulse space-y-2">
          <div class="h-4 bg-muted rounded w-1/2" />
          <div class="h-8 bg-muted rounded w-1/3" />
        </div>
      </u-card>
    </div>

    <!-- Error state -->
    <u-card v-else-if="error">
      <div class="text-center py-4">
        <u-icon :name="resolveIcon('caution')" class="size-8 text-error mx-auto mb-2"></u-icon>
        <p class="text-error">
          {{ error }}
        </p>
      </div>
    </u-card>

    <!-- Stats -->
    <template v-else>
      <!-- User Stats -->
      <div>
        <h2 class="text-lg font-semibold mb-3">
          User Statistics
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <!-- Total Users -->
          <u-card>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-muted">
                  Total Users
                </p>
                <p class="text-3xl font-bold mt-1">
                  {{ totalUsers }}
                </p>
              </div>
              <u-icon :name="resolveIcon('users')" class="size-8 text-muted"></u-icon>
            </div>
          </u-card>

          <!-- Users by Role -->
          <u-card v-for="(count, role) in usersByRole" :key="role">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-muted flex items-center gap-2">
                  {{ formatLabel(role as string) }}
                  <u-badge size="sm" :color="roleColor(role as string)">
                    {{ role }}
                  </u-badge>
                </p>
                <p class="text-3xl font-bold mt-1">
                  {{ count }}
                </p>
              </div>
              <u-icon
                :name="role === 'admin' ? resolveIcon('shield') : role === 'editor' ? resolveIcon('edit') : resolveIcon('eye')"
                class="size-8 text-muted"
              ></u-icon>
            </div>
          </u-card>

          <!-- Recent Signups -->
          <u-card>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-muted">
                  Signups (7 days)
                </p>
                <p class="text-3xl font-bold mt-1">
                  {{ recentSignups }}
                </p>
              </div>
              <u-icon :name="resolveIcon('userPlus')" class="size-8 text-muted"></u-icon>
            </div>
          </u-card>
        </div>
      </div>

      <!-- System Info -->
      <div v-if="systemInfo">
        <h2 class="text-lg font-semibold mb-3">
          System Information
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <u-card>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-muted">
                  Nuxt Version
                </p>
                <p class="text-lg font-semibold mt-1">
                  {{ systemInfo.nuxtVersion }}
                </p>
              </div>
              <u-icon name="i-tabler-brand-nuxt" class="size-8 text-muted"></u-icon>
            </div>
          </u-card>

          <u-card>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-muted">
                  Environment
                </p>
                <p class="text-lg font-semibold mt-1 flex items-center gap-2">
                  {{ systemInfo.environment }}
                  <u-badge size="sm" :color="systemInfo.environment === 'development' ? 'warning' : 'success'">
                    {{ systemInfo.environment === 'development' ? 'dev' : 'prod' }}
                  </u-badge>
                </p>
              </div>
              <u-icon :name="resolveIcon('server')" class="size-8 text-muted"></u-icon>
            </div>
          </u-card>

          <u-card>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-muted">
                  Database
                </p>
                <p class="text-lg font-semibold mt-1 truncate max-w-48" :title="systemInfo.databaseUrl">
                  {{ systemInfo.databaseUrl }}
                </p>
              </div>
              <u-icon :name="resolveIcon('database')" class="size-8 text-muted"></u-icon>
            </div>
          </u-card>

          <u-card>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-muted">
                  Uptime
                </p>
                <p class="text-lg font-semibold mt-1">
                  {{ formatUptime(systemInfo.uptimeSeconds) }}
                </p>
              </div>
              <u-icon :name="resolveIcon('clock')" class="size-8 text-muted"></u-icon>
            </div>
          </u-card>

          <u-card>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-muted">
                  Node.js
                </p>
                <p class="text-lg font-semibold mt-1">
                  {{ systemInfo.nodeVersion }}
                </p>
              </div>
              <u-icon name="i-tabler-brand-nodejs" class="size-8 text-muted"></u-icon>
            </div>
          </u-card>

          <u-card>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-muted">
                  Platform
                </p>
                <p class="text-lg font-semibold mt-1">
                  {{ systemInfo.platform }}
                </p>
              </div>
              <u-icon :name="resolveIcon('system')" class="size-8 text-muted"></u-icon>
            </div>
          </u-card>
        </div>
      </div>

      <!-- Recent Activity -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-lg font-semibold">
            Recent Activity
          </h2>
          <u-select
            v-model="activityWindow"
            :items="activityWindowOptions"
            size="sm"
            class="w-40"
          ></u-select>
        </div>

        <u-card>
          <div v-if="recentLogins.length === 0" class="text-center py-6">
            <u-icon :name="resolveIcon('heartbeat')" class="size-8 text-muted mx-auto mb-2"></u-icon>
            <p class="text-sm text-muted">
              No login activity in this period
            </p>
          </div>

          <div v-else class="divide-y divide-[var(--ui-border)]">
            <div
              v-for="user in recentLogins"
              :key="user.id"
              class="flex items-center justify-between py-3 first:pt-0 last:pb-0"
            >
              <div class="flex items-center gap-3 min-w-0">
                <u-icon :name="resolveIcon('login')" class="size-4 text-muted shrink-0"></u-icon>
                <div class="min-w-0">
                  <p class="text-sm font-medium truncate">
                    {{ user.name || user.email }}
                  </p>
                  <p v-if="user.name" class="text-xs text-muted truncate">
                    {{ user.email }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-2 shrink-0 ml-4">
                <u-badge size="sm" :color="roleColor(user.role)">
                  {{ user.role }}
                </u-badge>
                <span class="text-xs text-muted whitespace-nowrap">
                  {{ formatRelativeTime(user.lastLoginAt!) }}
                </span>
              </div>
            </div>
          </div>
        </u-card>
      </div>

      <!-- Quick Links -->
      <div>
        <h2 class="text-lg font-semibold mb-3">
          Quick Links
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <nuxt-link
            v-for="link in quickLinks"
            :key="link.to"
            :to="link.to"
            class="block"
          >
            <u-card class="h-full hover:border-[var(--color-primary-500)] transition-colors cursor-pointer">
              <div class="flex flex-col items-center text-center gap-2">
                <u-icon :name="link.icon" class="size-8 text-muted"></u-icon>
                <p class="font-medium text-sm">
                  {{ link.label }}
                </p>
                <p class="text-xs text-muted">
                  {{ link.description }}
                </p>
              </div>
            </u-card>
          </nuxt-link>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { UiColor } from '#shared/types/appearance'
import { authClient } from '~/lib/auth-client'

definePageMeta({
  middleware: 'admin',
})

const { resolveIcon } = useAppearance()

interface User {
  id: string
  name: string
  email: string
  role: string
  createdAt: Date
  lastLoginAt?: Date | null
}

// Fetch all users for stats
const users = ref<User[]>([])
const loading = ref(true)
const error = ref('')

async function fetchUsers() {
  loading.value = true
  try {
    const { data, error: fetchError } = await authClient.admin.listUsers({
      query: {
        limit: 500,
        sortBy: 'createdAt',
        sortDirection: 'desc',
      },
    })

    if (fetchError) {
      error.value = fetchError.message || 'Failed to fetch users'
      return
    }

    users.value = (data?.users || []) as User[]
  }
  catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to fetch users'
  }
  finally {
    loading.value = false
  }
}

// Fetch system info
interface SystemInfo {
  nuxtVersion: string
  environment: string
  databaseUrl: string
  uptimeSeconds: number
  nodeVersion: string
  platform: string
}

const systemInfo = ref<SystemInfo | null>(null)

async function fetchSystemInfo() {
  try {
    systemInfo.value = await $fetch<SystemInfo>('/api/admin/system-info')
  }
  catch {
    // Non-critical, silently fail
  }
}

onMounted(() => {
  fetchUsers()
  fetchSystemInfo()
})

// Computed stats
const totalUsers = computed(() => users.value.length)

const usersByRole = computed(() => {
  const counts: Record<string, number> = { admin: 0, editor: 0, viewer: 0 }
  for (const user of users.value) {
    const role = user.role || 'viewer'
    counts[role] = (counts[role] || 0) + 1
  }
  return counts
})

const recentSignups = computed(() => {
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  return users.value.filter(u => u.createdAt.getTime() > sevenDaysAgo).length
})

// Format uptime
function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  if (days > 0)
    return `${days}d ${hours}h ${mins}m`
  if (hours > 0)
    return `${hours}h ${mins}m`
  return `${mins}m`
}

function roleColor(role: string): UiColor {
  const colors: Record<string, UiColor> = {
    admin: 'error',
    editor: 'warning',
    viewer: 'info',
  }
  return colors[role] || 'neutral'
}

// Activity feed — configurable time window
const activityWindow = ref('7d')
const activityWindowOptions = [
  { label: 'Last 24 hours', value: '24h' },
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
]

const activityWindowMs = computed((): number => {
  const windows: Record<string, number> = {
    '24h': 24 * 60 * 60 * 1000,
    '7d': 7 * 24 * 60 * 60 * 1000,
    '30d': 30 * 24 * 60 * 60 * 1000,
  }
  return windows[activityWindow.value] ?? windows['7d']!
})

const recentLogins = computed(() => {
  const cutoff = Date.now() - activityWindowMs.value
  return users.value
    .filter(u => u.lastLoginAt && u.lastLoginAt.getTime() > cutoff)
    .sort((a, b) => (b.lastLoginAt?.getTime() || 0) - (a.lastLoginAt?.getTime() || 0))
})

function formatRelativeTime(timestamp: Date): string {
  const diffMs = Date.now() - timestamp.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1)
    return 'just now'
  if (diffMins < 60)
    return `${diffMins}m ago`
  if (diffHours < 24)
    return `${diffHours}h ago`
  if (diffDays < 7)
    return `${diffDays}d ago`
  return timestamp.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

// Quick links
const quickLinks = computed(() => [
  {
    label: 'Users',
    description: 'Manage user accounts and roles',
    icon: resolveIcon('users'),
    to: '/app/admin/users',
  },
  {
    label: 'Email Compose',
    description: 'Draft and send emails',
    icon: resolveIcon('mailForward'),
    to: '/app/admin/email/compose',
  },
  {
    label: 'Email Lists',
    description: 'Manage mailing lists',
    icon: resolveIcon('list'),
    to: '/app/admin/email/lists',
  },
  {
    label: 'Email Analytics',
    description: 'View email engagement stats',
    icon: resolveIcon('chartBar'),
    to: '/app/admin/email/analytics',
  },
  {
    label: 'Trash',
    description: 'Restore or permanently delete items',
    icon: resolveIcon('trash'),
    to: '/app/admin/trash',
  },
])
</script>
