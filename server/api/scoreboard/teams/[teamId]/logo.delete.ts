import { rm } from 'node:fs/promises'
import { join } from 'node:path'
import { getTeam, updateTeamLogo } from '#server/utils/scoreboard-db'

export default defineEventHandler(async (event) => {
  const teamId = Number(getRouterParam(event, 'teamId'))
  if (!teamId || Number.isNaN(teamId)) {
    throw createError({ statusCode: 400, message: 'Invalid team ID' })
  }

  // Validate PIN from query param or header
  await requireScoreboardAdmin(event)

  // Check team exists
  const team = await getTeam(teamId)
  if (!team) {
    throw createError({ statusCode: 404, message: 'Team not found' })
  }

  // Delete the logo file if it exists
  if (team.logo) {
    const filePath = join(process.cwd(), 'public', team.logo)
    await rm(filePath, { force: true })
  }

  // Clear logo in database
  await updateTeamLogo(teamId, null)

  return { logo: null }
})
