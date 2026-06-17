<template>
  <div class="min-h-screen bg-default">
    <!-- Invalid Token -->
    <div v-if="judgeError" class="max-w-2xl mx-auto px-4 py-12">
      <div class="bg-elevated rounded-lg shadow-sm border border-default p-8 text-center">
        <u-icon :name="resolveIcon('caution')" class="w-16 h-16 text-red-500 mx-auto mb-4"></u-icon>
        <h1 class="font-display text-2xl font-bold text-default mb-2">
          Invalid or Expired Link
        </h1>
        <p class="text-muted">
          Contact the event admin for a valid scoring link.
        </p>
      </div>
    </div>

    <!-- Valid Token -->
    <div v-else-if="judge && eventState" class="max-w-2xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="bg-elevated rounded-lg shadow-sm border border-default p-6 mb-6">
        <div class="flex items-center gap-3 mb-4">
          <u-icon :name="resolveIcon('userCheck')" class="w-6 h-6 text-(--color-primary-500)"></u-icon>
          <div>
            <div class="text-sm text-muted">
              Scoring as:
            </div>
            <div class="font-display text-xl font-bold text-default">
              {{ judge.name }}
            </div>
          </div>
        </div>

        <div v-if="eventState.event" class="text-sm text-muted">
          Event: {{ eventState.event.name }}
        </div>

        <nuxt-link
          to="/labs/scoreboard"
          target="_blank"
          class="text-xs text-muted hover:text-(--color-primary-500) mt-2 inline-flex items-center gap-1"
        >
          <u-icon :name="resolveIcon('external')" class="w-3 h-3"></u-icon>
          View Scoreboard
        </nuxt-link>
      </div>

      <!-- Active Challenge -->
      <div v-if="eventState.activeChallenge" class="bg-linear-to-r from-(--color-primary-500) to-(--color-primary-600) text-inverted rounded-lg shadow-sm p-6 mb-6">
        <div class="flex items-center gap-2 mb-2">
          <u-icon :name="resolveIcon('activity')" class="w-5 h-5"></u-icon>
          <span class="text-sm font-medium opacity-90">Active Challenge:</span>
        </div>
        <h2 class="font-display text-2xl font-bold mb-2">
          {{ eventState.activeChallenge.name }}
        </h2>
        <p v-if="eventState.activeChallenge.description" class="text-sm opacity-80">
          {{ eventState.activeChallenge.description }}
        </p>
      </div>

      <!-- Waiting State -->
      <div v-else-if="statusMessage" class="bg-elevated rounded-lg shadow-sm border border-default p-8 text-center">
        <u-icon
          :name="resolveIcon('clock')"
          class="w-12 h-12 text-dimmed mx-auto mb-4"
          :class="{ 'animate-pulse': statusMessage.includes('Waiting') }"
        ></u-icon>
        <p class="text-lg text-muted">
          {{ statusMessage }}
        </p>
      </div>

      <!-- Team Scoring Form -->
      <div v-if="eventState.activeChallenge && eventState.teams.length" class="space-y-4">
        <div
          v-for="team in eventState.teams"
          :key="team.id"
          class="bg-elevated rounded-lg shadow-sm border border-default p-6"
        >
          <div class="flex items-center gap-2 mb-4">
            <template v-if="eventState?.event.teamIdentityMode === 'logo'">
              <img
                v-if="team.logo"
                :src="team.logo"
                :alt="team.name"
                class="w-8 h-8 rounded object-cover"
                @error="($event.target as HTMLImageElement).style.display = 'none'"
              >
              <u-icon
                v-else
                :name="resolveIcon('photo')"
                class="w-8 h-8 text-dimmed"
              ></u-icon>
            </template>
            <span v-else-if="team.emoji" class="text-2xl">{{ team.emoji }}</span>
            <h3 class="font-display text-lg font-semibold text-default">
              {{ team.name }}
            </h3>
          </div>

          <div class="space-y-4">
            <!-- Score Input -->
            <div>
              <label :for="`score-${team.id}`" class="block text-sm font-medium text-muted mb-2">
                Score ({{ eventState?.event.scoreMin }}-{{ eventState?.event.scoreMax }})
              </label>
              <input
                v-if="teamScores[team.id]"
                :id="`score-${team.id}`"
                v-model.number="teamScores[team.id]!.score"
                type="number"
                :min="eventState?.event.scoreMin"
                :max="eventState?.event.scoreMax"
                :disabled="hasSubmitted && !isEditing"
                class="w-full px-4 py-3 text-2xl font-bold text-center border border-default rounded-lg focus:ring-2 focus:ring-(--color-primary-500) focus:border-transparent disabled:bg-muted disabled:cursor-not-allowed bg-default text-default"
              >
            </div>

            <!-- Comment Input -->
            <div>
              <label :for="`comment-${team.id}`" class="block text-sm font-medium text-muted mb-2">
                Comment (optional)
              </label>
              <textarea
                v-if="teamScores[team.id]"
                :id="`comment-${team.id}`"
                v-model="teamScores[team.id]!.comment"
                :disabled="hasSubmitted && !isEditing"
                rows="2"
                class="w-full px-3 py-2 border border-default rounded-lg focus:ring-2 focus:ring-(--color-primary-500) focus:border-transparent disabled:bg-muted disabled:cursor-not-allowed bg-default text-default"
                placeholder="Add a comment about this team's performance..."
              />
            </div>
          </div>
        </div>

        <!-- Submit/Edit Buttons -->
        <div class="flex gap-4">
          <u-button
            v-if="!hasSubmitted || isEditing"
            size="xl"
            block
            :loading="isSubmitting"
            :disabled="isSubmitting"
            @click="submitScores"
          >
            <template #leading>
              <u-icon :name="resolveIcon('send')"></u-icon>
            </template>
            Submit Scores
          </u-button>

          <u-button
            v-else
            size="xl"
            block
            variant="outline"
            @click="enableEditing"
          >
            <template #leading>
              <u-icon :name="resolveIcon('edit')"></u-icon>
            </template>
            Edit Scores
          </u-button>
        </div>

        <div v-if="hasSubmitted && !isEditing" class="text-center">
          <div class="inline-flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
            <u-icon :name="resolveIcon('check')"></u-icon>
            Your scores have been submitted
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-else-if="eventPending" class="text-center py-8">
        <u-icon :name="resolveIcon('loading')" class="w-8 h-8 animate-spin text-dimmed mx-auto"></u-icon>
        <p class="text-muted mt-2">
          Loading event...
        </p>
      </div>
    </div>

    <!-- Loading Judge -->
    <div v-else class="max-w-2xl mx-auto px-4 py-12 text-center">
      <u-icon :name="resolveIcon('loading')" class="w-12 h-12 animate-spin text-dimmed mx-auto mb-4"></u-icon>
      <p class="text-muted">
        Validating your link...
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const token = route.params.token as string
const toast = useToast()
const { resolveIcon } = useAppearance()

