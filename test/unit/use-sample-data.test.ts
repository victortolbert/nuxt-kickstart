import { describe, expect, it } from 'vitest'
import { useSampleData } from '../../app/composables/use-sample-data'

describe('useSampleData', () => {
  describe('projects', () => {
    it('returns an array of projects', () => {
      const { projects } = useSampleData()

      expect(Array.isArray(projects)).toBe(true)
      expect(projects.length).toBeGreaterThan(0)
    })

    it('projects have required properties', () => {
      const { projects } = useSampleData()

      projects.forEach((project) => {
        expect(project).toHaveProperty('id')
        expect(project).toHaveProperty('name')
        expect(project).toHaveProperty('status')
        expect(project).toHaveProperty('tech')
        expect(project).toHaveProperty('domain')
        expect(project).toHaveProperty('progress')
        expect(project).toHaveProperty('lastUpdated')
        expect(project).toHaveProperty('priority')
        expect(project).toHaveProperty('owner')
      })
    })

    it('projects have valid status values', () => {
      const { projects } = useSampleData()
      const validStatuses = ['seed', 'sprout', 'evergreen', 'wilted']

      projects.forEach((project) => {
        expect(validStatuses).toContain(project.status)
      })
    })

    it('projects have valid priority values', () => {
      const { projects } = useSampleData()
      const validPriorities = ['low', 'medium', 'high']

      projects.forEach((project) => {
        expect(validPriorities).toContain(project.priority)
      })
    })

    it('projects have progress between 0 and 100', () => {
      const { projects } = useSampleData()

      projects.forEach((project) => {
        expect(project.progress).toBeGreaterThanOrEqual(0)
        expect(project.progress).toBeLessThanOrEqual(100)
      })
    })

    it('projects have tech as an array', () => {
      const { projects } = useSampleData()

      projects.forEach((project) => {
        expect(Array.isArray(project.tech)).toBe(true)
        expect(project.tech.length).toBeGreaterThan(0)
      })
    })
  })

  describe('calendarEvents', () => {
    it('returns an array of calendar events', () => {
      const { calendarEvents } = useSampleData()

      expect(Array.isArray(calendarEvents)).toBe(true)
      expect(calendarEvents.length).toBeGreaterThan(0)
    })

    it('events have required properties', () => {
      const { calendarEvents } = useSampleData()

      calendarEvents.forEach((event) => {
        expect(event).toHaveProperty('id')
        expect(event).toHaveProperty('title')
        expect(event).toHaveProperty('start')
      })
    })

    it('events have valid date format', () => {
      const { calendarEvents } = useSampleData()
      const dateRegex = /^\d{4}-\d{2}-\d{2}/

      calendarEvents.forEach((event) => {
        expect(event.start).toMatch(dateRegex)
      })
    })
  })

  describe('locations', () => {
    it('returns an array of locations', () => {
      const { locations } = useSampleData()

      expect(Array.isArray(locations)).toBe(true)
      expect(locations.length).toBeGreaterThan(0)
    })

    it('locations have required properties', () => {
      const { locations } = useSampleData()

      locations.forEach((location) => {
        expect(location).toHaveProperty('id')
        expect(location).toHaveProperty('name')
        expect(location).toHaveProperty('lat')
        expect(location).toHaveProperty('lng')
        expect(location).toHaveProperty('type')
      })
    })

    it('locations have valid type values', () => {
      const { locations } = useSampleData()
      const validTypes = ['office', 'client', 'event', 'remote']

      locations.forEach((location) => {
        expect(validTypes).toContain(location.type)
      })
    })

    it('locations have valid lat/lng coordinates', () => {
      const { locations } = useSampleData()

      locations.forEach((location) => {
        expect(location.lat).toBeGreaterThanOrEqual(-90)
        expect(location.lat).toBeLessThanOrEqual(90)
        expect(location.lng).toBeGreaterThanOrEqual(-180)
        expect(location.lng).toBeLessThanOrEqual(180)
      })
    })
  })

  describe('contentByStatus', () => {
    it('returns chart data for content by status', () => {
      const { contentByStatus } = useSampleData()

      expect(Array.isArray(contentByStatus)).toBe(true)
      expect(contentByStatus.length).toBeGreaterThan(0)
    })

    it('chart data has required properties', () => {
      const { contentByStatus } = useSampleData()

      contentByStatus.forEach((item) => {
        expect(item).toHaveProperty('name')
        expect(item).toHaveProperty('value')
        expect(item).toHaveProperty('color')
      })
    })

    it('includes all status types', () => {
      const { contentByStatus } = useSampleData()
      const names = contentByStatus.map(item => item.name)

      expect(names).toContain('Seed')
      expect(names).toContain('Sprout')
      expect(names).toContain('Evergreen')
      expect(names).toContain('Wilted')
    })
  })

  describe('activityOverTime', () => {
    it('returns activity data over time', () => {
      const { activityOverTime } = useSampleData()

      expect(Array.isArray(activityOverTime)).toBe(true)
      expect(activityOverTime.length).toBeGreaterThan(0)
    })

    it('activity data has required properties', () => {
      const { activityOverTime } = useSampleData()

      activityOverTime.forEach((item) => {
        expect(item).toHaveProperty('month')
        expect(item).toHaveProperty('projects')
        expect(item).toHaveProperty('notes')
        expect(item).toHaveProperty('resources')
      })
    })
  })

  describe('techUsage', () => {
    it('returns tech usage data', () => {
      const { techUsage } = useSampleData()

      expect(Array.isArray(techUsage)).toBe(true)
      expect(techUsage.length).toBeGreaterThan(0)
    })

    it('tech usage data has required properties', () => {
      const { techUsage } = useSampleData()

      techUsage.forEach((item) => {
        expect(item).toHaveProperty('tech')
        expect(item).toHaveProperty('count')
        expect(typeof item.tech).toBe('string')
        expect(typeof item.count).toBe('number')
      })
    })
  })

  describe('domainBreakdown', () => {
    it('returns domain breakdown data', () => {
      const { domainBreakdown } = useSampleData()

      expect(Array.isArray(domainBreakdown)).toBe(true)
      expect(domainBreakdown.length).toBeGreaterThan(0)
    })

    it('domain breakdown has required properties', () => {
      const { domainBreakdown } = useSampleData()

      domainBreakdown.forEach((item) => {
        expect(item).toHaveProperty('name')
        expect(item).toHaveProperty('value')
        expect(typeof item.name).toBe('string')
        expect(typeof item.value).toBe('number')
      })
    })
  })
})
