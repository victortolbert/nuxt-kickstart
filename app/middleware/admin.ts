export default defineNuxtRouteMiddleware(async () => {
  const { loggedIn, isAdmin } = await fetchSessionIdentity()

  if (!loggedIn) {
    return navigateToPath('/login')
  }

  if (!isAdmin) {
    return navigateToPath('/')
  }
})
