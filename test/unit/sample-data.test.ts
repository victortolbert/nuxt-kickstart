import { describe, expect, it } from 'vitest'
import { useSampleData } from '../../app/composables/use-sample-data'

describe('use-sample-data', () => {
  describe('useSampleData', () => {
    it('returns expected properties', () => {
      const result = useSampleData()

      expect(result).toHaveProperty('projects')
      expect(result).toHaveProperty('calendarEvents')
      expect(result).toHaveProperty('locations')
      expect(result).toHaveProperty('contentByStatus')
      expect(result).toHaveProperty('activityOverTime')
      expect(result).toHaveProperty('techUsage')
      expect(result).toHaveProperty('domainBreakdown')
    })

    it('projects have required fields', () => {
      const { projects } = useSampleData()

      expect(projects.length).toBeGreaterThan(0)

      for (const project of projects) {
        expect(project).toHaveProperty('id')
        expect(project).toHaveProperty('name')
        expect(project).toHaveProperty('status')
        expect(project).toHaveProperty('tech')
        expect(project).toHaveProperty('domain')
        expect(project).toHaveProperty('progress')
        expect(project).toHaveProperty('lastUpdated')
        expect(project).toHaveProperty('priority')
        expect(project).toHaveProperty('owner')

        // Validate status values
        expect(['seed', 'sprout', 'evergreen', 'wilted']).toContain(project.status)

        // Validate priority values
        expect(['low', 'medium', 'high']).toContain(project.priority)

        // Validate progress is a percentage
        expect(project.progress).toBeGreaterThanOrEqual(0)
        expect(project.progress).toBeLessThanOrEqual(100)
      }
    })

    it('calendar events have required fields', () => {
      const { calendarEvents } = useSampleData()

      expect(calendarEvents.length).toBeGreaterThan(0)

      for (const event of calendarEvents) {
        expect(event).toHaveProperty('id')
        expect(event).toHaveProperty('title')
        expect(event).toHaveProperty('start')

        // Validate date format
        expect(event.start).toMatch(/^\d{4}-\d{2}-\d{2}/)
      }
    })

    it('locations have required fields', () => {
      const { locations } = useSampleData()

      expect(locations.length).toBeGreaterThan(0)

      for (const location of locations) {
        expect(location).toHaveProperty('id')
        expect(location).toHaveProperty('name')
        expect(location).toHaveProperty('lat')
        expect(location).toHaveProperty('lng')
        expect(location).toHaveProperty('type')

        // Validate type values
        expect(['office', 'client', 'event', 'remote']).toContain(location.type)

        // Validate coordinates are numbers
        expect(typeof location.lat).toBe('number')
        expect(typeof location.lng).toBe('number')
      }
    })

    it('content by status chart data is valid', () => {
      const { contentByStatus } = useSampleData()

      expect(contentByStatus.length).toBe(4)

      for (const item of contentByStatus) {
        expect(item).toHaveProperty('name')
        expect(item).toHaveProperty('value')
        expect(item).toHaveProperty('color')
        expect(typeof item.value).toBe('number')
        expect(item.color).toMatch(/^var\(--color-chart-\d\)$/)
      }
    })

    it('activity over time chart data is valid', () => {
      const { activityOverTime } = useSampleData()

      expect(activityOverTime.length).toBeGreaterThan(0)

      for (const item of activityOverTime) {
        expect(item).toHaveProperty('month')
        expect(item).toHaveProperty('projects')
        expect(item).toHaveProperty('notes')
        expect(item).toHaveProperty('resources')
        expect(typeof item.projects).toBe('number')
        expect(typeof item.notes).toBe('number')
        expect(typeof item.resources).toBe('number')
      }
    })

    it('tech usage chart data is valid', () => {
      const { techUsage } = useSampleData()

      expect(techUsage.length).toBeGreaterThan(0)

      for (const item of techUsage) {
        expect(item).toHaveProperty('tech')
        expect(item).toHaveProperty('count')
        expect(typeof item.count).toBe('number')
      }
    })

    it('domain breakdown chart data is valid', () => {
      const { domainBreakdown } = useSampleData()

      expect(domainBreakdown.length).toBeGreaterThan(0)

      for (const item of domainBreakdown) {
        expect(item).toHaveProperty('name')
        expect(item).toHaveProperty('value')
        expect(typeof item.value).toBe('number')
      }
    })
  })
})
