import type { ThemeConfig, ThemeId } from '~~/shared/types/theme'
import { computed, useColorMode, useState, watch } from '#imports'

export const themes: ThemeConfig[] = [
  {
    id: 'system',
    label: 'Default',
    icon: 'i-tabler-settings',
    description: 'Uses app.config colors (primary + neutral)',
    radius: '0rem',
  },
  {
    id: 'lyra',
    label: 'Lyra',
    icon: 'i-tabler-palette',
    description: 'Blue/slate shadcn-inspired theme',
    radius: '0.25rem',
  },
  {
    id: 'nord',
    label: 'Nord',
    icon: 'i-tabler-snowflake',
    description: 'Arctic, north-bluish palette',
    radius: '0.5rem',
  },
  {
    id: 'dracula',
    label: 'Dracula',
    icon: 'i-tabler-ghost',
    description: 'Dark purple/pink palette',
    radius: '0.75rem',
  },
  {
    id: 'catppuccin',
    label: 'Catppuccin',
    icon: 'i-tabler-coffee',
    description: 'Warm pastel colors',
    radius: '1rem',
  },
  {
    id: 'carnival',
    label: 'Carnival',
    icon: 'i-tabler-carousel-horizontal',
    description: 'Warm, playful carnival colors',
    radius: '0.75rem',
  },
  {
    id: 'broadsheet',
    label: 'Broadsheet',
    icon: 'i-tabler-news',
    description: 'Newsprint grays with a single teal signal',
    radius: '0rem',
  },
]

const STORAGE_KEY = 'kickstart-theme'

export function useTheme() {
  const theme = useState<ThemeId>('theme', () => 'system')
  const colorMode = useColorMode()

  const currentTheme = computed(() =>
    themes.find(t => t.id === theme.value) || themes[0],
  )

  function setTheme(id: ThemeId) {
    theme.value = id
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, id)
      // 'system' theme removes data-theme to let Nuxt UI's app.config colors apply
      if (id === 'system') {
        delete document.documentElement.dataset.theme
      }
      else {
        document.documentElement.dataset.theme = id
      }
    }
  }

  function cycleTheme() {
    const currentIndex = themes.findIndex(t => t.id === theme.value)
    const nextIndex = (currentIndex + 1) % themes.length
    const nextTheme = themes[nextIndex]
    if (nextTheme) {
      setTheme(nextTheme.id)
    }
  }

  // Initialize from localStorage on client
  if (import.meta.client) {
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeId | null
    if (saved && themes.some(t => t.id === saved)) {
      theme.value = saved
      if (saved === 'system') {
        delete document.documentElement.dataset.theme
      }
      else {
        document.documentElement.dataset.theme = saved
      }
    }
    else {
      // Default to 'system' theme (no data-theme attribute)
      theme.value = 'system'
      delete document.documentElement.dataset.theme
    }
  }

  // Watch for theme changes and sync to DOM
  watch(theme, (newTheme) => {
    if (import.meta.client) {
      if (newTheme === 'system') {
        delete document.documentElement.dataset.theme
      }
      else {
        document.documentElement.dataset.theme = newTheme
      }
    }
  })

  return {
    theme,
    themes,
    currentTheme,
    setTheme,
    cycleTheme,
    colorMode,
  }
}
