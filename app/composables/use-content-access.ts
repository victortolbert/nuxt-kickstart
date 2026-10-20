import type { ContentWithVisibility, VisibilityViewer } from '#shared/utils/content-visibility'
import { useRoute } from '#imports'
import { canViewContent, effectiveVisibility } from '#shared/utils/content-visibility'

interface ContentAccessResult {
  canAccess: boolean
  redirectTo?: string
  errorCode?: number
}

/**
 * Check if dev bypass is enabled via query param
 * Only works in development mode with ?dev=true
 */
function isDevBypassEnabled(): boolean {
  if (!import.meta.dev)
    return false

  // On client, use window.location directly for reliability
  if (import.meta.client && typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search)
    return params.get('dev') === 'true'
  }

  // On server, use useRoute which should have query params
  try {
    const route = useRoute()
    return route.query.dev === 'true'
  }
  catch {
    return false
  }
}

/**
 * What a detail page does with the visibility answer. Pure, so the decision is
 * testable without a session; whether the viewer may see the item at all is
 * `canViewContent`'s call, shared with the listings and the sitemap.
 *
 * - missing item → 404
 * - visible → render
 * - internal (as read by `effectiveVisibility`) + signed out → login, keeping the path
 * - anything else → 404, so a private page is indistinguishable from no page
 */
export function resolveContentAccess(
  item: ContentWithVisibility | null | undefined,
  viewer: VisibilityViewer,
  path: string,
): ContentAccessResult {
  if (!item)
    return { canAccess: false, errorCode: 404 }

  if (canViewContent(item, viewer))
    return { canAccess: true }

  // Internal content is not secret, just gated — send a visitor to log in
  // rather than pretending the page does not exist.
  if (effectiveVisibility(item) === 'internal' && !viewer.loggedIn)
    return { canAccess: false, redirectTo: `/login?redirect=${path}` }

  return { canAccess: false, errorCode: 404 }
}

/**
 * Composable to check access permissions for a single content item
 *
 * Returns appropriate access state for detail pages:
 * - For private content + not admin: returns 404 error
 * - For internal content + not logged in: returns redirect to login
 * - For public or authorized content: returns access granted
 *
 * Dev bypass: In development mode with ?dev=true query param,
 * all content is accessible. Otherwise, normal visibility rules apply.
 *
 * @param item - Content item with optional visibility field
 * @returns Reactive object with canAccess, redirectTo, and errorCode
 */
export function useContentAccess(item: ContentWithVisibility | null | undefined): ContentAccessResult {
  const { loggedIn, isAdmin } = useSessionState()
  const route = useRoute()

  // Dev bypass: only with ?dev=true query param
  if (item && isDevBypassEnabled()) {
    return {
      canAccess: true,
    }
  }

  return resolveContentAccess(item, { loggedIn: loggedIn.value, isAdmin: isAdmin.value }, route.path)
}
