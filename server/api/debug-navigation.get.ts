export default defineEventHandler(async () => {
  try {
    const storage = useStorage('assets:navigation')
    const keys = await storage.getKeys()

    const debug = {
      storageKeys: keys,
      itemCount: keys.length,
      items: [] as any[],
    }

    for (const key of keys) {
      const item = await storage.getItem(key)
      debug.items.push({
        key,
        type: typeof item,
        value: item,
      })
    }

    return debug
  }
  catch (error) {
    return {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    }
  }
})
