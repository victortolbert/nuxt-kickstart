import { access, writeFile } from 'node:fs/promises'

export default defineEventHandler(async (event) => {
  requireDevContentEditing()
  const collection = validateCollection(getRouterParam(event, 'collection'))
  const slug = validateSlug(getRouterParam(event, 'slug'))
  const { frontmatter, body } = validateEditorPayload(await readBody(event))

  const filePath = contentFilePath(collection, slug)

  try {
    await access(filePath)
  }
  catch {
    throw createError({ statusCode: 404, message: `Content ${collection}/${slug} does not exist` })
  }

  try {
    await writeFile(filePath, serializeMarkdown(frontmatter, body), 'utf-8')
    return { slug, path: filePath }
  }
  catch {
    throw createError({ statusCode: 500, message: `Failed to update ${collection} content` })
  }
})
