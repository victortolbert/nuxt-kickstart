# Routes

Server routes that live **outside** the `/api/*` REST tree — used here for the
Better Auth handler and WebSocket endpoints.

## Difference from `server/api/`

| `server/api/`      | `server/routes/`                 |
| ------------------ | -------------------------------- |
| JSON REST handlers | Catch-all handlers, WebSockets   |
| Prefixed `/api/`   | Arbitrary paths                  |

## Files

| File                      | Purpose                                                      |
| ------------------------- | ----------------------------------------------------------- |
| `api/auth/[...all].ts`    | Better Auth catch-all — handles all `/api/auth/*` requests   |
| `_ws/scoreboard.ts`       | WebSocket endpoint streaming live scoreboard updates         |

## Better Auth Handler

All authentication flows (magic link, email OTP, phone OTP, GitHub OAuth,
session retrieval) are delegated to Better Auth:

```ts
import { auth } from '#server/auth'

export default defineEventHandler(event => auth.handler(toWebRequest(event)))
```

Client calls go through `app/lib/auth-client.ts` (`authClient.signIn.*`,
`authClient.useSession()`), which hit these routes.

## Learn More

- [Server Routes](https://nuxt.com/docs/guide/directory-structure/server#server-routes)
- [Better Auth](https://www.better-auth.com/)
- [Nitro WebSockets](https://nitro.build/guide/websocket)
