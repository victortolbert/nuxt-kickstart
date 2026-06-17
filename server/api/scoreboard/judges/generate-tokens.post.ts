import {
  getJudges,
  updateJudgeToken,
} from '#server/utils/scoreboard-db'

// Generate a URL-safe random token (12 characters)
function generateToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
  let token = ''
  const randomBytes = crypto.getRandomValues(new Uint8Array(12))
  for (let i = 0; i < 12; i++) {
    const byte = randomBytes[i]
    if (byte !== undefined) {
      token += chars[byte % chars.length]
    }
  }
  return token
}

export default defineEventHandler(async (event) => {
  await requireScoreboardAdmin(event)

  const judges = await getJudges()

  // Generate tokens for all judges
  const judgeLinks = []
  for (const judge of judges) {
    const token = generateToken()
    await updateJudgeToken(judge.id, token)
    judgeLinks.push({
      judgeName: judge.name,
      token,
      url: `/labs/scoreboard/judge/${token}`,
    })
  }

  return judgeLinks
})
