<template>
  <u-card class="hover:shadow-lg transition-shadow">
    <template #header>
      <div class="flex items-start gap-4">
        <u-avatar
          :src="podcast.coverImage"
          :alt="podcast.title"
          size="lg"
          :icon="resolveIcon('microphone')"
        ></u-avatar>

        <div class="flex-1 min-w-0">
          <h3 class="font-semibold text-lg truncate">
            {{ podcast.title }}
          </h3>
          <p class="text-sm text-muted truncate">
            {{ podcast.author }}
          </p>
        </div>
      </div>
    </template>

    <div class="space-y-3">
      <p class="text-sm text-muted line-clamp-3">
        {{ podcast.description }}
      </p>

      <div class="flex items-center justify-between text-sm">
        <span class="text-muted">
          {{ episodeCount }} episode{{ episodeCount !== 1 ? 's' : '' }}
        </span>

        <div class="flex gap-2">
          <u-button
            v-if="podcast.website"
            :to="podcast.website"
            :icon="resolveIcon('external')"
            variant="ghost"
            size="xs"
            color="neutral"
            target="_blank"
          ></u-button>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex gap-2">
        <u-button
          :to="`/labs/podcasts/${podcast.slug}`"
          label="View Episodes"
          :icon="resolveIcon('arrowRight')"
          trailing
          block
          variant="soft"
        ></u-button>
        <podcasts-subscribe-button
          :podcast-slug="podcast.slug"
          :initial-subscribed="subscribed"
        ></podcasts-subscribe-button>
      </div>
    </template>
  </u-card>
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

interface Props {
  podcast: Podcast
  episodeCount: number
  subscribed?: boolean
}

withDefaults(defineProps<Props>(), {
  subscribed: false,
})

const { resolveIcon } = useAppearance()
</script>
