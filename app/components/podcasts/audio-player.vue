<template>
  <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 space-y-4">
    <!-- Hidden audio element -->
    <audio
      ref="audioRef"
      :src="audioUrl"
      @loadedmetadata="handleLoadedMetadata"
      @timeupdate="handleTimeUpdate"
      @ended="handleEnded"
    />

    <!-- Progress Bar -->
    <div class="space-y-2">
      <label for="audio-progress" class="sr-only">Playback progress</label>
      <input
        id="audio-progress"
        type="range"
        min="0"
        max="100"
        :value="progress"
        class="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
        @input="handleSeek"
        @mousedown="handleSeekStart"
        @mouseup="handleSeekEnd"
        @touchstart="handleSeekStart"
        @touchend="handleSeekEnd"
      >
      <div class="flex justify-between text-xs text-muted">
        <span>{{ formattedCurrentTime }}</span>
        <span>{{ formattedDuration }}</span>
      </div>
    </div>

    <!-- Controls -->
    <div class="flex items-center justify-between gap-4">
      <!-- Play/Pause Button -->
      <u-button
        :icon="isPlaying ? resolveIcon('pause') : resolveIcon('play')"
        size="lg"
        :label="isPlaying ? 'Pause' : 'Play'"
        @click="togglePlayPause"
      ></u-button>

      <!-- Volume Control -->
      <div class="flex items-center gap-2 flex-1 max-w-xs">
        <u-icon
          :name="resolveIcon('volume')"
          class="w-5 h-5 text-muted"
          aria-hidden="true"
        ></u-icon>
        <label for="audio-volume" class="sr-only">Volume</label>
        <input
          id="audio-volume"
          type="range"
          min="0"
          max="1"
          step="0.01"
          :value="volume"
          class="flex-1 h-2 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
          @input="handleVolumeChange"
        >
        <span class="text-xs text-muted w-8 text-right">{{ Math.round(volume * 100) }}%</span>
      </div>
    </div>

    <!-- Completion Badge -->
    <div v-if="isCompleted" class="text-center">
      <u-badge color="success" variant="subtle">
        <u-icon :name="resolveIcon('check')" class="w-4 h-4"></u-icon>
        Completed
      </u-badge>
    </div>
  </div>
</template>

<script setup lang="ts">
// Pattern: Independent Property as Resource
// Playback progress is tracked independently from the episode resource

interface Props {
  audioUrl: string
  episodeSlug: string
  initialPosition?: number
}

const props = withDefaults(defineProps<Props>(), {
  initialPosition: 0,
})

const { resolveIcon } = useAppearance()

// State
const isPlaying = ref(false)
const currentTime = ref(props.initialPosition)
const duration = ref(0)
const volume = ref(0.8)
const isSeeking = ref(false)
const audioRef = ref<HTMLAudioElement | null>(null)

// API state
const progressId = ref<number | null>(null)
const lastSavedPosition = ref(props.initialPosition)

// Computed
const progress = computed(() => {
  if (!duration.value)
    return 0
  return (currentTime.value / duration.value) * 100
})

const formattedCurrentTime = computed(() => formatTime(currentTime.value))
const formattedDuration = computed(() => formatTime(duration.value))

const isCompleted = computed(() => {
  if (!duration.value)
    return false
  return (currentTime.value / duration.value) >= 0.9
})

// Helpers
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Audio event handlers
function handleLoadedMetadata() {
  if (audioRef.value) {
    duration.value = audioRef.value.duration
    // Set initial position if provided
    if (props.initialPosition > 0) {
      audioRef.value.currentTime = props.initialPosition
      currentTime.value = props.initialPosition
    }
  }
}

function handleTimeUpdate() {
  if (audioRef.value && !isSeeking.value) {
    currentTime.value = audioRef.value.currentTime
  }
}

function handleEnded() {
  isPlaying.value = false
  // Mark as completed when playback ends
  saveProgress(true)
}

async function togglePlayPause() {
  if (!audioRef.value)
    return

  if (isPlaying.value) {
    audioRef.value.pause()
    isPlaying.value = false
  }
  else {
    await audioRef.value.play()
    isPlaying.value = true
  }
}

function handleSeek(event: Event) {
  const input = event.target as HTMLInputElement
  const seekTime = (Number.parseFloat(input.value) / 100) * duration.value

  if (audioRef.value) {
    audioRef.value.currentTime = seekTime
    currentTime.value = seekTime
  }
}

function handleSeekStart() {
  isSeeking.value = true
}

function handleSeekEnd() {
  isSeeking.value = false
  // Save position after seeking
  saveProgress()
}

function handleVolumeChange(event: Event) {
  const input = event.target as HTMLInputElement
  volume.value = Number.parseFloat(input.value)
  if (audioRef.value) {
    audioRef.value.volume = volume.value
  }
}

// API interactions
async function fetchInitialProgress() {
  try {
    const response = await $fetch<{ position: number, completed: boolean, id: number } | null>(
      `/api/podcasts/playback-progress/${props.episodeSlug}`,
    )

    if (response) {
      progressId.value = response.id
      lastSavedPosition.value = response.position
      currentTime.value = response.position

      if (audioRef.value && response.position > 0) {
        audioRef.value.currentTime = response.position
      }
    }
  }
  catch (error) {
    // Progress doesn't exist yet, will be created on first save
    console.debug('No existing progress found:', error)
  }
}

async function saveProgress(completed = false) {
  try {
    const response = await $fetch(`/api/podcasts/playback-progress/${props.episodeSlug}`, {
      method: 'PUT',
      body: {
        position: Math.floor(currentTime.value),
        completed: completed || isCompleted.value,
      },
    })

    lastSavedPosition.value = currentTime.value

    // Store the ID if this was the first save
    if (!progressId.value && response && typeof response === 'object' && 'id' in response) {
      progressId.value = response.id as number
    }
  }
  catch (error) {
    console.error('Failed to save progress:', error)
  }
}

// Auto-save interval
let autoSaveInterval: ReturnType<typeof setInterval> | null = null

watch(isPlaying, (playing) => {
  if (playing) {
    // Save progress every 10 seconds during playback
    autoSaveInterval = setInterval(() => {
      saveProgress()
    }, 10000)
  }
  else {
    if (autoSaveInterval) {
      clearInterval(autoSaveInterval)
      autoSaveInterval = null
    }
    // Save when pausing
    saveProgress()
  }
})

// Lifecycle
onMounted(async () => {
  await fetchInitialProgress()

  // Set initial volume
  if (audioRef.value) {
    audioRef.value.volume = volume.value
  }
})

onUnmounted(() => {
  if (autoSaveInterval) {
    clearInterval(autoSaveInterval)
  }
  // Save final position when component unmounts
  saveProgress()
})
</script>
