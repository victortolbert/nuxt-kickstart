import { beforeEach, describe, expect, it, vi } from 'vitest'

// `/api/navigation` filters the tree for the requesting session before it
// leaves the server. Nitro auto-imports are stubbed as globals; the viewer is
// supplied directly so the test is about what the route returns per tier.
const YAML_GROUPS: Record<string, string> = {
  'guides.yml': 'id: guides\nlabel: Guides\norder: 1\npublic: true\nitems:\n  - { slug: all, label: All, path: /guides }\n  - { slug: architecture, label: Arch, path: /guides/architecture, visibility: internal }\n',
  'admin.yml': 'id: admin\nlabel: Admin\norder: 8\nrequiresAuth: true\nrequiresRole: admin\nitems:\n  - { slug: users, label: Users, path: /app/admin/users }\n',
}
const headers: Record<string, string> = {}
const getRequestViewer = vi.fn()

vi.stubGlobal('defineEventHandler', (fn: unknown) => fn)
vi.stubGlobal('defineRouteMeta', () => {})
vi.stubGlobal('setResponseHeader', (_event: unknown, name: string, value: string) => {
  headers[name] = value
})
vi.stubGlobal('getRequestViewer', getRequestViewer)
vi.stubGlobal('useStorage', () => ({
  getKeys: async () => Object.keys(YAML_GROUPS),
  getItem: async (key: string) => YAML_GROUPS[key],
}))

const { default: handler } = await import('../../server/api/navigation.get')
type Handler = (event: unknown) => Promise<{ id: string, items: { slug: string }[] }[]>
const route = handler as unknown as Handler

beforeEach(() => {
  getRequestViewer.mockReset()
})

describe('/api/navigation', () => {
  it('gives a visitor the public groups without their internal items', async () => {
    getRequestViewer.mockResolvedValue({ loggedIn: false, isAdmin: false })
    const groups = await route({})
    expect(groups.map(g => g.id)).toEqual(['guides'])
    expect(groups[0]?.items.map(i => i.slug)).toEqual(['all'])
  })

  it('gives a member the internal items, but not admin', async () => {
    getRequestViewer.mockResolvedValue({ loggedIn: true, isAdmin: false })
    const groups = await route({})
    expect(groups.map(g => g.id)).toEqual(['guides'])
    expect(groups[0]?.items.map(i => i.slug)).toEqual(['all', 'architecture'])
  })

  it('gives the owner the admin group, in order', async () => {
    getRequestViewer.mockResolvedValue({ loggedIn: true, isAdmin: true })
    expect((await route({})).map(g => g.id)).toEqual(['guides', 'admin'])
  })

  it('tells caches the body depends on who asked', async () => {
    getRequestViewer.mockResolvedValue({ loggedIn: false, isAdmin: false })
    await route({})
    expect(headers['Cache-Control']).toContain('no-store')
    expect(headers.Vary).toBe('Cookie')
  })
})
