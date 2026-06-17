import { auth } from '#server/auth'

export default defineEventHandler(async (event) => {
  try {
    // Convert H3 event to Web standard Request
    const request = toWebRequest(event)

    // Forward to Better Auth handler
    const response = await auth.handler(request)

    // Return the response
    return response
  }
  catch (error) {
    console.error('Better Auth handler error:', error)
    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : 'Authentication error',
    })
  }
})
