<template>
  <div class="not-prose my-6 overflow-hidden rounded-lg border border-default">
    <table class="w-full text-sm">
      <thead>
        <tr class="border-b border-default bg-elevated/50 text-left">
          <th class="px-4 py-2 font-semibold">
            Theme
          </th>
          <th class="px-4 py-2 font-semibold">
            Description
          </th>
          <th class="px-4 py-2 font-semibold">
            Primary
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="t in themes"
          :key="t.id"
          class="border-b border-default last:border-0"
          :class="theme === t.id ? 'bg-primary/5' : ''"
        >
          <td class="px-4 py-2">
            <button
              type="button"
              class="inline-flex items-center gap-2 font-medium transition-colors hover:text-primary"
              :class="theme === t.id ? 'text-primary' : ''"
              @click="setTheme(t.id)"
            >
              <u-icon :name="t.icon" class="size-4 shrink-0"></u-icon>
              {{ t.label }}
              <u-icon
                v-if="theme === t.id"
                :name="resolveIcon('check')"
                class="size-4 shrink-0 text-primary"
              ></u-icon>
            </button>
          </td>
          <td class="px-4 py-2 text-muted">
            {{ t.description }}
          </td>
          <td class="px-4 py-2">
            <span class="inline-flex items-center gap-2 whitespace-nowrap">
              <span
                class="size-4 shrink-0 rounded-full border border-default"
                :style="{ backgroundColor: swatch[t.id] }"
              />
              <span class="text-muted">{{ hueLabel[t.id] }}</span>
            </span>
          </td>
        </tr>
      </tbody>
    </table>
    <p class="border-t border-default px-4 py-2 text-xs text-muted">
      Click a theme name to apply it live.
    </p>
  </div>
</template>

<script setup lang="ts">
import type { ThemeId } from '~~/shared/types/theme'

const { theme, themes, setTheme } = useTheme()
const { resolveIcon } = useAppearance()
const appConfig = useAppConfig()

// The default ("system") theme uses the colors declared in app/app.config.ts.
// Read the primary live (Title-cased) instead of hardcoding it.
const appPrimary = computed(() => formatLabel(String(appConfig.ui?.colors?.primary ?? 'neutral')))

// Per-theme primary swatches mirror --color-primary-500 in
// app/assets/css/themes/*.css (a CSS var would only reflect the *active* theme,
// but the table shows all primaries at once). 'system' is the exception: it
// pulls the live app.config primary via --ui-primary, which is theme-independent.
const swatch = computed<Record<ThemeId, string>>(() => ({
  system: 'var(--ui-primary)',
  lyra: 'oklch(0.623 0.214 259.815)',
  nord: 'oklch(0.65 0.11 205)',
  dracula: 'oklch(0.68 0.20 320)',
  catppuccin: 'oklch(0.68 0.18 295)',
  carnival: 'oklch(0.68 0.19 35)',
}))
const hueLabel = computed<Record<ThemeId, string>>(() => ({
  system: `${appPrimary.value} (app.config)`,
  lyra: 'Blue (~hue 260)',
  nord: 'Cyan-blue (~hue 205)',
  dracula: 'Pink (~hue 320)',
  catppuccin: 'Mauve (~hue 295)',
  carnival: 'Orange (~hue 35)',
}))
</script>
