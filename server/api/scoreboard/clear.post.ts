import {
  deleteChallenges,
  deleteJudges,
  deleteTeams,
} from '#server/utils/scoreboard-db'

export default defineEventHandler(async (event) => {
  await requireScoreboardAdmin(event)

  // Clear all data (scores will cascade delete via foreign keys)
  await deleteTeams()
  await deleteChallenges()
  await deleteJudges()

  return { success: true, message: 'All demo data cleared successfully' }
})
