import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import {
  MEMBERSHIP_REFUSED_CODE,
  MEMBERSHIP_REFUSED_MESSAGE,
  MEMBERSHIP_UNVERIFIED_CODE,
} from '../../server/utils/membership'

/**
 * The membership rules are unit-tested in `membership.test.ts`; this file pins
 * that `server/auth.ts` actually asks them, at the one chokepoint every sign-in
 * path converges on.
 *
 * It drives the shipped `user.create.before` hook directly — the real closure
 * off the real auth options — rather than re-implementing it, so a rule that is
 * written but never wired fails here. Nothing sends a magic link or an SMS: the
 * hook is a plain function of the user row Better Auth is about to insert.
 *
 * The database is an empty in-memory client and Twilio is stubbed, only so
 * importing the module opens nothing real; neither is touched by the hook.
 */

vi.mock('../../server/utils/db', async () => {
  const { createClient } = await import('@libsql/client')
  return { db: createClient({ url: ':memory:' }) }
})
vi.mock('twilio', () => ({ default: () => ({ messages: { create: vi.fn() } }) }))

interface CreatedUser { email?: unknown, name?: string, emailVerified?: unknown }

async function loadAuth(env: Record<string, string>) {
  vi.resetModules()
  vi.stubEnv('MEMBER_EMAILS', '')
  vi.stubEnv('ADMIN_EMAILS', '')
  for (const [key, value] of Object.entries(env))
    vi.stubEnv(key, value)

  const { auth } = await import('../../server/auth')
  return auth
}

async function createHook(env: Record<string, string>) {
  const auth = await loadAuth(env)
  const hook = auth.options.databaseHooks?.user?.create?.before

  expect(hook, 'server/auth.ts must register a user.create.before hook').toBeTruthy()

  return (user: CreatedUser) => hook!(user as never)
}

// Every case re-evaluates `server/auth` under its own environment, but only the
// first one in a worker evaluates the graph behind it — Better Auth, its four
// plugins, Drizzle, Twilio — which can take seconds on a loaded machine. Left in
// the cases, that lands on whichever runs first and blows its timeout. Here it
// lands on the hook budget, leaving each case the re-evaluation alone. The
// warm-up goes through `loadAuth` so the module it evaluates is the one the
// cases evaluate.
beforeAll(async () => {
  await loadAuth({})
  vi.unstubAllEnvs()
})

afterEach(() => {
  vi.unstubAllEnvs()
  // A `console.warn` spy left installed by a failing test goes on collecting
  // calls in the next one, so a second test reads the first one's log line as
  // its own. Restoring here means a failure stays where it happened.
  vi.restoreAllMocks()
})

