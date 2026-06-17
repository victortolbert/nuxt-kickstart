<template>
  <nuxt-layout :name="viewMode === 'grid' ? 'blank' : 'default'">
    <div class="min-h-screen bg-default">
      <!-- Grid View (Fullscreen Presentation Mode) -->
      <!-- eslint-disable-next-line vue-a11y/no-static-element-interactions -- @mousemove only auto-reveals the floating control bar; it's an ambient pointer enhancement with no keyboard equivalent, and the bar's actions remain reachable without it -->
      <div
        v-if="viewMode === 'grid' && eventState?.teams.length"
        class="fixed inset-0 z-50 overflow-hidden bg-default"
        @mousemove="handleGridMouseMove"
      >
        <scoreboard-presentation-grid
          :teams="rankedTeams"
          :max-score="maxScore"
          :team-identity-mode="eventState?.event.teamIdentityMode ?? 'emoji'"
          :animated-scores="animatedScores"
          :highlighted-team-ids="recentlyUpdated"
          :header-offset="0"
        ></scoreboard-presentation-grid>

        <!-- Persistent close button (top-right) -->
        <button
          class="fixed top-4 right-4 z-60 flex items-center justify-center size-10 rounded-full bg-elevated/80 border border-default text-muted hover:text-default hover:bg-elevated transition-colors backdrop-blur-sm shadow-sm"
          title="Back to leaderboard (Escape)"
          aria-label="Back to leaderboard"
          @click="viewMode = 'list'"
        >
          <u-icon :name="resolveIcon('close')" class="w-5 h-5"></u-icon>
        </button>

        <!-- Floating control bar (appears on hover near bottom) -->
        <transition
          enter-active-class="transition-all duration-300 ease-out"
          leave-active-class="transition-all duration-300 ease-in"
          enter-from-class="translate-y-full opacity-0"
          leave-to-class="translate-y-full opacity-0"
        >
          <div
            v-if="showControls"
            class="fixed bottom-0 inset-x-0 z-60 px-6 py-3"
            style="background: linear-gradient(to top, oklch(0.15 0 0 / 80%), oklch(0.15 0 0 / 40%)); backdrop-filter: blur(8px);"
          >
            <div class="flex items-center justify-center gap-4 text-sm text-white/90">
              <!-- Status -->
              <div class="flex items-center gap-1.5">
                <span
                  class="inline-block w-2 h-2 rounded-full"
                  :class="statusConfig.dotClass"
                />
                <span>{{ statusConfig.label }}</span>
              </div>

              <span class="w-px h-4 bg-white/20" />

              <!-- Event name -->
              <span v-if="eventState?.event" class="font-display font-bold truncate max-w-50">
                {{ eventState.event.name }}
              </span>

              <!-- Active challenge -->
              <span v-if="eventState?.activeChallenge" class="opacity-70 truncate max-w-50">
                {{ eventState.activeChallenge.name }}
              </span>

              <span class="w-px h-4 bg-white/20" />

              <!-- Refresh -->
              <button
                class="p-1.5 rounded hover:bg-white/10 transition-colors"
                title="Refresh"
                @click="handleForceRefresh"
              >
                <u-icon
                  :name="resolveIcon('reload')"
                  class="w-4 h-4"
                  :class="{ 'animate-spin': isRefreshing }"
                ></u-icon>
              </button>

              <!-- Switch to list -->
              <button
                class="p-1.5 rounded hover:bg-white/10 transition-colors"
                title="List view (V)"
                @click="toggleView"
              >
                <u-icon :name="resolveIcon('list')" class="w-4 h-4"></u-icon>
              </button>

              <!-- Exit fullscreen -->
              <button
                class="p-1.5 rounded hover:bg-white/10 transition-colors"
                title="Exit (Escape)"
                @click="viewMode = 'list'"
              >
                <u-icon :name="resolveIcon('close')" class="w-4 h-4"></u-icon>
              </button>
            </div>
          </div>
        </transition>
      </div>

      <!-- Header -->
      <div class="bg-elevated border-b border-default">
        <div class="max-w-6xl mx-auto px-4 py-6">
          <div v-if="pending" class="flex items-center justify-center">
            <u-icon :name="resolveIcon('loading')" class="w-6 h-6 animate-spin text-dimmed"></u-icon>
            <span class="ml-2 text-muted">Loading scoreboard...</span>
          </div>

          <div v-else-if="error" class="text-center">
            <u-icon :name="resolveIcon('caution')" class="w-8 h-8 text-red-500 mx-auto mb-2"></u-icon>
            <p class="text-red-600 dark:text-red-400">
              Failed to load scoreboard
            </p>
          </div>

          <div v-else-if="!eventState?.event">
            <div class="text-center py-12">
              <u-icon :name="resolveIcon('trophy')" class="w-16 h-16 text-dimmed mx-auto mb-4"></u-icon>
              <h2 class="font-display text-2xl font-bold text-default mb-2">
                No event configured
              </h2>
              <p class="text-muted">
                Contact an admin to set up the scoreboard.
              </p>
            </div>
          </div>

          <div v-else>
            <div class="flex items-start justify-between">
              <div>
                <h1 class="font-display text-3xl font-bold text-default mb-2">
                  {{ eventState.event.name }}
                </h1>
                <p v-if="eventState.event.description" class="text-muted">
                  {{ eventState.event.description }}
                </p>
              </div>

              <!-- Connection Status Indicator -->
              <div class="flex items-center gap-2 text-xs text-muted shrink-0 ml-4">
                <u-tooltip :text="transportLabel">
                  <div class="flex items-center gap-1.5">
                    <span
                      class="inline-block w-2 h-2 rounded-full"
                      :class="statusConfig.dotClass"
                    />
                    <span>{{ statusConfig.label }}</span>
                  </div>
                </u-tooltip>
                <span v-if="lastUpdated" class="text-dimmed">
                  {{ timeAgo }}
                </span>
                <button
                  class="p-1 rounded hover:bg-muted transition-colors"
                  title="Force Refresh"
                  @click="handleForceRefresh"
                >
                  <u-icon
                    :name="resolveIcon('reload')"
                    class="w-3.5 h-3.5"
                    :class="{ 'animate-spin': isRefreshing }"
                  ></u-icon>
                </button>
                <span class="w-px h-3 bg-border" />
                <button
                  class="p-1 rounded transition-colors"
                  :class="viewMode === 'grid' ? 'text-primary-500' : 'text-dimmed hover:bg-muted'"
                  title="Grid view (V)"
                  @click="toggleView"
                >
                  <u-icon :name="resolveIcon('layoutGrid')" class="w-3.5 h-3.5"></u-icon>
                </button>
                <button
                  class="p-1 rounded transition-colors"
                  :class="viewMode === 'list' ? 'text-primary-500' : 'text-dimmed hover:bg-muted'"
                  title="List view (V)"
                  @click="toggleView"
                >
                  <u-icon :name="resolveIcon('list')" class="w-3.5 h-3.5"></u-icon>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Active Challenge Banner -->
      <div
        v-if="eventState?.activeChallenge"
        class="bg-linear-to-r from-(--color-primary-500) to-(--color-primary-600) text-inverted"
      >
        <div class="max-w-6xl mx-auto px-4 py-6">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <u-icon :name="resolveIcon('activity')" class="w-5 h-5"></u-icon>
                <span class="text-sm font-medium opacity-90">Now scoring:</span>
              </div>
              <h2 class="font-display text-2xl font-bold">
                {{ eventState.activeChallenge.name }}
              </h2>
              <p v-if="eventState.activeChallenge.description" class="text-sm opacity-80 mt-1">
                {{ eventState.activeChallenge.description }}
              </p>
            </div>
            <div class="text-right">
              <div class="text-sm opacity-90">
                {{ challengeStatus }}
              </div>
              <div class="flex gap-1 mt-2">
                <div
                  v-for="i in totalChallenges"
                  :key="i"
                  class="w-2 h-2 rounded-full"
                  :class="i <= completedChallenges + 1 ? 'bg-white' : 'bg-white/30'"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-else-if="eventState"
        class="bg-muted border-b border-default"
      >
        <div class="max-w-6xl mx-auto px-4 py-4 text-center">
          <p class="text-muted">
            {{ challengeStatus }}
          </p>
        </div>
      </div>

      <!-- Empty state: event loaded but 0 teams -->
      <div v-if="eventState?.event && !eventState.teams.length" class="max-w-6xl mx-auto px-4 py-16 text-center">
        <u-icon :name="resolveIcon('users')" class="w-16 h-16 text-dimmed mx-auto mb-4"></u-icon>
        <h2 class="font-display text-2xl font-bold text-default mb-2">
          No teams yet
        </h2>
        <p class="text-muted">
          Teams will appear here once they are added in the admin settings.
        </p>
      </div>

      <!-- List View (Leaderboard) -->
      <div v-if="viewMode === 'list' && eventState?.teams.length" class="max-w-6xl mx-auto px-4 py-8">
        <div class="bg-elevated rounded-lg shadow-sm border border-default overflow-hidden">
          <div class="px-6 py-4 border-b border-default">
            <h2 class="font-display text-xl font-bold text-default flex items-center gap-2">
              <u-icon :name="resolveIcon('trophy')" class="w-6 h-6 text-(--color-primary-500)"></u-icon>
              Leaderboard
            </h2>
          </div>

          <transition-group
            tag="div"
            name="team-list"
            class="divide-y divide-default"
          >
            <div
              v-for="(team, index) in rankedTeams"
              :key="team.id"
              class="px-6 py-4 flex items-center gap-4 hover:bg-muted transition-colors"
              :class="{ 'score-updated': recentlyUpdated.has(team.id) }"
            >
              <!-- Rank & Medal -->
              <div class="flex items-center justify-center w-12">
                <span v-if="getMedal(index)" class="text-3xl">{{ getMedal(index) }}</span>
                <span v-else class="text-xl font-bold text-dimmed">{{ index + 1 }}</span>
              </div>

              <!-- Team Info -->
              <div class="flex-1">
                <div class="flex items-center gap-2">
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
                  <span class="text-lg font-semibold text-default">
                    {{ team.name }}
                  </span>
                </div>
              </div>

              <!-- Score -->
              <div class="text-right min-w-30">
                <div class="text-2xl font-bold text-(--color-primary-500)">
                  {{ getAnimatedScore(team.id) }}
                </div>
                <div class="text-xs text-muted">
                  points
                </div>
              </div>

              <!-- Bar Chart -->
              <div class="w-48 h-8 bg-muted rounded-full overflow-hidden">
                <div
                  class="h-full bg-linear-to-r from-(--color-primary-500) to-(--color-primary-600) transition-all duration-500"
                  :style="{ width: `${(team.totalScore / maxScore) * 100}%` }"
                />
              </div>
            </div>
          </transition-group>
        </div>

        <!-- Footer -->
        <div class="mt-8 text-center">
          <nuxt-link
            to="/labs/scoreboard/settings"
            class="inline-flex items-center gap-2 text-sm text-muted hover:text-default"
          >
            <u-icon :name="resolveIcon('settings')"></u-icon>
            Admin Settings
          </nuxt-link>
        </div>
      </div>
    </div>
  </nuxt-layout>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import { onKeyStroke, TransitionPresets, useMediaQuery, useTimeAgo, useTransition } from '@vueuse/core'

