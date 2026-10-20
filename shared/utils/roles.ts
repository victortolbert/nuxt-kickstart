import type { AuthUser } from '#shared/types/auth'

/**
 * Which roles the admin UI may assign, and which one it may not.
 *
 * `ADMIN_EMAILS` is the single source of truth for `admin`: the login sync
 * promotes a listed address and demotes a stored `admin` it does not list, on
 * that person's next sign-in (`roleOnLogin` in `server/utils/membership.ts`). A
 * grant from the UI would therefore appear to work — the row updates, the toast
 * fires — and silently undo itself the next time that person signs in. So the
 * picker offers the roles the UI genuinely owns, and an Owner row shows a badge
 * pointing at the variable instead.
 *
 * Shared between the users index and the user detail page so the two cannot
 * drift apart; `test/unit/roles.test.ts` checks that they do not. Labels are
 * translated at the call site (`admin.users.roles.<role>`).
 */
export const OWNER_ROLE = 'admin' satisfies AuthUser['role']

/** Roles the login sync leaves alone, and so the UI may grant and keep. */
export const ASSIGNABLE_ROLES = ['editor', 'viewer'] as const satisfies ReadonlyArray<AuthUser['role']>

export type AssignableRole = (typeof ASSIGNABLE_ROLES)[number]
