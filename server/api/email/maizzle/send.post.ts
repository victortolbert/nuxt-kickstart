import { isAdmin } from '~~/shared/utils/abilities'
import { isValidEmail } from '~~/shared/utils/email-validation'
import { sendEmail } from '../../../utils/email'
import { renderMaizzleTemplate } from '../../../utils/maizzle'

interface Recipient { email: string, data?: Record<string, unknown> }

/**
 * Render a Maizzle template and send it via the Resend transport (admin only).
 *
 * Body:
 * - `template`   (required) — template name (file stem of app/emails/*.vue)
 * - `recipients` (required) — array of emails, or `{ email, data }` objects for
 *                             per-recipient personalization
 * - `data`       (optional) — shared data merged into every render
 * - `subject`    (optional) — overrides the template's `defineConfig` subject
 * - `replyTo`    (optional)
 *
 * Each recipient is rendered individually so `{{ config.* }}` values (e.g.
 * `config.user`) can differ per person. `recipient` (the email) is always
 * available in the template data.
 */
export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin)

  const body = await readBody(event)
  const { template, subject, data: sharedData, replyTo } = body ?? {}

  if (!template || typeof template !== 'string') {
    throw createError({ statusCode: 400, message: 'template is required' })
  }

  const raw = Array.isArray(body?.recipients) ? body.recipients : body?.recipients ? [body.recipients] : []
  if (raw.length === 0) {
    throw createError({ statusCode: 400, message: 'recipients is required and must not be empty' })
  }

  // Normalize to { email, data } and validate addresses
  const recipients: Recipient[] = raw.map((r: unknown) =>
    typeof r === 'string' ? { email: r } : (r as Recipient))
  for (const { email } of recipients) {
    if (!email || !isValidEmail(email)) {
      throw createError({ statusCode: 400, message: `Invalid email address: ${email}` })
    }
  }

  let sent = 0
  const errors: string[] = []
  for (const { email, data } of recipients) {
    const { html, config } = await renderMaizzleTemplate(template, {
      ...sharedData,
      ...data,
      recipient: email,
    })
    const resolvedSubject
      = (typeof subject === 'string' && subject)
        || (typeof config.subject === 'string' && config.subject)
        || `Message from ${template}`

    const result = await sendEmail({ to: email, subject: resolvedSubject, html, replyTo })
    if (result.success) {
      sent++
    }
    else {
      errors.push(`${email}: ${result.error}`)
    }
  }

  return {
    success: errors.length === 0,
    sent,
    total: recipients.length,
    errors: errors.length > 0 ? errors : undefined,
  }
})