const { data: eventState, status: streamStatus, transport: streamTransport, lastUpdated, forceRefresh } = useScoreboardStream()
const route = useRoute()
const router = useRouter()
const { resolveIcon } = useAppearance()

// View mode: grid (fullscreen presentation, no app chrome) or list
// (leaderboard inside the default layout). Priority: URL param > localStorage
// > default ('list'). The initial value must be SSR-deterministic (URL only) —
// the stored preference is applied after mount to avoid hydration mismatches.
function resolveInitialView(): 'grid' | 'list' {
  const param = route.query.view as string | undefined
  if (param === 'grid' || param === 'list')
    return param
  return 'list'
}

const viewMode = ref<'grid' | 'list'>(resolveInitialView())

onMounted(() => {
  const param = route.query.view as string | undefined
  if (param !== 'grid' && param !== 'list') {
    const stored = localStorage.getItem('scoreboard-view')
    if (stored === 'grid' || stored === 'list')
      viewMode.value = stored
  }
})

// Persist view changes to localStorage and URL param
watch(viewMode, (mode) => {
  if (import.meta.client)
    localStorage.setItem('scoreboard-view', mode)
  router.replace({ query: { ...route.query, view: mode } })
})

// Escape key returns to list view
onKeyStroke('Escape', () => {
  if (viewMode.value === 'grid')
    viewMode.value = 'list'
})

