/**
 * Global middleware to protect internal and private routes
 * Redirects unauthenticated users to login page
 */
import { isProtectedPath } from '#shared/utils/protected-paths'

export default defineNuxtRouteMiddleware(async (to) => {
  // The list, its public exceptions (/labs/broadsheet) and the locale
  // stripping live in shared/utils/protected-paths.ts, so the sitemap and the
  // noindex route rules read the same one. Matching is by whole segment:
  // '/app' must not match public siblings like '/appearance'.
  if (!isProtectedPath(to.path)) {
    return
  }

  const { loggedIn } = await fetchSessionIdentity()

  if (!loggedIn) {
    return navigateToPath({
      path: '/login',
      query: { redirect: to.fullPath },
    })
  }
})
