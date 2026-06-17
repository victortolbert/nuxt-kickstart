import { access, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const FRONTMATTER_WITH_BODY_RE = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/
const STATUS_FIELD_RE = /^status:\s*(\S+)$/m
const STATUS_VALUE_RE = /^status:\s*\S+$/m

// Pattern: Publishing is a state change modeled as Store/Destroy on state resource
// DELETE /published-episodes/[id] destroys "published" state by changing status from published to draft

export default defineEventHandler(async (event) => {
  // Require authentication
  const session = await getUserSession(event)
  if (!session.user) {
    throw createError({
      statusCode: 401,
      message: 'Authentication required',
    })
  }

  // Get episode slug from route param
  const episodeSlug = getRouterParam(event, 'id')

  // Validate episodeSlug
  if (!episodeSlug || typeof episodeSlug !== 'string') {
    throw createError({
      statusCode: 400,
      message: 'Episode slug is required',
    })
  }

  // Locate episode file
  const contentDir = join(process.cwd(), 'content', 'examples', 'episodes')
  const filePath = join(contentDir, `${episodeSlug}.md`)

  try {
    await access(filePath)
  }
  catch {
    throw createError({
      statusCode: 404,
      message: `Episode ${episodeSlug} not found`,
    })
  }

  // Read current content
  const content = await readFile(filePath, 'utf-8')

  // Parse frontmatter and body
  const frontmatterMatch = content.match(FRONTMATTER_WITH_BODY_RE)
  if (!frontmatterMatch) {
    throw createError({
      statusCode: 500,
      message: 'Invalid episode file format',
    })
  }

  const frontmatterText = frontmatterMatch[1]!
  const bodyText = frontmatterMatch[2]!

  // Check current status
  const statusMatch = frontmatterText.match(STATUS_FIELD_RE)
  const currentStatus = statusMatch?.[1]?.trim()

  if (currentStatus === 'draft') {
    throw createError({
      statusCode: 400,
      message: 'Episode is already a draft',
    })
  }

  // Update status to draft
  const updatedFrontmatter = frontmatterText.replace(STATUS_VALUE_RE, 'status: draft')

  // Write updated content
  const updatedContent = `---\n${updatedFrontmatter}\n---\n${bodyText}`
  await writeFile(filePath, updatedContent, 'utf-8')

  return {
    episodeSlug,
    status: 'draft',
    message: 'Episode unpublished successfully',
  }
})
