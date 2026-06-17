import type { ScoreboardEventPayload, ScoreboardEventType } from '#server/utils/scoreboard-events'
import { createEventStream } from 'h3'
import { buildEventState } from '#server/utils/scoreboard-db'
import { scoreboardEvents } from '#server/utils/scoreboard-events'

export default defineEventHandler(async (event) => {
  const eventStream = createEventStream(event)
  const config = useRuntimeConfig()
  const ssePollInterval = config.public.scoreboard.ssePollInterval as number || 2000

  // Send current state as initial 'connected' event
  const initialState = await buildEventState()
  await eventStream.push({
    event: 'connected',
    data: JSON.stringify(initialState),
  })

  // Subscribe to event bus for real-time updates
  const handler = (payload: ScoreboardEventPayload, eventType: ScoreboardEventType) => {
    eventStream.push({
      event: eventType,
      data: JSON.stringify(payload),
    })
  }

  // Wrap handler to include event type
  const scoreHandler = (payload: ScoreboardEventPayload) => handler(payload, 'score:updated')
  const eventHandler = (payload: ScoreboardEventPayload) => handler(payload, 'event:updated')
  const challengeHandler = (payload: ScoreboardEventPayload) => handler(payload, 'challenge:updated')

  scoreboardEvents.on('score:updated', scoreHandler)
  scoreboardEvents.on('event:updated', eventHandler)
  scoreboardEvents.on('challenge:updated', challengeHandler)

  // Serverless fallback: internal polling for environments where event bus
  // may not persist across function invocations
  let lastStateJson = JSON.stringify(initialState)
  const pollInterval = setInterval(async () => {
    try {
      const currentState = await buildEventState()
      const currentJson = JSON.stringify(currentState)
      if (currentJson !== lastStateJson) {
        lastStateJson = currentJson
        await eventStream.push({
          event: 'score:updated',
          data: currentJson,
        })
      }
    }
    catch {
      // Silently ignore poll errors — stream will be cleaned up on close
    }
  }, ssePollInterval)

  // Clean up on client disconnect
  eventStream.onClosed(async () => {
    clearInterval(pollInterval)
    scoreboardEvents.off('score:updated', scoreHandler)
    scoreboardEvents.off('event:updated', eventHandler)
    scoreboardEvents.off('challenge:updated', challengeHandler)
    await eventStream.close()
  })

  // Also handle request abort
  event.node.req.on('close', () => {
    clearInterval(pollInterval)
    scoreboardEvents.off('score:updated', scoreHandler)
    scoreboardEvents.off('event:updated', eventHandler)
    scoreboardEvents.off('challenge:updated', challengeHandler)
  })

  setResponseHeader(event, 'Cache-Control', 'no-cache')
  setResponseHeader(event, 'Connection', 'keep-alive')

  return eventStream.send()
})
