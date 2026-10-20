import type { AuthUser } from '#shared/types/auth'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { ASSIGNABLE_ROLES, OWNER_ROLE } from '#shared/utils/roles'

/**
 * The admin UI offers only the roles it owns.
 *
 * Both admin user surfaces offered `Admin` through `authClient.admin.setRole()`.
 * The login sync demotes any stored `admin` that `ADMIN_EMAILS` does not list,
 * so that grant would appear to work — row updated, toast fired — and silently
 * undo itself at that person's next sign-in. `ADMIN_EMAILS` is the one way
 * Owner is granted, and the picker offers the roles the UI genuinely owns.
 */

const ROOT = resolve(__dirname, '../..')
const ADMIN_PAGES = ['app/pages/app/admin/users/index.vue', 'app/pages/app/admin/users/[id].vue']

/** The three roles the app defines, as the type declares them. */
const KNOWN_ROLES: ReadonlyArray<AuthUser['role']> = ['admin', 'editor', 'viewer']

describe('assignable roles', () => {
  it('never include the Owner role', () => {
    expect(OWNER_ROLE).toBe('admin')
    expect(ASSIGNABLE_ROLES).not.toContain(OWNER_ROLE)
  })

  it('are all roles the app defines', () => {
    // `editor` is real: `shared/utils/abilities.ts` grants it `canEdit` and
    // `editContent`. Anything the picker offers must be a role something reads.
    for (const role of ASSIGNABLE_ROLES)
      expect(KNOWN_ROLES).toContain(role)
    expect(ASSIGNABLE_ROLES.length).toBeGreaterThan(0)
  })

  it.each(ADMIN_PAGES)('%s builds no role list of its own', (page) => {
    // The list lives in one place so the two pages cannot drift back apart.
    const source = readFileSync(resolve(ROOT, page), 'utf-8')
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/[^\n]*/g, '')

    // The role *filter* on the index page may still name Admin: filtering by a
    // role is not granting it. What may not exist is an edit list naming it.
    const editList = source.match(/const roleEditItems\s*=[\s\S]*?\n\}\)\)\)?/)?.[0] ?? ''
    expect(editList, `${page} should build roleEditItems`).not.toBe('')
    expect(editList, `${page} should build roleEditItems from ASSIGNABLE_ROLES`).toMatch(/ASSIGNABLE_ROLES\.map/)
    expect(editList, `${page} should not offer the Owner role`).not.toMatch(/value:\s*'admin'/)
    expect(source, `${page} should take its roles from #shared/utils/roles`).toMatch(/import \{[^}]*\bASSIGNABLE_ROLES\b[^}]*\} from '#shared\/utils\/roles'/)
  })
})
