export type ThemeId = 'system' | 'lyra' | 'nord' | 'dracula' | 'catppuccin' | 'carnival'

export interface ThemeConfig {
  id: ThemeId
  label: string
  icon: string
  description?: string
  radius?: string
}
