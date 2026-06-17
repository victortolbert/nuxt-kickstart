import { findJudgeByToken } from '#server/utils/scoreboard-db'

export default defineEventHandler(async (event) => {
  const token = getRouterParam(event, 'token')

  if (!token) {
    throw createError({
      statusCode: 400,
      message: 'Token is required',
    })
  }

  const judge = await findJudgeByToken(token)

  if (!judge) {
    throw createError({
      statusCode: 404,
      message: 'Invalid or expired token',
    })
  }

  return {
    id: judge.id,
    name: judge.name,
    eventId: judge.event_id,
  }
})
