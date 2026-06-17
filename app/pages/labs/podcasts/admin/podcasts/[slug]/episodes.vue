<template>
  <div class="container mx-auto p-4 space-y-6">
    <!-- Error states -->
    <div v-if="podcastError" class="text-red-500">
      Failed to load podcast: {{ podcastError.message }}
    </div>

    <!-- Podcast header -->
    <div v-else-if="podcast" class="space-y-4">
      <div class="flex items-center gap-4">
        <u-button
          :icon="resolveIcon('arrowLeft')"
          variant="ghost"
          :to="`/labs/podcasts/${podcastSlug}`"
        >
          Back to Podcast
        </u-button>
      </div>

      <div class="flex items-start gap-4">
        <u-avatar
          :src="podcast.coverImage"
          :alt="podcast.title"
          size="3xl"
          :icon="resolveIcon('microphone')"
        ></u-avatar>
        <div>
          <h1 class="text-3xl font-bold">
            {{ podcast.title }}
          </h1>
          <p class="text-muted">
            Manage Episodes
          </p>
        </div>
      </div>

      <!-- Tabs -->
      <u-tabs
        v-model="activeTab"
        :items="[
          { value: 'drafts', label: 'Drafts', icon: resolveIcon('file') },
          { value: 'published', label: 'Published', icon: resolveIcon('check') },
        ]"
      ></u-tabs>

      <!-- Draft episodes panel -->
      <div v-if="activeTab === 'drafts'" class="space-y-4">
        <div v-if="draftError" class="text-red-500">
          Failed to load draft episodes: {{ draftError.message }}
        </div>
        <div v-else-if="!draftEpisodes || draftEpisodes.length === 0" class="text-muted">
          No draft episodes found.
        </div>
        <div v-else class="grid gap-4">
          <u-card
            v-for="episode in draftEpisodes"
            :key="episode.slug"
            class="relative"
          >
            <template #header>
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 class="font-semibold">
                    {{ episode.title }}
                  </h3>
                  <div class="flex items-center gap-4 text-sm text-muted">
                    <span>{{ formatDate(episode.publishedAt) }}</span>
                    <span>{{ formatDuration(episode.duration) }}</span>
                  </div>
                </div>
                <u-button
                  :icon="resolveIcon('send')"
                  color="primary"
                  :loading="publishingEpisode === episode.slug"
                  :disabled="publishingEpisode !== null"
                  @click="publishEpisode(episode.slug)"
                >
                  Publish
                </u-button>
              </div>
            </template>
            <p v-if="episode.description" class="text-sm line-clamp-2">
              {{ episode.description }}
            </p>
          </u-card>
        </div>
      </div>

      <!-- Published episodes panel -->
      <div v-if="activeTab === 'published'" class="space-y-4">
        <div v-if="publishedError" class="text-red-500">
          Failed to load published episodes: {{ publishedError.message }}
        </div>
        <div v-else-if="!publishedEpisodes || publishedEpisodes.length === 0" class="text-muted">
          No published episodes found.
        </div>
        <div v-else class="grid gap-4">
          <u-card
            v-for="episode in publishedEpisodes"
            :key="episode.slug"
            class="relative"
          >
            <template #header>
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 class="font-semibold">
                    {{ episode.title }}
                  </h3>
                  <div class="flex items-center gap-4 text-sm text-muted">
                    <span>{{ formatDate(episode.publishedAt) }}</span>
                    <span>{{ formatDuration(episode.duration) }}</span>
                  </div>
                </div>
                <u-button
                  :icon="resolveIcon('archive')"
                  color="error"
                  variant="ghost"
                  :loading="unpublishingEpisode === episode.slug"
                  :disabled="unpublishingEpisode !== null"
                  @click="unpublishEpisode(episode.slug)"
                >
                  Unpublish
                </u-button>
              </div>
            </template>
            <p v-if="episode.description" class="text-sm line-clamp-2">
              {{ episode.description }}
            </p>
          </u-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'admin',
})

interface Podcast {
  slug: string
  title: string
  description?: string
  author?: string
  coverImage?: string
  categories?: string[]
}

interface Episode {
  slug: string
  title: string
  description?: string
  podcastSlug: string
  publishedAt: string
  duration: number
  audioUrl?: string
  showNotes?: string
  status: 'draft' | 'published'
}

const route = useRoute()
const { resolveIcon } = useAppearance()
const podcastSlug = computed(() => route.params.slug as string)

// Fetch podcast details
const { data: podcast, error: podcastError } = await useFetch<Podcast>(
  `/api/podcasts/${podcastSlug.value}`,
)

// Fetch draft episodes
const {
  data: draftEpisodes,
  error: draftError,
  refresh: refreshDrafts,
} = await useFetch<Episode[]>(
  `/api/podcasts/${podcastSlug.value}/draft-episodes`,
)

// Fetch published episodes
const {
  data: publishedEpisodes,
  error: publishedError,
  refresh: refreshPublished,
} = await useFetch<Episode[]>(
  `/api/podcasts/${podcastSlug.value}/published-episodes`,
)

// State for active tab
const activeTab = ref<'drafts' | 'published'>('drafts')

// Loading states
const publishingEpisode = ref<string | null>(null)
const unpublishingEpisode = ref<string | null>(null)

// Format date
function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Format duration (minutes to mm:ss)
function formatDuration(minutes: number): string {
  const totalSeconds = minutes * 60
  const mins = Math.floor(totalSeconds / 60)
  const secs = Math.floor(totalSeconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Publish episode
async function publishEpisode(episodeSlug: string) {
  publishingEpisode.value = episodeSlug
  try {
    await $fetch('/api/podcasts/published-episodes', {
      method: 'POST',
      body: { episodeSlug },
    })
    await Promise.all([refreshDrafts(), refreshPublished()])
  }
  catch (error) {
    console.error('Failed to publish episode:', error)
  }
  finally {
    publishingEpisode.value = null
  }
}

// Unpublish episode
async function unpublishEpisode(episodeSlug: string) {
  unpublishingEpisode.value = episodeSlug
  try {
    await $fetch(`/api/podcasts/published-episodes/${episodeSlug}`, {
      method: 'DELETE',
    })
    await Promise.all([refreshDrafts(), refreshPublished()])
  }
  catch (error) {
    console.error('Failed to unpublish episode:', error)
  }
  finally {
    unpublishingEpisode.value = null
  }
}
</script>
