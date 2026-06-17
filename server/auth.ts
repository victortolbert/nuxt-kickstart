import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { betterAuth } from 'better-auth/minimal'
import { admin } from 'better-auth/plugins'
import { emailOTP } from 'better-auth/plugins/email-otp'
import { magicLink } from 'better-auth/plugins/magic-link'
import { phoneNumber } from 'better-auth/plugins/phone-number'
import { eq, sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/libsql'
import Twilio from 'twilio'
import * as schema from './db/schema'
import { db as sharedDbClient } from './utils/db'
import { sendEmail } from './utils/email'
import { renderMagicLinkEmail, renderOtpEmail } from './utils/email-templates'

// Better Auth shares the SAME libSQL connection as the app (server/utils/db.ts),
// which already selects Turso (prod) vs local file (dev) and sets WAL +
// busy_timeout. Using a SEPARATE connection to the same SQLite file deadlocks on
// writes: a write held here (a session read/refresh) blocks a write in app code
// (e.g. createSite) and busy_timeout does not break it. One shared connection
// serializes all statements, so they can never deadlock.
const client = sharedDbClient

// Create Drizzle instance for Better Auth
const db = drizzle(client, { schema })

// Parse admin emails from environment variable
// eslint-disable-next-line node/no-process-env
const adminEmails = (process.env.ADMIN_EMAILS || '')
  .split(',')
  .map(email => email.trim().toLowerCase())
  .filter(Boolean)

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
  // eslint-disable-next-line node/no-process-env
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  // Configure social providers
  socialProviders: {
    github: {
      // eslint-disable-next-line node/no-process-env
      clientId: process.env.NUXT_OAUTH_GITHUB_CLIENT_ID || '',
      // eslint-disable-next-line node/no-process-env
      clientSecret: process.env.NUXT_OAUTH_GITHUB_CLIENT_SECRET || '',
    },
  },
  // Configure plugins
  plugins: [
    admin({
      bannedUserMessage: 'Your account has been suspended. Contact support for assistance.',
    }),
    magicLink({
      // Tokens expire after 15 minutes
      expiresIn: 60 * 15, // 15 minutes in seconds
      // Auto-create new users on first magic link sign-in (disableSignUp NOT set)
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
  // Database hooks to auto-assign admin role and track login activity
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const email = user.email.toLowerCase()
          const isAdmin = adminEmails.includes(email)
          return {
            data: {
              ...user,
              role: isAdmin ? 'admin' : 'viewer',
            },
          }
        },
      },
    },
    session: {
      create: {
        after: async (session) => {
          // Sync role from ADMIN_EMAILS on every login
          const user = await db.select({ email: schema.user.email }).from(schema.user).where(eq(schema.user.id, session.userId)).get()
          const role = user && adminEmails.includes(user.email.toLowerCase()) ? 'admin' : undefined

          await db
            .update(schema.user)
            .set({
              lastLoginAt: new Date(),
              loginCount: sql`COALESCE(${schema.user.loginCount}, 0) + 1`,
              ...(role && { role }),
            })
            .where(eq(schema.user.id, session.userId))
        },
      },
    },
  },
})

export { client, db }
