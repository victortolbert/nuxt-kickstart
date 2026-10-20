/**
 * The sidebar's navigation tree, filtered here rather than in the browser.
 *
 * Returning every group verbatim would hand an unauthenticated GET the
 * complete route map — every group label, item label and path, admin
 * included — and the same tree would ride along in the SSR payload of every
 * visitor-rendered page. Data shipped to the client and filtered there is not
 * a boundary (ADR-0005).
 *
 * The rules are the shared ones from `#shared/utils/navigation-visibility`, so
 * this pass and the composable's reactive one cannot drift. The composable
 * still filters what it is given — defense in depth, and it keeps the menu
 * honest while the client session resolves.
 */

import type { H3Event } from 'h3'
import type { NavGroup } from '#shared/types/navigation'
import YAML from 'yaml'
import { filterNavigation } from '#shared/utils/navigation-visibility'

/** Read the navigation YAML out of the Nitro server-asset storage. */
async function loadNavigationGroups(): Promise<NavGroup[]> {
  const storage = useStorage('assets:navigation')
  const groups: NavGroup[] = []

  for (const key of await storage.getKeys()) {
    const item = await storage.getItem(key)
    if (!item)
      continue

    const parsed = typeof item === 'string'
      ? YAML.parse(item) as NavGroup
      : item as NavGroup

    if (parsed?.id)
      groups.push(parsed)
  }

  return groups.sort((a, b) => (a.order || 0) - (b.order || 0))
}

export default defineEventHandler(async (event: H3Event): Promise<NavGroup[]> => {
  // The body depends on who asked, so nothing may cache it: a shared cache (or
  // a CDN keyed on the path alone) would serve one audience another's menu.
  setResponseHeader(event, 'Cache-Control', 'private, no-store, max-age=0')
  setResponseHeader(event, 'Vary', 'Cookie')

  const viewer = await getRequestViewer(event)

  // A sidebar that cannot load its config is a degraded shell, not a broken
  // page, so a failed read answers with an empty menu and logs the reason.
  const groups = await loadNavigationGroups().catch((error): NavGroup[] => {
    console.error('Failed to load navigation config:', error)
    return []
  })

  return filterNavigation(groups, viewer, { isDev: import.meta.dev })
})
