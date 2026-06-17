import type { NavGroup } from '~~/shared/types/navigation'
import YAML from 'yaml'

export default defineEventHandler(async () => {
  try {
    const storage = useStorage('assets:navigation')
    const keys = await storage.getKeys()

    const groups: NavGroup[] = []

    for (const key of keys) {
      const item = await storage.getItem(key)
      if (!item)
        continue

      // Parse YAML string to object
      const parsed = typeof item === 'string'
        ? YAML.parse(item) as NavGroup
        : item as NavGroup

      // Validate and add
      if (parsed?.id) {
        groups.push(parsed)
      }
    }

    // Sort by order
    groups.sort((a, b) => (a.order || 0) - (b.order || 0))

    return groups
  }
  catch (error) {
    console.error('Failed to load navigation config:', error)
    return []
  }
})
