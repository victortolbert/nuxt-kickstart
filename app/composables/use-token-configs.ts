import type { FormatOptions } from '#shared/data/style-dictionary-formats'
import { useState } from '#app'

export interface SavedConfig {
  id: string
  name: string
  formats: string[]
  options: Record<string, FormatOptions>
  createdAt: number
}

const MAX_CONFIGS = 10
const STORAGE_KEY = 'kickstart-token-configs'

export function useTokenConfigs() {
  // Use Nuxt's useState for SSR-safe shared state
  const configs = useState<SavedConfig[]>('token-configs', () => [])
  const isInitialized = useState<boolean>('token-configs-initialized', () => false)

  // Load configs from localStorage (client-side only)
  function loadFromStorage() {
    if (import.meta.server)
      return

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        configs.value = JSON.parse(stored)
      }
    }
    catch (error) {
      console.error('Failed to load saved configs:', error)
      configs.value = []
    }
  }

  // Save configs to localStorage
  function saveToStorage() {
    if (import.meta.server)
      return

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(configs.value))
    }
    catch (error) {
      console.error('Failed to save configs:', error)
    }
  }

  // Initialize on client
  if (import.meta.client && !isInitialized.value) {
    loadFromStorage()
    isInitialized.value = true
  }

  // Add a new config
  function addConfig(name: string, formats: string[], options: Record<string, FormatOptions>) {
    const newConfig: SavedConfig = {
      id: crypto.randomUUID(),
      name,
      formats: [...formats],
      options: JSON.parse(JSON.stringify(options)), // Deep clone
      createdAt: Date.now(),
    }

    const updatedConfigs = [newConfig, ...configs.value]

    // Enforce max configs limit
    if (updatedConfigs.length > MAX_CONFIGS) {
      updatedConfigs.splice(MAX_CONFIGS)
    }

    configs.value = updatedConfigs
    saveToStorage()
  }

  // Delete a config by id
  function deleteConfig(id: string) {
    configs.value = configs.value.filter((c: SavedConfig) => c.id !== id)
    saveToStorage()
  }

  // Update an existing config (overwrite formats and options)
  function updateConfig(id: string, formats: string[], options: Record<string, FormatOptions>) {
    const index = configs.value.findIndex((c: SavedConfig) => c.id === id)
    if (index === -1)
      return

    const existingConfig = configs.value[index]
    if (!existingConfig)
      return

    configs.value[index] = {
      id: existingConfig.id,
      name: existingConfig.name,
      formats: [...formats],
      options: JSON.parse(JSON.stringify(options)),
      createdAt: Date.now(), // Update timestamp
    }
    saveToStorage()
  }

  // Get a config by id
  function getConfig(id: string): SavedConfig | undefined {
    return configs.value.find((c: SavedConfig) => c.id === id)
  }

  // Clear all configs
  function clearConfigs() {
    configs.value = []
    saveToStorage()
  }

  // Reset state for testing - clears both memory and storage
  function _resetState() {
    configs.value = []
    isInitialized.value = false
    if (import.meta.client) {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  return {
    configs,
    addConfig,
    updateConfig,
    deleteConfig,
    getConfig,
    clearConfigs,
    _resetState,
  }
}
