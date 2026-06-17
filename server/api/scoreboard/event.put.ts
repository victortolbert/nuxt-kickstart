import {
  buildEventState,
  createChallenge,
  createJudge,
  createTeam,
  deleteChallenges,
  deleteJudges,
  deleteTeams,
  getChallenges,
  upsertEvent,
} from '#server/utils/scoreboard-db'
import { scoreboardEvents } from '#server/utils/scoreboard-events'

interface EventConfig {
  pin: string
  name: string
  description?: string
  teamIdentityMode?: 'emoji' | 'logo'
  scoreMin: number
  scoreMax: number
  teams: Array<{ name: string, emoji?: string, logo?: string }>
  challenges: Array<{ name: string, description?: string }>
  judges: Array<{ name: string }>
}

export default defineEventHandler(async (event) => {
  const body = await readBody<EventConfig>(event)

  await requireScoreboardAdmin(event)

  // Validate required fields
  if (!body.teams || body.teams.length === 0) {
    throw createError({
      statusCode: 400,
      message: 'At least one team is required',
    })
  }

  if (!body.challenges || body.challenges.length === 0) {
    throw createError({
      statusCode: 400,
      message: 'At least one challenge is required',
    })
  }

  if (!body.judges || body.judges.length === 0) {
    throw createError({
      statusCode: 400,
      message: 'At least one judge is required',
    })
  }

  // Validate scoring range
  if (
    !Number.isInteger(body.scoreMin)
    || !Number.isInteger(body.scoreMax)
    || body.scoreMin < 1
    || body.scoreMax < 1
    || body.scoreMin >= body.scoreMax
  ) {
    throw createError({
      statusCode: 400,
      message: 'Invalid scoring range: min and max must be positive integers with min < max',
    })
  }

  // Update event
  await upsertEvent({
    name: body.name,
    description: body.description || null,
    score_min: body.scoreMin,
    score_max: body.scoreMax,
    team_identity_mode: body.teamIdentityMode || 'emoji',
    status: 'active',
  })

  // Replace teams (delete + recreate)
  await deleteTeams()
  for (let i = 0; i < body.teams.length; i++) {
    const team = body.teams[i]
    if (!team)
      continue
    await createTeam({
      event_id: 1,
      name: team.name,
      emoji: team.emoji || null,
      logo: team.logo || null,
      sort_order: i + 1,
    })
  }

  // Replace challenges (delete + recreate, preserve status if possible)
  const existingChallenges = await getChallenges()
  await deleteChallenges()
  for (let i = 0; i < body.challenges.length; i++) {
    const challenge = body.challenges[i]
    if (!challenge)
      continue
    // Try to preserve status from existing challenge with same name
    const existing = existingChallenges.find(c => c.name === challenge.name)
    await createChallenge({
      event_id: 1,
      name: challenge.name,
      description: challenge.description || null,
      sort_order: i + 1,
      status: existing?.status || 'upcoming',
    })
  }

  // Replace judges (delete + recreate, preserve tokens if possible)
  await deleteJudges()
  for (const judge of body.judges) {
    await createJudge({
      event_id: 1,
      name: judge.name,
      token: null, // Tokens generated separately
    })
  }

  // Build refreshed state and emit event
  const state = await buildEventState()
  scoreboardEvents.emit('event:updated', state)

  return state
})
