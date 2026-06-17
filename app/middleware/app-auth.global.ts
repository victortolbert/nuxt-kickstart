/**
 * Global middleware to protect internal and private routes
 * Redirects unauthenticated users to login page
 */
export default defineNuxtRouteMiddleware(async (to) => {
  // Define protected route patterns
  const protectedPaths = [
    '/app',
    '/admin',
    '/settings',
    '/labs',
  ]

  // Public exceptions inside an otherwise-protected prefix. The Scoreboard demo
  // (under /labs) is public-facing with its own access model — a public board,
  // token-based judge links, and a PIN-gated admin — so it must not sit behind
  // the app login gate.
  const publicExceptions = [
    '/labs/scoreboard',
  ]
  const isPublicException = publicExceptions.some(
    path => to.path === path || to.path.startsWith(`${path}/`),
  )

  if (isPublicException) {
    return
  }

  // Check if current route is protected (segment-aware: '/app' must not
  // match public siblings like '/blocks')
  const isProtected = protectedPaths.some(
    path => to.path === path || to.path.startsWith(`${path}/`),
  )

  if (!isProtected) {
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
