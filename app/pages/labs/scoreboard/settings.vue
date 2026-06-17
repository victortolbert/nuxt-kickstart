<template>
  <div class="min-h-screen bg-default">
    <!-- PIN Entry Form -->
    <div v-if="!isAuthenticated" class="flex items-center justify-center min-h-screen">
      <u-card class="w-full max-w-md">
        <template #header>
          <h2 class="font-display text-xl font-semibold">
            Admin Settings
          </h2>
        </template>

        <form @submit.prevent="verifyPin()">
          <u-form-field label="Enter Admin PIN" :error="pinError">
            <u-pin-input
              v-model="pinDigits"
              mask
              :length="4"
              size="lg"
              autofocus
              aria-label="4-digit admin PIN"
              @update:model-value="pin = pinDigits.join(''); pinError = ''"
              @complete="verifyPin()"
            ></u-pin-input>
          </u-form-field>

          <div class="mt-4 flex gap-2">
            <u-button
              type="submit"
              color="primary"
              block
            >
              Verify PIN
            </u-button>
            <u-button
              to="/labs/scoreboard"
              variant="soft"
              color="neutral"
              block
            >
              Cancel
            </u-button>
          </div>
        </form>
      </u-card>
    </div>

    <!-- Settings Form -->
    <div
      v-else
      class="max-w-4xl mx-auto py-8 px-4"
      @input="markDirty"
    >
      <div class="mb-6 flex items-center justify-between">
        <h1 class="font-display text-2xl font-bold">
          Event Settings
        </h1>
        <u-button
          to="/labs/scoreboard"
          variant="soft"
          color="neutral"
          :icon="resolveIcon('arrowLeft')"
        >
          Back to Scoreboard
        </u-button>
      </div>

      <!-- Event Info -->
      <u-card class="mb-6">
        <template #header>
          <h3 class="font-display text-lg font-semibold">
            Event Information
          </h3>
        </template>

        <div class="space-y-4">
          <u-form-field label="Event Name" class="w-full">
            <u-input
              v-model="eventName"
              placeholder="Enter event name"
              size="lg"
              class="w-full"
            ></u-input>
          </u-form-field>

          <u-form-field label="Event Description" class="w-full">
            <u-textarea
              v-model="eventDescription"
              placeholder="Enter event description"
              :rows="3"
              size="lg"
              class="w-full"
            ></u-textarea>
          </u-form-field>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <u-form-field label="Min Score">
              <u-input
                v-model.number="scoreMin"
                type="number"
                min="1"
                size="lg"
                placeholder="1"
              ></u-input>
            </u-form-field>

            <u-form-field label="Max Score">
              <u-input
                v-model.number="scoreMax"
                type="number"
                min="1"
                size="lg"
                placeholder="200"
              ></u-input>
            </u-form-field>
          </div>
        </div>
      </u-card>

      <!-- Teams -->
      <u-card class="mb-6">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-display text-lg font-semibold">
              Teams
            </h3>
            <u-button
              size="sm"
              :icon="resolveIcon('plus')"
              @click="addTeam"
            >
              Add Team
            </u-button>
          </div>
        </template>

        <div class="space-y-4">
          <u-radio-group
            v-model="teamIdentityMode"
            orientation="horizontal"
            :items="[
              { label: 'Emoji', value: 'emoji' },
              { label: 'Logo', value: 'logo' },
            ]"
          ></u-radio-group>

          <div class="space-y-3">
            <div
              v-for="(team, index) in teams"
              :key="index"
              class="flex gap-3 items-center"
            >
              <!-- Emoji picker (emoji mode only) -->
              <u-popover v-if="teamIdentityMode === 'emoji'">
                <button
                  type="button"
                  class="w-12 h-12 shrink-0 rounded border border-default flex items-center justify-center text-2xl hover:bg-muted transition-colors"
                >
                  {{ team.emoji || '🎯' }}
                </button>
                <template #content="{ close }">
                  <client-only>
                    <emoji-picker
                      :native="true"
                      :disable-skin-tones="true"
                      @select="(emoji: any) => { team.emoji = emoji.i; close() }"
                    ></emoji-picker>
                  </client-only>
                </template>
              </u-popover>

              <!-- Logo upload (logo mode only) -->
              <template v-if="teamIdentityMode === 'logo'">
                <div class="w-12 h-12 shrink-0 rounded border border-default flex items-center justify-center overflow-hidden">
                  <img
                    v-if="team.logo"
                    :src="team.logo"
                    :alt="team.name"
                    class="w-full h-full object-cover"
                  >
                  <u-icon
                    v-else
                    :name="resolveIcon('photo')"
                    class="text-xl text-dimmed"
                  ></u-icon>
                </div>
                <div v-if="!team.id" class="text-xs text-muted">
                  Save first
                </div>
                <template v-else>
                  <label
                    class="cursor-pointer"
                  >
                    <u-button
                      :loading="uploadingTeamIndex === index"
                      size="sm"
                      variant="soft"
                      :icon="team.logo ? resolveIcon('reload') : resolveIcon('upload')"
                      as="span"
                    >
                      {{ team.logo ? 'Change' : 'Upload' }}
                    </u-button>
                    <input
                      type="file"
                      accept="image/*"
                      class="hidden"
                      @change="onLogoFileChange(index, $event)"
                    >
                  </label>
                  <u-button
                    v-if="team.logo"
                    size="sm"
                    variant="soft"
                    color="error"
                    :icon="resolveIcon('close')"
                    @click="removeTeamLogo(index)"
                  >
                    Remove
                  </u-button>
                </template>
              </template>

              <u-input
                v-model="team.name"
                class="flex-1"
                placeholder="Team name"
                size="lg"
              ></u-input>
              <u-button
                color="error"
                variant="soft"
                :icon="resolveIcon('trash')"
                size="lg"
                @click="removeTeam(index)"
              ></u-button>
            </div>
          </div>

          <!-- Preview -->
          <div v-if="teams.length" class="border-t border-default pt-4">
            <h4 class="text-sm font-medium text-muted mb-3">
              Preview
            </h4>
            <div class="space-y-2">
              <div
                v-for="(team, index) in teams"
                :key="`preview-${index}`"
                class="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted"
              >
                <template v-if="teamIdentityMode === 'logo'">
                  <img
                    v-if="team.logo"
                    :src="team.logo"
                    :alt="team.name"
                    class="w-8 h-8 rounded object-cover"
                  >
                  <u-icon
                    v-else
                    :name="resolveIcon('photo')"
                    class="w-8 h-8 text-dimmed"
                  ></u-icon>
                </template>
                <span v-else class="text-2xl">{{ team.emoji || '🎯' }}</span>
                <span class="text-sm font-medium text-default">
                  {{ team.name || 'Unnamed Team' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </u-card>

      <!-- Challenges -->
      <u-card class="mb-6">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-display text-lg font-semibold">
              Challenges
            </h3>
            <u-button
              size="sm"
              :icon="resolveIcon('plus')"
              @click="addChallenge"
            >
              Add Challenge
            </u-button>
          </div>
        </template>

        <div class="space-y-3">
          <div
            v-for="(challenge, index) in challenges"
            :key="index"
            class="p-3 rounded-lg border"
            :class="{
              'border-green-500 bg-green-50/50 dark:bg-green-950/20': challenge.status === 'active',
              'border-default': challenge.status !== 'active',
            }"
          >
            <div class="flex gap-3 mb-2">
              <div class="flex-1 space-y-3">
                <div class="flex items-center gap-2">
                  <u-input
                    v-model="challenge.name"
                    placeholder="Challenge name"
                    class="flex-1"
                    size="lg"
                  ></u-input>
                  <u-badge
                    :color="getChallengeStatusColor(challenge.status || 'upcoming')"
                    variant="subtle"
                    size="lg"
                  >
                    {{ getChallengeStatusLabel(challenge.status || 'upcoming') }}
                  </u-badge>
                </div>
                <u-input
                  v-model="challenge.description"
                  placeholder="Description (optional)"
                  size="lg"
                  class="w-full"
                ></u-input>
              </div>
              <u-button
                color="error"
                variant="soft"
                :icon="resolveIcon('trash')"
                size="lg"
                @click="removeChallenge(index)"
              ></u-button>
            </div>

            <!-- Challenge action buttons (only show for existing challenges with IDs) -->
            <div v-if="challenge.id" class="flex gap-2 mt-2">
              <!-- Upcoming → Activate -->
              <u-button
                v-if="challenge.status === 'upcoming'"
                size="sm"
                color="success"
                :icon="resolveIcon('play')"
                @click="activateChallenge(challenge.id!)"
              >
                Activate
              </u-button>

              <!-- Active → Lock or Lock & Next -->
              <template v-if="challenge.status === 'active'">
                <u-button
                  size="sm"
                  color="error"
                  :icon="resolveIcon('lock')"
                  @click="lockChallenge(challenge.id!)"
                >
                  Lock
                </u-button>
                <u-button
                  size="sm"
                  color="primary"
                  :icon="resolveIcon('skipForward')"
                  @click="lockAndNext(challenge.id!)"
                >
                  Lock & Next
                </u-button>
              </template>

              <!-- Locked → Re-activate -->
              <u-button
                v-if="challenge.status === 'locked'"
                size="sm"
                color="warning"
                :icon="resolveIcon('reload')"
                @click="reactivateChallenge(challenge.id!)"
              >
                Re-activate
              </u-button>
            </div>
          </div>
        </div>
      </u-card>

      <!-- Judges -->
      <u-card class="mb-6">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-display text-lg font-semibold">
              Judges
            </h3>
            <div class="flex gap-2">
              <u-button
                size="sm"
                color="primary"
                :icon="resolveIcon('link')"
                :loading="isGeneratingTokens"
                @click="generateAllLinks"
              >
                Generate All Links
              </u-button>
              <u-button
                v-if="judgeLinks.length > 0"
                size="sm"
                variant="soft"
                :icon="resolveIcon('copy')"
                @click="copyAllLinks"
              >
                Copy All Links
              </u-button>
              <u-button
                size="sm"
                :icon="resolveIcon('plus')"
                @click="addJudge"
              >
                Add Judge
              </u-button>
            </div>
          </div>
        </template>

        <div class="space-y-4">
          <div
            v-for="(judge, index) in judges"
            :key="index"
            class="space-y-2"
          >
            <div class="flex gap-3 items-center">
              <u-input
                v-model="judge.name"
                class="flex-1"
                placeholder="Judge name"
                size="lg"
              ></u-input>
              <u-badge
                v-if="judge.token"
                color="success"
                variant="subtle"
                size="lg"
              >
                Link Generated
              </u-badge>
              <u-badge
                v-else
                color="neutral"
                variant="subtle"
                size="lg"
              >
                No Link
              </u-badge>
              <u-button
                color="error"
                variant="soft"
                :icon="resolveIcon('trash')"
                size="lg"
                @click="removeJudge(index)"
              ></u-button>
            </div>

            <!-- Show generated link if available -->
            <div
              v-if="judge.token"
              class="ml-2 flex gap-2 items-center"
            >
              <code class="flex-1 px-3 py-2 bg-muted rounded text-xs overflow-x-auto font-mono">
                {{ getFullJudgeUrl(`/labs/scoreboard/judge/${judge.token}`) }}
              </code>
              <u-button
                size="md"
                variant="soft"
                :icon="resolveIcon('copy')"
                @click="copyJudgeLink(`/labs/scoreboard/judge/${judge.token}`)"
              >
                Copy
              </u-button>
            </div>
          </div>
        </div>
      </u-card>

      <!-- Actions -->
      <u-card class="bg-muted/50">
        <div class="flex flex-col sm:flex-row gap-4">
          <u-button
            color="primary"
            size="xl"
            :icon="resolveIcon('save')"
            :loading="isSaving"
            class="flex-1"
            @click="saveConfiguration"
          >
            Save Configuration
          </u-button>

          <u-button
            color="neutral"
            variant="soft"
            size="xl"
            :icon="resolveIcon('reload')"
            class="flex-1"
            @click="resetToDemo"
          >
            Reset to Demo Data
          </u-button>

          <u-button
            color="error"
            variant="soft"
            size="xl"
            :icon="resolveIcon('trash')"
            class="flex-1"
            @click="clearDemoData"
          >
            Clear Demo Data
          </u-button>
        </div>
      </u-card>
    </div>
    <!-- Confirmation Modal -->
    <u-modal v-model:open="confirmModal">
      <template #header>
        <h3 class="font-display text-lg font-semibold">
          {{ confirmTitle }}
        </h3>
      </template>
      <template #body>
        <p>{{ confirmDescription }}</p>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <u-button
            color="neutral"
            variant="soft"
            @click="confirmModal = false"
          >
            Cancel
          </u-button>
          <u-button
            color="error"
            @click="executeConfirm"
          >
            Confirm
          </u-button>
        </div>
      </template>
    </u-modal>
  </div>
</template>

<script setup lang="ts">
import type { TeamIdentityMode } from '#shared/types'

const EmojiPicker = defineAsyncComponent(() => import('vue3-emoji-picker'))

onMounted(() => {
  // @ts-expect-error CSS side-effect import has no type declarations
  import('vue3-emoji-picker/css')
})

interface Team {
  id?: number
  name: string
  emoji: string
  logo?: string
}

interface Challenge {
  id?: number
  name: string
  description: string
  status?: 'upcoming' | 'active' | 'locked'
}

interface Judge {
  id?: number
  name: string
  token?: string
}

const toast = useToast()
const { resolveIcon } = useAppearance()

const pin = ref('')
// Digits for the PIN widget; joined into `pin` (used as the x-admin-pin header).
// Length must match SCOREBOARD_ADMIN_PIN (default '1234').
const pinDigits = ref<string[]>([])
const isAuthenticated = ref(false)
const pinError = ref('')
const isSaving = ref(false)
const isGeneratingTokens = ref(false)

// Confirmation modal state
const confirmModal = ref(false)
const confirmTitle = ref('')
const confirmDescription = ref('')
const confirmAction = ref<(() => void) | null>(null)

function showConfirm(title: string, description: string, action: () => void) {
  confirmTitle.value = title
  confirmDescription.value = description
  confirmAction.value = action
  confirmModal.value = true
}

function executeConfirm() {
  confirmModal.value = false
  confirmAction.value?.()
}

// Event configuration
const eventName = ref('')
const eventDescription = ref('')
const teamIdentityMode = ref<TeamIdentityMode>('emoji')
const scoreMin = ref(1)
const scoreMax = ref(200)
const teams = ref<Team[]>([])
const challenges = ref<Challenge[]>([])
const judges = ref<Judge[]>([])

// Judge links (stored after generating tokens)
const judgeLinks = ref<{ judgeName: string, token: string, url: string }[]>([])

// Real-time stream — update displayed data when user is NOT editing
const { data: streamData } = useScoreboardStream()
const isDirty = ref(false)

// Track form dirtiness: mark dirty when user edits any field
function markDirty() {
  isDirty.value = true
}

// Reset dirty flag after save/load
function markClean() {
  isDirty.value = false
}

// Watch stream data and update form when not dirty
watch(streamData, (newData) => {
  if (!newData || !isAuthenticated.value || isDirty.value)
    return
  // Update form refs from stream data
  eventName.value = newData.event.name
  eventDescription.value = newData.event.description || ''
  teamIdentityMode.value = (newData.event.teamIdentityMode || 'emoji') as TeamIdentityMode
  scoreMin.value = newData.event.scoreMin
  scoreMax.value = newData.event.scoreMax
  teams.value = newData.teams.map(t => ({ id: t.id, name: t.name, emoji: t.emoji || '', logo: t.logo || undefined }))
  challenges.value = newData.challenges.map(c => ({
    id: c.id,
    name: c.name,
    description: c.description || '',
    status: c.status || 'upcoming',
  }))
  if (newData.judges) {
    judges.value = newData.judges.map(j => ({ id: j.id, name: j.name }))
  }
})

// Check sessionStorage on mount
onMounted(() => {
  const storedPin = sessionStorage.getItem('scoreboard-admin-pin')
  if (storedPin) {
    pin.value = storedPin
    pinDigits.value = storedPin.split('')
    verifyPin(storedPin)
  }
})

async function verifyPin(pinValue: string = pin.value) {
  pinError.value = ''
  try {
    const response = await $fetch('/api/scoreboard/auth/verify-pin', {
      method: 'POST',
      body: { pin: pinValue },
    })

    if (response.valid) {
      sessionStorage.setItem('scoreboard-admin-pin', pinValue)
      isAuthenticated.value = true
      await loadEventData()
    }
  }
  catch (error: any) {
    if (error.status === 401) {
      pinError.value = 'Invalid PIN'
      pinDigits.value = []
    }
    else {
      pinError.value = 'Error verifying PIN'
      pinDigits.value = []
    }
  }
}

async function loadEventData() {
  try {
    const event = await $fetch<any>('/api/scoreboard/event')
    if (!event?.event)
      return

    eventName.value = event.event.name
    eventDescription.value = event.event.description
    teamIdentityMode.value = event.event.teamIdentityMode || 'emoji'
    scoreMin.value = event.event.scoreMin
    scoreMax.value = event.event.scoreMax
    teams.value = event.teams?.map((t: any) => ({ id: t.id, name: t.name, emoji: t.emoji, logo: t.logo || undefined })) || []
    challenges.value = event.challenges?.map((c: any) => ({
      id: c.id,
      name: c.name,
      description: c.description || '',
      status: c.status || 'upcoming',
    })) || []
    judges.value = event.judges?.map((j: any) => ({ id: j.id, name: j.name })) || []
    markClean()
  }
  catch (error: any) {
    toast.add({
      title: 'Failed to load event data',
      description: error.data?.message,
      icon: resolveIcon('warning'),
      color: 'error',
    })
  }
}

function addTeam() {
  teams.value.push({ name: '', emoji: '🎯' })
  markDirty()
}

function removeTeam(index: number) {
  teams.value.splice(index, 1)
  markDirty()
}

const uploadingTeamIndex = ref<number | null>(null)

async function uploadTeamLogo(index: number, file: File) {
  const team = teams.value[index]
  if (!team?.id)
    return

  uploadingTeamIndex.value = index
  try {
    const formData = new FormData()
    formData.append('logo', file)

    const result = await $fetch<{ logo: string }>(`/api/scoreboard/teams/${team.id}/logo`, {
      method: 'PUT',
      headers: { 'x-admin-pin': pin.value },
      body: formData,
    })

    team.logo = result.logo
    toast.add({ title: 'Logo uploaded', icon: resolveIcon('check'), color: 'success' })
  }
  catch (error: any) {
    toast.add({
      title: 'Failed to upload logo',
      description: error.data?.message,
      icon: resolveIcon('warning'),
      color: 'error',
    })
  }
  finally {
    uploadingTeamIndex.value = null
  }
}

async function removeTeamLogo(index: number) {
  const team = teams.value[index]
  if (!team?.id)
    return

  try {
    await $fetch(`/api/scoreboard/teams/${team.id}/logo`, {
      method: 'DELETE',
      headers: { 'x-admin-pin': pin.value },
    })

    team.logo = undefined
    toast.add({ title: 'Logo removed', icon: resolveIcon('check'), color: 'success' })
  }
  catch (error: any) {
    toast.add({
      title: 'Failed to remove logo',
      description: error.data?.message,
      icon: resolveIcon('warning'),
      color: 'error',
    })
  }
}

function onLogoFileChange(index: number, event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    uploadTeamLogo(index, file)
  }
}

