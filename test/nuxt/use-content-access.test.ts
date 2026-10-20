import { describe, expect, it } from 'vitest'
import { resolveContentAccess } from '../../app/composables/use-content-access'

/**
 * The detail-page decision, through its pure seam. The visibility question is
 * `canViewContent`'s (covered in test/unit/content-visibility.test.ts); this
 * covers what a page does with the answer: render, send to login, or 404.
 */

const VISITOR = { loggedIn: false, isAdmin: false }
const MEMBER = { loggedIn: true, isAdmin: false }
const OWNER = { loggedIn: true, isAdmin: true }
const PATH = '/guides/architecture'

describe('resolveContentAccess', () => {
  it('404s a missing item for everyone', () => {
    for (const viewer of [VISITOR, MEMBER, OWNER])
      expect(resolveContentAccess(null, viewer, PATH)).toEqual({ canAccess: false, errorCode: 404 })
  })

  it('renders public content for a visitor', () => {
    expect(resolveContentAccess({ visibility: 'public' }, VISITOR, PATH)).toEqual({ canAccess: true })
  })

  it('sends a visitor to log in for internal content, keeping the path', () => {
    expect(resolveContentAccess({ visibility: 'internal' }, VISITOR, PATH)).toEqual({
      canAccess: false,
      redirectTo: `/login?redirect=${PATH}`,
    })
  })

  it('renders internal content for a member', () => {
    expect(resolveContentAccess({ visibility: 'internal' }, MEMBER, PATH)).toEqual({ canAccess: true })
  })

  it('404s private content for a member rather than admitting it exists', () => {
    expect(resolveContentAccess({ visibility: 'private' }, MEMBER, PATH)).toEqual({ canAccess: false, errorCode: 404 })
    expect(resolveContentAccess({ visibility: 'private' }, VISITOR, PATH)).toEqual({ canAccess: false, errorCode: 404 })
  })

  it('renders private content for the owner', () => {
    expect(resolveContentAccess({ visibility: 'private' }, OWNER, PATH)).toEqual({ canAccess: true })
  })

  it('treats a wilted public page as internal: login for a visitor', () => {
    expect(resolveContentAccess({ visibility: 'public', status: 'wilted' }, VISITOR, PATH)).toEqual({
      canAccess: false,
      redirectTo: `/login?redirect=${PATH}`,
    })
  })

  it('404s an unrecognized visibility value even for the owner', () => {
    expect(resolveContentAccess({ visibility: 'bogus' }, OWNER, PATH)).toEqual({ canAccess: false, errorCode: 404 })
  })
})
