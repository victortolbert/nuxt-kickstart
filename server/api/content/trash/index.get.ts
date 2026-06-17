import { access } from 'node:fs/promises'

export default defineEventHandler(async () => {
  requireDevContentEditing()

  const manifest = await readTrashManifest()

  // Verify file existence; filter out stale manifest entries
  const items = await Promise.all(
    Object.values(manifest).map(async (entry) => {
      try {
        await access(trashFilePath(entry.collection as AllowedCollection, entry.slug))
        return { ...entry, exists: true }
      }
      catch {
        return { ...entry, exists: false }
      }
    }),
  )

  return items.filter(item => item.exists)
})
