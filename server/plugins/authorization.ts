import type { AuthUser } from '#shared/types/auth'
import { auth } from '#server/auth'
import { requestHeaders } from '#server/utils/session'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('request', async (event) => {
    event.context.$authorization = {
      // Headers only, never `toWebRequest(event)`: that takes ownership of the
      // body stream, and a route that calls `authorizeUser()` first and
      // `readBody()` second then waits forever on a body nothing will deliver.
      // The session lives in the cookie header.
      resolveServerUser: async (): Promise<AuthUser | null> => {
        const session = await auth.api.getSession({
          headers: requestHeaders(event),
        })

        if (!session?.user) {
          return null
        }

        return {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          avatar: session.user.image || null,
          provider: 'github',
          role: (session.user as any).role,
        }
      },
    }
  })
})
