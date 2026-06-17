import type { H3Event } from 'h3'

/**
 * The Scoreboard Admin guard.
 *
 * Demo-grade PIN auth for the scoreboard example's admin endpoints. The PIN
 * may arrive as an `x-admin-pin` header, a `?pin=` query param, or a `pin`
 * body field — callers don't need to care which.
 *
 * To upgrade the example to real auth, replace `requireScoreboardAdmin` with
 * a session/role check — every admin route goes through this one seam.
 */

export function getScoreboardAdminPin(): string {
  // Default '1234' is for development; set SCOREBOARD_ADMIN_PIN in production
  // eslint-disable-next-line node/no-process-env
  return process.env.SCOREBOARD_ADMIN_PIN || '1234'
}

export function isValidScoreboardPin(pin: unknown): boolean {
  return typeof pin === 'string' && pin.length > 0 && pin === getScoreboardAdminPin()
}

/** Throws 401 unless a valid admin PIN accompanies the request. */
export async function requireScoreboardAdmin(event: H3Event): Promise<void> {
  let pin: unknown = getHeader(event, 'x-admin-pin') || (getQuery(event).pin as string | undefined)

  if (!pin) {
    try {
      const body = await readBody(event)
      pin = body?.pin
    }
    catch {
      // No readable body (e.g. DELETE without payload) — fall through to 401
    }
  }

  if (!isValidScoreboardPin(pin)) {
    throw createError({ statusCode: 401, message: 'Invalid PIN' })
  }
}
