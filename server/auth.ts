import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { APIError, createAuthMiddleware, isAPIError } from 'better-auth/api'
import { betterAuth } from 'better-auth/minimal'
import { admin } from 'better-auth/plugins'
import { emailOTP } from 'better-auth/plugins/email-otp'
import { magicLink } from 'better-auth/plugins/magic-link'
import { phoneNumber } from 'better-auth/plugins/phone-number'
import { eq, sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/libsql'
import Twilio from 'twilio'
import * as schema from './db/schema'
import { authBaseURL, LOGIN_PATH, loginRefusalURL, refusalCodeFromOAuthError } from './utils/auth-refusal'
import { db as sharedDbClient } from './utils/db'
import { sendEmail } from './utils/email'
import { renderMagicLinkEmail, renderOtpEmail } from './utils/email-templates'
import {
  admitsNobody,
  describeRefusedAddress,
  hasProvenAddress,
  isAdminCreateRequest,
  isOpenMembership,
  mayJoin,
  mayRemain,
  MEMBERSHIP_ADMIN_CREATE_CODE,
  MEMBERSHIP_ADMIN_CREATE_MESSAGE,
  MEMBERSHIP_REFUSED_CODE,
  MEMBERSHIP_REFUSED_MESSAGE,
  MEMBERSHIP_REVOKED_CODE,
  MEMBERSHIP_REVOKED_MESSAGE,
  MEMBERSHIP_UNVERIFIED_CODE,
  MEMBERSHIP_UNVERIFIED_MESSAGE,
  membershipPolicyFromEnv,
  roleForNewMember,
  roleOnLogin,
  unusableEntries,
} from './utils/membership'

// Better Auth shares the SAME libSQL connection as the app (server/utils/db.ts),
// which already selects Turso (prod) vs local file (dev) and sets WAL +
// busy_timeout. Using a SEPARATE connection to the same SQLite file deadlocks on
// writes: a write held here (a session read/refresh) blocks a write in app code
// (e.g. createSite) and busy_timeout does not break it. One shared connection
// serializes all statements, so they can never deadlock.
const client = sharedDbClient

// Create Drizzle instance for Better Auth
const db = drizzle(client, { schema })

// Where this deployment answers. Shared with the Nitro handler, which builds the
// same refusal redirects for the paths a browser navigates into.
const baseURL = authBaseURL()

// Who may sign in at all (MEMBER_EMAILS) and who owns the app (ADMIN_EMAILS).
// Read once at boot, outside any request. The rules live in ./utils/membership
// and ADR-0007.
// eslint-disable-next-line node/no-process-env
const membership = membershipPolicyFromEnv(process.env)

// Open mode: neither list is set, so anyone with a proven address may sign up.
// That is the right default for a fresh clone and the wrong one for anything
// deployed, so it is said once, where whoever deployed it will look.
if (isOpenMembership(membership)) {
  console.warn(
    '⚠️ [auth] Membership is open: MEMBER_EMAILS and ADMIN_EMAILS are both unset, so anyone '
    + 'with a verified email address can create an account. Set either variable to make '
    + 'membership invitation-only.',
  )
}

// An entry that cannot match an address is configuration somebody wrote on
// purpose that admits nobody. Name the variable and how many of its entries are
// inert — not their contents, which are still somebody's address.
for (const [variable, entries] of [
  ['MEMBER_EMAILS', membership.invited],
  ['ADMIN_EMAILS', membership.owners],
] as const) {
  const unusable = unusableEntries(entries).length
  if (unusable > 0) {
    console.warn(
      `⚠️ [auth] ${variable} has ${unusable} ${unusable === 1 ? 'entry' : 'entries'} that cannot `
      + 'match an email address, so nobody is admitted by them. Separate addresses with a comma, '
      + 'and leave out quotes.',
    )
  }
}

// Closed, and nothing configured can match anybody — the Owner included. It
// boots, it sends magic links, and it refuses only at the final step.
if (admitsNobody(membership)) {
  console.warn(
    '⚠️ [auth] Membership admits nobody: MEMBER_EMAILS or ADMIN_EMAILS is set, but no entry in '
    + 'either is a usable address, so every sign-in is refused.',
  )
}

// Initialize Twilio for sending SMS
// eslint-disable-next-line node/no-process-env
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID
// eslint-disable-next-line node/no-process-env
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN
// eslint-disable-next-line node/no-process-env
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER
// Lazy-initialize Twilio to avoid hanging at startup behind corporate proxies
let _twilioClient: ReturnType<typeof Twilio> | null = null
function getTwilioClient() {
  if (!_twilioClient) {
    if (!twilioAccountSid || !twilioAuthToken) {
      console.warn('⚠️ Twilio not configured — SMS sending will be disabled')
      return null
    }
    _twilioClient = Twilio(twilioAccountSid, twilioAuthToken)
  }
  return _twilioClient
}

export const auth = betterAuth({
  appName: 'Kickstart',
  database: drizzleAdapter(db, {
    provider: 'sqlite',
  }),
  emailAndPassword: {
    enabled: false, // Disable password-based auth entirely
  },
  // eslint-disable-next-line node/no-process-env
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL,
  // Better Auth defaults this to its own `${baseURL}/error`, a framework page
  // with none of the app's chrome, theme or i18n — so a refused GitHub sign-in,
  // which is a decision, would read as a broken deployment.
  onAPIError: {
    errorURL: `${baseURL}${LOGIN_PATH}`,
  },
  hooks: {
    // Put the refusal *code* in the OAuth redirect, not the sentence.
    //
    // `handleOAuthUserInfo` catches the membership `APIError` and returns
    // `{ error: e.message }`, which drops `e.body.code` — so the callback falls
    // through to underscoring the English message instead. The redirect is
    // thrown, and the dispatcher catches it into `context.returned` before
    // after-hooks run, so this sees the finished 302 and rewrites only the
    // ones it recognizes.
    after: createAuthMiddleware(async (ctx) => {
      const returned = ctx.context.returned

      // `FOUND` is Better Auth's redirect; anything else is not this hook's.
      // A non-redirect refusal (the magic-link 403) cannot be fixed here — the
      // dispatcher never takes `status` from an after-hook — so that one is
      // turned into a redirect in `server/routes/api/auth/[...all].ts`.
      if (!isAPIError(returned) || returned.status !== 'FOUND')
        return

      // `responseHeaders` is the copy the response is built from; the error's
      // own headers are typed `HeadersInit` and only readable once narrowed.
      const errorHeaders = returned.headers instanceof Headers ? returned.headers : undefined
      const location = ctx.context.responseHeaders?.get('location')
        ?? errorHeaders?.get('location')
      if (!location)
        return

      // `undefined` covers every other OAuth failure (`state_mismatch`,
      // `unable_to_create_user`) and the authorization redirect itself.
      const code = refusalCodeFromOAuthError(
        new URL(location, baseURL).searchParams.get('error'),
      )
      if (!code)
        return

      const refusalURL = loginRefusalURL(baseURL, code)
      ctx.setHeader('location', refusalURL)
      errorHeaders?.set('location', refusalURL)
    }),
  },
  // Configure social providers. GitHub is registered only when both
  // credentials are present: falling back to '' registered a provider that
  // could never complete a sign-in and made Better Auth warn on every boot,
  // burying the membership warning above on a fresh clone.
  socialProviders: {
    // eslint-disable-next-line node/no-process-env
    ...(process.env.NUXT_OAUTH_GITHUB_CLIENT_ID && process.env.NUXT_OAUTH_GITHUB_CLIENT_SECRET
      ? {
          github: {
            // eslint-disable-next-line node/no-process-env
            clientId: process.env.NUXT_OAUTH_GITHUB_CLIENT_ID,
            // eslint-disable-next-line node/no-process-env
            clientSecret: process.env.NUXT_OAUTH_GITHUB_CLIENT_SECRET,
          },
        }
      : {}),
  },
  // Configure plugins
  plugins: [
    admin({
      bannedUserMessage: 'Your account has been suspended. Contact support for assistance.',
    }),
    magicLink({
      // Tokens expire after 15 minutes
      expiresIn: 60 * 15, // 15 minutes in seconds
      // `disableSignUp` is deliberately NOT set: the plugin still reaches user
      // creation, and the `user.create.before` hook below decides who is let in.
      sendMagicLink: async ({ email, url }) => {
        const { subject, html } = renderMagicLinkEmail({ url })
        const result = await sendEmail({ to: email, subject, html })
        if (!result.success)
          throw new Error(`Failed to send magic link email: ${result.error}`)
      },
    }),
    emailOTP({
      // OTP codes are 6 digits
      otpLength: 6,
      // OTP codes expire after 10 minutes
      expiresIn: 60 * 10, // 10 minutes in seconds
      // Send OTP via Resend for sign-in flow
      sendVerificationOTP: async ({ email, otp, type }) => {
        // Only handle sign-in type (per US-007 acceptance criteria)
        if (type === 'sign-in') {
          const { subject, html } = renderOtpEmail({ otp, type })
          const result = await sendEmail({ to: email, subject, html })
          if (!result.success)
            throw new Error(`Failed to send OTP email: ${result.error}`)
        }
      },
    }),
    phoneNumber({
      // OTP codes expire after 10 minutes
      expiresIn: 60 * 10, // 10 minutes in seconds
      // Send OTP via Twilio SMS
      sendOTP: async ({ phoneNumber, code }) => {
        const twilioClient = getTwilioClient()
        if (!twilioClient || !twilioPhoneNumber) {
          throw new Error('Twilio not configured')
        }

        await twilioClient.messages.create({
          body: `Your Kickstart code: ${code}`,
          from: twilioPhoneNumber,
          to: phoneNumber,
        })
      },
    }),
  ],
  // Add custom user fields
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'viewer',
        required: false,
      },
    },
  },
  // Database hooks to decide membership, sync the admin role, and track login
  // activity. See ./utils/membership and ADR-0007.
  databaseHooks: {
    user: {
      create: {
        // The one chokepoint for admission: magic link, email OTP, GitHub OAuth
        // and phone all converge on user creation.
        before: async (user, context?) => {
          // The admin plugin's create-user route is not a way in: it builds a
          // row that has proven nothing. Refused ahead of the allowlist check,
          // in its own words, so a listed address is refused too.
          if (isAdminCreateRequest(context)) {
            console.warn('[auth] refused an admin create-user call; membership is granted by MEMBER_EMAILS')
            throw new APIError('FORBIDDEN', {
              message: MEMBERSHIP_ADMIN_CREATE_MESSAGE,
              code: MEMBERSHIP_ADMIN_CREATE_CODE,
            })
          }

          // Membership before proof of address, so what a stranger is told
          // never depends on anything about their own account.
          if (!mayJoin(user.email, membership)) {
            console.warn(`[auth] refused a sign-up that is not on the allowlist: ${describeRefusedAddress(user.email)}`)
            throw new APIError('FORBIDDEN', {
              message: MEMBERSHIP_REFUSED_MESSAGE,
              code: MEMBERSHIP_REFUSED_CODE,
            })
          }

          // OAuth hands over an address the provider merely asserts; the email
          // paths prove it by construction. Asked in open mode too.
          if (!hasProvenAddress(user)) {
            console.warn(`[auth] refused a sign-up whose address is unproven: ${describeRefusedAddress(user.email)}`)
            throw new APIError('FORBIDDEN', {
              message: MEMBERSHIP_UNVERIFIED_MESSAGE,
              code: MEMBERSHIP_UNVERIFIED_CODE,
            })
          }

          return {
            data: {
              ...user,
              role: roleForNewMember(user.email, membership),
            },
          }
        },
      },
    },
    session: {
      create: {
        // The chokepoint for continued membership: every sign-in mints a
        // session, so an address taken off the lists is refused here, on its
        // next sign-in. Before the session exists, so no cookie is set. The
        // row is kept; re-listing the address undoes this. In open mode
        // everyone remains.
        before: async (session) => {
          const user = await db
            .select({ email: schema.user.email })
            .from(schema.user)
            .where(eq(schema.user.id, session.userId))
            .get()
          if (!mayRemain(user?.email, membership)) {
            console.warn(`[auth] refused a sign-in by an address no longer on the allowlist: ${describeRefusedAddress(user?.email)}`)
            throw new APIError('FORBIDDEN', {
              message: MEMBERSHIP_REVOKED_MESSAGE,
              code: MEMBERSHIP_REVOKED_CODE,
            })
          }
        },
        after: async (session) => {
          // Role sync + login tracking is best-effort: a throw here aborts the
          // sign-in response after the session already exists, so a missing
          // column or a transient DB error would lock everyone out.
          try {
            // Sync role from ADMIN_EMAILS on every login, in both directions.
            // `roleOnLogin` answers `undefined` when the row already agrees.
            const user = await db
              .select({ email: schema.user.email, role: schema.user.role })
              .from(schema.user)
              .where(eq(schema.user.id, session.userId))
              .get()
            const role = roleOnLogin(user?.email, user?.role, membership)

            await db
              .update(schema.user)
              .set({
                lastLoginAt: new Date(),
                loginCount: sql`COALESCE(${schema.user.loginCount}, 0) + 1`,
                ...(role && { role }),
              })
              .where(eq(schema.user.id, session.userId))
          }
          catch (error) {
            console.error('[auth] role sync / login tracking failed:', error)
          }
        },
      },
    },
  },
})

export { client, db }
