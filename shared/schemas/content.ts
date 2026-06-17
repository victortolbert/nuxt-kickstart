import { z } from 'zod'
import { emailSchema, optionalStringSchema, requiredStringSchema } from './common'

/**
 * Note/capture validation schema
 * Used for quick capture forms
 */
export const noteSchema = z.object({
  title: requiredStringSchema,
  description: optionalStringSchema,
})

/**
 * Email compose validation schema
 * Used for email composition forms
 */
export const emailComposeSchema = z.object({
  subject: z.string().optional(),
  body: z.string().min(1, 'Email body is required'),
  recipients: z.array(emailSchema).min(1, 'At least one recipient is required'),
})

/**
 * TypeScript types inferred from schemas
 */
export type NoteForm = z.infer<typeof noteSchema>
export type EmailComposeForm = z.infer<typeof emailComposeSchema>
