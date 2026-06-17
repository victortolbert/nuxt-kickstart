import { describe, expect, it } from 'vitest'
import { renderEmailTemplate } from '../../server/utils/email-templates'

describe('renderEmailTemplate', () => {
  it('includes subject and content in the output', () => {
    const html = renderEmailTemplate('<p>Hello</p>', 'newsletter', { subject: 'Hello World' })
    expect(html).toContain('<title>Hello World</title>')
    expect(html).toContain('Hello World')
    expect(html).toContain('<p>Hello</p>')
  })

  it('renders preheader content when provided', () => {
    const html = renderEmailTemplate('<p>Body</p>', 'announcement', {
      subject: 'Update',
      preheader: 'Quick summary',
    })
    expect(html).toContain('Quick summary')
    expect(html).toContain('preheader')
  })

  it('generates an unsubscribe link from recipient email when not provided', () => {
    const html = renderEmailTemplate('<p>Body</p>', 'newsletter', {
      subject: 'Newsletter',
      recipientEmail: 'test@example.com',
    })
    expect(html).toContain('/api/email/unsubscribe?token=dGVzdEBleGFtcGxlLmNvbQ==')
  })

  it('uses an explicit unsubscribe URL when provided', () => {
    const html = renderEmailTemplate('<p>Body</p>', 'newsletter', {
      subject: 'Newsletter',
      recipientEmail: 'test@example.com',
      unsubscribeUrl: 'https://example.com/unsub',
    })
    expect(html).toContain('https://example.com/unsub')
  })

  it('adds a tracking pixel when emailId and recipientEmail are set', () => {
    const html = renderEmailTemplate('<p>Body</p>', 'personal', {
      subject: 'Hello',
      recipientEmail: 'test@example.com',
      emailId: 'email-123',
    })
    expect(html).toContain('emailId=email-123')
    expect(html).toContain('recipient=test%40example.com')
  })
})
