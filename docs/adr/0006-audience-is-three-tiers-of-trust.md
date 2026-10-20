# Audience is three tiers of trust

Who someone is to the site is a question of trust, not of how they
authenticated: **Visitor**, **Member** or **Owner**. Each tier maps to one
`visibility` value, and every surface asks the same pure rules
(`shared/utils/content-visibility.ts`, `shared/utils/navigation-visibility.ts`)
with the same viewer descriptor, `{ loggedIn, isAdmin }`.

| Tier | Sees | Enforced by |
| --- | --- | --- |
| **Visitor** | `public` | no session |
| **Member** | `public`, `internal` | signed in, any role but `admin` |
| **Owner** | everything | `admin` role |

An absent `visibility` resolves to `private`. Content is secret by default and
published on purpose. An unrecognized value is denied to everyone, the Owner
included, so a typo hides a page instead of publishing it.

Two statuses adjust the tier a `public` document is read at
(`effectiveVisibility`):

- **`wilted`** reads as `internal`. Wilted is the archive verdict: the page
  drops out of a visitor's listings and the sitemap and stays at its URL for a
  Member.
- **The review gate** holds an unreviewed `public` document as `internal` in a
  gated collection until it carries `reviewed: YYYY-MM-DD`. The template gates
  no collection (`REVIEW_GATED_PREFIXES` is empty). Gate one by adding its
  content-path prefix there.

## The surfaces

One rule set, read by:

1. **Listings**: `useVisibilityFilter`.
2. **Detail pages**: `useContentAccess`. Internal content sends a Visitor to
   log in. Private content returns 404, which looks the same as a missing page.
3. **Navigation**: `/api/navigation` filters for the requesting session, and
   `useNavigationConfig` re-filters reactively.
4. **The sitemap**: the `content:file:afterParse` hook drops any document that
   is not effectively public. `shared/utils/protected-paths.ts` drives the
   sitemap's route excludes, the `robots: false` route rules and the global
   middleware from one list.

A `.select()` that reads `visibility` must also read `path`, `reviewed` and
`status`, or the rules cannot place the item
(`test/unit/content-visibility-selects.test.ts`).

## What the middle tier means here

The template ships with signup **open**. A first magic-link or OTP sign-in
creates the account (`server/auth.ts`, `disableSignUp` unset), so `internal`
means "anyone who can receive an email", not "someone who was let in". That is
the right default for a starter, but `internal` is then not a trust boundary.
A project that wants it to be one closes signup: either set `disableSignUp`, or
add an allowlist check in the `user.create.before` database hook that every
sign-in path converges on. Phone OTP has no email to match against an
allowlist, and OAuth only asserts an address, so both need deciding explicitly.

## The `admin` conflation, accepted knowingly

`private` resolves to `role === 'admin'`. That conflates two claims:
*administers the application* and *owns the content*. They coincide while
`ADMIN_EMAILS` names one person. **The tripwire: granting anyone else `admin`
to let them manage users silently hands them every `private` document.** If a
second administrator is ever needed, separate the two claims first.

## Considered options

- **A distinct `member` role above `viewer`.** More explicit, and better if
  several guest tiers appear. Premature for a starter. Closing signup gets the
  same semantics from the role that already exists.
- **Separate ownership from administration now.** Correct in the abstract, but
  it builds for a second owner the template does not have. Recorded above as a
  tripwire.

## Consequences

- Any "view as" preview must change the viewer passed to the rules, not only
  the layout. The dev visibility modes (`?dev=true`) do this: each simulated
  tier is a viewer handed to `filterByVisibility`.
- `hidden` on navigation means parked for everyone and nothing else. Audience is
  `public` / `requiresAuth` / `requiresRole` on a group and `visibility` on an
  item.
- None of this is confidentiality. See ADR-0005.
