import { useEventListener, useIntervalFn } from '@vueuse/core'
import { onScopeDispose, ref } from 'vue'

export interface EventState {
  event: {
    name: string
    description: string | null
    teamIdentityMode: 'emoji' | 'logo'
    scoreMin: number
    scoreMax: number
    status: string
  }
  teams: Array<{
    id: number
    name: string
    emoji: string | null
    logo: string | null
    totalScore: number
  }>
  challenges: Array<{
    id: number
    name: string
    description: string | null
    status: 'upcoming' | 'active' | 'locked'
    sortOrder: number | null
  }>
  activeChallenge: {
    id: number
    name: string
    description: string | null
    status: 'upcoming' | 'active' | 'locked'
    sortOrder: number | null
  } | null
  judges?: Array<{
    id: number
    name: string
  }>
}

export type TransportStatus = 'connected' | 'connecting' | 'reconnecting' | 'polling' | 'offline'
export type TransportType = 'websocket' | 'sse' | 'polling'

interface Capabilities {
  websocket: boolean
  sse: boolean
  polling: boolean
}

// Module-level cache — don't re-fetch on every component mount
let cachedCapabilities: Capabilities | null = null

export function useScoreboardStream() {
  const config = useRuntimeConfig()
  const pollInterval = config.public.scoreboard.pollInterval as number || 5000

  // Use useAsyncData for SSR-compatible initial fetch
  const { data: initialData } = useAsyncData(
    'scoreboard-initial',
    () => $fetch<EventState>('/api/scoreboard/event'),
    {
      default: () => null,
      server: true,
    },
  )

  const data = ref<EventState | null>(initialData.value)
  const status = ref<TransportStatus>(initialData.value ? 'polling' : 'connecting')
  const transport = ref<TransportType>('polling')
  const lastUpdated = ref<Date | null>(initialData.value ? new Date() : null)

  let eventSource: EventSource | null = null
  let sseErrorTimer: ReturnType<typeof setTimeout> | null = null

  // --- Polling mode ---
  async function fetchState() {
    try {
      const result = await $fetch<EventState>('/api/scoreboard/event')
      data.value = result
      lastUpdated.value = new Date()
      if (transport.value === 'polling')
        status.value = 'polling'
    }
    catch {
      status.value = 'offline'
    }
  }

  const { pause: pausePolling, resume: resumePolling } = useIntervalFn(fetchState, pollInterval, { immediate: false })

  function startPolling() {
    transport.value = 'polling'
    fetchState()
    resumePolling()
  }

  function stopPolling() {
    pausePolling()
  }

  // --- SSE mode ---
  function startSSE() {
    if (!import.meta.client)
      return
    transport.value = 'sse'
    status.value = 'connecting'

    eventSource = new EventSource('/api/scoreboard/stream')

    eventSource.addEventListener('connected', (e: MessageEvent) => {
      data.value = JSON.parse(e.data) as EventState
      lastUpdated.value = new Date()
      status.value = 'connected'
      transport.value = 'sse'
      // Clear any error timer on successful connection
      if (sseErrorTimer) {
        clearTimeout(sseErrorTimer)
        sseErrorTimer = null
      }
    })

    const handleUpdate = (e: MessageEvent) => {
      data.value = JSON.parse(e.data) as EventState
      lastUpdated.value = new Date()
    }

    eventSource.addEventListener('score:updated', handleUpdate)
    eventSource.addEventListener('event:updated', handleUpdate)
    eventSource.addEventListener('challenge:updated', handleUpdate)

    eventSource.onerror = () => {
      status.value = 'reconnecting'
      // If SSE stays in error state for >30s, fall back to polling
      if (!sseErrorTimer) {
        sseErrorTimer = setTimeout(() => {
          stopSSE()
          startPolling()
        }, 30000)
      }
    }
  }

  function stopSSE() {
    if (eventSource) {
      eventSource.close()
      eventSource = null
    }
    if (sseErrorTimer) {
      clearTimeout(sseErrorTimer)
      sseErrorTimer = null
    }
  }

  // --- WebSocket mode ---
  let ws: WebSocket | null = null
  let wsReconnectAttempts = 0
  let wsReconnectTimer: ReturnType<typeof setTimeout> | null = null

  function getWsUrl() {
    const loc = window.location
    const protocol = loc.protocol === 'https:' ? 'wss:' : 'ws:'
    return `${protocol}//${loc.host}/_ws/scoreboard`
  }

  function startWebSocket() {
    if (!import.meta.client)
      return
    transport.value = 'websocket'
    status.value = 'connecting'

    ws = new WebSocket(getWsUrl())

    ws.onopen = () => {
      status.value = 'connecting'
    }

    ws.onmessage = (e: MessageEvent) => {
      try {
        const msg = JSON.parse(e.data) as { type: string, data: EventState }
        data.value = msg.data
        lastUpdated.value = new Date()
        if (msg.type === 'connected') {
          status.value = 'connected'
          transport.value = 'websocket'
          wsReconnectAttempts = 0
        }
      }
      catch {
        // Ignore malformed messages
      }
    }

    ws.onclose = () => {
      status.value = 'reconnecting'
      attemptWsReconnect()
    }

    ws.onerror = () => {
      // onclose will fire after onerror, which handles reconnect
    }
  }

  function attemptWsReconnect() {
    wsReconnectAttempts++
    if (wsReconnectAttempts > 3) {
      // Fall back: try SSE, then polling
      stopWebSocket()
      startSSE()
      return
    }
    // Exponential backoff: 1s, 2s, 4s, 8s... max 30s
    const delay = Math.min(1000 * 2 ** (wsReconnectAttempts - 1), 30000)
    wsReconnectTimer = setTimeout(() => {
      if (ws?.readyState === WebSocket.CLOSED || ws?.readyState === WebSocket.CLOSING || !ws) {
        startWebSocket()
      }
    }, delay)
  }

  function stopWebSocket() {
    if (wsReconnectTimer) {
      clearTimeout(wsReconnectTimer)
      wsReconnectTimer = null
    }
    if (ws) {
      ws.onclose = null // Prevent reconnect on intentional close
      ws.close()
      ws = null
    }
  }

  // --- Auto-negotiation ---
  async function autoNegotiate() {
    try {
      if (!cachedCapabilities) {
        cachedCapabilities = await $fetch<Capabilities>('/api/scoreboard/capabilities')
      }
      if (cachedCapabilities.websocket) {
        startWebSocket()
      }
      else if (cachedCapabilities.sse) {
        startSSE()
      }
      else {
        startPolling()
      }
    }
    catch {
      // If capabilities fetch fails, fall back to polling
      startPolling()
    }
  }

  // --- Transport selection ---
  const transportConfig = config.public.scoreboard.transport as string || 'auto'

  if (import.meta.client) {
    if (transportConfig === 'websocket') {
      startWebSocket()
    }
    else if (transportConfig === 'sse') {
      startSSE()
    }
    else if (transportConfig === 'polling') {
      startPolling()
    }
    else {
      // 'auto': negotiate best transport from server capabilities
      autoNegotiate()
    }
  }
  // Note: SSR initial fetch already handled by useAsyncData above

  // Pause polling when tab is hidden, resume + immediate fetch when visible
  if (import.meta.client) {
    useEventListener(document, 'visibilitychange', () => {
      if (document.hidden) {
        if (transport.value === 'polling')
          stopPolling()
      }
      else {
        if (transport.value === 'polling') {
          startPolling()
        }
      }
    })
  }

  // Expose a manual refresh function
  async function forceRefresh() {
    await fetchState()
  }

  // Cleanup on scope dispose
  onScopeDispose(() => {
    stopPolling()
    stopSSE()
    stopWebSocket()
  })

  return {
    data,
    status,
    transport,
    lastUpdated,
    forceRefresh,
  }
}
