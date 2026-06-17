export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body || typeof body.pin !== 'string') {
    throw createError({
      statusCode: 400,
      message: 'PIN is required',
    })
  }

  if (isValidScoreboardPin(body.pin)) {
    return { valid: true }
  }

  throw createError({
    statusCode: 401,
    message: 'Invalid PIN',
  })
})
