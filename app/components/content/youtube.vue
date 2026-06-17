<template>
  <div
    class="youtube-embed not-prose my-6 w-full"
    :style="{ maxWidth: maxWidthStyle }"
  >
    <div
      class="youtube-wrapper relative w-full overflow-hidden rounded-lg bg-muted"
      :style="{ aspectRatio: aspect }"
    >
      <iframe
        :src="embedUrl"
        :title="`YouTube video ${id}`"
        class="absolute inset-0 size-full"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
        loading="lazy"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * YouTube Embed Component with responsive aspect ratio
 *
 * Usage in markdown:
 * ::youtube{id="dQw4w9WgXcQ"}
 * ::
 *
 * With custom aspect ratio:
 * ::youtube{id="dQw4w9WgXcQ" aspect="4/3"}
 * ::
 */

const props = withDefaults(defineProps<{
  id: string
  aspect?: string
  maxWidth?: string | number
  start?: number
  autoplay?: boolean
  loop?: boolean
  mute?: boolean
}>(), {
  aspect: '16/9',
  maxWidth: 800,
  start: 0,
  autoplay: false,
  loop: false,
  mute: false,
})

const embedUrl = computed(() => {
  const params = new URLSearchParams()

  if (props.start > 0)
    params.set('start', props.start.toString())
  if (props.autoplay)
    params.set('autoplay', '1')
  if (props.loop) {
    params.set('loop', '1')
    params.set('playlist', props.id)
  }
  if (props.mute)
    params.set('mute', '1')

  const baseUrl = `https://www.youtube-nocookie.com/embed/${props.id}`
  const queryString = params.toString()

  return queryString ? `${baseUrl}?${queryString}` : baseUrl
})

const maxWidthStyle = computed(() =>
  typeof props.maxWidth === 'number' ? `${props.maxWidth}px` : props.maxWidth,
)
</script>

<style scoped>
@media print {
  .youtube-embed {
    page-break-inside: avoid;
    break-inside: avoid;
  }
}
</style>
