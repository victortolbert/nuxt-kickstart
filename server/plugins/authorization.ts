import type { AuthUser } from '~~/shared/types/auth'
import { auth } from '#server/auth'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('request', async (event) => {
    event.context.$authorization = {
      resolveServerUser: async (): Promise<AuthUser | null> => {
        const request = toWebRequest(event)
        const session = await auth.api.getSession({
          headers: request.headers,
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
