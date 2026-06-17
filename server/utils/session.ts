import type { H3Event } from 'h3'
import { auth } from '#server/auth'

/**
 * Build a Headers object from the event WITHOUT consuming the request body.
 *
 * Better Auth's getSession only needs the request headers (the session cookie).
 * Using `toWebRequest(event)` here wraps the body stream, which then makes a
 * later `readBody()`/`readValidatedBody()` in the same handler hang forever —
 * it waits for a body the wrapped Request already locked. Passing headers-only
 * avoids touching the body entirely, so POST handlers can read it normally.
 */
function requestHeaders(event: H3Event): Headers {
  const headers = new Headers()
  for (const [key, value] of Object.entries(getRequestHeaders(event))) {
    if (typeof value === 'string')
      headers.set(key, value)
  }
  return headers
}

interface SessionUser {
  id: string
  name: string | null
  email: string | null
  image: string | null
  role: string
  [key: string]: unknown
}

interface UserSession {
  user: SessionUser
  session: { id: string, expiresAt: Date, [key: string]: unknown }
}

/**
 * Get the current user session from Better Auth.
 * Returns { user, session } or { user: null, session: null } if not authenticated.
 * Drop-in replacement for nuxt-auth-utils getUserSession().
 */
export async function getUserSession(event: H3Event): Promise<{ user: SessionUser | null }> {
  const result = await auth.api.getSession({
    headers: requestHeaders(event),
  })

  if (!result?.user) {
    return { user: null }
  }

  return { user: result.user as SessionUser }
}

/**
 * Require an authenticated session. Throws 401 if not authenticated.
 * Drop-in replacement for nuxt-auth-utils requireUserSession().
 */
export async function requireUserSession(event: H3Event): Promise<UserSession> {
  const result = await auth.api.getSession({
    headers: requestHeaders(event),
  })

  if (!result?.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  return result as UserSession
}
