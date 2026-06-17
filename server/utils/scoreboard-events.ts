import { EventEmitter } from 'node:events'

// Event types emitted by the scoreboard event bus
export type ScoreboardEventType = 'score:updated' | 'event:updated' | 'challenge:updated'

// Payload shape matches GET /api/scoreboard/event response
export interface ScoreboardEventPayload {
  event: {
    name: string
    description: string | null
    teamIdentityMode: 'emoji' | 'logo'
    scoreMin: number
    scoreMax: number
    status: 'draft' | 'active' | 'completed'
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

type ScoreboardEventHandler = (payload: ScoreboardEventPayload) => void

class ScoreboardEventBus {
  private emitter = new EventEmitter()

  emit(eventType: ScoreboardEventType, payload: ScoreboardEventPayload): void {
    this.emitter.emit(eventType, payload)
  }

  on(eventType: ScoreboardEventType, handler: ScoreboardEventHandler): void {
    this.emitter.on(eventType, handler)
  }

  off(eventType: ScoreboardEventType, handler: ScoreboardEventHandler): void {
    this.emitter.off(eventType, handler)
  }
}

// Module-level singleton — shared across all requests within the same process
export const scoreboardEvents = new ScoreboardEventBus()
