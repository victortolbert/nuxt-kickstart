import { writeFile } from 'node:fs/promises'

export default defineEventHandler(async (event) => {
  requireDevContentEditing()
  const collection = validateCollection(getRouterParam(event, 'collection'))
  const { frontmatter, body } = validateEditorPayload(await readBody(event))

  if (!frontmatter.title || typeof frontmatter.title !== 'string' || frontmatter.title.trim().length === 0) {
    throw createError({ statusCode: 400, message: 'frontmatter.title is required' })
  }

  const provided = frontmatter.slug
  const slug = (typeof provided === 'string' && provided.trim().length > 0)
    ? provided
    : slugFromTitle(frontmatter.title)

  const filePath = contentFilePath(collection, slug)

  try {
    await writeFile(filePath, serializeMarkdown(frontmatter, body), 'utf-8')
    setResponseStatus(event, 201)
    return { slug, path: filePath }
  }
  catch {
    throw createError({ statusCode: 500, message: `Failed to create ${collection} content` })
  }
})
