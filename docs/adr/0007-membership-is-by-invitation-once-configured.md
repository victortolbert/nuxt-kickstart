# Membership is by invitation once configured

**Amends ADR-0006** (audience is three tiers of trust, added in #29), which holds the tier table. ADR-0006 defines the
tiers (Visitor, Member, Owner) and notes that while signup is open, `internal`
means "anyone who can receive an email", not "someone who was let in". This ADR
records how the template closes that gap and when. **`internal` means "let in"
once `MEMBER_EMAILS` or `ADMIN_EMAILS` is set, and "signed in" while both are
unset.** The tiers, the visibility rules and the `admin` conflation tripwire
are unchanged and stay in ADR-0006.

## The two modes

| `MEMBER_EMAILS` / `ADMIN_EMAILS` | Mode | A Member is |
| --- | --- | --- |
| both unset or empty | **open** | anyone with a verified address |
| either has an entry | **closed** | someone whose address is listed |

- **Closed.** Sign-up is invitation-only, and it fails closed. An address on
  neither list is refused at sign-up and at every later sign-in, including an
  account created before the lists were set. A list holding only malformed
  entries still counts as closed. It admits nobody, and the server warns about
  it at boot. A typo must never reopen sign-up.
- **Open.** Anyone with a proven address may sign up as a `viewer`. The server
  logs one `console.warn` at boot saying membership is open and how to close
  it.

`ADMIN_EMAILS` counts as an invitation, so owners don't need to be repeated in
`MEMBER_EMAILS`.

**This deliberately differs from UXLab, the app this was ported from, where
both lists empty signs in nobody.** That's right for a single deployment
whose operator sets the variables. It's wrong for a template: someone who
clones the template and runs `pnpm dev` would get a sign-in page that sends a
magic link and then refuses them. That looks like a broken template, not a
secure one.

**The transition is the thing to know.** Accounts created while the deployment
was open become strangers the moment either list is set. Each one is refused
at its next sign-in with `MEMBERSHIP_REVOKED` until its address is listed.
Before setting the lists on a deployment that has been running open, list
everyone who should keep access.

## Enforcement

The rules are pure functions in `server/utils/membership.ts`. They run at the
two points every sign-in path converges on, both of them Better Auth database
hooks in `server/auth.ts`:

```text
sign-in (magic link | email OTP | GitHub | phone)
├─ new user? → user.create.before
│    ├─ admin create-user route?  → 403 MEMBERSHIP_ADMIN_CREATE_CLOSED
│    ├─ mayJoin(email)?  no       → 403 MEMBERSHIP_BY_INVITATION_ONLY
│    ├─ hasProvenAddress? no      → 403 MEMBERSHIP_ADDRESS_NOT_VERIFIED
│    └─ create with roleForNewMember (admin if in ADMIN_EMAILS, else viewer)
└─ session.create.before
     ├─ mayRemain(email)? no      → 403 MEMBERSHIP_REVOKED (row kept)
     └─ session.create.after: roleOnLogin syncs admin both ways
```

- **Admission** happens once, in `user.create.before`. All four sign-in paths
  create users through the same adapter call, so one check covers them.
- **Continued membership** is checked on every sign-in, in
  `session.create.before`. The check runs before the session exists, so no
  cookie is set. The row is kept, so re-listing the address is the whole undo.
- **The Owner role syncs both ways** on every login. A listed address is
  promoted, and a stored `admin` that is no longer listed is demoted to
  `viewer`. This applies in open mode too: a deployment that configures no
  Owner has none. No other role is touched, so `editor` survives. The admin UI
  doesn't offer `admin` (`shared/utils/roles.ts`), because the next login would
  undo the grant.

ADR-0006 left three paths "to decide explicitly". They are decided as follows,
and the same answers hold in both modes:

- **OAuth** asserts an address without proving it, so the create hook requires
  `emailVerified: true`. In closed mode, this stops an invitation being claimed
  by whoever adds the invited address to their own GitHub account first. In
  open mode, it stops someone squatting an address that would pass `mayRemain`
  the day its real owner is listed.
- **Phone OTP** has no email to match, so it can't create accounts
  (`signUpOnVerification` stays unset). It can only link a number to an account
  that already exists.
- **The admin plugin's create-user route** admits nobody, because the row it
  builds has proven nothing. Membership is granted by the lists.

A refusal is a 403 with a stable `MEMBERSHIP_*` code, because the person has
authenticated and is still refused (ADR-0008). A refusal that a browser
navigated into (the magic link or the GitHub callback) is turned into a
redirect to `/login?error=<code>` by `server/utils/auth-refusal.ts`, and the
login page renders it in the visitor's locale.

## Considered options

- **Closed even when unconfigured, as in UXLab.** The more secure default, but
  it breaks the out-of-the-box experience a template exists to provide.
  Rejected by the owner in favor of open-with-a-warning.
- **`disableSignUp`.** It closes sign-up to invited addresses too, so admission
  would need a second, admin-driven path. The allowlist uses the hook that
  already exists.
- **A real invite flow, where a generated link creates the account.** The right
  product eventually. It's roughly a feature's worth of building, against one
  hook for an allowlist.
- **A distinct `member` role.** Rejected in ADR-0006, for the same reason it
  still holds here.