function addChallenge() {
  challenges.value.push({ name: '', description: '' })
  markDirty()
}

function removeChallenge(index: number) {
  challenges.value.splice(index, 1)
  markDirty()
}

function addJudge() {
  judges.value.push({ name: '' })
  markDirty()
}

function removeJudge(index: number) {
  judges.value.splice(index, 1)
  markDirty()
}

async function saveConfiguration() {
  isSaving.value = true
  try {
    await $fetch('/api/scoreboard/event', {
      method: 'PUT',
      body: {
        pin: pin.value,
        name: eventName.value,
        description: eventDescription.value,
        teamIdentityMode: teamIdentityMode.value,
        scoreMin: scoreMin.value,
        scoreMax: scoreMax.value,
        teams: teams.value,
        challenges: challenges.value,
        judges: judges.value,
      },
    })

    // Reload to get updated data and reset dirty state
    await loadEventData()
    markClean()
    toast.add({
      title: 'Configuration saved',
      icon: resolveIcon('check'),
      color: 'success',
    })
  }
  catch (error: any) {
    toast.add({
      title: 'Failed to save configuration',
      description: error.data?.message,
      icon: resolveIcon('warning'),
      color: 'error',
    })
  }
  finally {
    isSaving.value = false
  }
}

function resetToDemo() {
  showConfirm(
    'Reset to Demo Data',
    'This will reset all event data to demo values. Are you sure?',
    async () => {
      try {
        await $fetch('/api/scoreboard/seed', {
          method: 'POST',
          body: { pin: pin.value },
        })

        await loadEventData()
        toast.add({
          title: 'Reset to demo data',
          icon: resolveIcon('check'),
          color: 'success',
        })
      }
      catch (error: any) {
        toast.add({
          title: 'Failed to reset data',
          description: error.data?.message,
          icon: resolveIcon('warning'),
          color: 'error',
        })
      }
    },
  )
}

