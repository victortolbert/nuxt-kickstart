export default defineEventHandler((event) => {
  const config = useRuntimeConfig()

  // WebSocket is available only when nitro.experimental.websocket is enabled
  // and the server-side flag is set. US-006 will enable this.
  const wsEnabled = !!(config as Record<string, unknown>).scoreboardWebsocketEnabled

  setResponseHeader(event, 'Cache-Control', 'max-age=60')

  return {
    websocket: wsEnabled,
    sse: true,
    polling: true,
  }
})
