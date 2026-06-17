import { getTeam, updateTeamLogo } from '#server/utils/scoreboard-db'
import { handleFileUpload } from '#server/utils/upload'
import { toKebabCase } from '#shared/utils/case'

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

  const filename = toKebabCase(team.name)

  const result = await handleFileUpload(event, {
    allowedTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/gif'],
    maxSizeBytes: 2097152, // 2MB
    pathPrefix: 'img/teams',
    filename,
    imageOptions: { width: 256, height: 256, format: 'webp' },
  })

  await updateTeamLogo(teamId, result.url)

  return { logo: result.url }
})
