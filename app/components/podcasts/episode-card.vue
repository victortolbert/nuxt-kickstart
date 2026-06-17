<template>
  <u-card class="hover:shadow-md transition-shadow">
    <div class="space-y-3">
      <div>
        <h3 class="text-lg font-semibold">
          {{ episode.title }}
        </h3>
        <p class="text-sm text-muted mt-1">
          {{ formattedDate }} · {{ formattedDuration }}
        </p>
      </div>

      <p class="text-sm text-muted line-clamp-2">
        {{ episode.description }}
      </p>

      <!-- Progress bar if progress exists -->
      <u-progress
        v-if="progress && progressPercentage > 0"
        :value="progressPercentage"
        :max="100"
        size="sm"
        color="primary"
      ></u-progress>

      <div class="flex gap-2">
        <u-button
          :to="`/labs/podcasts/${episode.podcastSlug}/episodes/${episode.slug}`"
          :label="progress && progressPercentage > 0 ? 'Continue' : 'Play Episode'"
          :icon="resolveIcon('play')"
          variant="soft"
          size="sm"
        ></u-button>
      </div>
    </div>
  </u-card>
</template>

<script setup lang="ts">
interface Episode {
  slug: string
  title: string
  description: string
  podcastSlug: string
  publishedAt: string
  duration: number
  audioUrl: string
  showNotes?: string
  status: 'draft' | 'published'
}

interface ProgressData {
  position: number
  completed: boolean
  updatedAt: string
}

interface Props {
  episode: Episode
  progress?: ProgressData
}

const props = defineProps<Props>()

const { resolveIcon } = useAppearance()

// Format duration from minutes to mm:ss
const formattedDuration = computed(() => {
  const totalSeconds = props.episode.duration * 60
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = Math.floor(totalSeconds % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
})

// Calculate progress percentage
const progressPercentage = computed(() => {
  if (!props.progress)
    return 0
  const totalSeconds = props.episode.duration * 60
  return Math.min(100, Math.round((props.progress.position / totalSeconds) * 100))
})

// Format published date
const formattedDate = computed(() => {
  return new Date(props.episode.publishedAt).toLocaleDateString()
})
</script>
