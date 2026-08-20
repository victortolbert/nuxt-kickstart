import { describe, expect, it } from 'vitest'
import { renderMagicLinkEmail, renderOtpEmail } from '../../server/utils/email-templates'

// These two renderers are the only remaining consumers of this module, and
// server/auth.ts is their only caller. Password auth is disabled, so a
// regression here breaks sign-in outright.

describe('renderMagicLinkEmail', () => {
  it('embeds the sign-in URL in the button href', () => {
    const url = 'https://example.com/api/auth/magic-link/verify?token=abc123'
    const { html } = renderMagicLinkEmail({ url })

    expect(html).toContain(`href="${url}"`)
  })

  it('opens the link safely in a new tab', () => {
    const { html } = renderMagicLinkEmail({ url: 'https://example.com/verify' })

    expect(html).toContain('target="_blank"')
    expect(html).toContain('rel="noopener noreferrer"')
  })

  it('returns the sign-in subject', () => {
    expect(renderMagicLinkEmail({ url: 'https://example.com' }).subject)
      .toBe('Sign in to Kickstart')
  })
})

describe('renderOtpEmail', () => {
  it('renders the one-time code', () => {
    const { html } = renderOtpEmail({ otp: '482913', type: 'sign-in' })

    expect(html).toContain('482913')
  })

  it('varies the instruction by type but keeps one subject', () => {
    const signIn = renderOtpEmail({ otp: '111111', type: 'sign-in' })
    const verify = renderOtpEmail({ otp: '111111', type: 'verify' })

    expect(signIn.html).toContain('Enter this code to sign in')
    expect(verify.html).toContain('Enter this code to verify your account')
    expect(signIn.subject).toBe('Your Kickstart sign-in code')
    expect(verify.subject).toBe(signIn.subject)
  })

  it('warns the reader when they did not request the code', () => {
    const { html } = renderOtpEmail({ otp: '000000', type: 'sign-in' })

    expect(html).toContain('someone may be trying to access your account')
  })
})
