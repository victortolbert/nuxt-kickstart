/**
 * Email template system with inline CSS for email client compatibility
 */

import { Buffer } from 'node:buffer'

export type EmailTemplate = 'newsletter' | 'announcement' | 'personal'

export interface RenderEmailTemplateOptions {
  subject?: string
  preheader?: string
  unsubscribeUrl?: string
  recipientEmail?: string
  emailId?: string
}

/**
 * Renders email content wrapped in a template with inline styles
 */
export function renderEmailTemplate(
  content: string,
  template: EmailTemplate = 'newsletter',
  options: RenderEmailTemplateOptions = {},
): string {
  const { subject = '', preheader = '', unsubscribeUrl, recipientEmail, emailId } = options

  // Generate unsubscribe URL from recipientEmail if provided
  let finalUnsubscribeUrl = unsubscribeUrl || '#'
  if (recipientEmail && !unsubscribeUrl) {
    // Base64 encode the email address for the token
    const token = Buffer.from(recipientEmail).toString('base64')
    finalUnsubscribeUrl = `/api/email/unsubscribe?token=${token}`
  }

  const baseStyles = {
    body: 'margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; line-height: 1.6; color: #333333; background-color: #f4f4f4;',
    container: 'max-width: 600px; margin: 0 auto; background-color: #ffffff;',
    header: 'padding: 20px; text-align: center; background-color: #0066cc; color: #ffffff;',
    content: 'padding: 30px 20px;',
    footer: 'padding: 20px; text-align: center; font-size: 12px; color: #666666; background-color: #f9f9f9; border-top: 1px solid #eeeeee;',
    link: 'color: #0066cc; text-decoration: none;',
    unsubscribe: 'color: #999999; text-decoration: underline;',
  }

  // Template-specific styles
  const templateStyles = {
    newsletter: {
      headerBg: '#0066cc',
      headerColor: '#ffffff',
    },
    announcement: {
      headerBg: '#ff6600',
      headerColor: '#ffffff',
    },
    personal: {
      headerBg: '#333333',
      headerColor: '#ffffff',
    },
  }

  const styles = templateStyles[template]

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${subject}</title>
  ${preheader ? `<style type="text/css">.preheader { display: none !important; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0; }</style>` : ''}
</head>
<body style="${baseStyles.body}">
  ${preheader ? `<div class="preheader">${preheader}</div>` : ''}
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="${baseStyles.container}">
          <!-- Header -->
          <tr>
            <td style="${baseStyles.header.replace('#0066cc', styles.headerBg).replace('color: #ffffff', `color: ${styles.headerColor}`)}">
              <h1 style="margin: 0; font-size: 24px; font-weight: 600;">${subject}</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="${baseStyles.content}">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="${baseStyles.footer}">
              <p style="margin: 0 0 10px 0;">
                This email was sent to you by Kickstart.
              </p>
              <p style="margin: 0;">
                <a href="${finalUnsubscribeUrl}" style="${baseStyles.unsubscribe}">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  ${emailId && recipientEmail ? `<img src="/api/email/track/open?emailId=${encodeURIComponent(emailId)}&recipient=${encodeURIComponent(recipientEmail)}" width="1" height="1" alt="" style="display:block; border:0; outline:none;" />` : ''}
</body>
</html>`
}

/**
 * Branded email templates for Better Auth authentication flows
 * Uses inline CSS for maximum email client compatibility
 * Neutral colors work in both light and dark email clients
 */

interface MagicLinkEmailParams {
  url: string
}

interface OtpEmailParams {
  otp: string
  type: 'sign-in' | 'verify'
}

interface AuthEmailTemplate {
  subject: string
  html: string
}

/**
 * Base auth email template with Kickstart branding
 */
function createAuthBaseTemplate(content: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Kickstart</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'JetBrains Mono', 'Courier New', monospace; background-color: #f5f5f5;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e0e0e0;">

          <!-- Header -->
          <tr>
            <td style="padding: 32px 40px; border-bottom: 1px solid #e0e0e0;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #1a1a1a; letter-spacing: -0.5px;">
                Kickstart
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 40px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; border-top: 1px solid #e0e0e0; background-color: #fafafa;">
              <p style="margin: 0; font-size: 12px; line-height: 18px; color: #666666;">
                This email was sent by <strong>Kickstart</strong>. If you didn't request this, you can safely ignore it.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}

/**
 * Generate magic link sign-in email for Better Auth
 */
export function renderMagicLinkEmail({ url }: MagicLinkEmailParams): AuthEmailTemplate {
  const content = `
    <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 600; color: #1a1a1a; line-height: 1.3;">
      Sign in to Kickstart
    </h2>

    <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 22px; color: #333333;">
      Click the button below to sign in to your account. This link will expire in 15 minutes.
    </p>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="background-color: #1a1a1a; padding: 0;">
          <a href="${url}"
             target="_blank"
             rel="noopener noreferrer"
             style="display: inline-block; padding: 14px 32px; font-size: 14px; font-weight: 600; color: #ffffff; text-decoration: none; background-color: #1a1a1a; border: 1px solid #1a1a1a;">
            Sign in to Kickstart
          </a>
        </td>
      </tr>
    </table>

    <p style="margin: 32px 0 0 0; font-size: 13px; line-height: 20px; color: #666666;">
      Or copy and paste this URL into your browser:
    </p>

    <p style="margin: 8px 0 0 0; font-size: 12px; line-height: 18px; color: #666666; word-break: break-all; font-family: 'Courier New', monospace; background-color: #f5f5f5; padding: 12px; border: 1px solid #e0e0e0;">
      ${url}
    </p>
  `

  return {
    subject: 'Sign in to Kickstart',
    html: createAuthBaseTemplate(content),
  }
}

/**
 * Generate OTP sign-in email for Better Auth
 */
export function renderOtpEmail({ otp, type }: OtpEmailParams): AuthEmailTemplate {
  const content = `
    <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 600; color: #1a1a1a; line-height: 1.3;">
      Your sign-in code
    </h2>

    <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 22px; color: #333333;">
      Enter this code to ${type === 'sign-in' ? 'sign in' : 'verify your account'}. This code will expire in 10 minutes.
    </p>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 32px 0;">
      <tr>
        <td style="background-color: #f5f5f5; border: 2px solid #1a1a1a; padding: 20px 32px;">
          <p style="margin: 0; font-size: 36px; font-weight: 700; color: #1a1a1a; letter-spacing: 8px; font-family: 'Courier New', monospace; text-align: center;">
            ${otp}
          </p>
        </td>
      </tr>
    </table>

    <p style="margin: 0; font-size: 13px; line-height: 20px; color: #666666;">
      If you didn't request this code, someone may be trying to access your account. You can safely ignore this email.
    </p>
  `

  return {
    subject: 'Your Kickstart sign-in code',
    html: createAuthBaseTemplate(content),
  }
}
