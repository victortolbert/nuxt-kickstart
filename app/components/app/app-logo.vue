<template>
  <div class="app-logo font-brand">
    <span
      class="app-name"
      :class="textSizeClasses[props.size]"
      :aria-label="appName"
    >{{ collapsed ? initial : appName }}</span>
  </div>
</template>

<script setup lang="ts">
/**
 * AppLogo — text wordmark for the app name.
 *
 * Renders the app name as plain text in the theme's primary color (no logomark).
 * When `collapsed` (icon-rail sidebar), only the first initial is shown.
 *
 * The name is a plain string literal so `pnpm run init` can rename it across the
 * codebase; the collapsed initial is derived from it automatically.
 *
 * @prop {boolean} collapsed - Show the initial only (collapsed sidebar)
 * @prop {string} size - Size preset: 'sm' | 'md' | 'lg' | 'xl'
 */

interface Props {
  collapsed?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<Props>(), {
  collapsed: false,
  size: 'lg',
})

// Plain string literal so `pnpm run init` renames the app name everywhere.
const appName = 'Kickstart'
const initial = computed(() => [...appName][0] ?? '')

const textSizeClasses = {
  sm: 'text-base',
  md: 'text-lg',
  lg: 'text-xl',
  xl: 'text-2xl',
}
</script>

<style>
/* AppLogo component styles (not scoped to keep selectors simple). */
.app-logo {
  display: inline-flex;
  align-items: center;
}

.app-logo .app-name {
  /* The active theme's brand color. Each theme defines --color-primary-500 for
     both light and dark, so this tracks theme + color mode. (Note: --ui-primary
     does NOT track the theme here — see app/utils/garden-status.ts neighbors.) */
  color: var(--color-primary-500);
  font-weight: 700;
  letter-spacing: 0.02em;
  line-height: 1.2;
  white-space: nowrap;
}
</style>
