/**
 * The Session Identity module (request side).
 *
 * Awaitable identity for route middleware: fetches the Better Auth session
 * with forwarded cookies during SSR and derives the same fields as
 * `useSessionState()` does on the client.
 */

export interface SessionIdentity {
  loggedIn: boolean
  user: { id: string, role?: string | null } | null
  role?: string
  isAdmin: boolean
}

export async function fetchSessionIdentity(): Promise<SessionIdentity> {
  const headers = import.meta.server ? useRequestHeaders(['cookie']) : undefined
  const session = await $fetch<{ user?: { id: string, role?: string | null } } | null>(
    '/api/auth/get-session',
    { headers },
  )

  const user = session?.user ?? null
  const role = user?.role ?? undefined
  return { loggedIn: !!user, user, role, isAdmin: role === 'admin' }
}
