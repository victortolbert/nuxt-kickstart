import { access, unlink } from 'node:fs/promises'

export default defineEventHandler(async (event) => {
  requireDevContentEditing()
  const collection = validateCollection(getRouterParam(event, 'collection'))
  const slug = validateSlug(getRouterParam(event, 'slug'))

  const filePath = trashFilePath(collection, slug)

  try {
    await access(filePath)
  }
  catch {
    throw createError({ statusCode: 404, message: `Content ${collection}/${slug} not found in trash` })
  }

  try {
    await unlink(filePath)

    const manifest = await readTrashManifest()
    delete manifest[trashKey(collection, slug)]
    await writeTrashManifest(manifest)

    return { message: 'Permanently deleted' }
  }
  catch {
    throw createError({ statusCode: 500, message: `Failed to permanently delete ${collection}/${slug}` })
  }
})
