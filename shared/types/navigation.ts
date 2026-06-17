/**
 * Navigation item within a group
 */
export interface NavItem {
  slug: string
  label: string
  icon?: string
  path?: string
  description?: string
  hidden?: boolean
  devOnly?: boolean
  /**
   * Hide the item unless the viewer could access its linked content, mirroring
   * the page-level rule in useContentAccess: `internal` needs login, `private`
   * needs an admin role. Omitted = always shown (public). Keep in sync with the
   * target content's `visibility` frontmatter.
   */
  visibility?: 'public' | 'internal' | 'private'
  badge?: string | number
  children?: NavItem[]
}

/**
 * Where a Navigation group renders in the sidebar.
 * `main` (default) flows in the top list; `footer` is pinned to the bottom
 * above a separator (e.g. Admin). Unknown/omitted values resolve to `main`.
 */
export type NavSection = 'main' | 'footer'

/**
 * Navigation group configuration
 * Loaded from content/navigation/*.yml files
 */
export interface NavGroup {
  id: string
  label: string
  icon?: string
  hidden?: boolean
  order: number
  /** Sidebar placement; defaults to `main`. See {@link NavSection}. */
  section?: NavSection
  defaultOpen?: boolean
  public?: boolean
  requiresAuth?: boolean
  requiresRole?: string
  items: NavItem[]
}

/**
 * Processed navigation ready for UNavigationMenu
 */
export interface ProcessedNavGroup {
  label: string
  icon?: string
  defaultOpen?: boolean
  to?: string
  children?: ProcessedNavItem[]
}

export interface ProcessedNavItem {
  label: string
  icon?: string
  to: string
  badge?: string | number
}
