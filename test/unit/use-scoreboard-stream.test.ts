import type { EffectScope } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { effectScope, nextTick, ref } from 'vue'

// --- Mock browser globals ---

const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)

let transportConfig = 'polling'
vi.stubGlobal('useRuntimeConfig', () => ({
  public: {
    scoreboard: {
      transport: transportConfig,
      pollInterval: 5000,
      ssePollInterval: 2000,
    },
  },
}))

vi.stubGlobal('useAsyncData', (_key: string, _fetcher: () => Promise<unknown>, opts?: { default?: () => unknown }) => ({
  data: ref(opts?.default ? opts.default() : null),
}))

// Note: import.meta.client is set to true via vitest.config.ts define

// Mock EventSource
class MockEventSource {
  static instances: MockEventSource[] = []
  url: string
  listeners = new Map<string, ((...args: any[]) => void)[]>()
  onerror: ((e: any) => void) | null = null
  close = vi.fn()

  constructor(url: string) {
    this.url = url
    MockEventSource.instances.push(this)
  }

  addEventListener(event: string, cb: (...args: any[]) => void) {
    if (!this.listeners.has(event))
      this.listeners.set(event, [])
    this.listeners.get(event)!.push(cb)
  }

  _emit(event: string, data: unknown) {
    for (const cb of this.listeners.get(event) || [])
      cb({ data: JSON.stringify(data) })
  }
}
vi.stubGlobal('EventSource', MockEventSource)

// Mock WebSocket
class MockWebSocket {
  static instances: MockWebSocket[] = []
  static readonly CLOSED = 3
  static readonly CLOSING = 2
  url: string
  onopen: ((e: any) => void) | null = null
  onmessage: ((e: any) => void) | null = null
  onclose: ((e: any) => void) | null = null
  onerror: ((e: any) => void) | null = null
  readyState = 1
  close = vi.fn()

  constructor(url: string) {
    this.url = url
    MockWebSocket.instances.push(this)
  }
}
vi.stubGlobal('WebSocket', MockWebSocket)

vi.stubGlobal('window', {
  location: { protocol: 'http:', host: 'localhost:3000' },
})

vi.stubGlobal('document', {
  hidden: false,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
})

// Mock VueUse — capture polling callback, no-op event listener
let _pollingCallback: (() => Promise<void>) | null = null
const pollingPauseFn = vi.fn()
const pollingResumeFn = vi.fn()

vi.mock('@vueuse/core', async (importOriginal) => {
  const mod = await importOriginal<typeof import('@vueuse/core')>()
  return {
    ...mod,
    useIntervalFn: vi.fn((cb: () => Promise<void>) => {
      _pollingCallback = cb
      return { pause: pollingPauseFn, resume: pollingResumeFn }
    }),
    useEventListener: vi.fn(),
  }
})

// --- Helpers ---

const mockState = {
  event: { name: 'Test Event', description: null, teamIdentityMode: 'emoji' as const, scoreMin: 1, scoreMax: 10, status: 'active' },
  teams: [{ id: 1, name: 'Alpha', emoji: '🔥', logo: null, totalScore: 50 }],
  challenges: [{ id: 1, name: 'Challenge 1', description: null, status: 'active' as const, sortOrder: 1 }],
  activeChallenge: { id: 1, name: 'Challenge 1', description: null, status: 'active' as const, sortOrder: 1 },
}

