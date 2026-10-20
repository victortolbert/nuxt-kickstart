<template>
  <div class="p-4 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">
          {{ t('nav.users') }}
        </h1>
        <p class="text-sm text-muted mt-1">
          {{ t('admin.users.count', users.length) }}
        </p>
      </div>
    </div>

    <!-- Search and filter controls -->
    <div class="flex flex-col sm:flex-row gap-4">
      <!-- Search input -->
      <div class="flex-1 relative">
        <u-input
          v-model="searchQuery"
          :placeholder="t('admin.users.searchPlaceholder')"
          :icon="resolveIcon('search')"
          :trailing="!!searchQuery"
        >
          <template v-if="searchQuery" #trailing>
            <button
              type="button"
              class="text-muted hover:text-highlighted transition-colors"
              :aria-label="t('admin.users.clearSearch')"
              @click="clearSearch"
            >
              <u-icon :name="resolveIcon('close')" class="w-4 h-4"></u-icon>
            </button>
          </template>
        </u-input>
      </div>

      <!-- Role filter -->
      <u-select
        v-model="roleFilter"
        :items="roleFilterItems"
        :placeholder="t('admin.users.filterByRole')"
        :icon="resolveIcon('filter')"
        class="w-full sm:w-48"
      ></u-select>
    </div>

    <!-- Users table -->
    <u-table
      :data="users"
      :columns="columns"
      :loading="loading"
      :empty="t('admin.users.empty')"
      class="cursor-pointer"
      @select="handleRowClick"
    ></u-table>

    <!-- Pagination controls -->
    <div v-if="users.length > 0" class="flex items-center justify-between">
      <div class="text-sm text-muted">
        {{ t('admin.users.pagination.page', { page: currentPage }) }}
      </div>
      <div class="flex gap-2">
        <button
          type="button"
          :disabled="currentPage === 1"
          class="px-3 py-1 text-sm border rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
          @click="currentPage--"
        >
          {{ t('common.previous') }}
        </button>
        <button
          type="button"
          :disabled="!hasNextPage"
          class="px-3 py-1 text-sm border rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
          @click="currentPage++"
        >
          {{ t('common.next') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { h, resolveComponent } from 'vue'
import { ASSIGNABLE_ROLES, OWNER_ROLE } from '#shared/utils/roles'
import { authClient } from '~/lib/auth-client'

const NuxtLink = resolveComponent('NuxtLink')
const UAvatar = resolveComponent('UAvatar')
const UBadge = resolveComponent('UBadge')
const USelect = resolveComponent('USelect')
const UTooltip = resolveComponent('UTooltip')

definePageMeta({
  middleware: ['admin'],
  layout: 'default',
})

interface User {
  id: string
  name: string
  email: string
  image: string | null
  role: 'admin' | 'editor' | 'viewer'
  banned: boolean
  banReason: string | null
  createdAt: Date
  lastLoginAt?: Date | null
  loginCount?: number
}

const router = useRouter()
const toast = useToast()
const { t, locale } = useI18n()
const { resolveIcon } = useAppearance()
const session = authClient.useSession()
const currentUserId = computed(() => (session.value.data as { user?: { id?: string } } | null)?.user?.id)

// Search and filter state
const searchQuery = ref('')
const roleFilter = ref<'all' | 'admin' | 'editor' | 'viewer'>('all')
const currentPage = ref(1)
const pageSize = 20
const totalUsers = ref(0)
const hasNextPage = ref(false)

// Fetch users
const loading = ref(true)
const users = ref<User[]>([])

// Debounced search
const debouncedSearch = refDebounced(searchQuery, 300)

// Role filter options
const roleFilterItems = computed(() => [
  { label: t('admin.users.roles.all'), value: 'all' },
  { label: t('admin.users.roles.admin'), value: 'admin' },
  { label: t('admin.users.roles.editor'), value: 'editor' },
  { label: t('admin.users.roles.viewer'), value: 'viewer' },
])

// Role edit options for inline editing. Owner is not among them: ADMIN_EMAILS
// grants it, and the login sync would revert a grant from here at that
// person's next sign-in (see #shared/utils/roles).
const roleEditItems = computed(() => ASSIGNABLE_ROLES.map(role => ({
  label: t(`admin.users.roles.${role}`),
  value: role,
})))

async function fetchUsers() {
  loading.value = true
  try {
    const offset = (currentPage.value - 1) * pageSize

    // Build query params (fetch one extra row to detect whether a next page exists)
    const queryParams: any = {
      limit: pageSize + 1,
      offset,
      sortBy: 'createdAt',
      sortDirection: 'desc',
    }

    // Add search filter if present
    if (debouncedSearch.value.trim()) {
      queryParams.searchValue = debouncedSearch.value.trim()
      queryParams.searchField = 'email'
    }

    // Add role filter if not 'all'
    if (roleFilter.value !== 'all') {
      queryParams.filterField = 'role'
      queryParams.filterValue = roleFilter.value
      queryParams.filterOperator = 'eq'
    }

    const { data, error } = await authClient.admin.listUsers({
      query: queryParams,
    })

    if (error) {
      users.value = []
      totalUsers.value = 0
      hasNextPage.value = false
      toast.add({
        title: t('admin.users.toasts.fetchFailed'),
        description: error.message || t('common.error'),
        color: 'error',
        icon: resolveIcon('caution'),
      })
    }
    else {
      const fetched = (data?.users || []) as User[]
      hasNextPage.value = fetched.length > pageSize
      users.value = fetched.slice(0, pageSize)
      // Better Auth admin plugin doesn't return total count, so we estimate
      totalUsers.value = users.value.length
    }
  }
  catch (err) {
    users.value = []
    totalUsers.value = 0
    hasNextPage.value = false
    toast.add({
      title: t('admin.users.toasts.fetchFailed'),
      description: err instanceof Error ? err.message : t('common.error'),
      color: 'error',
      icon: resolveIcon('caution'),
    })
  }
  finally {
    loading.value = false
  }
}

// Watchers to refetch when filters change
watch([debouncedSearch, roleFilter], () => {
  currentPage.value = 1 // Reset to first page on filter change
  fetchUsers()
})

watch(currentPage, () => {
  fetchUsers()
})

// Clear search
function clearSearch() {
  searchQuery.value = ''
}

// Inline role editing
async function handleRoleChange(userId: string, newRole: User['role'], oldRole: User['role']) {
  const userIndex = users.value.findIndex(u => u.id === userId)
  if (userIndex === -1)
    return

  // Optimistic update
  users.value[userIndex] = { ...users.value[userIndex], role: newRole } as User

  const { error } = await authClient.admin.setRole({
    userId,
    role: newRole as 'admin', // Better Auth types only 'user'|'admin' but project uses custom roles
  })

  if (error) {
    // Revert on error
    users.value[userIndex] = { ...users.value[userIndex], role: oldRole } as User
    toast.add({
      title: t('admin.users.toasts.roleUpdateFailed'),
      description: error.message || t('common.error'),
      color: 'error',
      icon: resolveIcon('caution'),
    })
  }
  else {
    toast.add({
      title: t('admin.users.toasts.roleUpdated'),
      description: t('admin.users.toasts.roleChangedTo', { role: t(`admin.users.roles.${newRole}`) }),
      color: 'success',
      icon: resolveIcon('check'),
    })
  }
}

onMounted(() => {
  fetchUsers()
})

// Define table columns
const columns = computed<TableColumn<User>[]>(() => [
  {
    id: 'avatar',
    header: '',
    cell: ({ row }) => {
      const user = row.original
      const name = user.name || user.email
      const initials = name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)

      return h(UAvatar, {
        src: user.image || undefined,
        alt: name,
        text: initials,
        size: 'sm',
      })
    },
    meta: {
      class: {
        th: 'w-12',
        td: 'w-12',
      },
    },
  },
  {
    accessorKey: 'name',
    header: t('admin.users.table.name'),
    cell: ({ row }) => h(NuxtLink, {
      to: `/app/admin/users/${row.original.id}`,
      class: 'font-medium focus-visible:outline-2 focus-visible:outline-[var(--color-primary-500)]',
    }, () => row.original.name || '—'),
  },
  {
    accessorKey: 'email',
    header: t('auth.email'),
  },
  {
    accessorKey: 'role',
    header: t('admin.users.table.role'),
    cell: ({ row }) => {
      const user = row.original

      // A badge saying where the role comes from, in place of a control that
      // would only appear to work.
      if (user.role === OWNER_ROLE) {
        return h(UTooltip, { text: t('admin.users.tooltips.ownerRoleFromEnv') }, () => h(
          UBadge,
          { variant: 'subtle', color: 'error' },
          () => t('admin.users.roles.admin'),
        ))
      }

      const isSelf = user.id === currentUserId.value
      const isDisabled = isSelf || user.banned
      const tooltipText = isSelf
        ? t('admin.users.tooltips.cannotChangeOwnRole')
        : user.banned
          ? t('admin.users.tooltips.cannotChangeBannedRole')
          : ''

      const select = h(USelect, {
        'modelValue': user.role,
        'items': roleEditItems.value,
        'disabled': isDisabled,
        'size': 'xs',
        'class': 'w-28',
        'onUpdate:modelValue': (newRole: string) => handleRoleChange(user.id, newRole as User['role'], user.role),
      })

      const content = isDisabled && tooltipText
        ? h(UTooltip, { text: tooltipText }, () => select)
        : select

      return h('div', { onClick: (e: Event) => e.stopPropagation() }, [content])
    },
  },
  {
    id: 'status',
    header: t('admin.users.table.status'),
    cell: ({ row }) => {
      const user = row.original
      if (user.banned) {
        return h(
          UBadge,
          { variant: 'subtle', color: 'error' },
          () => t('admin.users.status.banned'),
        )
      }
      return h(
        'div',
        { class: 'flex items-center gap-2' },
        [
          h('span', { class: 'w-2 h-2 rounded-full bg-success' }),
          h('span', { class: 'text-sm' }, t('admin.users.status.active')),
        ],
      )
    },
  },
  {
    id: 'lastLogin',
    header: t('admin.users.table.lastLogin'),
    cell: ({ row }) => {
      const lastLoginAt = row.original.lastLoginAt
      if (!lastLoginAt) {
        return h('span', { class: 'text-muted' }, t('admin.users.status.never'))
      }
      const date = new Date(lastLoginAt)
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMs / 3600000)
      const diffDays = Math.floor(diffMs / 86400000)

      if (diffMins < 60) {
        return t('admin.users.time.minutesAgo', { n: diffMins })
      }
      else if (diffHours < 24) {
        return t('admin.users.time.hoursAgo', { n: diffHours })
      }
      else if (diffDays < 7) {
        return t('admin.users.time.daysAgo', { n: diffDays })
      }
      else {
        return date.toLocaleDateString(locale.value, {
          month: 'short',
          day: 'numeric',
          year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
        })
      }
    },
  },
])

// Row click handler
function handleRowClick(event: Event, row: any) {
  router.push(`/app/admin/users/${row.original.id}`)
}
</script>
