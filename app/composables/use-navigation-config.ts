import type { NavigationMenuItem } from '@nuxt/ui'
import type { NavGroup, NavItem, NavSection } from '~~/shared/types/navigation'
import { computed, watch } from 'vue'
import { canViewNavGroup, filterNavItems } from '#shared/utils/navigation-visibility'

/**
 * The sidebar section a group renders in. Pure and exported so the placement
 * rule can be tested through its interface. Unknown/omitted → `main`, so a
 * typo'd or new section value degrades to "visible in the main list" rather
 * than silently vanishing the group.
 */
export function sectionOf(group: Pick<NavGroup, 'section'>): NavSection {
  return group.section === 'footer' ? 'footer' : 'main'
}

/**
 * Composable to load and process navigation configuration from YAML files
 *
 * Navigation groups are defined in content/navigation/*.yml files
 * Each file defines a group with its items, visibility, and ordering
 */
export function useNavigationConfig() {
  const { loggedIn, userRole, isAdmin } = useSessionState()
  const environment = { isDev: import.meta.dev }

  /**
   * The session reduced to the descriptor the visibility rules take — the same
   * shape `getRequestViewer()` builds for `/api/navigation`, so both passes
   * ask the shared rules the identical question.
   */
  const viewer = computed(() => ({ loggedIn: loggedIn.value, isAdmin: isAdmin.value }))

  // Use appearance composable for dynamic icon resolution
  // eslint-disable-next-line ts/ban-ts-comment
  // @ts-ignore - useAppearance is auto-imported by Nuxt
  const { resolveIcon } = useAppearance()

  // eslint-disable-next-line ts/ban-ts-comment
  // @ts-ignore - useI18n is auto-imported by Nuxt
  const { t, te, locale } = useI18n()

  /**
   * Translate a nav label by convention: item slugs / group ids map to
   * `nav.<camelCaseSlug>` / `nav.groups.<id>` message keys. Falls back to
   * the literal label from the YAML file when no translation exists.
   */
  function toCamelCase(slug: string): string {
    return slug.replace(/-(\w)/g, (_, c: string) => c.toUpperCase())
  }

  function localizedItemLabel(item: NavItem): string {
    const key = `nav.${toCamelCase(item.slug)}`
    return te(key) ? t(key) : item.label
  }

  function localizedGroupLabel(group: NavGroup): string {
    const key = `nav.groups.${group.id}`
    return te(key) ? t(key) : group.label
  }

  /**
   * Prefix internal paths with the active locale (prefix_except_default),
   * so sidebar links keep visitors in their language.
   */
  function localizedNavPath(path?: string): string | undefined {
    if (!path || !path.startsWith('/'))
      return path
    return locale.value === 'en' ? path : `/${locale.value}${path}`
  }

  // Fetch navigation config from API. The response is already filtered for
  // the requesting session — this is what the browser is *allowed* to know,
  // not the whole tree.
  // eslint-disable-next-line ts/ban-ts-comment
  // @ts-ignore - useFetch is auto-imported by Nuxt
  const { data: navGroups, status, refresh } = useFetch<NavGroup[]>('/api/navigation', {
    key: 'navigation-config',
    default: (): NavGroup[] => [],
  })

  /**
   * A session-scoped response stops being right the moment the tier changes,
   * and signing in or out is a client-side navigation — no reload refetches
   * it. The client filter can only remove groups, never restore ones the
   * server withheld, so refetch. Keyed on the tier rather than the session
   * object so a token refresh does not refetch.
   */
  const viewerTier = computed(() => (viewer.value.isAdmin ? 'owner' : viewer.value.loggedIn ? 'member' : 'visitor'))
  watch(viewerTier, () => {
    refresh()
  })

  /**
   * Filter items based on visibility rules (recursive for nested children)
   */
  function filterItems(items: NavItem[]): NavItem[] {
    return filterNavItems(items, viewer.value, environment)
  }

  /**
   * Single visibility predicate for a group, shared with `/api/navigation`
   * through `canViewNavGroup`, so the sidebar, palette, `isGroupVisible(id)`
   * and the server can never disagree about whether a group should show.
   */
  function groupVisible(group: NavGroup): boolean {
    return canViewNavGroup(group, viewer.value)
  }

  /**
   * Filter groups based on visibility and auth rules
   */
  function filterGroups(groups: NavGroup[]): NavGroup[] {
    return groups.filter(groupVisible)
  }

  /**
   * Convert NavItem to NavigationMenuItem format
   * Resolves semantic icon names to actual icon classes
   * Supports nested children for sub-groups (e.g., Email → Compose, Drafts, etc.)
   */
  function toMenuItem(item: NavItem): NavigationMenuItem {
    // Item with children becomes a nested expandable group
    if (item.children && item.children.length > 0) {
      return {
        label: localizedItemLabel(item),
        icon: item.icon ? resolveIcon(item.icon) : undefined,
        defaultOpen: false,
        children: item.children.map(toMenuItem),
      }
    }

    return {
      label: localizedItemLabel(item),
      icon: item.icon ? resolveIcon(item.icon) : undefined,
      to: localizedNavPath(item.path),
      badge: item.badge,
    }
  }

  /**
   * Convert NavGroup to NavigationMenuItem format
   * Groups with items become expandable menus
   * Groups with single item become direct links
   * Resolves semantic icon names to actual icon classes
   */
  function toMenuGroup(group: NavGroup): NavigationMenuItem {
    const filteredItems = filterItems(group.items)

    // If group has no visible items, return empty
    if (filteredItems.length === 0) {
      return { label: localizedGroupLabel(group) }
    }

    // If group has only one item, make it a direct link
    if (filteredItems.length === 1 && filteredItems[0]) {
      return {
        label: localizedGroupLabel(group),
        icon: group.icon ? resolveIcon(group.icon) : undefined,
        to: localizedNavPath(filteredItems[0].path),
      }
    }

    // Otherwise, create an expandable group
    return {
      label: localizedGroupLabel(group),
      icon: group.icon ? resolveIcon(group.icon) : undefined,
      defaultOpen: group.defaultOpen ?? false,
      children: filteredItems.map(toMenuItem),
    }
  }

  /**
   * Sidebar navigation, bucketed by each group's declared `section` (YAML).
   * Order within a section comes from the API's global `order` sort, which
   * the filter/bucket steps preserve. A new Navigation group appears here the
   * moment its YAML exists — no code change, matching the palette's behavior.
   */
  const navigation = computed<Record<NavSection, NavigationMenuItem[]>>(() => {
    const visible = filterGroups(navGroups.value)
    const bucket = (section: NavSection) =>
      visible.filter(g => sectionOf(g) === section).map(toMenuGroup)
    return {
      main: bucket('main'),
      footer: bucket('footer'),
    }
  })

  /** Flat palette item: a navigable destination. */
  interface PaletteItem {
    label: string
    icon?: string
    to?: string
  }

  function flattenPaletteItems(items: NavItem[]): PaletteItem[] {
    const out: PaletteItem[] = []
    for (const item of items) {
      if (item.children?.length) {
        out.push(...flattenPaletteItems(item.children))
      }
      else if (item.path) {
        out.push({
          label: localizedItemLabel(item),
          icon: item.icon ? resolveIcon(item.icon) : undefined,
          to: localizedNavPath(item.path),
        })
      }
    }
    return out
  }

  /**
   * Command-palette groups derived from the same YAML config as the sidebar:
   * visible groups (auth/role rules applied), nested items flattened, labels
   * translated, and paths localized. Add a nav item in YAML and it appears
   * here for free.
   */
  const paletteGroups = computed(() => {
    return filterGroups(navGroups.value)
      .map(group => ({
        id: group.id,
        label: localizedGroupLabel(group),
        items: flattenPaletteItems(filterItems(group.items)),
      }))
      .filter(group => group.items.length > 0)
  })

  /**
   * Get a specific group by ID
   */
  function getGroup(id: string): NavGroup | undefined {
    return navGroups.value.find((g: NavGroup) => g.id === id)
  }

  /**
   * Check if a group is visible — delegates to the same predicate the sidebar
   * and palette use, so all three agree (including the role check).
   */
  function isGroupVisible(id: string): boolean {
    const group = getGroup(id)
    return group ? groupVisible(group) : false
  }

  return {
    // Raw data
    navGroups,
    status,

    // Auth state (for consumers that need role-based visibility)
    loggedIn,
    userRole,

    // Processed navigation ({ main, footer } — see `navigation` computed)
    navigation,
    paletteGroups,

    // Utilities
    getGroup,
    isGroupVisible,
  }
}
