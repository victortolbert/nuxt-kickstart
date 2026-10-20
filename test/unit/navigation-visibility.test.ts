import type { NavGroup, NavItem } from '../../shared/types/navigation'
import { readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import YAML from 'yaml'
import {
  canViewNavGroup,
  canViewNavItem,
  filterNavigation,
  filterNavItems,
} from '../../shared/utils/navigation-visibility'

const VISITOR = { loggedIn: false, isAdmin: false }
const MEMBER = { loggedIn: true, isAdmin: false }
const OWNER = { loggedIn: true, isAdmin: true }

const makeItem = (over: Partial<NavItem> = {}): NavItem => ({ slug: 's', label: 'L', path: '/x', ...over })
const makeGroup = (over: Partial<NavGroup> = {}): NavGroup => ({ id: 'g', label: 'G', order: 0, items: [makeItem()], ...over })

/** Every combination of the group audience flags, and who each admits. */
const AUDIENCE_COMBINATIONS: { flags: Partial<NavGroup>, visitor: boolean, member: boolean, owner: boolean }[] = [
  { flags: {}, visitor: true, member: true, owner: true },
  { flags: { public: true }, visitor: true, member: true, owner: true },
  { flags: { public: false }, visitor: false, member: true, owner: true },
  { flags: { requiresAuth: true }, visitor: false, member: true, owner: true },
  { flags: { requiresRole: 'admin' }, visitor: false, member: false, owner: true },
  { flags: { requiresAuth: true, requiresRole: 'admin' }, visitor: false, member: false, owner: true },
]

describe('canViewNavGroup', () => {
  for (const { flags, visitor, member, owner } of AUDIENCE_COMBINATIONS) {
    const name = JSON.stringify(flags)

    it(`answers every tier for ${name}`, () => {
      const group = makeGroup(flags)
      expect(canViewNavGroup(group, VISITOR)).toBe(visitor)
      expect(canViewNavGroup(group, MEMBER)).toBe(member)
      expect(canViewNavGroup(group, OWNER)).toBe(owner)
    })

    it(`hides ${name} from every tier once hidden`, () => {
      const parked = makeGroup({ ...flags, hidden: true })
      for (const viewer of [VISITOR, MEMBER, OWNER])
        expect(canViewNavGroup(parked, viewer)).toBe(false)
    })
  }

  it('denies an unrecognized role rather than passing it through', () => {
    // Only `admin` names a tier above Member (ADR-0006); anything else is a
    // typo or a role nobody has wired up, and must not be granted by default.
    for (const viewer of [VISITOR, MEMBER, OWNER])
      expect(canViewNavGroup(makeGroup({ requiresRole: 'editor' }), viewer)).toBe(false)
  })
})

describe('canViewNavItem', () => {
  it('shows an item with no visibility, or public, to every tier', () => {
    for (const viewer of [VISITOR, MEMBER, OWNER]) {
      expect(canViewNavItem(makeItem(), viewer)).toBe(true)
      expect(canViewNavItem(makeItem({ visibility: 'public' }), viewer)).toBe(true)
    }
  })

  it('hides an internal item from a visitor only', () => {
    const item = makeItem({ visibility: 'internal' })
    expect(canViewNavItem(item, VISITOR)).toBe(false)
    expect(canViewNavItem(item, MEMBER)).toBe(true)
    expect(canViewNavItem(item, OWNER)).toBe(true)
  })

  it('keeps a private item from a member as well as a visitor', () => {
    const item = makeItem({ visibility: 'private' })
    expect(canViewNavItem(item, VISITOR)).toBe(false)
    expect(canViewNavItem(item, MEMBER)).toBe(false)
    expect(canViewNavItem(item, OWNER)).toBe(true)
  })

  it('denies an unrecognized visibility value, as the content rules do', () => {
    expect(canViewNavItem(makeItem({ visibility: 'members' as never }), OWNER)).toBe(false)
  })

  it('always hides a hidden item, even from the owner', () => {
    expect(canViewNavItem(makeItem({ hidden: true }), OWNER)).toBe(false)
  })

  it('hides a dev-only item outside a development build', () => {
    const item = makeItem({ devOnly: true })
    for (const viewer of [VISITOR, MEMBER, OWNER]) {
      expect(canViewNavItem(item, viewer)).toBe(false)
      expect(canViewNavItem(item, viewer, { isDev: false })).toBe(false)
      expect(canViewNavItem(item, viewer, { isDev: true })).toBe(true)
    }
  })

  it('treats dev-only as an environment fact, not an audience one', () => {
    // A dev build still hides what the *viewer* may not see.
    expect(canViewNavItem(makeItem({ devOnly: true, visibility: 'internal' }), VISITOR, { isDev: true })).toBe(false)
  })
})

describe('filterNavItems', () => {
  const items = [
    makeItem({ slug: 'open' }),
    makeItem({ slug: 'parked', hidden: true }),
    makeItem({ slug: 'gated', visibility: 'internal' }),
    makeItem({ slug: 'dev', devOnly: true }),
  ]

  it('gives a visitor only the ungated items', () => {
    expect(filterNavItems(items, VISITOR).map(i => i.slug)).toEqual(['open'])
  })

  it('gives a member the internal items too', () => {
    expect(filterNavItems(items, MEMBER).map(i => i.slug)).toEqual(['open', 'gated'])
  })

  it('adds dev-only items in a development build', () => {
    expect(filterNavItems(items, OWNER, { isDev: true }).map(i => i.slug)).toEqual(['open', 'gated', 'dev'])
  })

  it('filters children recursively without mutating the input', () => {
    const parent = makeItem({
      slug: 'email',
      path: undefined,
      children: [makeItem({ slug: 'compose' }), makeItem({ slug: 'drafts', visibility: 'internal' })],
    })

    const [filtered] = filterNavItems([parent], VISITOR)

    expect(filtered?.children?.map(i => i.slug)).toEqual(['compose'])
    expect(parent.children).toHaveLength(2)
  })

  it('returns an empty array for null or undefined input', () => {
    expect(filterNavItems(null, OWNER)).toEqual([])
    expect(filterNavItems(undefined, OWNER)).toEqual([])
  })
})

describe('filterNavigation', () => {
  const groups = [
    makeGroup({ id: 'docs', public: true, items: [makeItem({ slug: 'guides' }), makeItem({ slug: 'architecture', visibility: 'internal' })] }),
    makeGroup({ id: 'dashboard', requiresAuth: true, items: [makeItem({ slug: 'home' })] }),
    makeGroup({ id: 'parked', hidden: true, items: [makeItem({ slug: 'old' })] }),
    makeGroup({ id: 'admin', requiresAuth: true, requiresRole: 'admin', items: [makeItem({ slug: 'users' })] }),
  ]

  it('gives a visitor the open groups with their gated items removed', () => {
    const visible = filterNavigation(groups, VISITOR)
    expect(visible.map(g => g.id)).toEqual(['docs'])
    expect(visible[0]?.items.map(i => i.slug)).toEqual(['guides'])
  })

  it('gives a member every non-admin group', () => {
    const visible = filterNavigation(groups, MEMBER)
    expect(visible.map(g => g.id)).toEqual(['docs', 'dashboard'])
    expect(visible[0]?.items.map(i => i.slug)).toEqual(['guides', 'architecture'])
  })

  it('gives the owner the admin group but still not the hidden one', () => {
    expect(filterNavigation(groups, OWNER).map(g => g.id)).toEqual(['docs', 'dashboard', 'admin'])
  })

  it('keeps a group whose items all filter away', () => {
    // Dropping empty groups is a rendering decision, not a rule one.
    const [visible] = filterNavigation([makeGroup({ items: [makeItem({ visibility: 'internal' })] })], VISITOR)
    expect(visible?.items).toEqual([])
  })

  it('returns an empty array for null or undefined input', () => {
    expect(filterNavigation(null, OWNER)).toEqual([])
    expect(filterNavigation(undefined, OWNER)).toEqual([])
  })

  it('does not mutate the groups it was given', () => {
    filterNavigation(groups, VISITOR)
    expect(groups.map(g => g.id)).toEqual(['docs', 'dashboard', 'parked', 'admin'])
    expect(groups[0]?.items).toHaveLength(2)
  })
})

describe('the shipped navigation config', () => {
  const dir = resolve(__dirname, '../../content/navigation')
  const groups = readdirSync(dir)
    .filter(name => name.endsWith('.yml'))
    .sort()
    .map(name => YAML.parse(readFileSync(join(dir, name), 'utf-8')) as NavGroup)
    .sort((a, b) => a.order - b.order)

  it('offers a visitor no group that needs a session', () => {
    const ids = filterNavigation(groups, VISITOR).map(g => g.id)
    expect(ids).not.toContain('dashboard')
    expect(ids).not.toContain('labs')
    expect(ids).not.toContain('admin')
  })

  it('offers a member everything but admin, and the owner admin as well', () => {
    expect(filterNavigation(groups, MEMBER).map(g => g.id)).not.toContain('admin')
    expect(filterNavigation(groups, OWNER).map(g => g.id)).toContain('admin')
  })

  it('hides the internal architecture guide from a visitor only', () => {
    const slugs = (viewer: typeof VISITOR) =>
      filterNavigation(groups, viewer).find(g => g.id === 'guides')?.items.map(i => i.slug)
    expect(slugs(VISITOR)).not.toContain('architecture')
    expect(slugs(MEMBER)).toContain('architecture')
  })
})
