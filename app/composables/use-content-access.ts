import type { AuthUser } from '~~/shared/types/auth'
import { useRoute } from '#imports'

interface ContentWithVisibility {
  visibility?: 'public' | 'internal' | 'private'
}

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
  const { loggedIn, user } = useSessionState()
  const route = useRoute()

  if (!item) {
    return {
      canAccess: false,
      errorCode: 404,
    }
  }

  // Dev bypass: only with ?dev=true query param
  if (isDevBypassEnabled()) {
    return {
      canAccess: true,
    }
  }

  // Treat null/undefined visibility as 'private' (secure by default)
  const visibility = item.visibility ?? 'private'

  // Public content is always accessible
  if (visibility === 'public') {
    return {
      canAccess: true,
    }
  }

  // Internal content requires authentication
  if (visibility === 'internal') {
    if (loggedIn.value) {
      return {
        canAccess: true,
      }
    }
    else {
      return {
        canAccess: false,
        redirectTo: `/login?redirect=${route.path}`,
      }
    }
  }

  // Private content requires admin role
  if (visibility === 'private') {
    const authUser = user.value as AuthUser | null
    if (authUser?.role === 'admin') {
      return {
        canAccess: true,
      }
    }
    else {
      return {
        canAccess: false,
        errorCode: 404,
      }
    }
  }

  // Fallback: deny access for unknown visibility values
  return {
    canAccess: false,
    errorCode: 404,
  }
}
