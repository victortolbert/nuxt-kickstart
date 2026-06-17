import { computed, queryCollection, useAsyncData, useI18n } from '#imports'
import { fetchLocalizedEntries } from './use-localized-collection'

export interface DashboardContentItem {
  title: string
  path: string
  description?: string
  created?: string
  updated?: string
  status?: string
}

/** A recent item tagged with its source collection, for the combined table. */
export interface DashboardRecentItem extends DashboardContentItem {
  type: 'guide' | 'post'
}

export interface DashboardCounts {
  guides: number
  posts: number
  tech: number
  blocks: number
}

export interface StatusSlice {
  status: string
  value: number
}

export interface ActivityPoint {
  /** Month key (YYYY-MM) for ordering; format for display at the call site. */
  key: string
  value: number
}

export interface DashboardData {
  recentGuides: DashboardContentItem[]
  recentPosts: DashboardContentItem[]
  recentContent: DashboardRecentItem[]
  counts: DashboardCounts
  /** Real status distribution across guides + posts. */
  statusBreakdown: StatusSlice[]
  /** Items created per month over the last 6 months (real, from created dates). */
  monthlyActivity: ActivityPoint[]
}

const ACTIVITY_MONTHS = 6

/**
 * Composable for dashboard data queries.
 *
 * Aggregates recent content and real metrics from the core collections into a
 * single reactive object — counts, status distribution, and per-month activity
 * are all derived from the content itself (no sample data). Wire in your own
 * collections, API stats, or database queries here.
 */
export function useDashboardData() {
  const { locale } = useI18n()

  // Type assertion for queryCollection (Nuxt Content typing limitations)
  const query = queryCollection as (name: string) => { all: () => Promise<DashboardContentItem[]> }

  const byRecency = (a: DashboardContentItem, b: DashboardContentItem) =>
    (b.updated ?? b.created ?? '').localeCompare(a.updated ?? a.created ?? '')

  const { data: guides } = useAsyncData(
    'dashboard-guides',
    () => fetchLocalizedEntries<DashboardContentItem>('guides', locale.value),
    { default: () => [] as DashboardContentItem[], watch: [locale] },
  )

  const { data: posts } = useAsyncData(
    'dashboard-posts',
    () => query('posts').all(),
    { default: () => [] },
  )

  const { data: techCount } = useAsyncData(
    'dashboard-count-tech',
    () => query('tech').all().then(items => items.length),
    { default: () => 0 },
  )

  const { data: blocksCount } = useAsyncData(
    'dashboard-count-blocks',
    () => query('blocks').all().then(items => items.length),
    { default: () => 0 },
  )

  const dashboardData = computed<DashboardData>(() => {
    const allGuides = guides.value ?? []
    const allPosts = posts.value ?? []

    const recentGuides = allGuides.toSorted(byRecency).slice(0, 5)
    const recentPosts = allPosts.toSorted(byRecency).slice(0, 5)

    const recentContent: DashboardRecentItem[] = [
      ...allGuides.map(g => ({ ...g, type: 'guide' as const })),
      ...allPosts.map(p => ({ ...p, type: 'post' as const })),
    ].toSorted(byRecency).slice(0, 6)

    // Real status distribution across guides + posts
    const statusOrder = ['seed', 'sprout', 'evergreen', 'wilted']
    const statusTally = new Map<string, number>()
    for (const item of [...allGuides, ...allPosts]) {
      const status = item.status ?? 'seed'
      statusTally.set(status, (statusTally.get(status) ?? 0) + 1)
    }
    const statusBreakdown: StatusSlice[] = statusOrder
      .filter(s => statusTally.has(s))
      .map(status => ({ status, value: statusTally.get(status)! }))
    // Include any non-standard statuses after the known ones
    for (const [status, value] of statusTally) {
      if (!statusOrder.includes(status))
        statusBreakdown.push({ status, value })
    }

    // Real per-month activity (last N months) from created dates
    const monthKeys: string[] = []
    const ref = new Date()
    for (let i = ACTIVITY_MONTHS - 1; i >= 0; i--) {
      const d = new Date(ref.getFullYear(), ref.getMonth() - i, 1)
      monthKeys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
    }
    const monthTally = new Map(monthKeys.map(k => [k, 0]))
    for (const item of [...allGuides, ...allPosts]) {
      const date = item.created ?? item.updated
      if (!date)
        continue
      const key = date.slice(0, 7) // YYYY-MM
      if (monthTally.has(key))
        monthTally.set(key, monthTally.get(key)! + 1)
    }
    const monthlyActivity: ActivityPoint[] = monthKeys.map(key => ({ key, value: monthTally.get(key) ?? 0 }))

    return {
      recentGuides,
      recentPosts,
      recentContent,
      counts: {
        guides: allGuides.length,
        posts: allPosts.length,
        tech: techCount.value ?? 0,
        blocks: blocksCount.value ?? 0,
      },
      statusBreakdown,
      monthlyActivity,
    }
  })

  return dashboardData
}
