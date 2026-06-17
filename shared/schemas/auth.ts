import { z } from 'zod'
import { emailSchema } from './common'

/**
 * Magic link / email sign-in form validation schema
 * Validates email field only (passwordless auth)
 */
export const magicLinkSchema = z.object({
  email: emailSchema,
})

/**
 * Phone number sign-in form validation schema
 */
export const phoneSignInSchema = z.object({
  phoneNumber: z.string().min(10, 'Enter a valid phone number'),
})

/**
 * OTP verification schema
 */
export const otpSchema = z.object({
  code: z.string().length(6, 'Enter all 6 digits'),
})

// Export TypeScript types inferred from schemas
export type MagicLinkForm = z.infer<typeof magicLinkSchema>
export type PhoneSignInForm = z.infer<typeof phoneSignInSchema>
export type OtpForm = z.infer<typeof otpSchema>
