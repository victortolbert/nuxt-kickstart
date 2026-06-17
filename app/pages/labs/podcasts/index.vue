<template>
  <div class="space-y-8">
    <h1 class="sr-only">
      {{ $t('nav.podcastApp') }}
    </h1>

    <!-- Error States -->
    <div v-if="podcastsError" class="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
      <p class="font-semibold">
        Error loading podcasts
      </p>
      <p class="text-sm mt-1">
        {{ podcastsError }}
      </p>
    </div>

    <div v-if="subscriptionsError" class="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
      <p class="font-semibold">
        Error loading subscriptions
      </p>
      <p class="text-sm mt-1">
        {{ subscriptionsError }}
      </p>
    </div>

    <div v-if="inProgressError" class="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
      <p class="font-semibold">
        Error loading in-progress episodes
      </p>
      <p class="text-sm mt-1">
        {{ inProgressError }}
      </p>
    </div>

    <!-- Empty State -->
    <div v-if="!podcasts || podcasts.length === 0" class="text-center py-12">
      <div class="text-muted text-lg">
        No podcasts found
      </div>
    </div>

    <!-- Continue Listening Section -->
    <div v-if="inProgressEpisodes && inProgressEpisodes.length > 0" class="space-y-4">
      <div class="flex items-center gap-2">
        <u-icon :name="resolveIcon('clock')" class="w-5 h-5 text-primary"></u-icon>
        <h2 class="text-xl font-semibold">
          Continue Listening
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <podcasts-episode-card
          v-for="episode in inProgressEpisodes"
          :key="episode.slug"
          :episode="episode"
          :progress="episode.progress"
        ></podcasts-episode-card>
      </div>
    </div>

    <!-- My Subscriptions Section -->
    <div v-if="subscribedPodcasts.length > 0" class="space-y-4">
      <div class="flex items-center gap-2">
        <u-icon :name="resolveIcon('bookmark')" class="w-5 h-5 text-primary"></u-icon>
        <h2 class="text-xl font-semibold">
          My Subscriptions
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <podcasts-podcast-card
          v-for="podcast in subscribedPodcasts"
          :key="podcast.slug"
          :podcast="podcast"
          :episode-count="podcast.episodeCount"
          :subscribed="true"
        ></podcasts-podcast-card>
      </div>
    </div>

    <!-- All Podcasts Section -->
    <div v-if="allPodcasts.length > 0" class="space-y-4">
      <div class="flex items-center gap-2">
        <u-icon :name="resolveIcon('microphone')" class="w-5 h-5 text-muted"></u-icon>
        <h2 class="text-xl font-semibold">
          {{ subscribedPodcasts.length > 0 ? 'All Podcasts' : 'Podcasts' }}
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <podcasts-podcast-card
          v-for="podcast in allPodcasts"
          :key="podcast.slug"
          :podcast="podcast"
          :episode-count="podcast.episodeCount"
          :subscribed="subscribedPodcastSlugs.has(podcast.slug)"
        ></podcasts-podcast-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
  podcastSlug: string
  status: 'draft' | 'published'
}

interface Subscription {
  id: number
  userId: string
  podcastSlug: string
  createdAt: string
}

interface ProgressData {
  position: number
  completed: boolean
  updatedAt: string
}

interface InProgressEpisode extends Episode {
  title: string
  description: string
  publishedAt: string
  duration: number
  audioUrl: string
  showNotes?: string
  progress: ProgressData
}

const { resolveIcon } = useAppearance()

// Fetch all podcasts
const { data: podcasts, error: podcastsError } = await useFetch<Podcast[]>('/api/podcasts')

// Fetch user subscriptions
const { data: subscriptions, error: subscriptionsError } = await useFetch<Subscription[]>('/api/podcasts/subscriptions')

// Fetch in-progress episodes
const { data: inProgressEpisodes, error: inProgressError } = await useFetch<InProgressEpisode[]>('/api/podcasts/in-progress-episodes')

// Compute podcasts with episode counts (for potential future use)
const _podcastsWithCounts = computed(() => {
  if (!podcasts.value)
    return []

  return podcasts.value.map(podcast => ({
    ...podcast,
    episodeCount: 0, // Will be populated below
  }))
})

// Fetch episodes for all podcasts to get counts
const episodeCounts = ref<Record<string, number>>({})

onMounted(async () => {
  if (!podcasts.value)
    return

  // Fetch episode counts for each podcast
  for (const podcast of podcasts.value) {
    try {
      const episodes = await $fetch<Episode[]>(`/api/podcasts/${podcast.slug}/episodes`)
      episodeCounts.value[podcast.slug] = episodes.length
    }
    catch (error) {
      console.error(`Failed to fetch episodes for ${podcast.slug}:`, error)
      episodeCounts.value[podcast.slug] = 0
    }
  }
})

const podcastsWithCountsComputed = computed(() => {
  if (!podcasts.value)
    return []

  return podcasts.value.map(podcast => ({
    ...podcast,
    episodeCount: episodeCounts.value[podcast.slug] || 0,
  }))
})

// Get subscribed podcast slugs as a Set for quick lookup
const subscribedPodcastSlugs = computed(() => {
  if (!subscriptions.value)
    return new Set<string>()
  return new Set(subscriptions.value.map(sub => sub.podcastSlug))
})

// Filter subscribed podcasts with counts
const subscribedPodcasts = computed(() => {
  return podcastsWithCountsComputed.value.filter(podcast =>
    subscribedPodcastSlugs.value.has(podcast.slug),
  )
})

// Filter non-subscribed podcasts
const allPodcasts = computed(() => {
  return podcastsWithCountsComputed.value
})
</script>
