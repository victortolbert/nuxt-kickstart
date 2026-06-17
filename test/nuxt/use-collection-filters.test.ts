import { describe, expect, it } from 'vitest'
import { useCollectionFilters } from '../../app/composables/use-collection-filters'

describe('use-collection-filters', () => {
  describe('initialization', () => {
    it('returns expected properties', () => {
      const result = useCollectionFilters()

      expect(result).toHaveProperty('search')
      expect(result).toHaveProperty('statuses')
      expect(result).toHaveProperty('visibilities')
      expect(result).toHaveProperty('updateFilters')
      expect(result).toHaveProperty('applyFilters')
    })

    it('initializes with empty values when no query params', () => {
      const { search, statuses, visibilities } = useCollectionFilters()

      expect(search.value).toBe('')
      expect(statuses.value).toEqual([])
      expect(visibilities.value).toEqual([])
    })
  })

  describe('updateFilters', () => {
    it('updates filter state', () => {
      const { search, statuses, visibilities, updateFilters } = useCollectionFilters()

      updateFilters({
        search: 'new search',
        statuses: ['evergreen'],
        visibilities: ['private'],
      })

      expect(search.value).toBe('new search')
      expect(statuses.value).toEqual(['evergreen'])
      expect(visibilities.value).toEqual(['private'])
    })
  })

  describe('applyFilters filtering logic', () => {
    const testItems = [
      { title: 'Project Alpha', status: 'seed', visibility: 'public', description: 'A cool project', tags: ['typescript'] },
      { title: 'Project Beta', status: 'sprout', visibility: 'internal', description: 'Another project', tags: ['vue', 'nuxt'] },
      { title: 'Project Gamma', status: 'evergreen', visibility: 'private', description: 'Secret project', tags: ['react'] },
      { title: 'Documentation', status: 'seed', visibility: 'public', description: 'User guides', tags: ['docs'] },
    ]

    it('returns all items when no filters applied', () => {
      const { applyFilters } = useCollectionFilters()
      const filterFn = applyFilters.value

      const result = filterFn(testItems)

      expect(result).toHaveLength(4)
    })

    it('filters by search term in title', () => {
      const { updateFilters, applyFilters } = useCollectionFilters()
      updateFilters({ search: 'alpha', statuses: [], visibilities: [] })

      const result = applyFilters.value(testItems)

      expect(result).toHaveLength(1)
      expect(result[0]?.title).toBe('Project Alpha')
    })

    it('filters by search term in description', () => {
      const { updateFilters, applyFilters } = useCollectionFilters()
      updateFilters({ search: 'guides', statuses: [], visibilities: [] })

      const result = applyFilters.value(testItems)

      expect(result).toHaveLength(1)
      expect(result[0]?.title).toBe('Documentation')
    })

    it('filters by search term in tags', () => {
      const { updateFilters, applyFilters } = useCollectionFilters()
      updateFilters({ search: 'nuxt', statuses: [], visibilities: [] })

      const result = applyFilters.value(testItems)

      expect(result).toHaveLength(1)
      expect(result[0]?.title).toBe('Project Beta')
    })

    it('search is case insensitive', () => {
      const { updateFilters, applyFilters } = useCollectionFilters()
      updateFilters({ search: 'ALPHA', statuses: [], visibilities: [] })

      const result = applyFilters.value(testItems)

      expect(result).toHaveLength(1)
      expect(result[0]?.title).toBe('Project Alpha')
    })

    it('filters by status', () => {
      const { updateFilters, applyFilters } = useCollectionFilters()
      updateFilters({ search: '', statuses: ['seed'], visibilities: [] })

      const result = applyFilters.value(testItems)

      expect(result).toHaveLength(2)
      expect(result.every(i => i.status === 'seed')).toBe(true)
    })

    it('filters by multiple statuses', () => {
      const { updateFilters, applyFilters } = useCollectionFilters()
      updateFilters({ search: '', statuses: ['seed', 'evergreen'], visibilities: [] })

      const result = applyFilters.value(testItems)

      expect(result).toHaveLength(3)
    })

    it('filters by visibility', () => {
      const { updateFilters, applyFilters } = useCollectionFilters()
      updateFilters({ search: '', statuses: [], visibilities: ['public'] })

      const result = applyFilters.value(testItems)

      expect(result).toHaveLength(2)
      expect(result.every(i => i.visibility === 'public')).toBe(true)
    })

    it('combines search and status filters', () => {
      const { updateFilters, applyFilters } = useCollectionFilters()
      updateFilters({ search: 'project', statuses: ['seed'], visibilities: [] })

      const result = applyFilters.value(testItems)

      expect(result).toHaveLength(1)
      expect(result[0]?.title).toBe('Project Alpha')
    })

    it('combines all filters', () => {
      const { updateFilters, applyFilters } = useCollectionFilters()
      updateFilters({
        search: 'project',
        statuses: ['sprout', 'evergreen'],
        visibilities: ['internal', 'private'],
      })

      const result = applyFilters.value(testItems)

      expect(result).toHaveLength(2)
      expect(result.map(i => i.title)).toContain('Project Beta')
      expect(result.map(i => i.title)).toContain('Project Gamma')
    })

    it('handles items without optional fields', () => {
      const itemsWithoutOptional = [
        { title: 'Minimal Item' },
        { title: 'Another Item', status: 'seed' },
      ]

      const { updateFilters, applyFilters } = useCollectionFilters()
      updateFilters({ search: 'item', statuses: [], visibilities: [] })

      const result = applyFilters.value(itemsWithoutOptional)

      expect(result).toHaveLength(2)
    })
  })
})