describe('useScoreboardStream', () => {
  let scope: EffectScope

  beforeEach(() => {
    vi.clearAllMocks()
    MockEventSource.instances = []
    MockWebSocket.instances = []
    _pollingCallback = null
    scope = effectScope()
  })

  afterEach(() => {
    scope.stop()
  })

  describe('polling transport', () => {
    it('uses fetch interval and sets transport to "polling"', async () => {
      transportConfig = 'polling'
      mockFetch.mockResolvedValue(mockState)

      const { useScoreboardStream } = await import('../../app/composables/use-scoreboard-stream')

      let result!: ReturnType<typeof useScoreboardStream>
      scope.run(() => {
        result = useScoreboardStream()
      })

      // Wait for async fetchState to resolve
      await vi.waitFor(() => {
        expect(result.data.value).not.toBeNull()
      })

      expect(result.transport.value).toBe('polling')
      expect(mockFetch).toHaveBeenCalledWith('/api/scoreboard/event')
      expect(pollingResumeFn).toHaveBeenCalled()
    })

    it('sets status to "polling" after successful fetch', async () => {
      transportConfig = 'polling'
      mockFetch.mockResolvedValue(mockState)

      const { useScoreboardStream } = await import('../../app/composables/use-scoreboard-stream')

      let result!: ReturnType<typeof useScoreboardStream>
      scope.run(() => {
        result = useScoreboardStream()
      })

      await vi.waitFor(() => {
        expect(result.status.value).toBe('polling')
      })
    })

    it('sets status to "offline" when fetch fails', async () => {
      transportConfig = 'polling'
      mockFetch.mockRejectedValue(new Error('Network error'))

      const { useScoreboardStream } = await import('../../app/composables/use-scoreboard-stream')

      let result!: ReturnType<typeof useScoreboardStream>
      scope.run(() => {
        result = useScoreboardStream()
      })

      await vi.waitFor(() => {
        expect(result.status.value).toBe('offline')
      })
    })
  })

  describe('sSE transport', () => {
    it('creates EventSource when config is "sse"', async () => {
      transportConfig = 'sse'

      const { useScoreboardStream } = await import('../../app/composables/use-scoreboard-stream')

      let result!: ReturnType<typeof useScoreboardStream>
      scope.run(() => {
        result = useScoreboardStream()
      })

      expect(MockEventSource.instances).toHaveLength(1)
      expect(MockEventSource.instances[0].url).toBe('/api/scoreboard/stream')
      expect(result.transport.value).toBe('sse')
    })

    it('updates data when SSE "connected" event fires', async () => {
      transportConfig = 'sse'

      const { useScoreboardStream } = await import('../../app/composables/use-scoreboard-stream')

      let result!: ReturnType<typeof useScoreboardStream>
      scope.run(() => {
        result = useScoreboardStream()
      })

      const es = MockEventSource.instances[0]
      es._emit('connected', mockState)

      expect(result.data.value).toEqual(mockState)
      expect(result.status.value).toBe('connected')
    })
  })

  describe('webSocket transport', () => {
    it('creates WebSocket when config is "websocket"', async () => {
      transportConfig = 'websocket'

      const { useScoreboardStream } = await import('../../app/composables/use-scoreboard-stream')

      let result!: ReturnType<typeof useScoreboardStream>
      scope.run(() => {
        result = useScoreboardStream()
      })

      expect(MockWebSocket.instances).toHaveLength(1)
      expect(MockWebSocket.instances[0].url).toBe('ws://localhost:3000/_ws/scoreboard')
      expect(result.transport.value).toBe('websocket')
    })

    it('updates data on WebSocket message', async () => {
      transportConfig = 'websocket'

      const { useScoreboardStream } = await import('../../app/composables/use-scoreboard-stream')

      let result!: ReturnType<typeof useScoreboardStream>
      scope.run(() => {
        result = useScoreboardStream()
      })

      const ws = MockWebSocket.instances[0]
      ws.onmessage!({ data: JSON.stringify({ type: 'connected', data: mockState }) })

      expect(result.data.value).toEqual(mockState)
      expect(result.status.value).toBe('connected')
    })
  })

  describe('auto-negotiation', () => {
    it('uses SSE when capabilities returns websocket: false, sse: true', async () => {
      transportConfig = 'auto'
      mockFetch.mockImplementation((url: string) => {
        if (url === '/api/scoreboard/capabilities')
          return Promise.resolve({ websocket: false, sse: true, polling: true })
        return Promise.resolve(mockState)
      })

      // Reset modules to clear cached capabilities
      vi.resetModules()
      const { useScoreboardStream } = await import('../../app/composables/use-scoreboard-stream')

      let result!: ReturnType<typeof useScoreboardStream>
      scope.run(() => {
        result = useScoreboardStream()
      })

      await vi.waitFor(() => {
        expect(MockEventSource.instances.length).toBeGreaterThan(0)
      })

      expect(result.transport.value).toBe('sse')
    })
  })

  describe('data updates', () => {
    it('forceRefresh triggers a new fetch', async () => {
      transportConfig = 'polling'
      mockFetch.mockResolvedValue(mockState)

      const { useScoreboardStream } = await import('../../app/composables/use-scoreboard-stream')

      let result!: ReturnType<typeof useScoreboardStream>
      scope.run(() => {
        result = useScoreboardStream()
      })

      await vi.waitFor(() => {
        expect(result.data.value).not.toBeNull()
      })

      const updatedState = { ...mockState, teams: [{ id: 1, name: 'Alpha', emoji: '🔥', logo: null, totalScore: 100 }] }
      mockFetch.mockResolvedValue(updatedState)

      await result.forceRefresh()
      await nextTick()

      expect(result.data.value!.teams[0].totalScore).toBe(100)
    })

    it('lastUpdated is set after data fetch', async () => {
      transportConfig = 'polling'
      mockFetch.mockResolvedValue(mockState)

      const { useScoreboardStream } = await import('../../app/composables/use-scoreboard-stream')

      let result!: ReturnType<typeof useScoreboardStream>
      scope.run(() => {
        result = useScoreboardStream()
      })

      await vi.waitFor(() => {
        expect(result.lastUpdated.value).toBeInstanceOf(Date)
      })
    })
  })
})
