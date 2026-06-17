<template>
  <div class="space-y-6">
    <!-- Error States -->
    <div v-if="podcastError || episodeError" class="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
      <p class="font-semibold">
        Error loading {{ podcastError ? 'podcast' : 'episode' }}
      </p>
      <p class="text-sm mt-1">
        {{ podcastError || episodeError }}
      </p>
    </div>

    <!-- Episode Not Found -->
    <div v-else-if="!episode" class="text-center py-12">
      <div class="text-muted text-lg">
        Episode not found
      </div>
    </div>

    <!-- Episode Detail -->
    <div v-else class="space-y-6">
      <!-- Breadcrumb / Back Link -->
      <div>
        <u-button
          v-if="podcast"
          :to="`/labs/podcasts/${podcastSlug}`"
          label="Back to Podcast"
          :icon="resolveIcon('arrowLeft')"
          variant="soft"
          size="sm"
        ></u-button>
      </div>

      <!-- Episode Header -->
      <u-card>
        <div class="space-y-4">
          <!-- Podcast Context -->
          <div v-if="podcast" class="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
            <u-avatar
              :src="podcast.coverImage"
              :alt="podcast.title"
              size="md"
              :icon="resolveIcon('microphone')"
            ></u-avatar>
            <div>
              <p class="text-sm text-muted">
                {{ podcast.title }}
              </p>
              <p class="text-xs text-dimmed">
                {{ podcast.author }}
              </p>
            </div>
          </div>

          <!-- Episode Title -->
          <div>
            <h1 class="text-3xl font-bold">
              {{ episode.title }}
            </h1>
            <p class="text-sm text-muted mt-2">
              {{ formattedDate }} · {{ formattedDuration }}
            </p>
          </div>

          <!-- Episode Description -->
          <p class="text-muted">
            {{ episode.description }}
          </p>

          <!-- Audio Player -->
          <podcasts-audio-player
            :audio-url="episode.audioUrl"
            :episode-slug="episode.slug"
          ></podcasts-audio-player>
        </div>
      </u-card>

      <!-- Show Notes -->
      <u-card v-if="episode.showNotes">
        <div class="space-y-3">
          <h2 class="text-xl font-semibold">
            Show Notes
          </h2>
          <div class="prose text-sm max-w-none">
            <p class="text-muted whitespace-pre-wrap">
              {{ episode.showNotes }}
            </p>
          </div>
        </div>
      </u-card>
    </div>
  </div>
</template>

<script setup lang="ts">
// Pattern: Nested resource with dedicated route
// Episode details are accessed through /podcasts/[slug]/episodes/[episodeSlug]
// This maintains the hierarchical relationship while giving episodes their own view

interface Podcast {
  slug: string
  title: string
  description: string
  author: string
  coverImage?: string
  website?: string
  feedUrl?: string
  categories: string[]
}

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

const route = useRoute()
const { resolveIcon } = useAppearance()
const podcastSlug = route.params.slug as string
const episodeSlug = route.params.episodeSlug as string

// Fetch podcast details (for breadcrumb and context)
const { data: podcast, error: podcastError } = await useFetch<Podcast>(`/api/podcasts/${podcastSlug}`)

// Fetch episode details from nested API route
const { data: episode, error: episodeError } = await useFetch<Episode>(`/api/podcasts/${podcastSlug}/episodes/${episodeSlug}`)

// Format duration from minutes to mm:ss display format
const formattedDuration = computed(() => {
  if (!episode.value)
    return '0:00'
  const totalSeconds = episode.value.duration * 60
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
})

// Format published date
const formattedDate = computed(() => {
  if (!episode.value)
    return ''
  return new Date(episode.value.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})
</script>
