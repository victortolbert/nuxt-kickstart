export default defineNuxtRouteMiddleware(async (to) => {
  const { loggedIn } = await fetchSessionIdentity()

  if (!loggedIn) {
    return navigateToPath({
      path: '/login',
      query: { redirect: to.fullPath },
    })
  }
})