function clearDemoData() {
  showConfirm(
    'Clear All Data',
    'This will delete ALL teams, challenges, judges, and scores. This action cannot be undone. Are you sure?',
    async () => {
      try {
        await $fetch('/api/scoreboard/clear', {
          method: 'POST',
          body: { pin: pin.value },
        })

        await loadEventData()
        toast.add({
          title: 'All demo data cleared',
          icon: resolveIcon('check'),
          color: 'success',
        })
      }
      catch (error: any) {
        toast.add({
          title: 'Failed to clear data',
          description: error.data?.message,
          icon: resolveIcon('warning'),
          color: 'error',
        })
      }
    },
  )
}

// Challenge status management
async function activateChallenge(challengeId: number, force = false) {
  try {
    await $fetch('/api/scoreboard/challenges/activate', {
      method: 'POST',
      body: {
        pin: pin.value,
        challengeId,
        force,
      },
    })
    await loadEventData()
  }
  catch (error: any) {
    toast.add({
      title: 'Failed to activate challenge',
      description: error.data?.message,
      icon: resolveIcon('warning'),
      color: 'error',
    })
  }
}

async function lockChallenge(challengeId: number) {
  try {
    await $fetch('/api/scoreboard/challenges/lock', {
      method: 'POST',
      body: {
        pin: pin.value,
        challengeId,
      },
    })
    await loadEventData()
  }
  catch (error: any) {
    toast.add({
      title: 'Failed to lock challenge',
      description: error.data?.message,
      icon: resolveIcon('warning'),
      color: 'error',
    })
  }
}

