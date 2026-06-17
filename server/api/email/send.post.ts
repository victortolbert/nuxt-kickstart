import type { EmailTemplate } from '../../utils/email-templates'
import { isAdmin } from '~~/shared/utils/abilities'
import { isValidEmail } from '~~/shared/utils/email-validation'
import { sendEmail } from '../../utils/email'
import { renderEmailTemplate } from '../../utils/email-templates'
import { renderMarkdownToEmailHtml } from '../../utils/markdown-to-email'
import { loadUnsubscribedEmails } from '../../utils/unsubscribe'

export default defineEventHandler(async (event) => {
  // Only admins can send emails
  await authorize(event, isAdmin)

  // Read request body
  const body = await readBody(event)
  const { subject, body: markdown, template, recipients } = body

  // Validate required fields
  if (!subject || typeof subject !== 'string') {
    throw createError({
      statusCode: 400,
      message: 'subject is required',
    })
  }

  if (!markdown || typeof markdown !== 'string') {
    throw createError({
      statusCode: 400,
      message: 'body is required',
    })
  }

  if (!template || typeof template !== 'string') {
    throw createError({
      statusCode: 400,
      message: 'template is required',
    })
  }

  if (!Array.isArray(recipients) || recipients.length === 0) {
    throw createError({
      statusCode: 400,
      message: 'recipients array is required and must not be empty',
    })
  }

  // Validate recipients are valid emails (RFC 5322 compliant)
  for (const recipient of recipients) {
    if (!isValidEmail(recipient)) {
      throw createError({
        statusCode: 400,
        message: `Invalid email address: ${recipient}`,
      })
    }
  }

  try {
    // Load unsubscribed emails
    const unsubscribedEmails = await loadUnsubscribedEmails()

    // Filter out unsubscribed recipients
    const originalCount = recipients.length
    const filteredRecipients = recipients.filter(
      (email: string) => !unsubscribedEmails.includes(email),
    )
    const filteredCount = originalCount - filteredRecipients.length

    // Check if any recipients remain after filtering
    if (filteredRecipients.length === 0) {
      return {
        success: true,
        sent: 0,
        total: originalCount,
        filtered: filteredCount,
        errors: undefined,
      }
    }

    // Generate unique email ID for tracking
    const emailId = `email-${Date.now()}`

    // Send to each recipient
    let successCount = 0
    const errors: string[] = []

    for (const recipient of filteredRecipients) {
      // Render markdown to HTML with click tracking
      const contentHtml = renderMarkdownToEmailHtml(markdown, {
        emailId,
        recipient,
      })

      // Wrap in email template with recipient-specific unsubscribe link and tracking
      const html = renderEmailTemplate(contentHtml, template as EmailTemplate, {
        subject,
        recipientEmail: recipient,
        emailId,
      })

      const result = await sendEmail({
        to: recipient,
        subject,
        html,
      })

      if (result.success) {
        successCount++
      }
      else {
        errors.push(`${recipient}: ${result.error}`)
      }
    }

    // Return results
    return {
      success: true,
      sent: successCount,
      total: originalCount,
      filtered: filteredCount,
      errors: errors.length > 0 ? errors : undefined,
    }
  }
  catch (error) {
    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : 'Failed to send emails',
    })
  }
})