interface Judge {
  id: number
  name: string
  eventId: number
}

interface Team {
  id: number
  name: string
  emoji: string | null
  logo: string | null
}

interface Challenge {
  id: number
  name: string
  description: string | null
  status: 'upcoming' | 'active' | 'locked'
}

interface EventState {
  event: {
    name: string
    teamIdentityMode: 'emoji' | 'logo'
    scoreMin: number
    scoreMax: number
  }
  teams: Team[]
  challenges: Challenge[]
  activeChallenge: Challenge | null
}

interface TeamScore {
  teamId: number
  score: number
  comment: string
}

// Validate token on load
const { data: judge, error: judgeError } = await useFetch<Judge>(`/api/scoreboard/judges/validate/${token}`, {
  server: false,
})

// Fetch event state
const { data: eventState, pending: eventPending, refresh: refreshEvent } = await useFetch<EventState>('/api/scoreboard/event', {
  server: false,
})

// Track scores for each team
const teamScores = ref<Record<number, TeamScore>>({})
const isSubmitting = ref(false)
const hasSubmitted = ref(false)
const isEditing = ref(false)

// Initialize scores when teams are loaded
watch(() => eventState.value?.teams, (teams) => {
  if (teams && !Object.keys(teamScores.value).length) {
    teams.forEach((team) => {
      teamScores.value[team.id] = {
        teamId: team.id,
        score: eventState.value?.event.scoreMin || 1,
        comment: '',
      }
    })
  }
}, { immediate: true })

// Poll for active challenge changes every 5 seconds
const { pause, resume } = useIntervalFn(() => {
  refreshEvent()
}, 5000)

// Pause polling when tab is hidden
onMounted(() => {
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        pause()
      }
      else {
        resume()
        refreshEvent()
      }
    })
  }
})

// Watch for active challenge changes
watch(() => eventState.value?.activeChallenge, (newChallenge, oldChallenge) => {
  if (newChallenge && newChallenge.id !== oldChallenge?.id) {
    // Reset submission state when challenge changes
    hasSubmitted.value = false
    isEditing.value = false
    // Reset scores to minimum
    if (eventState.value?.teams) {
      eventState.value.teams.forEach((team) => {
        teamScores.value[team.id] = {
          teamId: team.id,
          score: eventState.value?.event.scoreMin || 1,
          comment: '',
        }
      })
    }
  }
})

async function submitScores() {
  if (!judge.value || !eventState.value?.activeChallenge)
    return

  isSubmitting.value = true

  try {
    // Submit each team's score
    const promises = Object.values(teamScores.value).map(({ teamId, score, comment }) =>
      $fetch('/api/scoreboard/scores', {
        method: 'POST',
        body: {
          token,
          teamId,
          challengeId: eventState.value!.activeChallenge!.id,
          score,
          comment: comment || undefined,
        },
      }),
    )

    await Promise.all(promises)

    toast.add({
      title: 'Success',
      description: 'Your scores have been submitted',
      color: 'success',
    })

    hasSubmitted.value = true
    isEditing.value = false
  }
  catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.data?.message || 'Failed to submit scores',
      color: 'error',
    })
  }
  finally {
    isSubmitting.value = false
  }
}

function enableEditing() {
  isEditing.value = true
}

// Computed status message
const statusMessage = computed(() => {
  if (!eventState.value)
    return ''
  const { activeChallenge, challenges } = eventState.value
  if (!activeChallenge) {
    const hasUpcoming = challenges.some(c => c.status === 'upcoming')
    if (hasUpcoming)
      return 'Waiting for the next challenge...'
    return 'All challenges are complete. Thanks for judging!'
  }
  return ''
})

definePageMeta({
  layout: 'blank',
})

useSeoMeta({
  title: 'Judge Scoring',
  description: 'Submit your scores for the AI Champions event',
})
</script>
