<template>
  <div class="p-4 space-y-6 max-w-3xl">
    <!-- Back link -->
    <nuxt-link
      to="/app/admin/users"
      class="inline-flex items-center gap-1 text-sm text-muted hover:text-highlighted transition-colors"
    >
      <u-icon :name="resolveIcon('arrowLeft')" class="w-4 h-4"></u-icon>
      {{ t('admin.users.detail.backToUsers') }}
    </nuxt-link>

    <!-- Loading state -->
    <div
      v-if="loading"
      role="status"
      class="flex items-center justify-center py-20"
    >
      <u-icon
        :name="resolveIcon('loading')"
        class="w-8 h-8 animate-spin text-muted"
        aria-hidden="true"
      ></u-icon>
      <span class="sr-only">{{ t('common.loading') }}</span>
    </div>

    <!-- Not found state -->
    <div v-else-if="notFound" class="text-center py-20 space-y-4">
      <u-icon :name="resolveIcon('userOff')" class="w-12 h-12 text-muted mx-auto block"></u-icon>
      <h2 class="text-xl font-semibold">
        {{ t('admin.users.detail.notFoundTitle') }}
      </h2>
      <p class="text-sm text-muted">
        {{ t('admin.users.detail.notFoundDescription') }}
      </p>
    </div>

    <!-- User profile -->
    <div v-else-if="user" class="space-y-6">
      <!-- Header with avatar and name -->
      <div class="flex items-start gap-6">
        <u-avatar
          :src="user.image || undefined"
          :alt="user.name || user.email"
          :text="getUserInitials(user)"
          size="3xl"
        ></u-avatar>
        <div class="space-y-2 min-w-0 break-words">
          <h1 class="text-2xl font-bold">
            {{ user.name || t('admin.users.detail.unnamedUser') }}
          </h1>
          <p class="text-muted">
            {{ user.email }}
          </p>
          <div class="flex items-center gap-2 flex-wrap">
            <u-badge
              :color="roleColorMap[user.role] || 'neutral'"
              variant="subtle"
            >
              {{ t(`admin.users.roles.${user.role}`) }}
            </u-badge>
            <u-badge
              v-if="user.banned"
              color="error"
              variant="subtle"
            >
              {{ t('admin.users.status.banned') }}
            </u-badge>
            <u-badge
              v-else
              color="success"
              variant="subtle"
            >
              {{ t('admin.users.status.active') }}
            </u-badge>
          </div>
        </div>
      </div>

      <!-- Ban reason -->
      <div
        v-if="user.banned && user.banReason"
        class="p-3 border border-error/30 bg-error/5 rounded text-sm"
      >
        <span class="font-medium">{{ t('admin.users.detail.banReason') }}</span> {{ user.banReason }}
      </div>

      <!-- Profile details -->
      <div class="border rounded divide-y">
        <div class="grid grid-cols-3 px-4 py-3">
          <span class="text-sm text-muted">{{ t('auth.email') }}</span>
          <span class="col-span-2 text-sm min-w-0 break-words">{{ user.email }}</span>
        </div>
        <div class="grid grid-cols-3 px-4 py-3">
          <span class="text-sm text-muted">{{ t('admin.users.detail.emailVerified') }}</span>
          <span class="col-span-2 text-sm min-w-0 break-words flex items-center gap-1">
            <u-icon
              v-if="user.emailVerified"
              :name="resolveIcon('success')"
              class="w-4 h-4 text-success"
            ></u-icon>
            <u-icon
              v-else
              :name="resolveIcon('error')"
              class="w-4 h-4 text-muted"
            ></u-icon>
            {{ user.emailVerified ? t('common.yes') : t('common.no') }}
          </span>
        </div>
        <div v-if="user.phoneNumber" class="grid grid-cols-3 px-4 py-3">
          <span class="text-sm text-muted">{{ t('admin.users.detail.phoneNumber') }}</span>
          <span class="col-span-2 text-sm min-w-0 break-words">{{ user.phoneNumber }}</span>
        </div>
        <div class="grid grid-cols-3 px-4 py-3">
          <span class="text-sm text-muted">{{ t('admin.users.table.role') }}</span>
          <span class="col-span-2 min-w-0 break-words">
            <u-badge
              :color="roleColorMap[user.role] || 'neutral'"
              variant="subtle"
            >
              {{ t(`admin.users.roles.${user.role}`) }}
            </u-badge>
          </span>
        </div>
        <div class="grid grid-cols-3 px-4 py-3">
          <span class="text-sm text-muted">{{ t('admin.users.table.status') }}</span>
          <span class="col-span-2 text-sm min-w-0 break-words">
            <template v-if="user.banned">
              <u-badge color="error" variant="subtle">{{ t('admin.users.status.banned') }}</u-badge>
            </template>
            <template v-else>
              <span class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-success" />
                {{ t('admin.users.status.active') }}
              </span>
            </template>
          </span>
        </div>
        <div class="grid grid-cols-3 px-4 py-3">
          <span class="text-sm text-muted">{{ t('admin.users.detail.joined') }}</span>
          <span class="col-span-2 text-sm min-w-0 break-words">{{ formatDate(user.createdAt) }}</span>
        </div>
        <div class="grid grid-cols-3 px-4 py-3">
          <span class="text-sm text-muted">{{ t('admin.users.table.lastLogin') }}</span>
          <span class="col-span-2 text-sm min-w-0 break-words">{{ formatRelativeTime(user.lastLoginAt) }}</span>
        </div>
        <div class="grid grid-cols-3 px-4 py-3">
          <span class="text-sm text-muted">{{ t('admin.users.detail.loginCount') }}</span>
          <span class="col-span-2 text-sm min-w-0 break-words">{{ user.loginCount ?? 0 }}</span>
        </div>
      </div>

      <!-- Linked Accounts -->
      <div class="space-y-3">
        <h2 class="text-lg font-semibold">
          {{ t('admin.users.detail.linkedAccounts') }}
        </h2>
        <div v-if="accounts.length === 0" class="border rounded p-6 text-center text-sm text-muted">
          {{ t('admin.users.detail.noLinkedAccounts') }}
        </div>
        <div v-else class="space-y-2">
          <div
            v-for="account in accounts"
            :key="account.id"
            class="border rounded p-4 flex items-center gap-4"
          >
            <u-icon :name="getProviderMeta(account.providerId).icon" class="w-5 h-5 text-muted"></u-icon>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium">
                {{ getProviderMeta(account.providerId).label }}
              </p>
              <p class="text-xs text-muted truncate">
                {{ account.accountId }}
              </p>
            </div>
            <span class="text-xs text-muted">
              {{ formatDate(account.createdAt) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Active Sessions -->
      <div class="space-y-3">
        <h2 class="text-lg font-semibold">
          {{ t('admin.users.detail.activeSessions') }}
        </h2>
        <div v-if="sessions.length === 0" class="border rounded p-6 text-center text-sm text-muted">
          {{ t('admin.users.detail.noActiveSessions') }}
        </div>
        <template v-else>
          <div class="border rounded divide-y">
            <div
              v-for="session in sessions"
              :key="session.id"
              class="px-4 py-3 flex items-center gap-4"
            >
              <div class="flex-1 min-w-0 space-y-1">
                <p class="text-sm">
                  {{ session.ipAddress || t('admin.users.detail.unknownIp') }}
                </p>
                <p class="text-xs text-muted truncate">
                  {{ session.userAgent || t('admin.users.detail.unknownDevice') }}
                </p>
              </div>
              <div class="text-right text-xs text-muted space-y-1 shrink-0">
                <p>{{ t('admin.users.detail.sessionCreated', { time: formatRelativeTime(session.createdAt) }) }}</p>
                <p>{{ t('admin.users.detail.sessionExpires', { time: formatRelativeTime(session.expiresAt) }) }}</p>
              </div>
            </div>
          </div>
          <u-button
            color="error"
            variant="soft"
            size="sm"
            :icon="resolveIcon('logout')"
            :label="t('admin.users.detail.revokeAllSessions')"
            @click="revokeModalOpen = true"
          ></u-button>
        </template>
      </div>

      <!-- Revoke confirmation modal -->
      <u-modal
        v-model:open="revokeModalOpen"
        :title="t('admin.users.revokeModal.title')"
        :description="t('admin.users.revokeModal.description')"
      >
        <template #body>
          <p class="text-sm text-muted">
            {{ t('admin.users.revokeModal.body') }}
          </p>
        </template>
        <template #footer>
          <div class="flex justify-end gap-2">
            <u-button
              color="neutral"
              variant="soft"
              :label="t('common.cancel')"
              @click="revokeModalOpen = false"
            ></u-button>
            <u-button
              color="error"
              :label="t('admin.users.revokeModal.confirm')"
              :loading="revoking"
              @click="handleRevokeSessions"
            ></u-button>
          </div>
        </template>
      </u-modal>

      <!-- Actions -->
      <div class="space-y-4">
        <h2 class="text-lg font-semibold">
          {{ t('admin.users.detail.actions') }}
        </h2>

        <div v-if="isSelf" class="border rounded p-4 text-sm text-muted flex items-center gap-2">
          <u-icon :name="resolveIcon('info')" class="w-4 h-4"></u-icon>
          {{ t('admin.users.detail.cannotModifySelf') }}
        </div>

        <template v-else>
          <!-- Edit Role -->
          <div class="border rounded p-4 space-y-3">
            <h3 class="text-sm font-medium">
              {{ t('admin.users.detail.editRole') }}
            </h3>
            <div class="flex items-center gap-2">
              <u-select
                v-model="editRole"
                :items="roleEditItems"
                size="sm"
                class="w-40"
              ></u-select>
              <u-button
                size="sm"
                :label="t('common.save')"
                :loading="savingRole"
                :disabled="editRole === user.role"
                @click="handleSaveRole"
              ></u-button>
            </div>
          </div>

          <!-- Ban / Unban -->
          <div class="border rounded p-4 space-y-3">
            <h3 class="text-sm font-medium">
              {{ user.banned ? t('admin.users.actions.unbanUser') : t('admin.users.actions.banUser') }}
            </h3>
            <u-button
              v-if="user.banned"
              color="success"
              variant="soft"
              size="sm"
              :icon="resolveIcon('lockOpen')"
              :label="t('admin.users.actions.unbanUser')"
              @click="unbanModalOpen = true"
            ></u-button>
            <u-button
              v-else
              color="warning"
              variant="soft"
              size="sm"
              :icon="resolveIcon('ban')"
              :label="t('admin.users.actions.banUser')"
              @click="banModalOpen = true"
            ></u-button>
          </div>

          <!-- Delete -->
          <div class="border border-error/30 rounded p-4 space-y-3">
            <h3 class="text-sm font-medium text-error">
              {{ t('admin.users.detail.dangerZone') }}
            </h3>
            <p class="text-xs text-muted">
              {{ t('admin.users.detail.deleteWarning') }}
            </p>
            <u-button
              color="error"
              variant="soft"
              size="sm"
              :icon="resolveIcon('trash')"
              :label="t('admin.users.actions.deletePermanently')"
              @click="deleteModalOpen = true"
            ></u-button>
          </div>
        </template>
      </div>

      <!-- Ban modal -->
      <u-modal
        v-model:open="banModalOpen"
        :title="t('admin.users.banModal.title')"
        :description="t('admin.users.banModal.description', { name: user.name || user.email })"
      >
        <template #body>
          <div class="space-y-3">
            <p class="text-sm text-muted">
              {{ t('admin.users.banModal.body') }}
            </p>
            <u-form-field :label="t('admin.users.banModal.reasonLabel')" name="banReason">
              <u-textarea
                v-model="banReason"
                :placeholder="t('admin.users.banModal.reasonPlaceholder')"
                :rows="3"
              ></u-textarea>
            </u-form-field>
          </div>
        </template>
        <template #footer>
          <div class="flex justify-end gap-2">
            <u-button
              color="neutral"
              variant="soft"
              :label="t('common.cancel')"
              @click="banModalOpen = false"
            ></u-button>
            <u-button
              color="warning"
              :label="t('admin.users.actions.banUser')"
              :loading="banning"
              @click="handleBanUser"
            ></u-button>
          </div>
        </template>
      </u-modal>

      <!-- Unban modal -->
      <u-modal
        v-model:open="unbanModalOpen"
        :title="t('admin.users.unbanModal.title')"
        :description="t('admin.users.unbanModal.description', { name: user.name || user.email })"
      >
        <template #body>
          <p class="text-sm text-muted">
            {{ t('admin.users.unbanModal.body') }}
          </p>
        </template>
        <template #footer>
          <div class="flex justify-end gap-2">
            <u-button
              color="neutral"
              variant="soft"
              :label="t('common.cancel')"
              @click="unbanModalOpen = false"
            ></u-button>
            <u-button
              color="success"
              :label="t('admin.users.actions.unbanUser')"
              :loading="unbanning"
              @click="handleUnbanUser"
            ></u-button>
          </div>
        </template>
      </u-modal>

      <!-- Delete modal -->
      <u-modal
        v-model:open="deleteModalOpen"
        :title="t('admin.users.deleteModal.title')"
        :description="t('admin.users.deleteModal.description')"
      >
        <template #body>
          <div class="space-y-3">
            <i18n-t
              keypath="admin.users.deleteModal.confirmPrompt"
              tag="p"
              class="text-sm text-muted"
              scope="global"
            >
              <template #email>
                <span class="font-mono font-medium text-highlighted">{{ user.email }}</span>
              </template>
            </i18n-t>
            <u-form-field :label="t('admin.users.deleteModal.confirmLabel')" name="deleteConfirmEmail">
              <u-input
                v-model="deleteConfirmEmail"
                :placeholder="t('admin.users.deleteModal.confirmPlaceholder')"
              ></u-input>
            </u-form-field>
          </div>
        </template>
        <template #footer>
          <div class="flex justify-end gap-2">
            <u-button
              color="neutral"
              variant="soft"
              :label="t('common.cancel')"
              @click="deleteModalOpen = false; deleteConfirmEmail = ''"
            ></u-button>
            <u-button
              color="error"
              :label="t('admin.users.actions.deletePermanently')"
              :loading="deleting"
              :disabled="deleteConfirmEmail !== user.email"
              @click="handleDeleteUser"
            ></u-button>
          </div>
        </template>
      </u-modal>
    </div>
  </div>
</template>

<script setup lang="ts">
import { authClient } from '~/lib/auth-client'

definePageMeta({
  middleware: ['admin'],
  layout: 'default',
})

interface UserDetail {
  id: string
  name: string
  email: string
  image: string | null
  role: 'admin' | 'editor' | 'viewer'
  banned: boolean
  banReason: string | null
  emailVerified: boolean
  phoneNumber: string | null
  createdAt: number
  lastLoginAt: number | null
  loginCount: number
}

const route = useRoute()
const { t, locale } = useI18n()
const { resolveIcon } = useAppearance()
const userId = computed(() => route.params.id as string)

interface LinkedAccount {
  id: string
  providerId: string
  accountId: string
  createdAt: number
}

interface UserSession {
  id: string
  userId: string
  ipAddress: string | null
  userAgent: string | null
  createdAt: number
  expiresAt: number
}

const router = useRouter()
const session = authClient.useSession()
const currentUserId = computed(() => (session.value.data as { user?: { id?: string } } | null)?.user?.id)

const loading = ref(true)
const user = ref<UserDetail | null>(null)
const isSelf = computed(() => user.value?.id === currentUserId.value)
const notFound = ref(false)
const accounts = ref<LinkedAccount[]>([])
const sessions = ref<UserSession[]>([])
const revokeModalOpen = ref(false)
const revoking = ref(false)

// Actions state
const editRole = ref<UserDetail['role']>('viewer')
const savingRole = ref(false)
const banModalOpen = ref(false)
const banReason = ref('')
const banning = ref(false)
const unbanModalOpen = ref(false)
const unbanning = ref(false)
const deleteModalOpen = ref(false)
const deleteConfirmEmail = ref('')
const deleting = ref(false)

async function fetchUser() {
  loading.value = true
  notFound.value = false

  const { data, error } = await authClient.admin.listUsers({
    query: {
      filterField: 'id',
      filterValue: userId.value,
      filterOperator: 'eq',
      limit: 1,
    },
  })

  if (error || !data?.users?.length) {
    notFound.value = true
    user.value = null
  }
  else {
    user.value = data.users[0] as unknown as UserDetail
  }

  loading.value = false
}

async function fetchAccounts() {
  try {
    const data = await $fetch<LinkedAccount[]>(`/api/admin/users/${userId.value}/accounts`)
    accounts.value = data
  }
  catch {
    // 404 means no accounts — treat as empty
    accounts.value = []
  }
}

async function fetchSessions() {
  const { data, error } = await authClient.admin.listUserSessions({
    userId: userId.value,
  })
  if (error || !data) {
    sessions.value = []
  }
  else {
    sessions.value = (data.sessions || []) as unknown as UserSession[]
  }
}

const toast = useToast()

async function handleRevokeSessions() {
  revoking.value = true
  const { error } = await authClient.admin.revokeUserSessions({
    userId: userId.value,
  })
  if (error) {
    toast.add({
      title: t('admin.users.toasts.revokeFailed'),
      description: error.message || t('common.error'),
      color: 'error',
      icon: resolveIcon('caution'),
    })
  }
  else {
    sessions.value = []
    toast.add({
      title: t('admin.users.toasts.sessionsRevoked'),
      description: t('admin.users.toasts.sessionsRevokedDescription'),
      color: 'success',
      icon: resolveIcon('check'),
    })
  }
  revoking.value = false
  revokeModalOpen.value = false
}

const roleEditItems = computed(() => [
  { label: t('admin.users.roles.admin'), value: 'admin' },
  { label: t('admin.users.roles.editor'), value: 'editor' },
  { label: t('admin.users.roles.viewer'), value: 'viewer' },
])

async function handleSaveRole() {
  if (!user.value)
    return
  savingRole.value = true
  const { error } = await authClient.admin.setRole({
    userId: userId.value,
    role: editRole.value as 'admin',
  })
  if (error) {
    toast.add({ title: t('admin.users.toasts.roleUpdateFailed'), description: error.message || t('common.error'), color: 'error', icon: resolveIcon('caution') })
  }
  else {
    user.value = { ...user.value, role: editRole.value } as UserDetail
    toast.add({ title: t('admin.users.toasts.roleUpdated'), description: t('admin.users.toasts.roleChangedTo', { role: t(`admin.users.roles.${editRole.value}`) }), color: 'success', icon: resolveIcon('check') })
  }
  savingRole.value = false
}

async function handleBanUser() {
  banning.value = true
  const { error } = await authClient.admin.banUser({
    userId: userId.value,
    banReason: banReason.value || undefined,
  })
  if (error) {
    toast.add({ title: t('admin.users.toasts.banFailed'), description: error.message || t('common.error'), color: 'error', icon: resolveIcon('caution') })
  }
  else {
    toast.add({ title: t('admin.users.toasts.userBanned'), color: 'success', icon: resolveIcon('check') })
    await fetchUser()
    banModalOpen.value = false
    banReason.value = ''
  }
  banning.value = false
}

async function handleUnbanUser() {
  unbanning.value = true
  const { error } = await authClient.admin.unbanUser({
    userId: userId.value,
  })
  if (error) {
    toast.add({ title: t('admin.users.toasts.unbanFailed'), description: error.message || t('common.error'), color: 'error', icon: resolveIcon('caution') })
  }
  else {
    toast.add({ title: t('admin.users.toasts.userUnbanned'), color: 'success', icon: resolveIcon('check') })
    await fetchUser()
  }
  unbanning.value = false
  unbanModalOpen.value = false
}

async function handleDeleteUser() {
  deleting.value = true
  const { error } = await authClient.admin.removeUser({
    userId: userId.value,
  })
  if (error) {
    toast.add({ title: t('admin.users.toasts.deleteFailed'), description: error.message || t('common.error'), color: 'error', icon: resolveIcon('caution') })
  }
  else {
    toast.add({ title: t('admin.users.toasts.userDeleted'), color: 'success', icon: resolveIcon('check') })
    router.push('/app/admin/users')
  }
  deleting.value = false
  deleteModalOpen.value = false
  deleteConfirmEmail.value = ''
}

onMounted(async () => {
  await fetchUser()
  if (user.value) {
    editRole.value = user.value.role
    fetchAccounts()
    fetchSessions()
  }
})

const roleColorMap: Record<string, 'error' | 'info' | 'neutral'> = {
  admin: 'error',
  editor: 'info',
  viewer: 'neutral',
}

function formatRelativeTime(timestamp: number | null): string {
  if (!timestamp)
    return t('admin.users.status.never')
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 60)
    return t('admin.users.time.minutesAgo', { n: diffMins })
  if (diffHours < 24)
    return t('admin.users.time.hoursAgo', { n: diffHours })
  if (diffDays < 7)
    return t('admin.users.time.daysAgo', { n: diffDays })
  return date.toLocaleDateString(locale.value, {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  })
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString(locale.value, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

const providerMeta = computed((): Record<string, { icon: string, label: string }> => ({
  'github': { icon: 'i-tabler-brand-github', label: 'GitHub' },
  'email-otp': { icon: resolveIcon('mail'), label: t('admin.users.providers.emailOtp') },
  'credential': { icon: resolveIcon('key'), label: t('auth.password') },
  'magic-link': { icon: resolveIcon('wand'), label: t('admin.users.providers.magicLink') },
}))

function getProviderMeta(providerId: string) {
  return providerMeta.value[providerId] || { icon: resolveIcon('plug'), label: providerId }
}

function getUserInitials(u: UserDetail): string {
  const name = u.name || u.email
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
</script>
