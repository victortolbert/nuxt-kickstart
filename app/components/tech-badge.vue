<template>
  <component
    :is="link ? 'NuxtLink' : 'span'"
    :to="link ? techPath : undefined"
    class="tech-badge inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
    :class="[
      link ? 'hover:opacity-80 cursor-pointer' : '',
      mode === 'icon'
        ? 'tech-badge--icon'
        : {
          'rounded': true,
          'px-1.5 py-0.5 text-xs': size === 'xs' || size === 'sm',
          'px-2 py-1 text-sm': size === 'md',
          'px-2.5 py-1 text-sm': size === 'lg',
          'px-3 py-1.5 text-base': size === 'xl',
        },
    ]"
    :style="{ '--brand': brandColor }"
  >
    <u-icon
      v-if="showIcon"
      :name="displayIcon"
      :class="iconSize"
    ></u-icon>
    <span v-if="showLabel">{{ formatTag(displayLabel) }}</span>
  </component>
</template>

<script setup lang="ts">
import type { UiSize } from '#shared/types/appearance'
import { getTechConfig } from '~/utils/tech-config'

type DisplayMode = 'icon' | 'label' | 'both'

const props = withDefaults(defineProps<{
  /** Tech slug (e.g., 'nuxt', 'tailwind', 'typescript') */
  slug: string
  /** Display mode: icon only, label only, or both */
  mode?: DisplayMode
  /** Badge size */
  size?: UiSize
  /** Override the default label */
  label?: string
  /** Override the default icon */
  icon?: string
  /** Make the badge a link to the tech page */
  link?: boolean
}>(), {
  mode: 'both',
  size: 'md',
  link: false,
})

const config = computed(() => getTechConfig(props.slug))

const displayLabel = computed(() => props.label || config.value.label)
const displayIcon = computed(() => props.icon || config.value.icon)
const brandColor = computed(() => config.value.color)

const showIcon = computed(() => props.mode === 'icon' || props.mode === 'both')
const showLabel = computed(() => props.mode === 'label' || props.mode === 'both')

const techPath = computed(() => `/tech/${props.slug}`)

// Icon size based on badge size
const iconSize = computed(() => {
  const sizes: Record<UiSize, string> = {
    xs: 'size-3',
    sm: 'size-3.5',
    md: 'size-4',
    lg: 'size-5',
    xl: 'size-6',
  }
  return sizes[props.size]
})
</script>

<style scoped>
/* Brand color tints the chip only — text stays theme-driven so the label is
   readable in every theme and color mode (see tech-config.ts). The lightness
   clamp keeps tint and outline visible regardless of how dark or light the
   brand hex is: near-black brands (Vercel, GitHub, Cypress) get lifted in
   dark mode; near-white/neon brands get deepened in light mode. */
.tech-badge {
  --brand-soft: oklch(from var(--brand) clamp(0.35, l, 0.75) c h);
  background-color: color-mix(in oklch, var(--brand-soft) 12%, var(--ui-bg));
  color: var(--ui-text);
}

.dark .tech-badge {
  --brand-soft: oklch(from var(--brand) clamp(0.55, l, 0.85) c h);
}

/* Icon-only mode: drop the chip box so the full-color logo stands alone. */
.tech-badge--icon {
  background-color: transparent;
  border: 0;
}
</style>
