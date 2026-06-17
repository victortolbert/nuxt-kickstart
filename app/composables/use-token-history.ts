import { onMounted, readonly, ref } from 'vue'

export interface HistoryEntry {
  id: string
  timestamp: number
  source: 'upload' | 'url' | 'paste' | 'example'
  formats: string[]
  tokenCount: number
  format: 'dtcg' | 'legacy' | 'helium' | 'unknown'
}

const STORAGE_KEY = 'kickstart-token-history'
const MAX_ENTRIES = 20

export function useTokenHistory() {
  const history = ref<HistoryEntry[]>([])

  // Load history from localStorage on mount
  function loadHistory() {
    if (import.meta.client) {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        try {
          history.value = JSON.parse(stored)
        }
        catch (error) {
          console.error('Failed to load token history:', error)
          history.value = []
        }
      }
    }
  }

  // Save history to localStorage
  function saveHistory() {
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history.value))
    }
  }

  // Add a new entry to history
  function addEntry(entry: Omit<HistoryEntry, 'id' | 'timestamp'>) {
    const newEntry: HistoryEntry = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    }

    history.value.unshift(newEntry)

    // Keep only the last MAX_ENTRIES
    if (history.value.length > MAX_ENTRIES) {
      history.value = history.value.slice(0, MAX_ENTRIES)
    }

    saveHistory()
  }

  // Clear all history
  function clearHistory() {
    history.value = []
    saveHistory()
  }

  // Remove a specific entry
  function removeEntry(id: string) {
    history.value = history.value.filter(entry => entry.id !== id)
    saveHistory()
  }

  // Get an entry by id
  function getEntry(id: string): HistoryEntry | undefined {
    return history.value.find(entry => entry.id === id)
  }

  // Initialize on mount (client-side only)
  if (import.meta.client) {
    onMounted(() => {
      loadHistory()
    })
  }

  return {
    history: readonly(history),
    addEntry,
    clearHistory,
    removeEntry,
    getEntry,
  }
}
