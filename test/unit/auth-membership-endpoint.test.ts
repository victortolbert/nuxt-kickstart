import type { Client } from '@libsql/client'
import type { LibSQLDatabase } from 'drizzle-orm/libsql'
import { eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/libsql'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import * as schema from '../../server/db/schema'
import { redirectRefusedNavigation } from '../../server/utils/auth-refusal'
import {
  MEMBERSHIP_ADMIN_CREATE_CODE,
  MEMBERSHIP_ADMIN_CREATE_MESSAGE,
  MEMBERSHIP_REFUSED_CODE,
  MEMBERSHIP_REFUSED_MESSAGE,
  MEMBERSHIP_REVOKED_CODE,
  MEMBERSHIP_REVOKED_MESSAGE,
  MEMBERSHIP_UNVERIFIED_CODE,
} from '../../server/utils/membership'
import { createSchemaMemoryClient } from './helpers/memory-db'

/**
 * The allowlist, driven through the sign-in endpoint that actually creates
 * users, against a real in-memory database built from `server/db/schema.ts`.
 *
 * `auth-membership.test.ts` calls the `user.create.before` closure directly, so
 * it proves the rule is wired but not that Better Auth reaches it, honors the
 * throw, or leaves the database untouched afterwards. This file is that check.
 *
 * All four sign-in paths are walked here. "They all converge on
 * `internalAdapter.createUser`" is the design's central claim and the whole
 * reason one hook can close membership — asserting it from the shape of the
 * options, as `auth-membership.test.ts` does, is not the same as walking each
 * path and watching it refuse.
 *
 * Nothing is delivered: each path's verification row is seeded directly (or, for
 * OAuth, GitHub's two endpoints are stubbed), so only the half that ends in user
 * creation runs.
 */

// The DB module is replaced by a per-test in-memory client. A getter, because
// the mock factory is hoisted above the client that satisfies it — `loadAuth`
// fills the holder before importing `server/auth`, which captures the client at
// module eval and builds its own Drizzle instance over it.
const connection: { client: Client | null, db: LibSQLDatabase<typeof schema> | null } = {
  client: null,
  db: null,
}

vi.mock('../../server/utils/db', () => ({
  get db() { return connection.client },
}))
vi.mock('twilio', () => ({ default: () => ({ messages: { create: vi.fn() } }) }))

const MAGIC_LINK_EXPIRY_MS = 15 * 60 * 1000
const PHONE_OTP_EXPIRY_MS = 10 * 60 * 1000

async function loadAuth(env: Record<string, string>) {
  vi.resetModules()
  vi.stubEnv('MEMBER_EMAILS', '')
  vi.stubEnv('ADMIN_EMAILS', '')
  vi.stubEnv('BETTER_AUTH_SECRET', 'membership-endpoint-test-secret')
  vi.stubEnv('BETTER_AUTH_URL', 'http://localhost:3000')
  for (const [key, value] of Object.entries(env))
    vi.stubEnv(key, value)

  const client = await createSchemaMemoryClient()
  connection.client = client
  connection.db = drizzle(client, { schema })

  const { auth } = await import('../../server/auth')
  return { auth, db: connection.db }
}

/**
 * Sign in by magic link without sending one: seed the verification row
 * `sign-in/magic-link` would have written, then call verify with its token.
 * The plugin stores tokens in plain form (`storeToken` is left at its default),
 * under a `magic-link:` prefix, with a typed record (Better Auth 1.7).
 */
async function verifyMagicLink(auth: Awaited<ReturnType<typeof loadAuth>>['auth'], email: string) {
  const token = `test-token-${email}`
  const ctx = await auth.$context

  await ctx.internalAdapter.createVerificationValue({
    identifier: `magic-link:${token}`,
    value: JSON.stringify({ type: 'magic-link', email }),
    expiresAt: new Date(Date.now() + MAGIC_LINK_EXPIRY_MS),
  })

  return auth.api.magicLinkVerify({ query: { token }, headers: new Headers() })
}

/**
 * A refusal at account creation, as the magic-link verify answers it since
 * Better Auth 1.7: the plugin catches the `APIError` the `user.create.before`
 * hook throws and redirects to the error callback with its code, rather than
 * letting the 403 through. Refusals after creation (revocation at session
 * create) still arrive as the 403.
 */
async function expectSignUpRefusedRedirect(attempt: Promise<unknown>, code: string) {
  const error = await attempt.then(
    () => { throw new Error('expected the sign-up to be refused') },
    (e: { statusCode?: number, headers?: Headers }) => e,
  )
  expect(error.statusCode).toBe(302)
  expect(error.headers?.get('location')).toBe(`http://localhost:3000/login?error=${code}`)
}

/**
 * The same verify, driven the way a browser reaches it: a real GET through
 * `auth.handler`, which is exactly what `server/routes/api/auth/[...all].ts`
 * calls.
 *
 * Deliberately not `auth.api.magicLinkVerify({ asResponse: true })`. That skips
 * the HTTP layer, so the request carries no method — and "was this a navigation"
 * is the whole question this turns on. Going through the handler is what makes
 * the GET real.
 */
async function verifyMagicLinkOverHttp(
  auth: Awaited<ReturnType<typeof loadAuth>>['auth'],
  email: string,
) {
  const token = `test-token-${email}`
  const ctx = await auth.$context

  await ctx.internalAdapter.createVerificationValue({
    identifier: `magic-link:${token}`,
    value: JSON.stringify({ type: 'magic-link', email }),
    expiresAt: new Date(Date.now() + MAGIC_LINK_EXPIRY_MS),
  })

  const request = new Request(
    `http://localhost:3000/api/auth/magic-link/verify?token=${encodeURIComponent(token)}`,
  )

  // The same two steps `server/routes/api/auth/[...all].ts` performs, in the
  // same order: Better Auth answers, then the refusal a browser navigated into
  // is turned into something it can land on. Composing them here is what makes
  // the 403 under test a real one rather than a fixture.
  return redirectRefusedNavigation(
    request,
    await auth.handler(request),
    'http://localhost:3000',
  )
}

/**
 * Sign in by email OTP without sending one. `createVerificationOTP` is Better
 * Auth's own server-only seam for exactly this: it writes the verification row
 * the send route would have written and hands back the code, skipping
 * `sendVerificationOTP` (and so Resend) entirely.
 */
async function signInWithEmailOtp(
  auth: Awaited<ReturnType<typeof loadAuth>>['auth'],
  email: string,
) {
  const otp = await auth.api.createVerificationOTP({ body: { email, type: 'sign-in' } })

  return auth.api.signInEmailOTP({ body: { email, otp }, headers: new Headers() })
}

/**
 * Verify a phone number without sending an SMS: seed the `${code}:${attempts}`
 * verification row `phone-number/send-otp` would have written under the number
 * itself, then submit that code.
 */
async function verifyPhone(
  auth: Awaited<ReturnType<typeof loadAuth>>['auth'],
  phoneNumber: string,
) {
  const code = '424242'
  const ctx = await auth.$context

  await ctx.internalAdapter.createVerificationValue({
    identifier: phoneNumber,
    value: `${code}:0`,
    expiresAt: new Date(Date.now() + PHONE_OTP_EXPIRY_MS),
  })

  return auth.api.verifyPhoneNumber({ body: { phoneNumber, code }, headers: new Headers() })
}

/**
 * Sign in through GitHub without GitHub. The three calls the provider makes —
 * the token exchange and the two profile reads — go through `betterFetch`, which
 * resolves `globalThis.fetch` per call, so stubbing it covers all of them.
 */
function stubGithub(email: string, { verified = true } = {}) {
  vi.stubGlobal('fetch', async (input: RequestInfo | URL) => {
    const url = String(input instanceof Request ? input.url : input)
    const json = (body: unknown) =>
      new Response(JSON.stringify(body), { headers: { 'content-type': 'application/json' } })

    if (url.startsWith('https://github.com/login/oauth/access_token'))
      return json({ access_token: 'gh-access-token', token_type: 'bearer', scope: 'read:user' })
    if (url.startsWith('https://api.github.com/user/emails'))
      return json([{ email, primary: true, verified }])
    if (url.startsWith('https://api.github.com/user'))
      return json({ id: 4242, login: 'octocat', name: 'Octocat', email, avatar_url: '' })

    throw new Error(`unexpected fetch in test: ${url}`)
  })
}

/**
 * Walk the OAuth round trip the way the browser does: ask for the authorization
 * URL so Better Auth mints and stores its own state, then hand that state back
 * to the callback with a code the stub above will accept.
 *
 * The signed `state` cookie from the first leg has to travel to the second, or
 * the callback refuses on CSRF grounds before it ever reaches user creation —
 * which looks like a passing refusal test while asserting nothing about
 * membership.
 */
async function completeGithubCallback(
  auth: Awaited<ReturnType<typeof loadAuth>>['auth'],
  email: string,
  options?: { verified?: boolean },
) {
  stubGithub(email, options)

  const signIn = await auth.api.signInSocial({
    body: { provider: 'github', callbackURL: 'http://localhost:3000/dashboard' },
    asResponse: true,
  })
  const { url } = await signIn.json() as { url: string }
  const state = new URL(url).searchParams.get('state')!
  const cookie = signIn.headers.getSetCookie().map(entry => entry.split(';')[0]).join('; ')

  return auth.api.callbackOAuth({
    params: { id: 'github' },
    query: { code: 'test-authorization-code', state },
    method: 'GET',
    headers: new Headers({ cookie }),
    asResponse: true,
  })
}

function findUser(db: LibSQLDatabase<typeof schema>, email: string) {
  return db.select().from(schema.user).where(eq(schema.user.email, email)).get()
}

/** Release the database `loadAuth` built and the environment it was built under. */
function releaseConnection() {
  vi.unstubAllEnvs()
  connection.client?.close()
  connection.client = null
  connection.db = null
}

// The first `loadAuth` in a worker evaluates the whole Better Auth graph and
// builds a fresh in-memory database; every later one re-evaluates a warm graph.
// Left in the cases, that cost lands on whichever runs first and can blow its
// timeout under parallel load. Here it lands on the hook budget, and going
// through the cases' own `loadAuth` keeps the warm-up from drifting from what it
// is warming.
beforeAll(async () => {
  await loadAuth({})
  releaseConnection()
})

afterEach(() => {
  releaseConnection()
  vi.unstubAllGlobals()
})

describe('membership at the magic-link endpoint', () => {
  it('refuses a non-allowlisted address and writes no user row', async () => {
    const { auth, db } = await loadAuth({ MEMBER_EMAILS: 'member@kickstart.test' })

    await expectSignUpRefusedRedirect(verifyMagicLink(auth, 'stranger@example.com'), MEMBERSHIP_REFUSED_CODE)

    // The half a unit test on the hook cannot show: refusing mid-creation must
    // not leave a user behind for the next attempt to find and sign in as.
    expect(await findUser(db, 'stranger@example.com')).toBeUndefined()
    expect(await db.select().from(schema.session).all()).toEqual([])
  })

  it('lands a refused browser on the login page instead of raw JSON', async () => {
    // The link is opened by navigating, so whatever this answers *is* the page
    // an uninvited person sees. Left alone, the throw reaches Better Auth's
    // generic handler and renders the 403 body — `{"message":...,"code":...}` —
    // which reads as a crash rather than a decision.
    const { auth, db } = await loadAuth({ MEMBER_EMAILS: 'member@kickstart.test' })

    const response = await verifyMagicLinkOverHttp(auth, 'stranger@example.com')

    expect(response.status).toBe(302)
    expect(response.headers.get('location')).toBe(
      `http://localhost:3000/login?error=${MEMBERSHIP_REFUSED_CODE}`,
    )
    // Presentation only: the refusal itself must be unchanged. A redirect that
    // also handed out a session would be the one way this "fix" could be worse
    // than the JSON it replaces.
    expect(response.headers.getSetCookie()).toEqual([])
    expect(await findUser(db, 'stranger@example.com')).toBeUndefined()
    expect(await db.select().from(schema.session).all()).toEqual([])
  })

  it('admits an invited address as a viewer, with a session', async () => {
    const { auth, db } = await loadAuth({ MEMBER_EMAILS: 'Member@Kickstart.test' })

    const result = await verifyMagicLink(auth, 'member@kickstart.test')

    expect(result).toMatchObject({ user: { email: 'member@kickstart.test', role: 'viewer' } })
    expect(await findUser(db, 'member@kickstart.test')).toMatchObject({ role: 'viewer' })
  })

  it('admits an address in ADMIN_EMAILS as an admin, without a second listing', async () => {
    const { auth, db } = await loadAuth({ ADMIN_EMAILS: 'owner@kickstart.test' })

    await verifyMagicLink(auth, 'owner@kickstart.test')

    expect(await findUser(db, 'owner@kickstart.test')).toMatchObject({ role: 'admin' })
  })

  it('refuses an existing user whose address is on neither list', async () => {
    // The lists are re-read on every sign-in, mirroring the bidirectional
    // admin-role sync: an invitation withdrawn from MEMBER_EMAILS withdraws the
    // access it granted. Fail-closed — a delisted address, including one
    // admitted before the lists existed, cannot sign in; the row is kept.
    const { auth, db } = await loadAuth({ MEMBER_EMAILS: 'member@kickstart.test' })
    await db.insert(schema.user).values({
      id: 'existing-user',
      name: 'Formerly Admitted',
      email: 'existing@example.com',
      emailVerified: true,
      role: 'viewer',
    })

    await expect(verifyMagicLink(auth, 'existing@example.com')).rejects.toMatchObject({
      status: 'FORBIDDEN',
      body: { code: MEMBERSHIP_REVOKED_CODE, message: MEMBERSHIP_REVOKED_MESSAGE },
    })

    expect(await findUser(db, 'existing@example.com')).toMatchObject({ id: 'existing-user', loginCount: 0 })
    expect(await db.select().from(schema.session).where(eq(schema.session.userId, 'existing-user'))).toEqual([])
    // Its own code: the person was invited once, and the remedy is being re-listed,
    // not an emailed link.
    expect(MEMBERSHIP_REVOKED_CODE).not.toBe(MEMBERSHIP_REFUSED_CODE)
  })

  it('signs a re-listed address back in', async () => {
    // The row survives revocation, so re-adding the address is the whole undo.
    const { auth, db } = await loadAuth({ MEMBER_EMAILS: 'member@kickstart.test,existing@example.com' })
    await db.insert(schema.user).values({
      id: 'existing-user',
      name: 'Re-admitted',
      email: 'existing@example.com',
      emailVerified: true,
      role: 'viewer',
    })

    const result = await verifyMagicLink(auth, 'existing@example.com')

    expect(result).toMatchObject({ user: { id: 'existing-user', role: 'viewer' } })
  })

  it('still signs in an existing user whose address was never verified', async () => {
    // The proof-of-address check is a condition of being admitted, not of
    // signing in: rows written before it existed (or by fixtures that insert
    // directly) carry whatever they carry. The login re-check reads
    // the lists and nothing else, and that is what this fails on.
    const { auth, db } = await loadAuth({ MEMBER_EMAILS: 'member@kickstart.test,unverified@example.com' })
    await db.insert(schema.user).values({
      id: 'unverified-existing',
      name: 'Already Admitted',
      email: 'unverified@example.com',
      emailVerified: false,
      role: 'viewer',
    })

    const result = await verifyMagicLink(auth, 'unverified@example.com')

    expect(result).toMatchObject({ user: { id: 'unverified-existing', role: 'viewer' } })
  })

  it('re-syncs the Owner role on login for a user created before ADMIN_EMAILS listed them', async () => {
    // The other half of the login path: `session.create.after` reads ADMIN_EMAILS
    // on every sign-in, which is what keeps the Owner an admin after the row was
    // written with some other role. Nothing else exercises that hook.
    const { auth, db } = await loadAuth({ ADMIN_EMAILS: 'owner@kickstart.test' })
    await db.insert(schema.user).values({
      id: 'demoted-owner',
      name: 'Owner',
      email: 'owner@kickstart.test',
      emailVerified: true,
      role: 'viewer',
    })

    await verifyMagicLink(auth, 'owner@kickstart.test')

    expect(await findUser(db, 'owner@kickstart.test')).toMatchObject({
      role: 'admin',
      loginCount: 1,
    })
  })

  it('revokes the Owner role on login once ADMIN_EMAILS no longer lists the address', async () => {
    // The other direction of the same sync, which did nothing at all: a
    // `role: undefined` spread contributed no column, so a row saying `admin`
    // stayed `admin` on every later login however the variable was edited.
    const { auth, db } = await loadAuth({
      MEMBER_EMAILS: 'ex-owner@kickstart.test',
      ADMIN_EMAILS: 'owner@kickstart.test',
    })
    await db.insert(schema.user).values({
      id: 'former-owner',
      name: 'Former Owner',
      email: 'ex-owner@kickstart.test',
      emailVerified: true,
      role: 'admin',
    })

    await verifyMagicLink(auth, 'ex-owner@kickstart.test')

    expect(await findUser(db, 'ex-owner@kickstart.test')).toMatchObject({
      role: 'viewer',
      loginCount: 1,
    })
  })

  it('leaves a stored role ADMIN_EMAILS does not own alone', async () => {
    // ADMIN_EMAILS is the source of truth for `admin` and nothing else, so a
    // role it does not own survives the login it would otherwise be clobbered on.
    const { auth, db } = await loadAuth({ MEMBER_EMAILS: 'editor@kickstart.test' })
    await db.insert(schema.user).values({
      id: 'an-editor',
      name: 'Editor',
      email: 'editor@kickstart.test',
      emailVerified: true,
      role: 'editor',
    })

    await verifyMagicLink(auth, 'editor@kickstart.test')

    expect(await findUser(db, 'editor@kickstart.test')).toMatchObject({ role: 'editor' })
  })

  it('does not promote an invited Member to admin on login', async () => {
    const { auth, db } = await loadAuth({
      MEMBER_EMAILS: 'member@kickstart.test',
      ADMIN_EMAILS: 'owner@kickstart.test',
    })

    await verifyMagicLink(auth, 'member@kickstart.test')

    expect(await findUser(db, 'member@kickstart.test')).toMatchObject({ role: 'viewer' })
  })
})

describe('membership at the email-OTP endpoint', () => {
  it('refuses a non-allowlisted address holding a valid code', async () => {
    // The code is genuine and unexpired: what refuses this sign-in is membership,
    // not a failed verification. The refusal lands on submission rather than on
    // request — a stranger still receives one code — because refusing at the
    // request step would let anyone enumerate the allowlist by watching which
    // addresses get mail.
    const { auth, db } = await loadAuth({ MEMBER_EMAILS: 'member@kickstart.test' })

    await expect(signInWithEmailOtp(auth, 'stranger@example.com')).rejects.toMatchObject({
      statusCode: 403,
      body: { message: MEMBERSHIP_REFUSED_MESSAGE, code: MEMBERSHIP_REFUSED_CODE },
    })

    expect(await findUser(db, 'stranger@example.com')).toBeUndefined()
    expect(await db.select().from(schema.session).all()).toEqual([])
  })

  it('admits an invited address as a viewer', async () => {
    const { auth, db } = await loadAuth({ MEMBER_EMAILS: 'member@kickstart.test' })

    const result = await signInWithEmailOtp(auth, 'member@kickstart.test')

    expect(result).toMatchObject({ user: { email: 'member@kickstart.test', role: 'viewer' } })
    expect(await findUser(db, 'member@kickstart.test')).toMatchObject({ role: 'viewer' })
  })
})

describe('membership at the phone endpoint', () => {
  it('creates no account for a verified number that belongs to nobody', async () => {
    // The allowlist cannot police this path — a phone number has no address to
    // match — so the path stays closed instead: with `signUpOnVerification`
    // unset the plugin can only link a number to a user that already exists.
    // `auth-membership.test.ts` pins the option; this asserts the outcome, which
    // survives losing either defense on its own. Setting the option makes the
    // plugin synthesize a temp email, and a synthesized address is on no
    // allowlist, so the create hook refuses it in turn.
    const { auth, db } = await loadAuth({ MEMBER_EMAILS: 'member@kickstart.test' })

    // The verify route answers 500 FAILED_TO_UPDATE_USER for an unknown number
    // rather than a clean refusal — Better Auth behavior that
    // `clarifyUnregisteredPhone` rewrites at the Nitro handler. What matters
    // here is that it is not a way in.
    await expect(verifyPhone(auth, '+15550001111')).rejects.toBeTruthy()

    expect(await db.select().from(schema.user).all()).toEqual([])
    expect(await db.select().from(schema.session).all()).toEqual([])
  })

  it('links a number to an already-admitted account', async () => {
    // The other half: the path is closed to new accounts, not broken. Without
    // this, the test above would still pass if phone sign-in stopped working
    // altogether.
    const { auth, db } = await loadAuth({ MEMBER_EMAILS: 'member@kickstart.test' })
    await db.insert(schema.user).values({
      id: 'admitted-member',
      name: 'Member',
      email: 'member@kickstart.test',
      emailVerified: true,
      role: 'viewer',
      phoneNumber: '+15550002222',
    })

    const result = await verifyPhone(auth, '+15550002222')

    expect(result).toMatchObject({ status: true, user: { id: 'admitted-member' } })
    expect(await findUser(db, 'member@kickstart.test')).toMatchObject({ phoneNumberVerified: true })
  })
})

const GITHUB_CREDENTIALS = {
  NUXT_OAUTH_GITHUB_CLIENT_ID: 'test-client-id',
  NUXT_OAUTH_GITHUB_CLIENT_SECRET: 'test-client-secret',
}

describe('membership at the GitHub OAuth callback', () => {
  it('refuses a non-allowlisted GitHub account by redirecting to the error URL', async () => {
    // The path that made the refusal a thrown APIError rather than a returned
    // `false`: OAuth answers a browser mid-redirect, so it has to end somewhere a
    // browser can land. Better Auth turns the throw into a redirect carrying the
    // reason instead of erroring blank.
    const { auth, db } = await loadAuth({
      ...GITHUB_CREDENTIALS,
      MEMBER_EMAILS: 'member@kickstart.test',
    })

    const response = await completeGithubCallback(auth, 'stranger@example.com')

    // Lands on the app's own login page carrying the stable code — not Better
    // Auth's `/api/auth/error`, and not the English sentence underscored.
    // Pinning the whole location says which redirect this is: a generic OAuth
    // failure (`state_mismatch`, `unable_to_create_user`) would land here too and
    // a `toContain('error')` would not tell the two apart.
    expect(response.status).toBe(302)
    expect(response.headers.get('location')).toBe(
      `http://localhost:3000/login?error=${MEMBERSHIP_REFUSED_CODE}`,
    )
    expect(await findUser(db, 'stranger@example.com')).toBeUndefined()
    expect(await db.select().from(schema.account).all()).toEqual([])
    expect(await db.select().from(schema.session).all()).toEqual([])
  })

  it('admits an invited GitHub account as a viewer', async () => {
    const { auth, db } = await loadAuth({
      ...GITHUB_CREDENTIALS,
      MEMBER_EMAILS: 'member@kickstart.test',
    })

    const response = await completeGithubCallback(auth, 'member@kickstart.test')

    expect(response.headers.get('location')).toBe('http://localhost:3000/dashboard')
    expect(await findUser(db, 'member@kickstart.test')).toMatchObject({ role: 'viewer' })
    expect(await db.select().from(schema.account).all()).toMatchObject([{ providerId: 'github' }])
  })

  it('refuses an invited address GitHub reports but has not verified', async () => {
    // The invitation names an address, so it may only be redeemed by whoever
    // controls that address. The email paths prove control inherently — the link
    // or the code has to be received — but OAuth creates the user with whatever
    // the provider reports (`emailVerified: userInfo.emailVerified`, with no
    // guard on registration), and an address can sit unverified on a GitHub
    // account that does not own it. Without this the allowlist could be redeemed
    // by whoever claims an invited address first.
    const { auth, db } = await loadAuth({
      ...GITHUB_CREDENTIALS,
      MEMBER_EMAILS: 'member@kickstart.test',
    })

    const response = await completeGithubCallback(auth, 'member@kickstart.test', { verified: false })

    expect(response.status).toBe(302)
    expect(response.headers.get('location')).toBe(
      `http://localhost:3000/login?error=${MEMBERSHIP_UNVERIFIED_CODE}`,
    )
    expect(await findUser(db, 'member@kickstart.test')).toBeUndefined()
    expect(await db.select().from(schema.account).all()).toEqual([])
    expect(await db.select().from(schema.session).all()).toEqual([])
  })

  it('revokes the Owner role on a GitHub sign-in once ADMIN_EMAILS no longer lists the address', async () => {
    // The revocation asserted for the magic link, driven through OAuth instead.
    // `session.create.after` is shared by every path, so this direction was
    // argued to hold here rather than measured — and OAuth is the one path that
    // reaches a session without passing `user.create.before` at all: the account
    // is already linked, so nothing else in this file's GitHub cases runs. An
    // owner dropped from the variable who signs in with GitHub is the case that
    // argument covers, and it was the case nobody had watched.
    const { auth, db } = await loadAuth({
      ...GITHUB_CREDENTIALS,
      MEMBER_EMAILS: 'ex-owner@kickstart.test',
      ADMIN_EMAILS: 'owner@kickstart.test',
    })
    await db.insert(schema.user).values({
      id: 'former-owner-oauth',
      name: 'Former Owner',
      email: 'ex-owner@kickstart.test',
      emailVerified: true,
      role: 'admin',
    })
    // Linked already: this is a returning user, not a registration. Without the
    // account row Better Auth refuses the callback before any session exists,
    // which would pass the role assertion by never writing a role at all.
    await db.insert(schema.account).values({
      id: 'former-owner-github-account',
      accountId: '4242',
      providerId: 'github',
      userId: 'former-owner-oauth',
      updatedAt: new Date(),
    })

    const response = await completeGithubCallback(auth, 'ex-owner@kickstart.test')

    // Landing on the callback URL rather than the error one: the sign-in
    // succeeded, so the demotion below is the hook's work and not a refusal.
    expect(response.headers.get('location')).toBe('http://localhost:3000/dashboard')
    expect(await findUser(db, 'ex-owner@kickstart.test')).toMatchObject({
      role: 'viewer',
      loginCount: 1,
    })
  })

  it('restores the Owner role on a GitHub sign-in once ADMIN_EMAILS lists the address again', async () => {
    // The claim that makes the fail-closed demotion affordable — restoring the
    // variable promotes on the next login — over the path that has no second way
    // back in. An owner who only ever signs in with GitHub is demoted by an
    // editing mistake and can recover from it here, or not at all.
    const { auth, db } = await loadAuth({
      ...GITHUB_CREDENTIALS,
      ADMIN_EMAILS: 'restored-owner@kickstart.test',
    })
    await db.insert(schema.user).values({
      id: 'restored-owner-oauth',
      name: 'Restored Owner',
      email: 'restored-owner@kickstart.test',
      emailVerified: true,
      role: 'viewer',
    })
    await db.insert(schema.account).values({
      id: 'restored-owner-github-account',
      accountId: '4242',
      providerId: 'github',
      userId: 'restored-owner-oauth',
      updatedAt: new Date(),
    })

    await completeGithubCallback(auth, 'restored-owner@kickstart.test')

    expect(await findUser(db, 'restored-owner@kickstart.test')).toMatchObject({
      role: 'admin',
      loginCount: 1,
    })
  })
})

describe('open membership (neither list set)', () => {
  it('admits a stranger by magic link as a viewer', async () => {
    // The fresh-clone path: nothing configured, and sign-in still works.
    const { auth, db } = await loadAuth({})

    const result = await verifyMagicLink(auth, 'anyone@example.com')

    expect(result).toMatchObject({ user: { email: 'anyone@example.com', role: 'viewer' } })
    expect(await findUser(db, 'anyone@example.com')).toMatchObject({ role: 'viewer', loginCount: 1 })
  })

  it('admits a stranger by email OTP', async () => {
    const { auth, db } = await loadAuth({})

    await signInWithEmailOtp(auth, 'otp@example.com')

    expect(await findUser(db, 'otp@example.com')).toMatchObject({ role: 'viewer' })
  })

  it('still refuses an address GitHub has not verified', async () => {
    const { auth, db } = await loadAuth(GITHUB_CREDENTIALS)

    const response = await completeGithubCallback(auth, 'squatter@example.com', { verified: false })

    expect(response.headers.get('location')).toBe(
      `http://localhost:3000/login?error=${MEMBERSHIP_UNVERIFIED_CODE}`,
    )
    expect(await findUser(db, 'squatter@example.com')).toBeUndefined()
  })

  it('still creates no account from a phone number alone', async () => {
    const { auth, db } = await loadAuth({})

    await expect(verifyPhone(auth, '+15550003333')).rejects.toBeTruthy()

    expect(await db.select().from(schema.user).all()).toEqual([])
  })

  it('demotes a stored admin, since ADMIN_EMAILS names no Owner', async () => {
    const { auth, db } = await loadAuth({})
    await db.insert(schema.user).values({
      id: 'stale-admin',
      name: 'Stale Admin',
      email: 'stale@example.com',
      emailVerified: true,
      role: 'admin',
    })

    await verifyMagicLink(auth, 'stale@example.com')

    expect(await findUser(db, 'stale@example.com')).toMatchObject({ role: 'viewer' })
  })
})

describe('closing membership after it was open', () => {
  it('refuses, at the next sign-in, an account admitted while open but not listed now', async () => {
    // The transition the template's default creates: a clone runs open, someone
    // signs up, then the operator sets the lists. That account has no standing
    // under the lists and is refused with the revoked code; the row survives.
    const open = await loadAuth({})
    await verifyMagicLink(open.auth, 'early@example.com')
    const admitted = await findUser(open.db, 'early@example.com')
    expect(admitted).toMatchObject({ role: 'viewer', loginCount: 1 })

    // Carry the same rows into a deployment that now has lists set.
    const rows = await open.db.select().from(schema.user).all()
    releaseConnection()
    const closed = await loadAuth({ ADMIN_EMAILS: 'owner@kickstart.test' })
    await closed.db.insert(schema.user).values(rows)

    await expect(verifyMagicLink(closed.auth, 'early@example.com')).rejects.toMatchObject({
      status: 'FORBIDDEN',
      body: { code: MEMBERSHIP_REVOKED_CODE },
    })
    expect(await findUser(closed.db, 'early@example.com')).toMatchObject({ id: admitted!.id, loginCount: 1 })
    expect(await closed.db.select().from(schema.session).all()).toEqual([])
  })

  it('keeps signing in an account admitted while open once it is listed', async () => {
    const open = await loadAuth({})
    await verifyMagicLink(open.auth, 'kept@example.com')
    const rows = await open.db.select().from(schema.user).all()
    releaseConnection()

    const closed = await loadAuth({ MEMBER_EMAILS: 'kept@example.com' })
    await closed.db.insert(schema.user).values(rows)

    await expect(verifyMagicLink(closed.auth, 'kept@example.com'))
      .resolves
      .toMatchObject({ user: { email: 'kept@example.com' } })
  })

  it('refuses a new stranger once the lists are set', async () => {
    const { auth, db } = await loadAuth({ MEMBER_EMAILS: 'member@kickstart.test' })

    await expectSignUpRefusedRedirect(verifyMagicLink(auth, 'late@example.com'), MEMBERSHIP_REFUSED_CODE)
    expect(await findUser(db, 'late@example.com')).toBeUndefined()
  })
})

/**
 * The admin plugin's create-user route is not a way in.
 *
 * `POST /api/auth/admin/create-user` builds its row without `emailVerified`,
 * so the proof-of-address guard would refuse it — with the magic-link message,
 * which sends the Owner to a path they are not on. Nothing in the app calls
 * the route, and membership is granted by `MEMBER_EMAILS`; opening it would
 * mean inventing an "Owner vouched for this address" proof. So it stays closed
 * and says so in its own words.
 */
describe('membership at the admin create-user route', () => {
  /** An Owner's session cookie, the way the magic-link response sets it. */
  async function signInOwner(auth: Awaited<ReturnType<typeof loadAuth>>['auth']) {
    const token = 'test-token-owner@kickstart.test'
    const ctx = await auth.$context
    await ctx.internalAdapter.createVerificationValue({
      identifier: `magic-link:${token}`,
      value: JSON.stringify({ type: 'magic-link', email: 'owner@kickstart.test' }),
      expiresAt: new Date(Date.now() + MAGIC_LINK_EXPIRY_MS),
    })
    const response = await auth.api.magicLinkVerify({ query: { token }, headers: new Headers(), asResponse: true })
    return response.headers.getSetCookie().map(entry => entry.split(';')[0]).join('; ')
  }

  it('refuses even an invited address, with a message aimed at the Owner', async () => {
    const { auth, db } = await loadAuth({
      ADMIN_EMAILS: 'owner@kickstart.test',
      MEMBER_EMAILS: 'invited@kickstart.test',
    })
    const cookie = await signInOwner(auth)

    await expect(auth.api.createUser({
      body: { email: 'invited@kickstart.test', name: 'Invited', role: 'user' },
      headers: new Headers({ cookie }),
    })).rejects.toMatchObject({
      status: 'FORBIDDEN',
      body: { code: MEMBERSHIP_ADMIN_CREATE_CODE, message: MEMBERSHIP_ADMIN_CREATE_MESSAGE },
    })

    expect(await findUser(db, 'invited@kickstart.test')).toBeUndefined()
    // Not the sign-in refusals: the Owner is not being turned away, and the
    // remedy is not an emailed link.
    expect(MEMBERSHIP_ADMIN_CREATE_CODE).not.toBe(MEMBERSHIP_REFUSED_CODE)
    expect(MEMBERSHIP_ADMIN_CREATE_CODE).not.toBe(MEMBERSHIP_UNVERIFIED_CODE)
    expect(MEMBERSHIP_ADMIN_CREATE_MESSAGE).toMatch(/MEMBER_EMAILS/)
  })

  it('leaves the sign-in paths refusing exactly as before', async () => {
    // The route check must sit in front of the allowlist check, not replace it.
    const { auth } = await loadAuth({ ADMIN_EMAILS: 'owner@kickstart.test' })

    await expectSignUpRefusedRedirect(verifyMagicLink(auth, 'stranger@kickstart.test'), MEMBERSHIP_REFUSED_CODE)
  })
})