describe('closed membership', () => {
  // `emailVerified` is part of every row Better Auth is about to insert on the
  // paths that admit anyone — the email paths hard-code `true`, OAuth passes on
  // what the provider said — so the admissions below carry it. The endpoint
  // tests in `auth-membership-endpoint.test.ts` are what pin that shape; these
  // fixtures only have to match it.
  it('admits an invited address as a viewer', async () => {
    const before = await createHook({ MEMBER_EMAILS: 'member@kickstart.test' })

    await expect(before({ email: 'member@kickstart.test', name: 'Member', emailVerified: true }))
      .resolves
      .toMatchObject({ data: { email: 'member@kickstart.test', role: 'viewer' } })
  })

  it('admits the Owner as an admin, without a second listing', async () => {
    const before = await createHook({ ADMIN_EMAILS: 'owner@kickstart.test' })

    await expect(before({ email: 'Owner@kickstart.test', emailVerified: true }))
      .resolves
      .toMatchObject({ data: { role: 'admin' } })
  })

  it('refuses an invited address that arrives unproven', async () => {
    // An invitation names an address, so it may only be redeemed by whoever
    // controls it. Refused with its own code, because this person may well be
    // the invitee and the remedy is a path that proves the address rather than
    // asking the Owner for anything.
    const before = await createHook({ MEMBER_EMAILS: 'member@kickstart.test' })

    await expect(before({ email: 'member@kickstart.test', emailVerified: false }))
      .rejects
      .toMatchObject({ statusCode: 403, body: { code: MEMBERSHIP_UNVERIFIED_CODE } })
  })

  it('tells a stranger they are not invited rather than that they are unverified', async () => {
    // Order matters: membership is decided before proof of address, so the
    // refusal an outsider sees never varies with anything about their own
    // account. A different message for an unverified stranger would say whether
    // the address they tried is on the list.
    const before = await createHook({ MEMBER_EMAILS: 'member@kickstart.test' })

    await expect(before({ email: 'stranger@example.com', emailVerified: false }))
      .rejects
      .toMatchObject({ body: { code: MEMBERSHIP_REFUSED_CODE } })
  })

  it('refuses a non-allowlisted address with a 403 and no user row', async () => {
    const before = await createHook({ MEMBER_EMAILS: 'member@kickstart.test' })

    // Throwing beats returning `false`: Better Auth turns the throw into a 403
    // carrying this message, while `false` surfaces as `failed_to_create_user`,
    // which reads as a broken server rather than a decision.
    await expect(before({ email: 'stranger@example.com' })).rejects.toMatchObject({
      statusCode: 403,
      body: { message: MEMBERSHIP_REFUSED_MESSAGE, code: MEMBERSHIP_REFUSED_CODE },
    })
  })

  it('refuses a stranger without writing their address to the log', async () => {
    // Whoever is refused here is not a user and never becomes one, so their
    // address is an identifier the deployment holds for nobody and has no
    // retention story for. Worse, anyone can provoke the line: ask for a magic
    // link to any address at all and the refusal writes it, which makes the log
    // contents steerable by an unauthenticated caller.
    //
    // The domain survives on purpose. An invitation written against the wrong
    // domain entirely is the one mismatch that re-reading the allowlist cannot
    // find, and it is exactly the half that names no person.
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const before = await createHook({ MEMBER_EMAILS: 'member@kickstart.test' })

    await expect(before({ email: 'stranger@example.com', emailVerified: true }))
      .rejects
      .toMatchObject({ statusCode: 403 })

    const said = warn.mock.calls.flat().join(' ')
    expect(said).toMatch(/example\.com/)
    expect(said).not.toMatch(/stranger/)
    warn.mockRestore()
  })

  it('refuses an unproven address without writing it to the log either', async () => {
    // The same rule on the other refusal branch. This person is likelier to be
    // the real invitee than a stranger is, which makes naming them tempting —
    // and makes it worse, because the address is one the Owner deliberately
    // wrote down.
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const before = await createHook({ MEMBER_EMAILS: 'member@kickstart.test' })

    await expect(before({ email: 'member@kickstart.test', emailVerified: false }))
      .rejects
      .toMatchObject({ statusCode: 403 })

    const said = warn.mock.calls.flat().join(' ')
    expect(said).toMatch(/kickstart\.test/)
    expect(said).not.toMatch(/member@/)
    warn.mockRestore()
  })

  it('refuses a user with no email, which is the phone sign-in shape', async () => {
    const before = await createHook({ MEMBER_EMAILS: 'member@kickstart.test' })

    await expect(before({})).rejects.toMatchObject({ statusCode: 403 })
  })

  it('admits anyone with a proven address when neither list is configured', async () => {
    // Open mode, so a fresh clone can sign in before it is configured.
    const before = await createHook({})

    await expect(before({ email: 'anyone@example.com', emailVerified: true }))
      .resolves
      .toMatchObject({ data: { email: 'anyone@example.com', role: 'viewer' } })
  })

  it('still refuses an unproven address in open mode', async () => {
    // No invitation to steal, but an address to squat: an account created under
    // someone else's address would pass the sign-in check the day that address
    // is listed.
    const before = await createHook({})

    await expect(before({ email: 'anyone@example.com', emailVerified: false }))
      .rejects
      .toMatchObject({ statusCode: 403, body: { code: MEMBERSHIP_UNVERIFIED_CODE } })
  })

  it('refuses the phone sign-in shape in open mode too', async () => {
    // No address means nothing proven, whatever the mode.
    const before = await createHook({})

    await expect(before({})).rejects.toMatchObject({ statusCode: 403 })
  })

  it('does not let phone verification create accounts', async () => {
    // Without `signUpOnVerification` the plugin can only link a number to an
    // account that already exists. The allowlist cannot police this path — a
    // phone number has no address to match — so the path must stay closed.
    const auth = await loadAuth({ MEMBER_EMAILS: 'member@kickstart.test' })
    const phone = auth.options.plugins?.find(plugin => plugin.id === 'phone-number') as
      { options?: { signUpOnVerification?: unknown } } | undefined

    expect(phone, 'the phone-number plugin must stay registered').toBeTruthy()
    expect(phone?.options?.signUpOnVerification).toBeUndefined()
  })

  it('warns once at startup that membership is open, and how to close it', async () => {
    // Open is the right default for a fresh clone and the wrong one for
    // anything deployed, so the deploy log has to say which this is.
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    await loadAuth({})

    const lines = warn.mock.calls.map(call => call.join(' '))
    expect(lines).toHaveLength(1)
    expect(lines[0]).toMatch(/open/i)
    expect(lines[0]).toMatch(/MEMBER_EMAILS.*ADMIN_EMAILS/)
    warn.mockRestore()
  })

  it('warns at startup when the lists are set but admit nobody', async () => {
    // Set-but-malformed is closed, not open: a typo must not reopen sign-up.
    // It refuses everyone, the Owner included, and says so nowhere else.
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    await loadAuth({ ADMIN_EMAILS: '"owner@kickstart.test"' })

    const said = warn.mock.calls.flat().join(' ')
    expect(said).toMatch(/admits nobody/)
    expect(said).not.toMatch(/Membership is open/)
    warn.mockRestore()
  })

  it('warns at startup when an allowlist entry can never match an address', async () => {
    // The blind spot in the warning above: it counted entries, so a variable
    // that was set but joined with the wrong separator looked configured while
    // admitting nobody. That is the likelier mistake of the two — a typo rather
    // than a forgotten variable — and it produced the same locked-out deployment
    // with none of the signal.
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    await loadAuth({ MEMBER_EMAILS: 'member@kickstart.test;owner@kickstart.test' })

    const said = warn.mock.calls.flat().join(' ')
    expect(said).toMatch(/MEMBER_EMAILS/)
    expect(said).toMatch(/comma/)
    warn.mockRestore()
  })

  it('names the broken variable without printing what is in it', async () => {
    // The allowlist is configuration, not something to print on every boot, and
    // a malformed entry still contains somebody's address. The variable and the
    // count are what an operator needs to go and fix it.
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    await loadAuth({ ADMIN_EMAILS: '"owner@kickstart.test"' })

    const said = warn.mock.calls.flat().join(' ')
    expect(said).toMatch(/ADMIN_EMAILS/)
    expect(said).not.toMatch(/owner@kickstart\.test/)
    warn.mockRestore()
  })

  it('still admits an invited address when a sibling entry is malformed', async () => {
    // The warning is a diagnosis, not a new refusal: a broken entry must not
    // cost the addresses beside it their invitation.
    const before = await createHook({ MEMBER_EMAILS: 'member@kickstart.test,"second@kickstart.test"' })

    await expect(before({ email: 'member@kickstart.test', emailVerified: true }))
      .resolves
      .toMatchObject({ data: { role: 'viewer' } })
  })

  it('says nothing at startup once an allowlist is configured', async () => {
    // Closed membership is the intended deployed state, so the warnings have to
    // be about open mode and misconfiguration, not the feature — otherwise every
    // boot carries one and nobody reads it.
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    await loadAuth({ MEMBER_EMAILS: 'member@kickstart.test' })

    expect(warn).not.toHaveBeenCalled()
    warn.mockRestore()
  })

  it('checks membership where users are created and where sessions are', async () => {
    // Admission is decided once, on creation. Continued membership is decided
    // on every sign-in, before the session exists — that hook is what
    // makes a withdrawn invitation withdraw access, and what
    // `auth-membership-endpoint.test.ts` drives end to end. Nothing on update:
    // a profile edit is not a sign-in and must not refuse anyone.
    const auth = await loadAuth({})

    // Widened: the inferred type of `databaseHooks` is the literal server/auth.ts
    // registers, on which the update key does not exist — which is the claim,
    // but as a runtime assertion rather than a compile-time one.
    const hooks = auth.options.databaseHooks as {
      user?: Record<string, unknown>
      session?: { create?: Record<string, unknown> }
    } | undefined
    expect(hooks?.user?.update).toBeUndefined()
    expect(hooks?.session?.create?.before).toBeTypeOf('function')
  })
})
