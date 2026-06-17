import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { useTokenHistory } from '../../app/composables/use-token-history'

describe('useTokenHistory', () => {
  // Clear localStorage before and after each test
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('initializes with empty history', () => {
    const { history } = useTokenHistory()
    expect(history.value).toEqual([])
  })

  it('adds entry to history', () => {
    const { history, addEntry } = useTokenHistory()

    addEntry({
      source: 'upload',
      formats: ['css', 'scss'],
      tokenCount: 15,
      format: 'dtcg',
    })

    expect(history.value.length).toBe(1)
    expect(history.value[0]!.source).toBe('upload')
    expect(history.value[0]!.tokenCount).toBe(15)
    expect(history.value[0]!.id).toBeDefined()
    expect(history.value[0]!.timestamp).toBeDefined()
  })

  it('limits history to 20 entries', () => {
    const { history, addEntry } = useTokenHistory()

    // Add 25 entries
    for (let i = 0; i < 25; i++) {
      addEntry({
        source: 'upload',
        formats: ['css'],
        tokenCount: i,
        format: 'dtcg',
      })
    }

    expect(history.value.length).toBe(20)
    // Latest entry should be first
    expect(history.value[0]!.tokenCount).toBe(24)
  })

  it('clears history', () => {
    const { history, addEntry, clearHistory } = useTokenHistory()

    addEntry({
      source: 'upload',
      formats: ['css'],
      tokenCount: 15,
      format: 'dtcg',
    })

    expect(history.value.length).toBe(1)

    clearHistory()

    expect(history.value.length).toBe(0)
  })

  it('removes specific entry', () => {
    const { history, addEntry, removeEntry } = useTokenHistory()

    addEntry({
      source: 'upload',
      formats: ['css'],
      tokenCount: 15,
      format: 'dtcg',
    })

    const entryId = history.value[0]!.id

    removeEntry(entryId)

    expect(history.value.length).toBe(0)
  })

  it('gets entry by id', () => {
    const { history, addEntry, getEntry } = useTokenHistory()

    addEntry({
      source: 'url',
      formats: ['json'],
      tokenCount: 20,
      format: 'helium',
    })

    const entryId = history.value[0]!.id
    const entry = getEntry(entryId)

    expect(entry).toBeDefined()
    expect(entry?.source).toBe('url')
    expect(entry?.format).toBe('helium')
  })
})
