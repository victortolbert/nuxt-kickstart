import type { AuthUser } from '~~/shared/types/auth'
import { authClient } from '~/lib/auth-client'

export default defineNuxtPlugin({
  name: 'authorization-resolver',
  parallel: true,
  setup() {
    return {
      provide: {
        authorization: {
          resolveClientUser: async (): Promise<AuthUser | null> => {
            const session = authClient.useSession()
            const user = session.value.data?.user

            if (!user) {
              return null
            }

            return {
              id: user.id,
              name: user.name,
              email: user.email,
              avatar: user.image || null,
              provider: 'github',
              role: (user as any).role,
            }
          },
        },
      },
    }
  },
})
