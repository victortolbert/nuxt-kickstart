import type { ContentWithVisibility, VisibilityViewer } from '#shared/utils/content-visibility'
import { computed, readonly, ref, useRoute } from '#imports'
import { filterByVisibility } from '#shared/utils/content-visibility'

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
 * The viewer each simulated dev mode stands in for. Simulation goes through
 * the real rules, so a `public` preview hides wilted and unreviewed pages
 * exactly as a visitor's listing does.
 */
const DEV_VIEWERS: Record<Exclude<DevVisibilityMode, 'bypass'>, VisibilityViewer> = {
  public: { loggedIn: false, isAdmin: false },
  internal: { loggedIn: true, isAdmin: false },
  admin: { loggedIn: true, isAdmin: true },
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
  const { loggedIn, isAdmin } = useSessionState()

  // Dev mode with ?dev=true: bypass, or simulate a tier through the same rules
  const devMode = getDevVisibilityMode()
  if (devMode === 'bypass')
    return items
  if (devMode !== null)
    return filterByVisibility(items, DEV_VIEWERS[devMode])

  // Normal visibility filtering (production and dev without ?dev=true).
  // The rules live in `canViewContent` so this pass, the page guard and the
  // sitemap cannot drift apart.
  return filterByVisibility(items, {
    loggedIn: loggedIn.value === true,
    isAdmin: isAdmin.value,
  })
}
