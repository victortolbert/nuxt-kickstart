import { access, mkdir, rename } from 'node:fs/promises'

export default defineEventHandler(async (event) => {
  requireDevContentEditing()
  const collection = validateCollection(getRouterParam(event, 'collection'))
  const slug = validateSlug(getRouterParam(event, 'slug'))

  const filePath = contentFilePath(collection, slug)

  try {
    await access(filePath)
  }
  catch {
    throw createError({ statusCode: 404, message: `Content ${collection}/${slug} does not exist` })
  }

  try {
    await mkdir(trashDir(collection), { recursive: true })
    await rename(filePath, trashFilePath(collection, slug))

    const manifest = await readTrashManifest()
    manifest[trashKey(collection, slug)] = {
      slug,
      collection,
      deletedAt: new Date().toISOString(),
      originalPath: filePath,
    }
    await writeTrashManifest(manifest)

    return { message: 'Moved to trash' }
  }
  catch {
    throw createError({ statusCode: 500, message: `Failed to move ${collection}/${slug} to trash` })
  }
})
