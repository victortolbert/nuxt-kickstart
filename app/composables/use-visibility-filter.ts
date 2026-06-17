import type { AuthUser } from '~~/shared/types/auth'
import { computed, readonly, ref, useRoute } from '#imports'

interface ContentWithVisibility {
  visibility?: 'public' | 'internal' | 'private'
}

export type DevVisibilityMode = 'bypass' | 'public' | 'internal' | 'admin'

const DEV_VISIBILITY_KEY = 'kickstart-dev-visibility'

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
 * Get the current dev visibility mode from localStorage
 * Only used in development mode with ?dev=true query param
 */
function getDevVisibilityMode(): DevVisibilityMode | null {
  // Only allow dev visibility modes when ?dev=true is present
  if (!isDevBypassEnabled())
    return null

  if (!import.meta.client)
    return 'bypass'
  try {
    const stored = localStorage.getItem(DEV_VISIBILITY_KEY)
    if (stored && ['bypass', 'public', 'internal', 'admin'].includes(stored)) {
      return stored as DevVisibilityMode
    }
  }
  catch {
    // localStorage not available
  }
  return 'bypass' // Default to bypass when dev mode is explicitly enabled
}

/**
 * Set the dev visibility mode in localStorage
 */
export function setDevVisibilityMode(mode: DevVisibilityMode): void {
  if (!import.meta.client)
    return
  try {
    localStorage.setItem(DEV_VISIBILITY_KEY, mode)
  }
  catch {
    // localStorage not available
  }
}

/**
 * Composable to manage dev visibility mode
 * Note: Dev visibility controls only work when ?dev=true is in the URL
 */
export function useDevVisibility() {
  const isActive = computed(() => isDevBypassEnabled())
  const mode = ref<DevVisibilityMode>(getDevVisibilityMode() ?? 'bypass')

  const setMode = (newMode: DevVisibilityMode) => {
    mode.value = newMode
    setDevVisibilityMode(newMode)
  }

  const modes: { value: DevVisibilityMode, label: string, description: string }[] = [
    { value: 'bypass', label: 'Bypass (Dev)', description: 'See all content regardless of visibility' },
    { value: 'public', label: 'Public User', description: 'See only public content' },
    { value: 'internal', label: 'Internal User', description: 'See public + internal content' },
    { value: 'admin', label: 'Admin', description: 'See all content (public + internal + private)' },
  ]

  return {
    mode: readonly(mode),
    setMode,
    modes,
    isDev: import.meta.dev,
    isActive, // true only when ?dev=true is present
  }
}

/**
 * Composable to filter content arrays based on visibility rules and user authentication state
 *
 * Visibility rules:
 * - public: Always visible to everyone
 * - internal: Visible only to authenticated users
 * - private: Visible only to admin users
 * - null/undefined visibility: Treated as 'private' (default secure)
 *
 * Dev mode bypass:
 * - Only enabled when ?dev=true query param is present in URL
 * - When enabled, uses localStorage setting to simulate different user roles
 * - Without ?dev=true, normal visibility rules apply even in development
 *
 * @param items - Array of content items with optional visibility field
 * @returns Filtered array based on current user's permissions
 */
export function useVisibilityFilter<T extends ContentWithVisibility>(items: T[]): T[] {
  const { loggedIn, user } = useSessionState()

  // Dev mode with ?dev=true: check for visibility bypass/simulation
  const devMode = getDevVisibilityMode()
  if (devMode !== null) {
    // Bypass mode: show everything
    if (devMode === 'bypass') {
      return items
    }

    // Simulate different user roles
    return items.filter((item) => {
      const visibility = item.visibility ?? 'private'

      if (devMode === 'public') {
        return visibility === 'public'
      }

      if (devMode === 'internal') {
        return visibility === 'public' || visibility === 'internal'
      }

      if (devMode === 'admin') {
        return true // Admin sees everything
      }

      return false
    })
  }

  // Normal visibility filtering (production and dev without ?dev=true)
  return items.filter((item) => {
    // Treat null/undefined visibility as 'private' (secure by default)
    const visibility = item.visibility ?? 'private'

    // Public content is always visible
    if (visibility === 'public') {
      return true
    }

    // Internal content requires authentication
    if (visibility === 'internal') {
      return loggedIn.value === true
    }

    // Private content requires admin role
    if (visibility === 'private') {
      const authUser = user.value as AuthUser | null
      return authUser?.role === 'admin'
    }

    // Fallback: hide content with unknown visibility values
    return false
  })
}
