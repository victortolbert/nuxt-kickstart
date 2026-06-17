import fs from 'node:fs'
import path from 'node:path'
import yaml from 'yaml'

const FRONTMATTER_RE = /^---\n([\s\S]*?)\n---/

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const emailId = query.emailId as string | undefined
  const recipient = query.recipient as string | undefined
  const url = query.url as string | undefined

  // Always redirect to the target URL, even if logging fails
  if (!url) {
    return sendRedirect(event, '/', 302)
  }

  // Log click event if we have the required tracking params
  if (emailId && recipient) {
    try {
      // eslint-disable-next-line node/no-process-env
      const isVercel = process.env.VERCEL === '1'
      const analyticsDir = isVercel
        ? path.join('/tmp', 'kickstart', 'content', 'email-analytics')
        : path.join(process.cwd(), 'content', 'email-analytics')
      const filename = `${emailId}-${recipient}.md`
      const filepath = path.join(analyticsDir, filename)
      fs.mkdirSync(analyticsDir, { recursive: true })

      let frontmatter: Record<string, any> = {
        emailId,
        recipient,
        opens: [],
        clicks: [],
      }

      // Load existing analytics if file exists
      if (fs.existsSync(filepath)) {
        const content = fs.readFileSync(filepath, 'utf-8')
        const match = content.match(FRONTMATTER_RE)
        if (match?.[1]) {
          frontmatter = yaml.parse(match[1]) || frontmatter
        }
      }

      // Ensure clicks array exists
      if (!Array.isArray(frontmatter.clicks)) {
        frontmatter.clicks = []
      }

      // Add click event
      frontmatter.clicks.push({
        timestamp: new Date().toISOString(),
        url,
      })

      // Write updated frontmatter
      const updatedContent = `---\n${yaml.stringify(frontmatter)}---\n`
      fs.writeFileSync(filepath, updatedContent, 'utf-8')
    }
    catch (error) {
      console.error('Failed to log click event:', error)
      // Continue with redirect even if logging fails
    }
  }

  // Redirect to original URL
  return sendRedirect(event, url, 302)
})