// Floating controls for grid (presentation) mode
const showControls = ref(false)
let controlsTimer: ReturnType<typeof setTimeout> | null = null

function handleGridMouseMove(event: MouseEvent) {
  const windowHeight = window.innerHeight
  if (windowHeight - event.clientY <= 120) {
    showControls.value = true
    resetControlsTimer()
  }
}

function resetControlsTimer() {
  if (controlsTimer)
    clearTimeout(controlsTimer)
  controlsTimer = setTimeout(() => {
    showControls.value = false
  }, 3000)
}

onUnmounted(() => {
  if (controlsTimer)
    clearTimeout(controlsTimer)
})

// V key toggles view (only when not focused on input/textarea)
onKeyStroke('v', (e) => {
  const tag = (e.target as HTMLElement)?.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT')
    return
  viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid'
})

function toggleView() {
  viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid'
}

// Show loading state while connecting
const pending = computed(() => streamStatus.value === 'connecting' && !eventState.value)
const error = computed(() => streamStatus.value === 'offline' && !eventState.value)

// Force refresh with spin animation
const isRefreshing = ref(false)
async function handleForceRefresh() {
  isRefreshing.value = true
  await forceRefresh()
  setTimeout(() => {
    isRefreshing.value = false
  }, 500)
}

// Status indicator config
const statusConfig = computed(() => {
  switch (streamStatus.value) {
    case 'connected':
      return { label: 'Live', dotClass: 'bg-[var(--status-connected)]' }
    case 'reconnecting':
      return { label: 'Reconnecting...', dotClass: 'bg-[var(--status-reconnecting)]' }
    case 'polling':
      return { label: 'Polling', dotClass: 'bg-[var(--status-polling)]' }
    case 'offline':
      return { label: 'Offline', dotClass: 'bg-[var(--status-offline)]' }
    default:
      return { label: 'Connecting...', dotClass: 'bg-[var(--status-reconnecting)]' }
  }
})

