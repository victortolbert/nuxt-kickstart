import { Buffer } from 'node:buffer'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const EMAIL_RE = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/
const FRONTMATTER_RE = /---\n([\s\S]*?)\n---/
const EMAILS_ARRAY_RE = /emails:\s*\[(.*?)\]/s
const QUOTES_RE = /['"]/g

/**
 * Unsubscribe endpoint
 * Accepts a token query parameter (base64 encoded email)
 * Adds email to unsubscribe list and redirects to confirmation page
 */
export default defineEventHandler(async (event) => {
  // Get token from query params
  const query = getQuery(event)
  const token = query.token as string | undefined

  // Validate token
  if (!token || typeof token !== 'string') {
    return sendRedirect(event, '/unsubscribe?success=false&error=invalid-token')
  }

  // Decode token to get email
  let email: string
  try {
    email = Buffer.from(token, 'base64').toString('utf-8')
  }
  catch {
    return sendRedirect(event, '/unsubscribe?success=false&error=invalid-token')
  }

  // Validate email format
  if (!EMAIL_RE.test(email)) {
    return sendRedirect(event, '/unsubscribe?success=false&error=invalid-email')
  }

  // eslint-disable-next-line node/no-process-env
  const isVercel = process.env.VERCEL === '1'
  const contentDir = isVercel
    ? join('/tmp', 'kickstart', 'content', 'email-unsubscribes')
    : join(process.cwd(), 'content', 'email-unsubscribes')
  const filePath = join(contentDir, 'unsubscribed.md')

  try {
    // Read existing unsubscribe list (if exists)
    let existingEmails: string[] = []
    try {
      const fileContent = await readFile(filePath, 'utf-8')
      // Extract emails from frontmatter
      const frontmatterMatch = fileContent.match(FRONTMATTER_RE)
      if (frontmatterMatch?.[1]) {
        const frontmatter = frontmatterMatch[1]
        const emailsMatch = frontmatter.match(EMAILS_ARRAY_RE)
        if (emailsMatch?.[1]) {
          const emailsStr = emailsMatch[1]
          existingEmails = emailsStr
            .split(',')
            .map(e => e.trim().replace(QUOTES_RE, ''))
            .filter(e => e.length > 0)
        }
      }
    }
    catch {
      // File doesn't exist yet, that's fine
    }

    // Check if email already unsubscribed
    if (existingEmails.includes(email)) {
      return sendRedirect(event, '/unsubscribe?success=true&already=true')
    }

    // Add email to list
    existingEmails.push(email)

    // Build frontmatter
    const frontmatter = {
      title: 'Unsubscribed Emails',
      tags: ['email-unsubscribe'],
      status: 'evergreen',
      visibility: 'private',
      emails: existingEmails,
      updatedAt: new Date().toISOString().split('T')[0],
    }

    // Build markdown content
    const lines = ['---']
    for (const [key, value] of Object.entries(frontmatter)) {
      if (value === undefined || value === null)
        continue

      if (key === 'emails') {
        lines.push(`emails: [${existingEmails.map(e => `'${e}'`).join(', ')}]`)
      }
      else if (Array.isArray(value)) {
        lines.push(`${key}: [${value.map(v => `'${v}'`).join(', ')}]`)
      }
      else if (typeof value === 'string') {
        lines.push(`${key}: '${value}'`)
      }
      else if (typeof value === 'boolean' || typeof value === 'number') {
        lines.push(`${key}: ${value}`)
      }
    }
    lines.push('---', '', '# Unsubscribed Emails', '', `Total unsubscribed: ${existingEmails.length}`, '')

    const content = lines.join('\n')

    await mkdir(contentDir, { recursive: true })
    // Write updated list
    await writeFile(filePath, content, 'utf-8')

    // Redirect to success page
    return sendRedirect(event, '/unsubscribe?success=true')
  }
  catch (error) {
    console.error('Unsubscribe error:', error)
    return sendRedirect(event, '/unsubscribe?success=false&error=server-error')
  }
})