function reactivateChallenge(challengeId: number) {
  showConfirm(
    'Re-activate Challenge',
    'Re-activate this locked challenge? This will lock any currently active challenge.',
    () => activateChallenge(challengeId, true),
  )
}

async function lockAndNext(currentChallengeId: number) {
  const currentIndex = challenges.value.findIndex(c => c.id === currentChallengeId)
  const nextChallenge = challenges.value
    .slice(currentIndex + 1)
    .find(c => c.status === 'upcoming')

  if (!nextChallenge?.id) {
    toast.add({
      title: 'No upcoming challenges to activate',
      icon: resolveIcon('info'),
      color: 'warning',
    })
    return
  }

  try {
    // Lock current challenge
    await lockChallenge(currentChallengeId)
    // Activate next challenge
    await activateChallenge(nextChallenge.id)
  }
  catch (error: any) {
    toast.add({
      title: 'Failed to lock and advance',
      description: error.data?.message,
      icon: resolveIcon('warning'),
      color: 'error',
    })
  }
}

function getChallengeStatusColor(status: string) {
  switch (status) {
    case 'active':
      return 'success'
    case 'locked':
      return 'error'
    default:
      return 'neutral'
  }
}

function getChallengeStatusLabel(status: string) {
  switch (status) {
    case 'active':
      return 'Active'
    case 'locked':
      return 'Locked'
    default:
      return 'Upcoming'
  }
}

