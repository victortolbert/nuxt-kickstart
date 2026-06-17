import { access, rename } from 'node:fs/promises'

export default defineEventHandler(async (event) => {
  requireDevContentEditing()
  const collection = validateCollection(getRouterParam(event, 'collection'))
  const slug = validateSlug(getRouterParam(event, 'slug'))

  const fromPath = trashFilePath(collection, slug)

  try {
    await access(fromPath)
  }
  catch {
    throw createError({ statusCode: 404, message: `Content ${collection}/${slug} not found in trash` })
  }

  const destinationPath = contentFilePath(collection, slug)

  try {
    await rename(fromPath, destinationPath)

    const manifest = await readTrashManifest()
    delete manifest[trashKey(collection, slug)]
    await writeTrashManifest(manifest)

    return { message: 'Restored', path: destinationPath }
  }
  catch {
    throw createError({ statusCode: 500, message: `Failed to restore ${collection}/${slug} from trash` })
  }
})
