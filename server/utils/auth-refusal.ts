/**
 * How a refusal is *presented*, as distinct from who is refused.
 *
 * `./membership` decides admission and says so by throwing an `APIError`
 * carrying a stable code. That throw is correct on every path and lands
 * differently on each, because Better Auth answers each path in its own shape:
 * a browser mid-redirect gets a 302, a fetch gets JSON. Left alone, the decision
 * is right and the answer reads like a crash, so the translation lives here, in
 * one place, rather than as a patch at each site.
 *
 * Nothing here decides anything. It maps an already-made refusal onto the shape
 * the caller can act on, which is why it is a separate file from the rules.
 */

import {
  MEMBERSHIP_REFUSED_CODE,
  MEMBERSHIP_REFUSED_MESSAGE,
  MEMBERSHIP_REVOKED_CODE,
  MEMBERSHIP_REVOKED_MESSAGE,
  MEMBERSHIP_UNVERIFIED_CODE,
  MEMBERSHIP_UNVERIFIED_MESSAGE,
} from './membership'

/** Where a refused browser is sent. The app's own page, not Better Auth's. */
export const LOGIN_PATH = '/login'

/**
 * Where this deployment answers.
 *
 * The same expression `server/auth.ts` passes to Better Auth as `baseURL`, read
 * from one place because the refusal redirects have to be built against the
 * origin they are replacing. Two copies that could drift is exactly how a
 * redirect ends up pointing at the wrong host in one environment only.
 */
export function authBaseURL(): string {
  // eslint-disable-next-line node/no-process-env
  return process.env.BETTER_AUTH_URL || 'http://localhost:3000'
}

/**
 * Better Auth's own transformation of an OAuth failure into a URL parameter:
 * `result.error.split(" ").join("_")` in `api/routes/callback.mjs`.
 *
 * Reproduced rather than hardcoded so the lookup below is derived from the same
 * message constant the throw uses. Rewording the refusal moves both together; a
 * literal string here would silently stop matching.
 */
export function oauthErrorParam(message: string): string {
  return message.split(' ').join('_')
}

/**
 * The refusal codes this app recognizes, and nothing else.
 *
 * A membership refusal is a decision; every other 403 on the auth surface is
 * not, and must keep whatever answer Better Auth already gives it. Presenting
 * an unrecognized failure as "you were not invited" would be a lie in the one
 * direction that costs a real user their sign-in.
 */
export const MEMBERSHIP_REFUSAL_CODES: readonly string[] = [
  MEMBERSHIP_REFUSED_CODE,
  MEMBERSHIP_UNVERIFIED_CODE,
  MEMBERSHIP_REVOKED_CODE,
]

/**
 * The underscored message Better Auth puts in the OAuth `error` parameter,
 * mapped back to the code that was thrown.
 *
 * This indirection exists because `handleOAuthUserInfo`
 * (`oauth2/link-account.mjs`) catches the `APIError` and returns `{ error:
 * e.message }`, dropping `e.body.code` — so the callback's own
 * `e.body?.code` branch cannot fire and the English sentence is all that
 * survives the round trip. Recovering the code here is what lets the URL carry
 * something stable.
 */
const CODE_BY_OAUTH_ERROR: Readonly<Record<string, string>> = {
  [oauthErrorParam(MEMBERSHIP_REFUSED_MESSAGE)]: MEMBERSHIP_REFUSED_CODE,
  [oauthErrorParam(MEMBERSHIP_UNVERIFIED_MESSAGE)]: MEMBERSHIP_UNVERIFIED_CODE,
  [oauthErrorParam(MEMBERSHIP_REVOKED_MESSAGE)]: MEMBERSHIP_REVOKED_CODE,
}

/** Is this code one of ours — a decision rather than a fault? */
export function isMembershipRefusalCode(code: unknown): code is string {
  return typeof code === 'string' && MEMBERSHIP_REFUSAL_CODES.includes(code)
}

/**
 * The stable code behind an OAuth `error` parameter, or `undefined` when the
 * parameter is some other OAuth failure.
 *
 * `undefined` is the important half: `state_mismatch` and
 * `unable_to_create_user` reach the same redirect, and they are not membership
 * decisions.
 */
export function refusalCodeFromOAuthError(error: string | null | undefined): string | undefined {
  if (typeof error !== 'string' || error === '')
    return undefined

  // Already a code (a future Better Auth that stops dropping `e.body.code`
  // would send one) — pass it through rather than failing to recognize it.
  if (isMembershipRefusalCode(error))
    return error

  return CODE_BY_OAUTH_ERROR[error]
}

/**
 * Where a refused browser should land, carrying the code rather than the
 * sentence.
 *
 * Absolute, because it replaces a `Location` header Better Auth built from
 * `baseURL`, and a relative one would resolve against `/api/auth/...`.
 */
