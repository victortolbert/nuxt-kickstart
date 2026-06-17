import {
  buildEventState,
  getChallenges,
  updateChallengeStatus,
} from '#server/utils/scoreboard-db'
import { scoreboardEvents } from '#server/utils/scoreboard-events'

interface LockRequest {
  pin: string
  challengeId: number
}

export default defineEventHandler(async (event) => {
  const body = await readBody<LockRequest>(event)

  await requireScoreboardAdmin(event)

  if (!body.challengeId) {
    throw createError({
      statusCode: 400,
      message: 'challengeId is required',
    })
  }

  const challenges = await getChallenges()
  const targetChallenge = challenges.find(c => c.id === body.challengeId)

  if (!targetChallenge) {
    throw createError({
      statusCode: 404,
      message: 'Challenge not found',
    })
  }

  // Lock the challenge
  await updateChallengeStatus(body.challengeId, 'locked')

  // Emit challenge:updated event with full refreshed state
  const state = await buildEventState()
  scoreboardEvents.emit('challenge:updated', state)

  // Return updated challenges array
  const updatedChallenges = await getChallenges()
  return {
    challenges: updatedChallenges.map(c => ({
      id: c.id,
      name: c.name,
      description: c.description,
      status: c.status,
      sortOrder: c.sort_order,
    })),
  }
})
