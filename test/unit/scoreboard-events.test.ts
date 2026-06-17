import type { ScoreboardEventPayload } from '../../server/utils/scoreboard-events'
import { describe, expect, it, vi } from 'vitest'
import { scoreboardEvents } from '../../server/utils/scoreboard-events'

function makePayload(): ScoreboardEventPayload {
  return {
    event: {
      name: 'Test Event',
      description: null,
      teamIdentityMode: 'emoji',
      scoreMin: 1,
      scoreMax: 200,
      status: 'active',
    },
    teams: [],
    challenges: [],
    activeChallenge: null,
  }
}

describe('scoreboardEvents bus', () => {
  it('delivers an emitted payload to a registered handler', () => {
    const handler = vi.fn()
    const payload = makePayload()

    scoreboardEvents.on('score:updated', handler)
    scoreboardEvents.emit('score:updated', payload)

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler).toHaveBeenCalledWith(payload)

    scoreboardEvents.off('score:updated', handler)
  })

  it('only invokes handlers for the matching event type', () => {
    const scoreHandler = vi.fn()
    const eventHandler = vi.fn()

    scoreboardEvents.on('score:updated', scoreHandler)
    scoreboardEvents.on('event:updated', eventHandler)
    scoreboardEvents.emit('event:updated', makePayload())

    expect(eventHandler).toHaveBeenCalledTimes(1)
    expect(scoreHandler).not.toHaveBeenCalled()

    scoreboardEvents.off('score:updated', scoreHandler)
    scoreboardEvents.off('event:updated', eventHandler)
  })

  it('stops delivering after a handler is removed', () => {
    const handler = vi.fn()

    scoreboardEvents.on('challenge:updated', handler)
    scoreboardEvents.off('challenge:updated', handler)
    scoreboardEvents.emit('challenge:updated', makePayload())

    expect(handler).not.toHaveBeenCalled()
  })

  it('supports multiple handlers on the same event type', () => {
    const a = vi.fn()
    const b = vi.fn()

    scoreboardEvents.on('score:updated', a)
    scoreboardEvents.on('score:updated', b)
    scoreboardEvents.emit('score:updated', makePayload())

    expect(a).toHaveBeenCalledTimes(1)
    expect(b).toHaveBeenCalledTimes(1)

    scoreboardEvents.off('score:updated', a)
    scoreboardEvents.off('score:updated', b)
  })
})
