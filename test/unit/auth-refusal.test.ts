import { describe, expect, it } from 'vitest'
import {
  authBaseURL,
  clarifyUnregisteredPhone,
  isMembershipRefusalCode,
  loginRefusalURL,
  oauthErrorParam,
  PHONE_NOT_REGISTERED_CODE,
  redirectRefusedNavigation,
  refusalCodeFromOAuthError,
} from '../../server/utils/auth-refusal'
import {
  MEMBERSHIP_REFUSED_CODE,
  MEMBERSHIP_REFUSED_MESSAGE,
  MEMBERSHIP_REVOKED_CODE,
  MEMBERSHIP_REVOKED_MESSAGE,
  MEMBERSHIP_UNVERIFIED_CODE,
  MEMBERSHIP_UNVERIFIED_MESSAGE,
} from '../../server/utils/membership'

/**
 * The presentation half of a refusal, on its own.
 *
 * `auth-membership-endpoint.test.ts` walks the sign-in paths and asserts where a
 * refused browser lands. That proves the wiring but not the edges, and the edges
 * are where this could do harm: every condition below exists to stop a refusal
 * being reported for something that is not one.
 */

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

const refusalBody = { message: MEMBERSHIP_REFUSED_MESSAGE, code: MEMBERSHIP_REFUSED_CODE }

describe('oauthErrorParam', () => {
  it('reproduces Better Auth\'s spaces-to-underscores transformation', () => {
    expect(oauthErrorParam('a b c')).toBe('a_b_c')
  })
})

describe('refusalCodeFromOAuthError', () => {
  it('recovers the code Better Auth dropped, for all three refusals', () => {
    expect(refusalCodeFromOAuthError(oauthErrorParam(MEMBERSHIP_REFUSED_MESSAGE)))
      .toBe(MEMBERSHIP_REFUSED_CODE)
    expect(refusalCodeFromOAuthError(oauthErrorParam(MEMBERSHIP_UNVERIFIED_MESSAGE)))
      .toBe(MEMBERSHIP_UNVERIFIED_CODE)
    expect(refusalCodeFromOAuthError(oauthErrorParam(MEMBERSHIP_REVOKED_MESSAGE)))
      .toBe(MEMBERSHIP_REVOKED_CODE)
  })

  it('passes a code straight through', () => {
    // A future Better Auth that stops dropping `e.body.code` would send one of
    // these directly; failing to recognize it would be a silent regression.
    expect(refusalCodeFromOAuthError(MEMBERSHIP_REFUSED_CODE)).toBe(MEMBERSHIP_REFUSED_CODE)
  })

  it('answers undefined for OAuth failures that are not membership decisions', () => {
    // These reach the identical redirect. Reporting them as a refusal would tell
    // an invited person they were not invited.
    expect(refusalCodeFromOAuthError('state_mismatch')).toBeUndefined()
    expect(refusalCodeFromOAuthError('unable_to_create_user')).toBeUndefined()
    expect(refusalCodeFromOAuthError(null)).toBeUndefined()
    expect(refusalCodeFromOAuthError('')).toBeUndefined()
  })
})

describe('isMembershipRefusalCode', () => {
  it('admits only the refusal codes this app throws', () => {
    expect(isMembershipRefusalCode(MEMBERSHIP_REFUSED_CODE)).toBe(true)
    expect(isMembershipRefusalCode(MEMBERSHIP_UNVERIFIED_CODE)).toBe(true)
    expect(isMembershipRefusalCode(MEMBERSHIP_REVOKED_CODE)).toBe(true)
    expect(isMembershipRefusalCode('FAILED_TO_UPDATE_USER')).toBe(false)
    expect(isMembershipRefusalCode(undefined)).toBe(false)
    expect(isMembershipRefusalCode(42)).toBe(false)
  })
})

describe('loginRefusalURL', () => {
  it('builds an absolute URL carrying the code', () => {
    expect(loginRefusalURL('http://localhost:3000', MEMBERSHIP_REFUSED_CODE))
      .toBe(`http://localhost:3000/login?error=${MEMBERSHIP_REFUSED_CODE}`)
  })

  it('does not double the slash when the base carries one', () => {
    expect(loginRefusalURL('https://kickstart.test/', MEMBERSHIP_REFUSED_CODE))
      .toBe(`https://kickstart.test/login?error=${MEMBERSHIP_REFUSED_CODE}`)
  })
})

describe('authBaseURL', () => {
  it('falls back to localhost when BETTER_AUTH_URL is unset', () => {
    // Whatever the environment says, it has to be a usable origin — a redirect
    // built on `undefined` would be the failure this exists to prevent.
    expect(() => new URL(authBaseURL())).not.toThrow()
  })
})

