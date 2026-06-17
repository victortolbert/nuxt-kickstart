import { Buffer } from 'node:buffer'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const FRONTMATTER_RE = /^---\n([\s\S]*?)\n---/
const OPENS_YAML_RE = /opens:\n((?: {2}- timestamp: .+\n)+)/
const CLICKS_YAML_RE = /clicks:\n((?: {2}- timestamp: .+\n {4}url: .+\n)+)/
const TIMESTAMP_RE = /timestamp: (.+)/
const URL_RE = /url: (.+)/

/**
 * Email open tracking endpoint
 *
 * Records when a recipient opens an email by tracking a 1x1 transparent pixel.
 *
 * Query params:
 * - emailId: The draft/email ID
 * - recipient: The recipient's email address
 *
 * Returns a 1x1 transparent PNG image
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const emailId = query.emailId as string
  const recipient = query.recipient as string

  // Validate params
  if (!emailId || !recipient) {
    // Return transparent pixel even on error to avoid broken images
    return sendTransparentPixel(event)
  }

  try {
    // Record the open event
    await logOpenEvent(emailId, recipient)
  }
  catch (error) {
    // Log error but still return pixel to avoid broken images
    console.error('Failed to log open event:', error)
  }

  // Always return transparent pixel
  return sendTransparentPixel(event)
})

/**
 * Log an open event to the analytics collection
 */
async function logOpenEvent(emailId: string, recipient: string): Promise<void> {
  // eslint-disable-next-line node/no-process-env
  const isVercel = process.env.VERCEL === '1'
  const analyticsDir = isVercel
    ? join('/tmp', 'kickstart', 'content', 'email-analytics')
    : join(process.cwd(), 'content', 'email-analytics')
  const filename = `${emailId}-${encodeURIComponent(recipient)}.md`
  const filepath = join(analyticsDir, filename)

  // Ensure directory exists
  if (!existsSync(analyticsDir)) {
    mkdirSync(analyticsDir, { recursive: true })
  }

  let opens: Array<{ timestamp: string }> = []
  let clicks: Array<{ timestamp: string, url: string }> = []

  // Read existing analytics if file exists
  if (existsSync(filepath)) {
    const content = readFileSync(filepath, 'utf-8')
    const frontmatterMatch = content.match(FRONTMATTER_RE)

    if (frontmatterMatch && frontmatterMatch[1]) {
      const yamlContent = frontmatterMatch[1]
      // Parse existing opens and clicks arrays
      const opensMatch = yamlContent.match(OPENS_YAML_RE)
      const clicksMatch = yamlContent.match(CLICKS_YAML_RE)

      if (opensMatch && opensMatch[1]) {
        const openLines = opensMatch[1].trim().split('\n')
        opens = openLines.map((line) => {
          const timestamp = line.match(TIMESTAMP_RE)?.[1] || ''
          return { timestamp }
        })
      }

      if (clicksMatch && clicksMatch[1]) {
        const clickLines = clicksMatch[1].trim().split('\n')
        const clickObjects: Array<{ timestamp: string, url: string }> = []
        for (let i = 0; i < clickLines.length; i += 2) {
          const timestamp = clickLines[i]?.match(TIMESTAMP_RE)?.[1] || ''
          const url = clickLines[i + 1]?.match(URL_RE)?.[1] || ''
          if (timestamp && url) {
            clickObjects.push({ timestamp, url })
          }
        }
        clicks = clickObjects
      }
    }
  }

  // Add new open event
  opens.push({ timestamp: new Date().toISOString() })

  // Build YAML frontmatter
  const frontmatter = [
    '---',
    `title: Analytics for ${emailId}`,
    `emailId: ${emailId}`,
    `recipient: ${recipient}`,
    'opens:',
    ...opens.map(o => `  - timestamp: ${o.timestamp}`),
    'clicks:',
    ...clicks.map(c => `  - timestamp: ${c.timestamp}\n    url: ${c.url}`),
    '---',
    '',
  ].join('\n')

  // Write updated analytics file
  writeFileSync(filepath, frontmatter, 'utf-8')
}

/**
 * Send a 1x1 transparent PNG image
 */
function sendTransparentPixel(event: any) {
  // 1x1 transparent PNG (base64)
  const pixel = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64',
  )

  setHeader(event, 'Content-Type', 'image/png')
  setHeader(event, 'Content-Length', pixel.length)
  setHeader(event, 'Cache-Control', 'no-cache, no-store, must-revalidate')
  setHeader(event, 'Pragma', 'no-cache')
  setHeader(event, 'Expires', '0')

  return pixel
}
