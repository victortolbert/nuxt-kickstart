<template>
  <div>
    <!-- Error States -->
    <div v-if="podcastError" class="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
      <p class="font-semibold">
        Error loading podcast
      </p>
      <p class="text-sm mt-1">
        {{ podcastError }}
      </p>
    </div>

    <!-- Podcast Not Found -->
    <div v-else-if="!podcast" class="text-center py-12">
      <div class="text-muted text-lg">
        Podcast not found
      </div>
    </div>

    <!-- Podcast Detail -->
    <div v-else class="space-y-8">
      <!-- Podcast Header -->
      <u-card>
        <div class="flex flex-col md:flex-row gap-6">
          <!-- Cover Image -->
          <div class="shrink-0">
            <u-avatar
              :src="podcast.coverImage"
              :alt="podcast.title"
              size="3xl"
              :icon="resolveIcon('microphone')"
            ></u-avatar>
          </div>

          <!-- Podcast Info -->
          <div class="flex-1 space-y-4">
            <div>
              <h1 class="text-3xl font-bold">
                {{ podcast.title }}
              </h1>
              <p class="text-lg text-muted mt-1">
                {{ podcast.author }}
              </p>
            </div>

            <p class="text-muted">
              {{ podcast.description }}
            </p>

            <div class="flex items-center gap-4">
              <span class="text-sm text-muted">
                {{ episodeCount }} episode{{ episodeCount !== 1 ? 's' : '' }}
              </span>

              <u-button
                v-if="podcast.website"
                :to="podcast.website"
                label="Visit Website"
                :icon="resolveIcon('external')"
                trailing
                variant="soft"
                size="sm"
                target="_blank"
              ></u-button>

              <!-- Subscribe button -->
              <podcasts-subscribe-button
                :podcast-slug="podcast.slug"
              ></podcasts-subscribe-button>
            </div>
          </div>
        </div>
      </u-card>

      <!-- Episodes List -->
      <div>
        <h2 class="text-2xl font-bold mb-4">
          Episodes
        </h2>

        <div v-if="episodesError" class="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
          <p class="font-semibold">
            Error loading episodes
          </p>
          <p class="text-sm mt-1">
            {{ episodesError }}
          </p>
        </div>

        <div v-else-if="!episodes || episodes.length === 0" class="text-center py-8 text-muted">
          No published episodes yet
        </div>

        <div v-else class="space-y-4">
          <u-card
            v-for="episode in episodes"
            :key="episode.slug"
            class="hover:shadow-md transition-shadow"
          >
            <div class="space-y-3">
              <div>
                <h3 class="text-lg font-semibold">
                  {{ episode.title }}
                </h3>
                <p class="text-sm text-muted mt-1">
                  {{ new Date(episode.publishedAt).toLocaleDateString() }} · {{ episode.duration }} minutes
                </p>
              </div>

              <p class="text-sm text-muted line-clamp-2">
                {{ episode.description }}
              </p>

              <div class="flex gap-2">
                <u-button
                  :to="`/labs/podcasts/${podcast.slug}/episodes/${episode.slug}`"
                  label="Play Episode"
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
const slug = route.params.slug as string

// Fetch podcast details
const { data: podcast, error: podcastError } = await useFetch<Podcast>(`/api/podcasts/${slug}`)

// Fetch published episodes for this podcast
const { data: episodes, error: episodesError } = await useFetch<Episode[]>(`/api/podcasts/${slug}/episodes`)

const episodeCount = computed(() => episodes.value?.length || 0)
</script>
