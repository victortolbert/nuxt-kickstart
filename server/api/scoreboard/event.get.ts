import type {
  DbChallenge,
  DbJudge,
  DbTeam,
} from '#server/utils/scoreboard-db'
import {
  getActiveChallenge,
  getChallenges,
  getEvent,
  getJudges,
  getScores,
  getTeams,
  seedScoreboardData,
} from '#server/utils/scoreboard-db'

export default defineEventHandler(async () => {
  // Check if event exists, seed if empty
  let event = await getEvent()
  if (!event) {
    await seedScoreboardData()
    event = await getEvent()
  }

  if (!event) {
    throw createError({
      statusCode: 500,
      message: 'Failed to initialize event',
    })
  }

  // Fetch all related data
  const teams = await getTeams()
  const challenges = await getChallenges()
  const judges = await getJudges()
  const scores = await getScores()
  const activeChallenge = await getActiveChallenge()

  // Calculate total scores per team
  const teamScores = new Map<number, number>()
  for (const score of scores) {
    const current = teamScores.get(score.team_id) || 0
    teamScores.set(score.team_id, current + score.score)
  }

  // Build response with camelCase field names
  return {
    event: {
      name: event.name,
      description: event.description,
      teamIdentityMode: event.team_identity_mode || 'emoji',
      scoreMin: event.score_min,
      scoreMax: event.score_max,
      status: event.status,
    },
    teams: teams.map((team: DbTeam) => ({
      id: team.id,
      name: team.name,
      emoji: team.emoji,
      logo: team.logo,
      totalScore: teamScores.get(team.id) || 0,
    })),
    challenges: challenges.map((challenge: DbChallenge) => ({
      id: challenge.id,
      name: challenge.name,
      description: challenge.description,
      status: challenge.status,
      sortOrder: challenge.sort_order,
    })),
    activeChallenge: activeChallenge
      ? {
          id: activeChallenge.id,
          name: activeChallenge.name,
          description: activeChallenge.description,
          status: activeChallenge.status,
          sortOrder: activeChallenge.sort_order,
        }
      : null,
    judges: judges.map((judge: DbJudge) => ({
      id: judge.id,
      name: judge.name,
      // Note: judge tokens are intentionally excluded from response
    })),
  }
})
