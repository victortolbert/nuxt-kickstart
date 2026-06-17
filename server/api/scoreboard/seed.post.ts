import {
  deleteChallenges,
  deleteJudges,
  deleteTeams,
  seedScoreboardData,
} from '#server/utils/scoreboard-db'

export default defineEventHandler(async (event) => {
  await requireScoreboardAdmin(event)

  // Clear existing data
  await deleteTeams()
  await deleteChallenges()
  await deleteJudges()

  // Seed with sample data (force=true to override existing check)
  await seedScoreboardData(true)

  return { success: true, message: 'Database reset to sample data' }
})
