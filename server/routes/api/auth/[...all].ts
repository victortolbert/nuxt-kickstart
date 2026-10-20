import { eq } from 'drizzle-orm'
import { auth, db } from '#server/auth'
import * as schema from '#server/db/schema'
import {
  authBaseURL,
  clarifyUnregisteredPhone,
  redirectRefusedNavigation,
} from '#server/utils/auth-refusal'

/** Does any account already hold this number? See `clarifyUnregisteredPhone`. */
async function isNumberRegistered(phoneNumber: string): Promise<boolean> {
  const existing = await db
    .select({ id: schema.user.id })
    .from(schema.user)
    .where(eq(schema.user.phoneNumber, phoneNumber))
    .get()

  return Boolean(existing)
}

export default defineEventHandler(async (event) => {
  try {
    // Convert H3 event to Web standard Request. This route owns the body, so
    // consuming it here is correct — unlike a session lookup (server/utils/session.ts).
    const request = toWebRequest(event)

    // `auth.handler` consumes the body, and explaining the phone-verify 500
    // needs the number that was submitted. Clone only on that one path.
    const isPhoneVerify = request.method === 'POST'
      && request.url.includes('/phone-number/verify')
    const submitted = isPhoneVerify ? request.clone() : null

    // Forward to Better Auth handler
    const response = await auth.handler(request)

    // A membership refusal the browser *navigated* into is answered as a page,
    // not as JSON. Every other response is returned untouched.
    const presented = await redirectRefusedNavigation(request, response, authBaseURL())

    // An unregistered number is refused, not a server fault.
    return submitted
      ? await clarifyUnregisteredPhone(submitted, presented, isNumberRegistered)
      : presented
  }
  catch (error) {
    console.error('Better Auth handler error:', error)
    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : 'Authentication error',
    })
  }
})
