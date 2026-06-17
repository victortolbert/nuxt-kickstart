import { access, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

// Pattern: Cover image edited independently from other podcast fields
// PUT /podcasts/[podcastId]/cover-image updates only the coverImage property

const FRONTMATTER_RE = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/
const COVER_IMAGE_RE = /^coverImage:/m
const COVER_IMAGE_LINE_RE = /^coverImage:.*$/m
const AUTHOR_LINE_RE = /^(author:.*)$/m

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

  // Read multipart form data
  const formData = await readMultipartFormData(event)
  if (!formData || formData.length === 0) {
    throw createError({
      statusCode: 400,
      message: 'No file uploaded',
    })
  }

  // Get the uploaded file
  const fileData = formData.find(item => item.name === 'image')
  if (!fileData || !fileData.data) {
    throw createError({
      statusCode: 400,
      message: 'Image file is required',
    })
  }

  // Validate file type (basic check)
  const filename = fileData.filename || 'upload'
  const ext = filename.split('.').pop()?.toLowerCase()
  const allowedExts = ['jpg', 'jpeg', 'png', 'webp', 'gif']
  if (!ext || !allowedExts.includes(ext)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid file type. Allowed: jpg, jpeg, png, webp, gif',
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

  // Save image to public/img/podcasts/
  const publicDir = join(process.cwd(), 'public', 'img', 'podcasts')
  const imageFilename = `${podcastId}.${ext}`
  const imagePath = join(publicDir, imageFilename)
  await writeFile(imagePath, fileData.data)

  // Read current podcast content
  const content = await readFile(filePath, 'utf-8')

  // Parse frontmatter and body
  const frontmatterMatch = content.match(FRONTMATTER_RE)
  if (!frontmatterMatch) {
    throw createError({
      statusCode: 500,
      message: 'Invalid podcast file format',
    })
  }

  const frontmatterText = frontmatterMatch[1]!
  const bodyText = frontmatterMatch[2]!

  // Update coverImage field
  const coverImagePath = `/img/podcasts/${imageFilename}`
  let updatedFrontmatter: string

  if (COVER_IMAGE_RE.test(frontmatterText)) {
    updatedFrontmatter = frontmatterText.replace(COVER_IMAGE_LINE_RE, `coverImage: ${coverImagePath}`)
  }
  else {
    updatedFrontmatter = frontmatterText.replace(AUTHOR_LINE_RE, `$1\ncoverImage: ${coverImagePath}`)
  }

  // Write updated content
  const updatedContent = `---\n${updatedFrontmatter}\n---\n${bodyText}`
  await writeFile(filePath, updatedContent, 'utf-8')

  return {
    podcastId,
    coverImage: coverImagePath,
    message: 'Cover image updated successfully',
  }
})
