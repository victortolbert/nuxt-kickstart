import { computed, readonly, ref, useRoute, useRouter } from '#imports'

interface CollectionFilters {
  search: string
  statuses: string[]
  visibilities: string[]
}

interface FilterableItem {
  title: string
  status?: string
  visibility?: string
  description?: string
  tags?: string[]
}

export function useCollectionFilters() {
  const route = useRoute()
  const router = useRouter()

  // Initialize from URL query params
  const search = ref<string>((route.query.search as string) || '')
  const statuses = ref<string[]>(
    route.query.statuses
      ? (route.query.statuses as string).split(',')
      : [],
  )
  const visibilities = ref<string[]>(
    route.query.visibilities
      ? (route.query.visibilities as string).split(',')
      : [],
  )

  // Sync filter state to URL query params
  function updateFilters(filters: CollectionFilters) {
    search.value = filters.search
    statuses.value = filters.statuses
    visibilities.value = filters.visibilities

    // Update URL query params
    const query: Record<string, string> = {}

    if (filters.search) {
      query.search = filters.search
    }
    if (filters.statuses.length > 0) {
      query.statuses = filters.statuses.join(',')
    }
    if (filters.visibilities.length > 0) {
      query.visibilities = filters.visibilities.join(',')
    }

    router.push({ query })
  }

  // Computed filter function that can be applied to any collection
  const applyFilters = computed(() => {
    return <T extends FilterableItem>(items: T[]): T[] => {
      return items.filter((item) => {
        // Search filter: check title, description, and tags
        if (search.value) {
          const searchLower = search.value.toLowerCase()
          const matchesTitle = item.title.toLowerCase().includes(searchLower)
          const matchesDescription = item.description?.toLowerCase().includes(searchLower)
          const matchesTags = item.tags?.some(tag => tag.toLowerCase().includes(searchLower))

          if (!matchesTitle && !matchesDescription && !matchesTags) {
            return false
          }
        }

        // Status filter
        if (statuses.value.length > 0 && item.status) {
          if (!statuses.value.includes(item.status)) {
            return false
          }
        }

        // Visibility filter
        if (visibilities.value.length > 0 && item.visibility) {
          if (!visibilities.value.includes(item.visibility)) {
            return false
          }
        }

        return true
      })
    }
  })

  return {
    search: readonly(search),
    statuses: readonly(statuses),
    visibilities: readonly(visibilities),
    updateFilters,
    applyFilters,
  }
}
