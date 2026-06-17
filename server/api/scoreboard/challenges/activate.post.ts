import {
  buildEventState,
  getActiveChallenge,
  getChallenges,
  updateChallengeStatus,
} from '#server/utils/scoreboard-db'
import { scoreboardEvents } from '#server/utils/scoreboard-events'

interface ActivateRequest {
  pin: string
  challengeId: number
  force?: boolean
}

export default defineEventHandler(async (event) => {
  const body = await readBody<ActivateRequest>(event)

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

  // Check if re-activating a locked challenge requires force flag
  if (targetChallenge.status === 'locked' && !body.force) {
    throw createError({
      statusCode: 400,
      message: 'Re-activating a locked challenge requires force: true',
    })
  }

  // Auto-lock any currently active challenge
  const currentActive = await getActiveChallenge()
  if (currentActive && currentActive.id !== body.challengeId) {
    await updateChallengeStatus(currentActive.id, 'locked')
  }

  // Activate the target challenge
  await updateChallengeStatus(body.challengeId, 'active')

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
