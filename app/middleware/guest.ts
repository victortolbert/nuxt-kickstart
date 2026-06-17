export default defineNuxtRouteMiddleware(async (to) => {
  const { loggedIn } = await fetchSessionIdentity()

  // Redirect logged-in users away from guest-only pages (like login)
  if (loggedIn) {
    const redirect = to.query.redirect as string | undefined
    if (redirect && redirect.startsWith('/') && !redirect.startsWith('//')) {
      return navigateToPath(redirect)
    }
    return navigateToPath('/app')
  }
})