export function loginRefusalURL(baseURL: string, code: string): string {
  const base = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL

  return `${base}${LOGIN_PATH}?error=${encodeURIComponent(code)}`
}

/**
 * Turn a refusal that a *browser navigated into* from a JSON body into a
 * redirect it can land on.
 *
 * `/api/auth/magic-link/verify` is a GET reached by clicking a link, so
 * whatever it answers is the page an uninvited person sees. Better Auth's
 * generic handler renders the 403 body, and `{"message":...,"code":...}` reads
 * as a crash rather than a decision.
 *
 * It lives at the Nitro handler rather than in an auth `hooks.after` because
 * `dispatchAuthEndpoint` never updates `result.status` from an after-hook — a
 * rewrite there yields a 403 carrying a `Location`, which no browser follows.
 * Here the whole `Response` is ours to replace.
 *
 * Three conditions, each load-bearing:
 *
 * - **`GET` only.** Email OTP and phone are `POST`s from `fetch`, and
 *   `app/pages/login.vue` renders `error.message` out of their bodies. Redirecting those
 *   would replace a readable message with a navigation the caller ignores.
 * - **403 only**, and
 * - **a code this app recognizes.** Every other auth failure keeps the answer
 *   Better Auth already gives it. Presenting an unrecognized fault as "you were
 *   not invited" would mislead in the one direction that costs a real user
 *   their sign-in.
 */
export async function redirectRefusedNavigation(
  request: Request,
  response: Response,
  baseURL: string,
): Promise<Response> {
  if (request.method !== 'GET' || response.status !== 403)
    return response

  if (!response.headers.get('content-type')?.includes('application/json'))
    return response

  // Clone before reading: the original is still the answer unless the body
  // turns out to name a refusal, and a body can only be consumed once.
  const body = await response.clone().json().catch(() => null) as { code?: unknown } | null

  if (!isMembershipRefusalCode(body?.code))
    return response

  return new Response(null, {
    status: 302,
    headers: { location: loginRefusalURL(baseURL, body!.code as string) },
  })
}

/** The path whose 500 this app can explain. */
const PHONE_VERIFY_PATH = '/phone-number/verify'

/** Better Auth's generic code for the throw an unknown number lands on. */
const FAILED_TO_UPDATE_USER = 'FAILED_TO_UPDATE_USER'

/**
 * What an unregistered number is actually told. A phone number can only be
 * linked to an account that already exists (ADR-0007), so this states the rule
 * rather than reporting a fault.
 */
export const PHONE_NOT_REGISTERED_MESSAGE = 'No account is registered to this number.'
export const PHONE_NOT_REGISTERED_CODE = 'PHONE_NUMBER_NOT_REGISTERED'

/**
 * Answer an unregistered phone number with a refusal instead of a crash.
 *
 * `signUpOnVerification` is deliberately unset, so `verifyPhoneNumber` falls
 * through its "no user, no signup" branch with `user` still null and hits a
 * generic `INTERNAL_SERVER_ERROR` / `FAILED_TO_UPDATE_USER`. The path is closed,
 * which membership needs — but a stranger is told the server broke, a 500 is the
 * wrong status for a policy refusal, and the message hides the actual rule.
 *
 * **Why the lookup.** That same throw also covers a genuine update failure for a
 * number that *is* registered. Rewriting every one of them to "not registered"
 * would report a real infrastructure fault as a routine refusal — so the two are
 * told apart by asking, and only the unregistered case is rewritten. A real
 * failure keeps its 500.
 *
 * **Why not a `hooks.before`.** The plugin verifies the OTP *before* it looks the
 * user up. Refusing earlier than that would answer "no such number" to anyone
 * submitting any code, turning the sign-in form into a way to enumerate which
 * numbers hold accounts. Running after the response keeps the OTP check in front
 * of the disclosure.
 *
 * `isNumberRegistered` is injected so this file stays free of the database; the
 * route supplies the real query.
 */
export async function clarifyUnregisteredPhone(
  request: Request,
  response: Response,
  isNumberRegistered: (phoneNumber: string) => Promise<boolean>,
): Promise<Response> {
  if (request.method !== 'POST' || response.status !== 500)
    return response

  if (!new URL(request.url).pathname.endsWith(PHONE_VERIFY_PATH))
    return response

  const body = await response.clone().json().catch(() => null) as { code?: unknown } | null
  if (body?.code !== FAILED_TO_UPDATE_USER)
    return response

  const submitted = await request.clone().json().catch(() => null) as { phoneNumber?: unknown } | null
  const phoneNumber = typeof submitted?.phoneNumber === 'string' ? submitted.phoneNumber : ''
  if (phoneNumber === '' || await isNumberRegistered(phoneNumber))
    return response

  return new Response(
    JSON.stringify({ message: PHONE_NOT_REGISTERED_MESSAGE, code: PHONE_NOT_REGISTERED_CODE }),
    { status: 404, headers: { 'content-type': 'application/json' } },
  )
}
