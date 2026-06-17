<template>
  <figure v-if="src && !failed" class="space-y-2">
    <img
      :src="src"
      :alt="alt ?? sources[type].alt"
      loading="lazy"
      v-bind="$attrs"
      @error="failed = true"
    >
    <figcaption v-if="caption || slots.caption" class="text-xs text-dimmed">
      <slot name="caption">
        {{ caption }}
      </slot>
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
/**
 * A random image that fetches a fresh one each visit (cache-busted) and hides
 * itself — image *and* caption together — if the request fails. Safe to drop
 * anywhere, including the error page, without risking a broken image or an
 * orphaned caption.
 *
 * Pick a source with `type` (default: a cat GIF from thecatapi.com). Add a
 * source by extending the `sources` registry below: each entry only needs to
 * return a direct image URL (no JSON round-trip), so the component stays
 * dependency-free and robust even when the rest of the app has failed.
 *
 * The caller's `class`/attrs pass through to the `<img>`; the `<figure>` is an
 * internal wrapper that keeps the caption tied to the image.
 */
defineOptions({ inheritAttrs: false })

const { type = 'cat', caption, alt } = defineProps<{
  /** Which random-image source to use. Defaults to a cat GIF. */
  type?: RandomImageType
  /** Optional caption shown below the image (hidden too if the image fails). */
  caption?: string
  /** Override the alt text (defaults to the source's own description). */
  alt?: string
}>()

type RandomImageType = 'cat' | 'photo'

interface RandomImageSource {
  /** Build a fresh, uncacheable image URL from a cache-buster value. */
  url: (bust: number) => string
  /** Default alt text when the caller doesn't override it. */
  alt: string
}

const sources: Record<RandomImageType, RandomImageSource> = {
  cat: {
    url: bust => `https://thecatapi.com/api/images/get?format=src&type=gif&_=${bust}`,
    alt: 'A random cat, because you deserve one',
  },
  photo: {
    url: bust => `https://picsum.photos/seed/${bust}/600/400`,
    alt: 'A random photo',
  },
}

const slots = useSlots()

const src = ref('')
const failed = ref(false)

onMounted(() => {
  src.value = sources[type].url(Date.now())
})
</script>