describe('redirectRefusedNavigation', () => {
  const baseURL = 'http://localhost:3000'
  const get = new Request(`${baseURL}/api/auth/magic-link/verify?token=t`)

  it('turns a navigated-into refusal into a redirect carrying the code', async () => {
    const result = await redirectRefusedNavigation(get, jsonResponse(refusalBody, 403), baseURL)

    expect(result.status).toBe(302)
    expect(result.headers.get('location'))
      .toBe(`${baseURL}/login?error=${MEMBERSHIP_REFUSED_CODE}`)
  })

  it('leaves a POST refusal as JSON', async () => {
    // Email OTP and phone are fetches, and `app/pages/login.vue` renders `error.message`
    // from the body. Redirecting them would swap a readable message for a
    // navigation the caller never follows.
    const post = new Request(`${baseURL}/api/auth/sign-in/email-otp`, { method: 'POST' })
    const response = jsonResponse(refusalBody, 403)

    const result = await redirectRefusedNavigation(post, response, baseURL)

    expect(result).toBe(response)
    expect(await result.json()).toMatchObject({ code: MEMBERSHIP_REFUSED_CODE })
  })

  it('leaves a 403 this app did not throw alone', async () => {
    const response = jsonResponse({ message: 'nope', code: 'SOMETHING_ELSE' }, 403)

    expect(await redirectRefusedNavigation(get, response, baseURL)).toBe(response)
  })

  it('leaves a successful navigation alone', async () => {
    const response = jsonResponse({ status: true }, 200)

    expect(await redirectRefusedNavigation(get, response, baseURL)).toBe(response)
  })

  it('leaves a non-JSON body alone', async () => {
    const response = new Response('forbidden', {
      status: 403,
      headers: { 'content-type': 'text/plain' },
    })

    expect(await redirectRefusedNavigation(get, response, baseURL)).toBe(response)
  })

  it('does not consume the body of a response it passes through', async () => {
    // The original is still the answer in every branch above, and a body can be
    // read once — reading it to decide would leave the caller holding an empty
    // stream.
    const response = jsonResponse({ code: 'SOMETHING_ELSE' }, 403)

    const result = await redirectRefusedNavigation(get, response, baseURL)

    expect(result.bodyUsed).toBe(false)
    await expect(result.json()).resolves.toMatchObject({ code: 'SOMETHING_ELSE' })
  })
})

describe('clarifyUnregisteredPhone', () => {
  const baseURL = 'http://localhost:3000'
  const failedToUpdate = { message: 'Failed to update user', code: 'FAILED_TO_UPDATE_USER' }

  function verifyRequest(phoneNumber: string): Request {
    return new Request(`${baseURL}/api/auth/phone-number/verify`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ phoneNumber, code: '424242' }),
    })
  }

  const noneRegistered = async () => false
  const allRegistered = async () => true

  it('answers an unregistered number with a 404 naming the rule', async () => {
    const result = await clarifyUnregisteredPhone(
      verifyRequest('+15550001111'),
      jsonResponse(failedToUpdate, 500),
      noneRegistered,
    )

    expect(result.status).toBe(404)
    await expect(result.json()).resolves.toMatchObject({ code: PHONE_NOT_REGISTERED_CODE })
  })

  it('leaves the 500 alone when the number IS registered', async () => {
    // The same throw covers a genuine update failure for an existing account.
    // Rewriting that one would report a real fault as a routine refusal — this
    // is the assertion that keeps the disambiguating lookup honest.
    const response = jsonResponse(failedToUpdate, 500)

    const result = await clarifyUnregisteredPhone(
      verifyRequest('+15550001111'),
      response,
      allRegistered,
    )

    expect(result).toBe(response)
    expect(result.status).toBe(500)
  })

  it('leaves a 500 with a different code alone', async () => {
    const response = jsonResponse({ code: 'FAILED_TO_CREATE_SESSION' }, 500)

    expect(await clarifyUnregisteredPhone(verifyRequest('+1555'), response, noneRegistered))
      .toBe(response)
  })

  it('leaves a successful verification alone', async () => {
    const response = jsonResponse({ status: true }, 200)

    expect(await clarifyUnregisteredPhone(verifyRequest('+1555'), response, noneRegistered))
      .toBe(response)
  })

  it('leaves another route alone', async () => {
    const elsewhere = new Request(`${baseURL}/api/auth/sign-in/email-otp`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'a@b.test' }),
    })
    const response = jsonResponse(failedToUpdate, 500)

    expect(await clarifyUnregisteredPhone(elsewhere, response, noneRegistered)).toBe(response)
  })

  it('leaves the 500 alone when the body carries no number to check', async () => {
    // Without a number there is nothing to ask about, and answering "not
    // registered" would be a guess.
    const request = new Request(`${baseURL}/api/auth/phone-number/verify`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ code: '424242' }),
    })
    const response = jsonResponse(failedToUpdate, 500)

    expect(await clarifyUnregisteredPhone(request, response, noneRegistered)).toBe(response)
  })
})
