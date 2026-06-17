<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="space-y-2">
      <div class="flex items-center gap-2">
        <u-icon :name="resolveIcon('success')" class="w-6 h-6 text-primary"></u-icon>
        <h1 class="text-2xl font-bold">
          Listening History
        </h1>
      </div>
      <p class="text-muted">
        Episodes you've completed
      </p>
    </div>

    <!-- Error State -->
    <div v-if="completedError" class="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
      <p class="font-semibold">
        Error loading history
      </p>
      <p class="text-sm mt-1">
        {{ completedError }}
      </p>
    </div>

    <!-- Empty State -->
    <div v-if="!completedEpisodes || completedEpisodes.length === 0" class="text-center py-12">
      <u-icon :name="resolveIcon('inbox')" class="w-16 h-16 text-muted mx-auto mb-4"></u-icon>
      <div class="text-lg font-semibold mb-2">
        No completed episodes
      </div>
      <p class="text-muted">
        Episodes you finish will appear here
      </p>
    </div>

    <!-- Completed Episodes List -->
    <div v-if="completedEpisodes && completedEpisodes.length > 0" class="space-y-4">
      <div
        v-for="episode in completedEpisodes"
        :key="episode.slug"
        class="relative group"
      >
        <u-card class="hover:shadow-md transition-shadow">
          <div class="space-y-3">
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-semibold">
                  {{ episode.title }}
                </h3>
                <p class="text-sm text-muted mt-1">
                  Completed on {{ formatCompletionDate(episode.progress.updatedAt) }}
                </p>
              </div>
              <u-button
                :icon="resolveIcon('close')"
                variant="ghost"
                size="sm"
                color="neutral"
                @click="clearFromHistory(episode.slug)"
              ></u-button>
            </div>

            <p class="text-sm text-muted line-clamp-2">
              {{ episode.description }}
            </p>

            <div class="flex items-center gap-2">
              <u-button
                :to="`/labs/podcasts/${episode.podcastSlug}/episodes/${episode.slug}`"
                label="Listen Again"
                :icon="resolveIcon('play')"
                variant="soft"
                size="sm"
              ></u-button>
            </div>
          </div>
        </u-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Episode {
  slug: string
  podcastSlug: string
  title: string
  description: string
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

interface CompletedEpisode extends Episode {
  progress: ProgressData
}

const { resolveIcon } = useAppearance()

// Fetch completed episodes
const { data: completedEpisodes, error: completedError, refresh } = await useFetch<CompletedEpisode[]>('/api/podcasts/completed-episodes')

// Clear individual item from history
async function clearFromHistory(episodeSlug: string) {
  try {
    await $fetch(`/api/podcasts/playback-progress/${episodeSlug}`, {
      method: 'DELETE',
    })
    // Refresh the list after clearing
    await refresh()
  }
  catch (error) {
    console.error('Failed to clear history item:', error)
  }
}

// Format completion date
function formatCompletionDate(updatedAt: string) {
  return new Date(updatedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>
