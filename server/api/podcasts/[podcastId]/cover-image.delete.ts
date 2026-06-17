import { access, readFile, unlink, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const FRONTMATTER_WITH_BODY_RE = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/
const COVER_IMAGE_FIELD_RE = /^coverImage:\s*(\S+)/m
const COVER_IMAGE_LINE_RE = /^coverImage:.*\n?/m
const LEADING_SLASH_RE = /^\//

// Pattern: Cover image edited independently from other podcast fields
// DELETE /podcasts/[podcastId]/cover-image removes the cover image file and clears the coverImage field

export default defineEventHandler(async (event) => {
  // Require authentication
  const session = await getUserSession(event)
  if (!session.user) {
    throw createError({
      statusCode: 401,
      message: 'Authentication required',
    })
  }

  // Get podcastId from route params
  const podcastId = getRouterParam(event, 'podcastId')
  if (!podcastId) {
    throw createError({
      statusCode: 400,
      message: 'podcastId is required',
    })
  }

  // Locate podcast file
  const contentDir = join(process.cwd(), 'content', 'examples', 'podcasts')
  const filePath = join(contentDir, `${podcastId}.md`)

  try {
    await access(filePath)
  }
  catch {
    throw createError({
      statusCode: 404,
      message: `Podcast ${podcastId} not found`,
    })
  }

  // Read current podcast content
  const content = await readFile(filePath, 'utf-8')

  // Parse frontmatter and body
  const frontmatterMatch = content.match(FRONTMATTER_WITH_BODY_RE)
  if (!frontmatterMatch) {
    throw createError({
      statusCode: 500,
      message: 'Invalid podcast file format',
    })
  }

  const frontmatterText = frontmatterMatch[1]!
  const bodyText = frontmatterMatch[2]!

  // Get current coverImage path
  const coverImageMatch = frontmatterText.match(COVER_IMAGE_FIELD_RE)
  const coverImagePath = coverImageMatch?.[1]

  // Delete the image file if it exists
  if (coverImagePath) {
    const publicDir = join(process.cwd(), 'public')
    const imageFilePath = join(publicDir, coverImagePath.replace(LEADING_SLASH_RE, ''))

    try {
      await access(imageFilePath)
      await unlink(imageFilePath)
    }
    catch {
      // Image file doesn't exist or can't be deleted - continue anyway
    }
  }

  // Remove coverImage field from frontmatter
  const updatedFrontmatter = frontmatterText.replace(COVER_IMAGE_LINE_RE, '')

  // Write updated content
  const updatedContent = `---\n${updatedFrontmatter}\n---\n${bodyText}`
  await writeFile(filePath, updatedContent, 'utf-8')

  return {
    podcastId,
    message: 'Cover image removed successfully',
  }
})
