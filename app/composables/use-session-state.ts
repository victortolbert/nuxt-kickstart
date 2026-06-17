import { computed } from 'vue'
import { authClient } from '~/lib/auth-client'

/**
 * The Session Identity module (client side).
 *
 * Single place that derives identity state from the Better Auth session.
 * Components and composables should use this instead of re-deriving
 * `loggedIn` / `userRole` / `isAdmin` from `authClient.useSession()`.
 *
 * For route middleware (which must await a fresh session with forwarded
 * cookies), use `fetchSessionIdentity()` from app/utils/session-identity.ts.
 */

export interface SessionUser {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  role?: string | null
}

export function useSessionState() {
  const session = authClient.useSession()

  const user = computed<SessionUser | null>(() =>
    (session.value.data?.user as SessionUser | undefined) ?? null)
  const loggedIn = computed(() => !!user.value)
  const userRole = computed(() => user.value?.role ?? undefined)
  const isAdmin = computed(() => userRole.value === 'admin')

  return { session, user, loggedIn, userRole, isAdmin }
}