// Judge token management
async function generateAllLinks() {
  isGeneratingTokens.value = true
  try {
    const links = await $fetch<{ judgeName: string, token: string, url: string }[]>(
      '/api/scoreboard/judges/generate-tokens',
      {
        method: 'POST',
        body: { pin: pin.value },
      },
    )

    judgeLinks.value = links

    // Update local judges with tokens
    for (const link of links) {
      const judge = judges.value.find(j => j.name === link.judgeName)
      if (judge) {
        judge.token = link.token
      }
    }

    toast.add({
      title: `Generated ${links.length} judge links`,
      icon: resolveIcon('check'),
      color: 'success',
    })
  }
  catch (error: any) {
    toast.add({
      title: 'Failed to generate judge links',
      description: error.data?.message,
      icon: resolveIcon('warning'),
      color: 'error',
    })
  }
  finally {
    isGeneratingTokens.value = false
  }
}

function getFullJudgeUrl(url: string): string {
  if (typeof window === 'undefined')
    return url
  return `${window.location.origin}${url}`
}

async function copyJudgeLink(url: string) {
  const fullUrl = getFullJudgeUrl(url)
  try {
    await navigator.clipboard.writeText(fullUrl)
    toast.add({
      title: 'Link copied to clipboard',
      icon: resolveIcon('clipboardCheck'),
      color: 'success',
    })
  }
  catch {
    toast.add({
      title: 'Failed to copy link',
      icon: resolveIcon('warning'),
      color: 'error',
    })
  }
}

async function copyAllLinks() {
  if (judgeLinks.value.length === 0) {
    toast.add({
      title: 'No links to copy',
      description: 'Generate links first.',
      icon: resolveIcon('info'),
      color: 'warning',
    })
    return
  }

  const allLinksText = judgeLinks.value
    .map(link => `${link.judgeName}: ${getFullJudgeUrl(link.url)}`)
    .join('\n')

  try {
    await navigator.clipboard.writeText(allLinksText)
    toast.add({
      title: 'All links copied to clipboard',
      icon: resolveIcon('clipboardCheck'),
      color: 'success',
    })
  }
  catch {
    toast.add({
      title: 'Failed to copy links',
      icon: resolveIcon('warning'),
      color: 'error',
    })
  }
}
</script>
