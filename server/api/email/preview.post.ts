import type { EmailTemplate } from '../../utils/email-templates'
import { renderEmailTemplate } from '../../utils/email-templates'
import { renderMarkdownToEmailHtml } from '../../utils/markdown-to-email'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Validate request body
  if (!body || typeof body.markdown !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request: markdown field is required',
    })
  }

  const markdown = body.markdown as string
  const template = (body.template as EmailTemplate) || 'newsletter'
  const subject = (body.subject as string) || 'Preview'

  try {
    // Convert markdown to email HTML
    const emailContent = renderMarkdownToEmailHtml(markdown)

    // Wrap in email template
    const renderedHtml = renderEmailTemplate(emailContent, template, {
      subject,
      unsubscribeUrl: '#',
    })

    return {
      success: true,
      html: renderedHtml,
    }
  }
  catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to render email preview',
      data: error,
    })
  }
})
