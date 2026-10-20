/**
 * The navigation visibility rules, as one pure module.
 *
 * Two callers read these: `/api/navigation`, which filters the tree for the
 * requesting session before anything leaves the server, and
 * `useNavigationConfig()`, which re-filters reactively while the client
 * session resolves. One implementation, so the two cannot disagree about
 * whether a group shows.
 *
 * The viewer is `VisibilityViewer` — the same descriptor the content rules
 * take, because navigation and content answer the same question about the
 * same person (ADR-0006). An item's `visibility` is read by `canViewContent`
 * itself, so an `internal` link hides exactly when an `internal` page would.
 *
 * `hidden` means parked-for-everyone and carries no audience meaning;
 * audience is `public` / `requiresAuth` / `requiresRole` on a group and
 * `visibility` on an item.
 */

import type { NavGroup, NavItem } from '../types/navigation'
import type { VisibilityViewer } from './content-visibility'
import { canViewContent } from './content-visibility'

/**
 * Facts about the build rather than the viewer. Only items carry `devOnly`,
 * and it is for whoever runs the dev server rather than for an audience tier,
 * so it stays out of the viewer descriptor. An omitted `isDev` means a
 * production build: a caller that forgets to say hides more, not less.
 */
export interface NavigationEnvironment {
  isDev?: boolean
}

/** The one role that names a tier above Member (ADR-0006: Owner). */
const OWNER_ROLE = 'admin'

/**
 * Can this viewer see this group?
 *
 * - `hidden` — parked for everyone, including the Owner
 * - `public: false` — signed-in viewers only (an unset `public` is open)
 * - `requiresAuth` — signed-in viewers only
 * - `requiresRole` — only `admin`, meaning the Owner; any other value is denied
 */
export function canViewNavGroup(
  group: NavGroup,
  viewer: VisibilityViewer,
): boolean {
  if (group.hidden)
    return false

  if (group.public === false && !viewer.loggedIn)
    return false

  if (group.requiresAuth && !viewer.loggedIn)
    return false

  if (group.requiresRole)
    return group.requiresRole === OWNER_ROLE && viewer.isAdmin

  return true
}

/**
 * Can this viewer see this item, in this build?
 *
 * An item's `visibility` mirrors the content it links to and is judged by the
 * content rules; an unset one is public (a nav link is shown unless it says
 * otherwise, unlike a document, which is private unless it says otherwise).
 * `devOnly` is checked against the environment.
 */
export function canViewNavItem(
  item: NavItem,
  viewer: VisibilityViewer,
  environment: NavigationEnvironment = {},
): boolean {
  if (item.hidden)
    return false

  if (item.devOnly && !environment.isDev)
    return false

  return canViewContent({ visibility: item.visibility ?? 'public' }, viewer)
}

/** Filter a list of items, and their children, down to what this viewer may see. */
export function filterNavItems(
  items: NavItem[] | null | undefined,
  viewer: VisibilityViewer,
  environment: NavigationEnvironment = {},
): NavItem[] {
  if (!items)
    return []

  return items
    .filter(item => canViewNavItem(item, viewer, environment))
    .map(item => (
      item.children
        ? { ...item, children: filterNavItems(item.children, viewer, environment) }
        : item
    ))
}

/**
 * Filter the whole tree down to what this viewer may see: the groups they are
 * allowed, each carrying only the items they are allowed.
 *
 * A group whose items all filter away is kept: this module reports what may
 * be seen, and dropping empty groups is the renderer's decision.
 */
export function filterNavigation(
  groups: NavGroup[] | null | undefined,
  viewer: VisibilityViewer,
  environment: NavigationEnvironment = {},
): NavGroup[] {
  if (!groups)
    return []

  return groups
    .filter(group => canViewNavGroup(group, viewer))
    .map(group => ({ ...group, items: filterNavItems(group.items, viewer, environment) }))
}
