import type { H3Event } from 'h3'
import type { BouncerAbility, BouncerArgs } from 'nuxt-authorization/utils'
import { AuthorizationError, authorize } from 'nuxt-authorization/utils'

/**
 * Gate a route on an ability, answering 401 to nobody and 403 to somebody.
 *
 * `nuxt-authorization`'s own `authorize(event, ability)` collapses the two: an
 * ability without `allowGuest` short-circuits a null user to
 * `{ authorized: false }` carrying no status, and the error it builds defaults
 * to 403 — so a guest and a signed-in non-admin were refused with the same code,
 * the same message and the same line, on every route that used it. That
 * is the distinction the two codes exist to express: "you are not signed in"
 * against "you are, and still may not". ADR-0008 records the convention.
 *
 * The module's server helper also catches everything and rethrows only its own
 * error type, so a failed session lookup let the request through. This
 * resolves the user itself and lets anything else propagate.
 *
 * Abilities that `allowGuest` are handed the null user as before; the 401 is
 * for abilities that need someone, not a sign-in wall in front of every route.
 * `requireUserSession` keeps its own 401, which was already right.
 */
export async function authorizeUser<Ability extends BouncerAbility<any>>(
  event: H3Event,
  ability: Ability,
  ...args: BouncerArgs<Ability>
): Promise<void> {
  const user = await event.context.$authorization.resolveServerUser()

  if (user === null && !ability.allowGuest) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'Sign in to continue.',
    })
  }

  try {
    await authorize(ability, user, ...args)
  }
  catch (error) {
    if (error instanceof AuthorizationError) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusCode === 403 ? 'Forbidden' : undefined,
        message: error.message,
      })
    }
    throw error
  }
}
