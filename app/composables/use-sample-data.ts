/**
 * Sample data for dashboard examples
 * In production, this would come from content collections or APIs
 */

export interface SampleProject {
  id: string
  name: string
  status: 'seed' | 'sprout' | 'evergreen' | 'wilted'
  tech: string[]
  domain: string
  progress: number
  lastUpdated: string
  priority: 'low' | 'medium' | 'high'
  owner: string
}

export interface SampleEvent {
  id: string
  title: string
  start: string
  end?: string
  allDay?: boolean
  backgroundColor?: string
  borderColor?: string
  classNames?: string[]
  extendedProps?: Record<string, unknown>
}

export interface SampleLocation {
  id: string
  name: string
  lat: number
  lng: number
  type: 'office' | 'client' | 'event' | 'remote'
  description?: string
}

export function useSampleData() {
  // Sample projects for table demos
  const projects: SampleProject[] = [
    { id: '1', name: 'Kickstart Digital Garden', status: 'sprout', tech: ['nuxt', 'vue', 'typescript'], domain: 'other', progress: 45, lastUpdated: '2026-01-23', priority: 'high', owner: 'Alex Doe' },
    { id: '2', name: 'Insurance Portal', status: 'evergreen', tech: ['react', 'typescript', 'postgresql'], domain: 'insurtech', progress: 100, lastUpdated: '2025-12-15', priority: 'medium', owner: 'Sarah Chen' },
    { id: '3', name: 'Biopharma Dashboard', status: 'sprout', tech: ['vue', 'tailwind', 'supabase'], domain: 'biopharma', progress: 68, lastUpdated: '2026-01-20', priority: 'high', owner: 'Marcus Johnson' },
    { id: '4', name: 'Property Finder App', status: 'seed', tech: ['nuxt', 'typescript', 'mongodb'], domain: 'proptech', progress: 15, lastUpdated: '2026-01-18', priority: 'low', owner: 'Emily Rodriguez' },
    { id: '5', name: 'Donor Management CRM', status: 'evergreen', tech: ['react', 'postgresql', 'redis'], domain: 'nonprofit', progress: 92, lastUpdated: '2025-11-30', priority: 'medium', owner: 'David Kim' },
    { id: '6', name: 'Campaign Analytics', status: 'wilted', tech: ['vue', 'python', 'postgresql'], domain: 'media-advertising', progress: 78, lastUpdated: '2025-08-10', priority: 'low', owner: 'Lisa Wang' },
    { id: '7', name: 'Fleet Tracker', status: 'sprout', tech: ['nuxt', 'typescript', 'mongodb'], domain: 'automotive', progress: 55, lastUpdated: '2026-01-21', priority: 'high', owner: 'James Miller' },
    { id: '8', name: 'Event Ticketing', status: 'evergreen', tech: ['next', 'typescript', 'postgresql'], domain: 'sports-events', progress: 88, lastUpdated: '2026-01-10', priority: 'medium', owner: 'Rachel Green' },
    { id: '9', name: 'Healthcare Portal', status: 'sprout', tech: ['vue', 'typescript', 'supabase'], domain: 'healthcare', progress: 35, lastUpdated: '2026-01-22', priority: 'high', owner: 'Dr. Michael Brown' },
    { id: '10', name: 'Fundraising Platform', status: 'seed', tech: ['nuxt', 'tailwind', 'postgresql'], domain: 'fundraising', progress: 10, lastUpdated: '2026-01-15', priority: 'medium', owner: 'Amanda Foster' },
    { id: '11', name: 'Claims Processing', status: 'evergreen', tech: ['react', 'typescript', 'redis'], domain: 'insurtech', progress: 95, lastUpdated: '2025-10-05', priority: 'low', owner: 'Kevin Patel' },
    { id: '12', name: 'Drug Trial Manager', status: 'sprout', tech: ['vue', 'python', 'postgresql'], domain: 'biopharma', progress: 42, lastUpdated: '2026-01-19', priority: 'high', owner: 'Dr. Jennifer Lee' },
  ]

  // Sample calendar events - using classNames for theme-aware colors
  // Classes: fc-event-primary (default), fc-event-accent-1 through fc-event-accent-5
  const calendarEvents: SampleEvent[] = [
    { id: '1', title: 'Review Kickstart Roadmap', start: '2026-02-01', allDay: true, classNames: ['fc-event-primary'] },
    { id: '2', title: 'Sprint Planning', start: '2026-01-27T09:00:00', end: '2026-01-27T11:00:00', classNames: ['fc-event-accent-1'] },
    { id: '3', title: 'Client Demo', start: '2026-01-28T14:00:00', end: '2026-01-28T15:30:00', classNames: ['fc-event-accent-2'] },
    { id: '4', title: 'Code Review', start: '2026-01-24T10:00:00', end: '2026-01-24T11:00:00', classNames: ['fc-event-accent-3'] },
    { id: '5', title: 'Team Standup', start: '2026-01-23T09:30:00', end: '2026-01-23T09:45:00', classNames: ['fc-event-primary'] },
    { id: '6', title: 'Design System Meeting', start: '2026-01-29T13:00:00', end: '2026-01-29T14:00:00', classNames: ['fc-event-accent-4'] },
    { id: '7', title: 'Deploy to Production', start: '2026-01-30', allDay: true, classNames: ['fc-event-accent-5'] },
    { id: '8', title: 'Quarterly Review', start: '2026-01-31T15:00:00', end: '2026-01-31T17:00:00', classNames: ['fc-event-accent-1'] },
  ]

  // Sample locations for map demos
  const locations: SampleLocation[] = [
    { id: '1', name: 'Main Office', lat: 33.7490, lng: -84.3880, type: 'office', description: 'Atlanta HQ' },
    { id: '2', name: 'Client Site - NYC', lat: 40.7128, lng: -74.0060, type: 'client', description: 'Financial District' },
    { id: '3', name: 'Remote Team - Austin', lat: 30.2672, lng: -97.7431, type: 'remote', description: 'Texas Hub' },
    { id: '4', name: 'Conference - SF', lat: 37.7749, lng: -122.4194, type: 'event', description: 'Annual Summit' },
    { id: '5', name: 'Client Site - Chicago', lat: 41.8781, lng: -87.6298, type: 'client', description: 'Midwest Region' },
  ]

  // Chart data - content by status
  const contentByStatus = [
    { name: 'Seed', value: 25, color: 'var(--color-chart-1)' },
    { name: 'Sprout', value: 42, color: 'var(--color-chart-2)' },
    { name: 'Evergreen', value: 68, color: 'var(--color-chart-3)' },
    { name: 'Wilted', value: 12, color: 'var(--color-chart-4)' },
  ]

  // Chart data - activity over time
  const activityOverTime = [
    { month: 'Aug', projects: 4, notes: 12, resources: 8 },
    { month: 'Sep', projects: 6, notes: 18, resources: 11 },
    { month: 'Oct', projects: 8, notes: 24, resources: 15 },
    { month: 'Nov', projects: 7, notes: 31, resources: 19 },
    { month: 'Dec', projects: 9, notes: 28, resources: 22 },
    { month: 'Jan', projects: 12, notes: 35, resources: 27 },
  ]

  // Chart data - tech usage
  const techUsage = [
    { tech: 'Nuxt', count: 15 },
    { tech: 'Vue', count: 12 },
    { tech: 'React', count: 8 },
    { tech: 'TypeScript', count: 20 },
    { tech: 'Tailwind', count: 14 },
    { tech: 'PostgreSQL', count: 9 },
  ]

  // Chart data - domains breakdown
  const domainBreakdown = [
    { name: 'Healthcare', value: 18 },
    { name: 'Biopharma', value: 14 },
    { name: 'Insurtech', value: 22 },
    { name: 'PropTech', value: 8 },
    { name: 'Nonprofit', value: 12 },
    { name: 'Other', value: 26 },
  ]

  return {
    projects,
    calendarEvents,
    locations,
    contentByStatus,
    activityOverTime,
    techUsage,
    domainBreakdown,
  }
}
