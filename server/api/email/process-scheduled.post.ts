import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { parse as parseYaml } from 'yaml'
import { sendEmail } from '~~/server/utils/email'
import { renderEmailTemplate } from '~~/server/utils/email-templates'
import { renderMarkdownToEmailHtml } from '~~/server/utils/markdown-to-email'
import { loadUnsubscribedEmails } from '~~/server/utils/unsubscribe'
import { isAdmin } from '~~/shared/utils/abilities'

const FRONTMATTER_RE = /^---\n([\s\S]*?)\n---/
const MD_EXTENSION_RE = /\.md$/
const DOUBLE_QUOTE_RE = /"/g

/**
 * Process scheduled emails
 *
 * This endpoint should be called by a cron job or manual trigger to:
 * 1. Find all drafts with status=scheduled and scheduledAt <= now
 * 2. Send each email to its recipients
 * 3. Update draft status to sent with sentAt timestamp
 *
 * Setup instructions:
 * - For development: manually call POST /api/email/process-scheduled
 * - For production: set up a cron job to call this endpoint every 5-15 minutes
 *   Example cron: every 5 minutes with curl -X POST https://yoursite.com/api/email/process-scheduled
 */
export default defineEventHandler(async (event) => {
  // Require admin authorization
  await authorize(event, isAdmin)

  try {
    // Read all email draft files from filesystem
    const now = new Date()
    // eslint-disable-next-line node/no-process-env
    const isVercel = process.env.VERCEL === '1'
    const draftsDir = isVercel
      ? join('/tmp', 'kickstart', 'content', 'email-drafts')
      : join(process.cwd(), 'content', 'email-drafts')
    await mkdir(draftsDir, { recursive: true })
    const draftFiles = await readdir(draftsDir)

    // Parse each draft file and filter for scheduled drafts ready to send
    const readyToSend: any[] = []

    for (const filename of draftFiles) {
      if (!filename.endsWith('.md') || filename === '.gitkeep')
        continue

      try {
        const filePath = join(draftsDir, filename)
        const fileContent = await readFile(filePath, 'utf-8')

        // Extract frontmatter (content between --- markers)
        const frontmatterMatch = fileContent.match(FRONTMATTER_RE)
        if (!frontmatterMatch || !frontmatterMatch[1])
          continue

        const frontmatter = parseYaml(frontmatterMatch[1])

        // Check if draft is scheduled and ready to send
        if (frontmatter.status === 'scheduled' && frontmatter.scheduledAt) {
          const scheduledDate = new Date(frontmatter.scheduledAt)
          if (scheduledDate <= now) {
            readyToSend.push({ ...frontmatter, _filename: filename })
          }
        }
      }
      catch {
        // Skip malformed draft files silently
      }
    }

    // Load unsubscribed emails once for all drafts
    const unsubscribedEmails = await loadUnsubscribedEmails()

    const results = {
      processed: 0,
      successful: 0,
      failed: 0,
      errors: [] as Array<{ draftId: string, error: string }>,
    }

    // Process each draft
    for (const draft of readyToSend) {
      results.processed++

      try {
        // Validate draft has required fields
        if (!draft.subject || !draft.body || !draft.template) {
          throw new Error('Draft missing required fields (subject, body, or template)')
        }

        if (!draft.recipients || draft.recipients.length === 0) {
          throw new Error('Draft has no recipients')
        }

        // Filter out unsubscribed recipients
        const filteredRecipients = draft.recipients.filter(
          (email: string) => !unsubscribedEmails.includes(email),
        )

        // Check if any recipients remain after filtering
        if (filteredRecipients.length === 0) {
          continue
        }

        // Use draft filename (without .md) as emailId for tracking
        const emailId = draft._filename.replace(MD_EXTENSION_RE, '')

        // Send to each recipient
        for (const recipient of filteredRecipients) {
          try {
            // Render email content with click tracking
            const htmlContent = renderMarkdownToEmailHtml(draft.body, {
              emailId,
              recipient,
            })

            // Wrap in email template with recipient-specific unsubscribe link and tracking
            const htmlEmail = renderEmailTemplate(htmlContent, draft.template as any, {
              subject: draft.subject,
              recipientEmail: recipient,
              emailId,
            })

            await sendEmail({
              to: recipient,
              subject: draft.subject,
              html: htmlEmail,
            })
          }
          catch {
            // Individual send failures don't block the batch
          }
        }

        // Get draft filename
        const draftFilename = draft._filename
        const draftPath = join(draftsDir, draftFilename)

        // Build updated frontmatter
        const yamlLines = [
          '---',
          `title: "${draft.subject.replace(DOUBLE_QUOTE_RE, '\\"')}"`,
          `subject: "${draft.subject.replace(DOUBLE_QUOTE_RE, '\\"')}"`,
          'body: |',
          ...draft.body.split('\n').map((line: string) => `  ${line}`),
          `template: ${draft.template}`,
          `recipientMode: ${draft.recipientMode || 'manual'}`,
          'recipients:',
          ...draft.recipients.map((r: string) => `  - "${r}"`),
          ...(draft.listSlug ? [`listSlug: "${draft.listSlug}"`] : []),
          `scheduledAt: "${draft.scheduledAt}"`,
          'status: sent',
          `sentAt: "${new Date().toISOString()}"`,
          `createdAt: "${draft.createdAt || new Date().toISOString()}"`,
          '---',
          '',
        ]

        const fileContent = yamlLines.join('\n')
        await writeFile(draftPath, fileContent, 'utf-8')

        results.successful++
      }
      catch (error) {
        results.failed++
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        const draftId = draft._filename || 'unknown'
        results.errors.push({
          draftId,
          error: errorMessage,
        })
      }
    }

    return {
      success: true,
      processed: results.processed,
      successful: results.successful,
      failed: results.failed,
      errors: results.errors.length > 0 ? results.errors : undefined,
    }
  }
  catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to process scheduled emails',
      message: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})
