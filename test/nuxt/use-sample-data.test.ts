import type { SampleEvent, SampleLocation, SampleProject } from '../../app/composables/use-sample-data'
import { describe, expect, it } from 'vitest'
import { useSampleData } from '../../app/composables/use-sample-data'

describe('useSampleData', () => {
  it('returns all data properties', () => {
    const result = useSampleData()

    expect(result).toHaveProperty('projects')
    expect(result).toHaveProperty('calendarEvents')
    expect(result).toHaveProperty('locations')
    expect(result).toHaveProperty('contentByStatus')
    expect(result).toHaveProperty('activityOverTime')
    expect(result).toHaveProperty('techUsage')
    expect(result).toHaveProperty('domainBreakdown')
  })

  describe('projects', () => {
    it('returns array of projects', () => {
      const { projects } = useSampleData()

      expect(Array.isArray(projects)).toBe(true)
      expect(projects.length).toBeGreaterThan(0)
    })

    it('projects have required properties', () => {
      const { projects } = useSampleData()
      const project = projects[0]!

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

    it('project status is valid', () => {
      const { projects } = useSampleData()
      const validStatuses = ['seed', 'sprout', 'evergreen', 'wilted']

      projects.forEach((project) => {
        expect(validStatuses).toContain(project.status)
      })
    })

    it('project priority is valid', () => {
      const { projects } = useSampleData()
      const validPriorities = ['low', 'medium', 'high']

      projects.forEach((project) => {
        expect(validPriorities).toContain(project.priority)
      })
    })

    it('project progress is between 0 and 100', () => {
      const { projects } = useSampleData()

      projects.forEach((project) => {
        expect(project.progress).toBeGreaterThanOrEqual(0)
        expect(project.progress).toBeLessThanOrEqual(100)
      })
    })
  })

  describe('calendarEvents', () => {
    it('returns array of events', () => {
      const { calendarEvents } = useSampleData()

      expect(Array.isArray(calendarEvents)).toBe(true)
      expect(calendarEvents.length).toBeGreaterThan(0)
    })

    it('events have required properties', () => {
      const { calendarEvents } = useSampleData()
      const event = calendarEvents[0]!

      expect(event).toHaveProperty('id')
      expect(event).toHaveProperty('title')
      expect(event).toHaveProperty('start')
    })
  })

  describe('locations', () => {
    it('returns array of locations', () => {
      const { locations } = useSampleData()

      expect(Array.isArray(locations)).toBe(true)
      expect(locations.length).toBeGreaterThan(0)
    })

    it('locations have required properties', () => {
      const { locations } = useSampleData()
      const location = locations[0]!

      expect(location).toHaveProperty('id')
      expect(location).toHaveProperty('name')
      expect(location).toHaveProperty('lat')
      expect(location).toHaveProperty('lng')
      expect(location).toHaveProperty('type')
    })

    it('location type is valid', () => {
      const { locations } = useSampleData()
      const validTypes = ['office', 'client', 'event', 'remote']

      locations.forEach((location) => {
        expect(validTypes).toContain(location.type)
      })
    })

    it('location coordinates are valid', () => {
      const { locations } = useSampleData()

      locations.forEach((location) => {
        expect(location.lat).toBeGreaterThanOrEqual(-90)
        expect(location.lat).toBeLessThanOrEqual(90)
        expect(location.lng).toBeGreaterThanOrEqual(-180)
        expect(location.lng).toBeLessThanOrEqual(180)
      })
    })
  })

  describe('chart data', () => {
    it('contentByStatus has valid structure', () => {
      const { contentByStatus } = useSampleData()

      expect(Array.isArray(contentByStatus)).toBe(true)
      contentByStatus.forEach((item) => {
        expect(item).toHaveProperty('name')
        expect(item).toHaveProperty('value')
        expect(item).toHaveProperty('color')
      })
    })

    it('activityOverTime has valid structure', () => {
      const { activityOverTime } = useSampleData()

      expect(Array.isArray(activityOverTime)).toBe(true)
      activityOverTime.forEach((item) => {
        expect(item).toHaveProperty('month')
        expect(item).toHaveProperty('projects')
        expect(item).toHaveProperty('notes')
        expect(item).toHaveProperty('resources')
      })
    })

    it('techUsage has valid structure', () => {
      const { techUsage } = useSampleData()

      expect(Array.isArray(techUsage)).toBe(true)
      techUsage.forEach((item) => {
        expect(item).toHaveProperty('tech')
        expect(item).toHaveProperty('count')
      })
    })

    it('domainBreakdown has valid structure', () => {
      const { domainBreakdown } = useSampleData()

      expect(Array.isArray(domainBreakdown)).toBe(true)
      domainBreakdown.forEach((item) => {
        expect(item).toHaveProperty('name')
        expect(item).toHaveProperty('value')
      })
    })
  })
})

describe('sampleProject type', () => {
  it('type shape is correct', () => {
    const project: SampleProject = {
      id: '1',
      name: 'Test Project',
      status: 'sprout',
      tech: ['vue', 'typescript'],
      domain: 'fintech',
      progress: 50,
      lastUpdated: '2026-01-15',
      priority: 'high',
      owner: 'Test User',
    }

    expect(project.id).toBe('1')
    expect(project.status).toBe('sprout')
    expect(project.priority).toBe('high')
  })
})

describe('sampleEvent type', () => {
  it('type shape is correct', () => {
    const event: SampleEvent = {
      id: '1',
      title: 'Test Event',
      start: '2026-01-15',
    }

    expect(event.id).toBe('1')
    expect(event.title).toBe('Test Event')
    expect(event.start).toBe('2026-01-15')
  })

  it('accepts optional properties', () => {
    const fullEvent: SampleEvent = {
      id: '2',
      title: 'Full Event',
      start: '2026-01-15T10:00:00',
      end: '2026-01-15T11:00:00',
      allDay: false,
      backgroundColor: '#3b82f6',
      borderColor: '#2563eb',
      extendedProps: { category: 'meeting' },
    }

    expect(fullEvent.end).toBe('2026-01-15T11:00:00')
    expect(fullEvent.allDay).toBe(false)
    expect(fullEvent.extendedProps?.category).toBe('meeting')
  })
})

describe('sampleLocation type', () => {
  it('type shape is correct', () => {
    const location: SampleLocation = {
      id: '1',
      name: 'Test Office',
      lat: 33.749,
      lng: -84.388,
      type: 'office',
    }

    expect(location.id).toBe('1')
    expect(location.type).toBe('office')
  })

  it('accepts optional description', () => {
    const location: SampleLocation = {
      id: '2',
      name: 'Client Site',
      lat: 40.7128,
      lng: -74.006,
      type: 'client',
      description: 'Manhattan office',
    }

    expect(location.description).toBe('Manhattan office')
  })
})
