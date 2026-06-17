import type { AuthUser, ContentItem } from '../../shared/types/auth'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

type AbilityFn = (...args: unknown[]) => boolean

const baseUser: Omit<AuthUser, 'id' | 'role'> = {
  name: 'Test User',
  email: 'test@example.com',
  avatar: null,
  provider: 'credentials',
}

function makeUser(role: AuthUser['role'], id = 'user-1'): AuthUser {
  return {
    id,
    role,
    ...baseUser,
  }
}

function getContent(visibility: ContentItem['visibility'], authorId?: string): ContentItem {
  return {
    visibility,
    authorId,
  }
}

let abilities: {
  isAuthenticated: AbilityFn
  isAdmin: AbilityFn
  canEdit: AbilityFn
  viewPublicContent: AbilityFn
  viewInternalContent: AbilityFn
  viewPrivateContent: AbilityFn
  viewContent: AbilityFn
  createContent: AbilityFn
  editContent: AbilityFn
  deleteContent: AbilityFn
  changeVisibility: AbilityFn
  accessSettings: AbilityFn
  manageUsers: AbilityFn
  exportContent: AbilityFn
}

beforeEach(async () => {
  vi.stubGlobal('defineAbility', (...args: unknown[]) => {
    const fn = args.at(-1)
    if (typeof fn !== 'function')
      throw new Error('defineAbility test stub expected a predicate function')
    return fn
  })

  vi.resetModules()
  abilities = await import('../../shared/utils/abilities')
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('authorization abilities', () => {
  it('treats authenticated users as logged in', () => {
    const user = makeUser('viewer')
    expect(abilities.isAuthenticated(user)).toBe(true)
    expect(abilities.isAuthenticated(null)).toBe(false)
  })

  it('allows only admins for admin checks', () => {
    expect(abilities.isAdmin(makeUser('admin'))).toBe(true)
    expect(abilities.isAdmin(makeUser('editor'))).toBe(false)
    expect(abilities.isAdmin(makeUser('viewer'))).toBe(false)
  })

  it('allows admin or editor for edit access', () => {
    expect(abilities.canEdit(makeUser('admin'))).toBe(true)
    expect(abilities.canEdit(makeUser('editor'))).toBe(true)
    expect(abilities.canEdit(makeUser('viewer'))).toBe(false)
  })

  it('handles content visibility rules', () => {
    const admin = makeUser('admin', 'admin-1')
    const editor = makeUser('editor', 'editor-1')
    const viewer = makeUser('viewer', 'viewer-1')
    const author = makeUser('viewer', 'author-1')

    expect(abilities.viewPublicContent(null)).toBe(true)
    expect(abilities.viewInternalContent(null)).toBe(false)
    expect(abilities.viewInternalContent(viewer)).toBe(true)

    const privateContent = getContent('private', 'author-1')
    expect(abilities.viewPrivateContent(admin, privateContent)).toBe(true)
    expect(abilities.viewPrivateContent(author, privateContent)).toBe(true)
    expect(abilities.viewPrivateContent(editor, privateContent)).toBe(false)

    const publicContent = getContent('public')
    const internalContent = getContent('internal')
    expect(abilities.viewContent(null, publicContent)).toBe(true)
    expect(abilities.viewContent(null, internalContent)).toBe(false)
    expect(abilities.viewContent(viewer, internalContent)).toBe(true)
    expect(abilities.viewContent(admin, privateContent)).toBe(true)
    expect(abilities.viewContent(viewer, privateContent)).toBe(false)
    expect(abilities.viewContent(author, privateContent)).toBe(true)
  })

  it('defaults to deny unknown visibility values', () => {
    const viewer = makeUser('viewer')
    const content: ContentItem = { visibility: 'unknown' as ContentItem['visibility'] }
    expect(abilities.viewContent(viewer, content)).toBe(false)
  })

  it('allows authors and privileged roles to edit and delete', () => {
    const admin = makeUser('admin', 'admin-1')
    const editor = makeUser('editor', 'editor-1')
    const author = makeUser('viewer', 'author-1')
    const other = makeUser('viewer', 'viewer-1')
    const content = getContent('private', 'author-1')

    expect(abilities.createContent(author)).toBe(true)
    expect(abilities.editContent(admin, content)).toBe(true)
    expect(abilities.editContent(editor, content)).toBe(true)
    expect(abilities.editContent(author, content)).toBe(true)
    expect(abilities.editContent(other, content)).toBe(false)

    expect(abilities.deleteContent(admin, content)).toBe(true)
    expect(abilities.deleteContent(author, content)).toBe(true)
    expect(abilities.deleteContent(other, content)).toBe(false)
  })

  it('gates settings and user management by admin role', () => {
    expect(abilities.accessSettings(makeUser('admin'))).toBe(true)
    expect(abilities.accessSettings(makeUser('editor'))).toBe(false)

    expect(abilities.manageUsers(makeUser('admin'))).toBe(true)
    expect(abilities.manageUsers(makeUser('viewer'))).toBe(false)
  })

  it('allows any authenticated user to export content', () => {
    expect(abilities.exportContent(makeUser('viewer'))).toBe(true)
    expect(abilities.exportContent(makeUser('editor'))).toBe(true)
    expect(abilities.exportContent(makeUser('admin'))).toBe(true)
    expect(abilities.exportContent(null)).toBe(false)
  })
})
