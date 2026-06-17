import {
  buildEventState,
  findJudgeByToken,
  getActiveChallenge,
  getEvent,
  getScores,
  getTeams,
  upsertScore,
} from '#server/utils/scoreboard-db'
import { scoreboardEvents } from '#server/utils/scoreboard-events'

interface ScoreSubmission {
  token: string
  teamId: number
  challengeId: number
  score: number
  comment?: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<ScoreSubmission>(event)

  // Validate token and get judge
  if (!body.token) {
    throw createError({
      statusCode: 401,
      message: 'Judge token is required',
    })
  }

  const judge = await findJudgeByToken(body.token)
  if (!judge) {
    throw createError({
      statusCode: 401,
      message: 'Invalid judge token',
    })
  }

  // Validate challenge is active
  const activeChallenge = await getActiveChallenge()
  if (!activeChallenge) {
    throw createError({
      statusCode: 400,
      message: 'No active challenge at this time',
    })
  }

  if (body.challengeId !== activeChallenge.id) {
    throw createError({
      statusCode: 400,
      message: 'Challenge is not currently active',
    })
  }

  // Validate score is within range
  const eventConfig = await getEvent()
  if (!eventConfig) {
    throw createError({
      statusCode: 500,
      message: 'Event not configured',
    })
  }

  if (
    !Number.isInteger(body.score)
    || body.score < eventConfig.score_min
    || body.score > eventConfig.score_max
  ) {
    throw createError({
      statusCode: 400,
      message: `Score must be between ${eventConfig.score_min} and ${eventConfig.score_max}`,
    })
  }

  // Upsert score (insert or update if already exists)
  await upsertScore({
    judge_id: judge.id,
    team_id: body.teamId,
    challenge_id: body.challengeId,
    score: body.score,
    comment: body.comment || null,
  })

  // Emit score:updated event with full refreshed state
  const state = await buildEventState()
  scoreboardEvents.emit('score:updated', state)

  // Calculate and return updated team totals
  const teams = await getTeams()
  const scores = await getScores()

  const teamScores = new Map<number, number>()
  for (const score of scores) {
    const current = teamScores.get(score.team_id) || 0
    teamScores.set(score.team_id, current + score.score)
  }

  return {
    success: true,
    teamTotals: teams.map(team => ({
      id: team.id,
      name: team.name,
      totalScore: teamScores.get(team.id) || 0,
    })),
  }
})
