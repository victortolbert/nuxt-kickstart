export default defineEventHandler(async (event) => {
  // This will throw 401 if user is not logged in
  const session = await requireUserSession(event)

  return {
    message: 'You have access to this protected resource',
    user: session.user,
  }
})
