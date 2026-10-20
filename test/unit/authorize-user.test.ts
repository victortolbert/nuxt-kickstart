import type { H3Event } from 'h3'
import { readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { defineAbility } from 'nuxt-authorization/utils'
import { describe, expect, it, vi } from 'vitest'

// `createError` is a Nitro auto-import in a built server; stubbed the way every
// route test here stubs it, before the util is loaded.
function createError(input: { statusCode: number, statusMessage?: string, message: string }) {
  const err = new Error(input.message) as Error & { statusCode: number, statusMessage?: string }
  err.statusCode = input.statusCode
  err.statusMessage = input.statusMessage
  return err
}
vi.stubGlobal('createError', createError)

const { authorizeUser } = await import('../../server/utils/authorize-user')

/**
 * Anonymous is 401; signed in and still refused is 403 (ADR-0008).
 *
 * `nuxt-authorization`'s `authorize()` collapses the two: an ability without
 * `allowGuest` short-circuits a null user to `{ authorized: false }` with no
 * status, and `createAuthorizationError` fills in 403 — so a guest and a
 * signed-in non-admin get the same code, same message, same line. A client
 * branching on 401 to prompt a sign-in never fires. Pinning the status here
 * means a dependency bump cannot move it without a test noticing.
 *
 * The module's server `authorize()` also swallows anything that is not an
 * `AuthorizationError` — a failed session lookup let the request through. The
 * wrapper rethrows.
 */

const isAdmin = defineAbility((user: { role?: string }) => user.role === 'admin')
const anyone = defineAbility({ allowGuest: true }, () => true)

function eventFor(user: { role?: string } | null): H3Event {
  return {
    context: { $authorization: { resolveServerUser: async () => user } },
  } as unknown as H3Event
}

describe('authorizeUser', () => {
  it('refuses an anonymous request with 401', async () => {
    await expect(authorizeUser(eventFor(null), isAdmin)).rejects.toMatchObject({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  })

  it('refuses a signed-in user the ability denies with 403', async () => {
    await expect(authorizeUser(eventFor({ role: 'viewer' }), isAdmin)).rejects.toMatchObject({
      statusCode: 403,
      statusMessage: 'Forbidden',
    })
  })

  it('lets a signed-in user the ability allows through', async () => {
    await expect(authorizeUser(eventFor({ role: 'admin' }), isAdmin)).resolves.toBeUndefined()
  })

  it('lets a guest through an ability that allows guests', async () => {
    // The 401 is for abilities that need a user, not a blanket sign-in wall.
    await expect(authorizeUser(eventFor(null), anyone)).resolves.toBeUndefined()
  })

  it('does not swallow a failed session lookup', async () => {
    const event = {
      context: { $authorization: { resolveServerUser: async () => { throw new Error('session store down') } } },
    } as unknown as H3Event

    await expect(authorizeUser(event, isAdmin)).rejects.toThrow('session store down')
  })
})

describe('the routes', () => {
  /** Every handler under server/api, comments stripped. */
  function handlers(dir: string): Array<{ path: string, code: string }> {
    return readdirSync(dir, { recursive: true, withFileTypes: true })
      .filter(entry => entry.isFile() && /\.(?:get|post|put|patch|delete)\.ts$/.test(entry.name))
      .map((entry) => {
        const path = join(entry.parentPath, entry.name)
        const code = readFileSync(path, 'utf-8')
          .replace(/\/\*[\s\S]*?\*\//g, '')
          .replace(/\/\/[^\n]*/g, '')
        return { path: path.slice(dir.length + 1), code }
      })
  }

  it('reach abilities only through authorizeUser', () => {
    // A route still on the bare `authorize()` answers 403 to a guest on its
    // own, and nothing else would notice.
    const all = handlers(resolve(__dirname, '../../server/api'))
    const wrapped = all.filter(({ code }) => /\bauthorizeUser\(/.test(code))
    const bare = all.filter(({ code }) => /(?<![\w.])authorize\(/.test(code)).map(({ path }) => path)

    expect(wrapped.length, 'the wrapper should be in use').toBeGreaterThan(0)
    expect(bare).toEqual([])
  })
})
