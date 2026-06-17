import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { isAdmin } from '~~/shared/utils/abilities'

const DOUBLE_QUOTE_RE = /"/g

export default defineEventHandler(async (event) => {
  // Require admin authorization
  await authorize(event, isAdmin)

  // Parse request body
  const body = await readBody(event)

  const {
    subject,
    body: emailBody,
    template,
    recipientMode,
    recipients,
    listSlug,
  } = body

  // Validate required fields
  if (!subject || typeof subject !== 'string') {
    throw createError({
      statusCode: 400,
      message: 'Subject is required',
    })
  }

  if (!emailBody || typeof emailBody !== 'string') {
    throw createError({
      statusCode: 400,
      message: 'Email body is required',
    })
  }

  if (!template || !['newsletter', 'announcement', 'personal'].includes(template)) {
    throw createError({
      statusCode: 400,
      message: 'Valid template is required (newsletter, announcement, or personal)',
    })
  }

  if (!recipientMode || !['manual', 'list'].includes(recipientMode)) {
    throw createError({
      statusCode: 400,
      message: 'Valid recipient mode is required (manual or list)',
    })
  }

  if (!Array.isArray(recipients)) {
    throw createError({
      statusCode: 400,
      message: 'Recipients must be an array',
    })
  }

  try {
    // Generate unique draft ID using timestamp
    const timestamp = Date.now()
    const draftId = `draft-${timestamp}`
    const slug = draftId

    // Convert data to YAML string
    const yamlLines = [
      '---',
      `title: "${subject.replace(DOUBLE_QUOTE_RE, '\\"')}"`,
      `subject: "${subject.replace(DOUBLE_QUOTE_RE, '\\"')}"`,
      `body: |`,
      ...emailBody.split('\n').map((line: string) => `  ${line}`),
      `template: ${template}`,
      `recipientMode: ${recipientMode}`,
      'recipients:',
      ...recipients.map((email: string) => `  - "${email}"`),
      ...(listSlug ? [`listSlug: "${listSlug}"`] : []),
      'status: draft',
      `createdAt: "${new Date().toISOString()}"`,
      '---',
      '',
    ]

    const fileContent = yamlLines.join('\n')

    // eslint-disable-next-line node/no-process-env
    const isVercel = process.env.VERCEL === '1'
    const draftDir = isVercel
      ? join('/tmp', 'kickstart', 'content', 'email-drafts')
      : join(process.cwd(), 'content', 'email-drafts')
    // Ensure directory exists
    await mkdir(draftDir, { recursive: true })

    // Write file
    const filePath = join(draftDir, `${slug}.md`)
    await writeFile(filePath, fileContent, 'utf-8')

    return {
      success: true,
      id: draftId,
      slug,
      path: filePath,
    }
  }
  catch (error: any) {
    console.error('Failed to create draft:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to create draft',
    })
  }
})
