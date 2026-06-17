import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

const FRONTMATTER_RE = /---\n([\s\S]*?)\n---/
const EMAILS_ARRAY_RE = /emails:\s*\[(.*?)\]/s
const QUOTES_RE = /['"]/g

/**
 * Load unsubscribed emails from the unsubscribe list file
 */
export async function loadUnsubscribedEmails(): Promise<string[]> {
  // eslint-disable-next-line node/no-process-env
  const isVercel = process.env.VERCEL === '1'
  const contentDir = isVercel
    ? join('/tmp', 'kickstart', 'content', 'email-unsubscribes')
    : join(process.cwd(), 'content', 'email-unsubscribes')
  const filePath = join(contentDir, 'unsubscribed.md')

  try {
    const fileContent = await readFile(filePath, 'utf-8')
    // Extract emails from frontmatter
    const frontmatterMatch = fileContent.match(FRONTMATTER_RE)
    if (frontmatterMatch?.[1]) {
      const frontmatter = frontmatterMatch[1]
      const emailsMatch = frontmatter.match(EMAILS_ARRAY_RE)
      if (emailsMatch?.[1]) {
        const emailsStr = emailsMatch[1]
        return emailsStr
          .split(',')
          .map(e => e.trim().replace(QUOTES_RE, ''))
          .filter(e => e.length > 0)
      }
    }
  }
  catch {
    // File doesn't exist yet or couldn't be read
    return []
  }

  return []
}
