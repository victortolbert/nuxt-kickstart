import type { ScoreboardEventPayload } from '#server/utils/scoreboard-events'
import { buildEventState } from '#server/utils/scoreboard-db'
import { scoreboardEvents } from '#server/utils/scoreboard-events'

const TOPIC = 'scoreboard:updates'

export default defineWebSocketHandler({
  async open(peer) {
    peer.subscribe(TOPIC)

    // Send current state as initial message
    try {
      const state = await buildEventState()
      peer.send(JSON.stringify({ type: 'connected', data: state }))
    }
    catch (err) {
      console.error('[ws:scoreboard] Failed to send initial state:', err)
    }

    // Subscribe to event bus and publish to topic
    const handler = (eventType: string) => (payload: ScoreboardEventPayload) => {
      peer.publish(TOPIC, JSON.stringify({ type: eventType, data: payload }))
      // Also send to the originating peer (publish doesn't send to self)
      peer.send(JSON.stringify({ type: eventType, data: payload }))
    }

    const scoreHandler = handler('score:updated')
    const eventHandler = handler('event:updated')
    const challengeHandler = handler('challenge:updated')

    scoreboardEvents.on('score:updated', scoreHandler)
    scoreboardEvents.on('event:updated', eventHandler)
    scoreboardEvents.on('challenge:updated', challengeHandler)

    // Store handlers on peer context for cleanup
    peer.context.scoreHandler = scoreHandler
    peer.context.eventHandler = eventHandler
    peer.context.challengeHandler = challengeHandler
  },

  close(peer) {
    peer.unsubscribe(TOPIC)

    // Clean up event bus listeners
    const { scoreHandler, eventHandler, challengeHandler } = peer.context as Record<string, (payload: ScoreboardEventPayload) => void>
    if (scoreHandler)
      scoreboardEvents.off('score:updated', scoreHandler)
    if (eventHandler)
      scoreboardEvents.off('event:updated', eventHandler)
    if (challengeHandler)
      scoreboardEvents.off('challenge:updated', challengeHandler)
  },

  error(peer, error) {
    console.error('[ws:scoreboard] WebSocket error:', error)

    // Clean up on error
    peer.unsubscribe(TOPIC)
    const { scoreHandler, eventHandler, challengeHandler } = peer.context as Record<string, (payload: ScoreboardEventPayload) => void>
    if (scoreHandler)
      scoreboardEvents.off('score:updated', scoreHandler)
    if (eventHandler)
      scoreboardEvents.off('event:updated', eventHandler)
    if (challengeHandler)
      scoreboardEvents.off('challenge:updated', challengeHandler)
  },
})
