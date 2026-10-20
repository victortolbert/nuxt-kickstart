# An anonymous request is refused with 401, a signed-in one with 403

`nuxt-authorization`'s server `authorize(event, ability)` answers a request
with no session with `403`. An ability without `allowGuest` short-circuits a
null user to `{ authorized: false }` with no status, and the error it builds
defaults to 403. Meanwhile `requireUserSession` (`server/utils/session.ts`)
answers the same condition with `401`. Left alone, the two conventions sit side
by side, and nothing pins either number.

**A request with no session is refused with `401 Unauthorized`. A request with
a session that the ability denies is refused with `403 Forbidden`.** The two
codes exist to tell "you are not signed in" apart from "you are, and still may
not", and a client can branch on that: a 401 prompts a sign-in, a 403 does not.

Every route that gates on an ability goes through `authorizeUser()` in
`server/utils/authorize-user.ts`. It resolves the session and answers 401 to a
null user unless the ability allows guests. Otherwise it hands the user to the
library's `authorize()` and translates its 403. It also lets a failed session
lookup propagate, where the module's own helper swallows it and lets the
request through. Routes under `server/api/` don't call the bare `authorize()`.
`test/unit/authorize-user.test.ts` sweeps for it and pins both statuses, so a
dependency bump can't move them silently.

The resolver that `authorizeUser()` calls (`server/plugins/authorization.ts`)
reads the session from the request headers only, through the same
`requestHeaders()` helper `requireUserSession` uses. `toWebRequest(event)`
takes ownership of the body stream, so a resolver that called it would leave
any `authorizeUser()`-then-`readBody()` route hanging forever, with no error.
`test/unit/authorization-plugin.test.ts` pins this.

Membership refusals at sign-in (ADR-0007) are 403s for the same reason: the
person has authenticated and is still refused.

## Considered

- **Document the split and leave the codes.** Rejected: the ambiguity stays,
  and a client that branches on 401 still never fires for ability-gated routes.
- **403 everywhere.** Rejected: it throws away the one bit of information the
  two codes carry.
- **Pass `statusCode: 401` through `deny()` in each ability.** Rejected: the
  null-user short-circuit happens in `defineAbility` before the ability's own
  function runs, so an ability can't say anything about a guest.
