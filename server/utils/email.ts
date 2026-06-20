/**
 * Email Transport module — the single place that talks to Resend.
 *
 * Owns the API client and from-address configuration. Callers render
 * their HTML (see `email-templates.ts`) and hand it to `sendEmail`.
 */
import { Resend } from 'resend'

function getResendClient() {
  // eslint-disable-next-line node/no-process-env
  const apiKey = process.env.RESEND_API_KEY || process.env.NUXT_RESEND_API_KEY
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured')
  }
  return new Resend(apiKey)
}

function getEmailFrom() {
  // eslint-disable-next-line node/no-process-env
  return process.env.EMAIL_FROM_ADDRESS || process.env.NUXT_EMAIL_FROM || 'Kickstart <onboarding@resend.dev>'
}

export interface SendEmailOptions {
  to: string | string[]
  subject: string
  html: string
  replyTo?: string
}

export interface SendEmailResponse {
  success: boolean
  messageId?: string
  error?: string
}

export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResponse> {
  const { to, subject, html, replyTo } = options

  try {
    const resend = getResendClient()

    const { data, error } = await resend.emails.send({
      from: getEmailFrom(),
      to,
      subject,
      html,
      replyTo,
    })

    if (error) {
      console.error('Failed to send email:', error)
      return {
        success: false,
        error: error.message || 'Failed to send email',
      }
    }

    return {
      success: true,
      messageId: data?.id,
    }
  }
  catch (err) {
    console.error('Error sending email:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}