const transportLabel = computed(() => {
  const labels: Record<string, string> = {
    websocket: 'Connected via WebSocket',
    sse: 'Connected via SSE',
    polling: 'Using polling',
  }
  return labels[streamTransport.value] || streamTransport.value
})

const timeAgo = useTimeAgo(() => lastUpdated.value || new Date())

// Computed properties for leaderboard
const rankedTeams = computed(() => {
  if (!eventState.value?.teams)
    return []
  return eventState.value.teams.toSorted((a, b) => b.totalScore - a.totalScore)
})

const maxScore = computed(() => {
  if (!rankedTeams.value.length)
    return 1
  return Math.max(...rankedTeams.value.map(t => t.totalScore), 1)
})

// Animated score transitions
const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
const _scoreTransitions = new Map<number, { source: Ref<number>, animated: Ref<number> }>()

function ensureScoreTransition(teamId: number, initial: number) {
  if (!_scoreTransitions.has(teamId)) {
    const source = ref(initial)
    const animated = useTransition(source, {
      duration: 500,
      transition: TransitionPresets.easeOutCubic,
      disabled: prefersReducedMotion,
    })
    _scoreTransitions.set(teamId, { source, animated })
  }
  return _scoreTransitions.get(teamId)!
}

watch(() => eventState.value?.teams, (teams) => {
  if (!teams)
    return
  for (const team of teams) {
    const t = ensureScoreTransition(team.id, team.totalScore)
    t.source.value = team.totalScore
  }
}, { deep: true, immediate: true })

function getAnimatedScore(teamId: number): number {
  const t = _scoreTransitions.get(teamId)
  return t ? Math.round(t.animated.value) : 0
}

// Animated scores as Map for grid component
const animatedScores = computed(() => {
  const map = new Map<number, number>()
  for (const team of rankedTeams.value)
    map.set(team.id, getAnimatedScore(team.id))
  return map
})

// Highlight pulse for score changes
const _previousScores = new Map<number, number>()
const recentlyUpdated = reactive(new Set<number>())

watch(() => eventState.value?.teams, (teams) => {
  if (!teams)
    return
  for (const team of teams) {
    const prev = _previousScores.get(team.id)
    if (prev !== undefined && prev !== team.totalScore) {
      recentlyUpdated.add(team.id)
      setTimeout(() => {
        recentlyUpdated.delete(team.id)
      }, 1500)
    }
    _previousScores.set(team.id, team.totalScore)
  }
}, { deep: true, immediate: true })

// Medal icons for top 3
function getMedal(index: number): string {
  if (index === 0)
    return '🥇'
  if (index === 1)
    return '🥈'
  if (index === 2)
    return '🥉'
  return ''
}

// Active challenge status message
const challengeStatus = computed(() => {
  if (!eventState.value)
    return ''
  const { activeChallenge, challenges } = eventState.value
  if (activeChallenge) {
    const current = challenges.findIndex(c => c.id === activeChallenge.id) + 1
    return `Challenge ${current} of ${challenges.length}`
  }
  const hasUpcoming = challenges.some(c => c.status === 'upcoming')
  if (hasUpcoming)
    return 'Waiting for next challenge...'
  return 'Event complete — Final standings'
})

const completedChallenges = computed(() => {
  if (!eventState.value)
    return 0
  return eventState.value.challenges.filter(c => c.status === 'locked').length
})

const totalChallenges = computed(() => eventState.value?.challenges.length || 0)

definePageMeta({
  layout: false,
})

useSeoMeta({
  title: () => eventState.value?.event.name || 'AI Champions Scoreboard',
  description: () => eventState.value?.event.description || 'Live scoreboard for AI Champions event',
})
</script>
