import type { SearchableCollection } from '../../shared/utils/search-registry'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// `/api/search` answers from the search registry through the visibility rules.
// Nitro auto-imports are stubbed as globals and `queryCollection` is replaced
// by an in-memory store, so each test is about what the route returns for a
// given registry, store and Viewer — not how it queries.

interface Row {
  title?: string
  path?: string
  visibility?: string
  status?: string
  reviewed?: string
  [field: string]: unknown
}

const store: Record<string, Row[] | Error> = {}
const queried: string[] = []
const selected: Record<string, string[]> = {}
let registry: SearchableCollection[] = []
let query: Record<string, string> = {}
const headers: Record<string, string> = {}
const getRequestViewer = vi.fn()

vi.mock('@nuxt/content/server', () => ({
  queryCollection: (_event: unknown, collection: string) => ({
    select: (...fields: string[]) => ({
      all: async () => {
        queried.push(collection)
        selected[collection] = fields
        const rows = store[collection]
        if (rows instanceof Error)
          throw rows
        if (!rows)
          throw new Error(`no such collection: ${collection}`)
        // Like the real query, hand back only the selected fields.
        return rows.map(row => Object.fromEntries(fields.filter(f => f in row).map(f => [f, row[f]])))
      },
    }),
  }),
}))

vi.stubGlobal('defineEventHandler', (fn: unknown) => fn)
vi.stubGlobal('defineRouteMeta', () => {})
vi.stubGlobal('getQuery', () => query)
vi.stubGlobal('setResponseHeader', (_event: unknown, name: string, value: string) => {
  headers[name] = value
})
vi.stubGlobal('getRequestViewer', getRequestViewer)
vi.stubGlobal('useAppConfig', () => ({ search: { collections: registry } }))

const { default: handler } = await import('../../server/api/search.get')
interface Result { collection: string, title: string, path: string, description?: string }
const route = handler as unknown as (event: unknown) => Promise<{ results: Result[] }>

const VISITOR = { loggedIn: false, isAdmin: false }
const MEMBER = { loggedIn: true, isAdmin: false }
const OWNER = { loggedIn: true, isAdmin: true }

async function search(viewer: typeof VISITOR, q: string, locale?: string): Promise<Result[]> {
  getRequestViewer.mockResolvedValue(viewer)
  query = locale ? { q, locale } : { q }
  return (await route({})).results
}

const paths = (results: Result[]) => results.map(r => r.path).sort()

beforeEach(() => {
  for (const key of Object.keys(store))
    delete store[key]
  queried.length = 0
  registry = []
  getRequestViewer.mockReset()
})

describe('/api/search across the audience tiers', () => {
  // One document per tier, plus the two that read below their declared tier:
  // a wilted public page and an unreviewed public page in a gated collection.
  beforeEach(() => {
    registry = [{ collection: 'posts', fields: ['title', 'description'] }]
    store.posts = [
      { title: 'Ledger public', path: '/posts/public', visibility: 'public', status: 'evergreen' },
      { title: 'Ledger internal', path: '/posts/internal', visibility: 'internal', status: 'evergreen' },
      { title: 'Ledger private', path: '/posts/private', visibility: 'private', status: 'evergreen' },
      { title: 'Ledger unset', path: '/posts/unset' },
      { title: 'Ledger wilted', path: '/posts/wilted', visibility: 'public', status: 'wilted' },
      { title: 'Ledger odd', path: '/posts/odd', visibility: 'secret', status: 'evergreen' },
      { title: 'Ledger pathless', visibility: 'public', status: 'evergreen' },
    ]
  })

  it('gives a visitor only effectively public results', async () => {
    expect(paths(await search(VISITOR, 'ledger'))).toEqual(['/posts/public'])
  })

  it('gives a member the internal and wilted results too', async () => {
    expect(paths(await search(MEMBER, 'ledger'))).toEqual(['/posts/internal', '/posts/public', '/posts/wilted'])
  })

  it('gives the owner everything that can be placed', async () => {
    expect(paths(await search(OWNER, 'ledger'))).toEqual([
      '/posts/internal',
      '/posts/private',
      '/posts/public',
      '/posts/unset',
      '/posts/wilted',
    ])
  })

  it('never returns a result above the viewer\'s tier', async () => {
    const rank = { public: 0, internal: 1, private: 2 } as const
    const tierOf = (path: string): number => {
      const row = (store.posts as Row[]).find(r => r.path === path)!
      if (row.visibility === 'public')
        return row.status === 'wilted' ? rank.internal : rank.public
      return rank[(row.visibility ?? 'private') as keyof typeof rank]
    }
    for (const [viewer, ceiling] of [[VISITOR, rank.public], [MEMBER, rank.internal], [OWNER, rank.private]] as const) {
      for (const result of await search(viewer, 'ledger'))
        expect(tierOf(result.path), `${result.path} for ${JSON.stringify(viewer)}`).toBeLessThanOrEqual(ceiling)
    }
  })

  it('selects what the visibility rules need, and returns none of it', async () => {
    const [result] = await search(OWNER, 'ledger public')
    expect(selected.posts).toEqual(expect.arrayContaining(['path', 'visibility', 'reviewed', 'status']))
    expect(result).toEqual({ collection: 'posts', title: 'Ledger public', path: '/posts/public' })
  })

  it('tells caches the body depends on who asked', async () => {
    await search(VISITOR, 'ledger')
    expect(headers['Cache-Control']).toContain('no-store')
    expect(headers.Vary).toBe('Cookie')
  })
})

describe('/api/search and the review gate', () => {
  it('holds an unreviewed public page in a gated collection back from a visitor', async () => {
    vi.resetModules()
    vi.doMock('../../shared/utils/content-visibility', async (importOriginal) => {
      const actual = await importOriginal<typeof import('../../shared/utils/content-visibility')>()
      return {
        ...actual,
        canViewContent: (item: Row, viewer: typeof VISITOR) => actual.canViewContent(item, viewer, ['/notes/']),
      }
    })
    const { default: gated } = await import('../../server/api/search.get')
    registry = [{ collection: 'notes', fields: ['title'] }]
    store.notes = [
      { title: 'Draft note', path: '/notes/draft', visibility: 'public', status: 'evergreen' },
      { title: 'Vouched note', path: '/notes/vouched', visibility: 'public', status: 'evergreen', reviewed: '2026-10-01' },
    ]
    query = { q: 'note' }

    getRequestViewer.mockResolvedValue(VISITOR)
    const visitor = (await (gated as unknown as typeof route)({})).results
    getRequestViewer.mockResolvedValue(MEMBER)
    const member = (await (gated as unknown as typeof route)({})).results

    expect(paths(visitor)).toEqual(['/notes/vouched'])
    expect(paths(member)).toEqual(['/notes/draft', '/notes/vouched'])
    vi.doUnmock('../../shared/utils/content-visibility')
  })
})

describe('/api/search and the registry', () => {
  it('matches a collection on the fields it registered', async () => {
    registry = [{ collection: 'glossary', fields: ['title', 'definitions', 'aliases'], roles: { body: 'definitions', aliases: 'aliases' } }]
    store.glossary = [
      { title: 'RACI', path: '/glossary/raci', visibility: 'public', definitions: ['A responsibility matrix'], aliases: ['Responsible, Accountable, Consulted, Informed'] },
    ]

    expect(paths(await search(VISITOR, 'accountable'))).toEqual(['/glossary/raci'])
    expect(paths(await search(VISITOR, 'matrix'))).toEqual(['/glossary/raci'])
    const [hit] = await search(VISITOR, 'matrix')
    expect(hit?.description).toBe('A responsibility matrix')
  })

  it('does not match on a field the collection did not register', async () => {
    registry = [{ collection: 'posts', fields: ['title'] }]
    store.posts = [{ title: 'Hello', path: '/posts/hello', visibility: 'public', description: 'about ledgers' }]

    expect(await search(VISITOR, 'ledgers')).toEqual([])
  })

  it('takes the result title from a collection\'s title role', async () => {
    registry = [{ collection: 'organizations', fields: ['name'], roles: { title: 'name' } }]
    store.organizations = [{ name: 'Acme Ledger Co', path: '/organizations/acme', visibility: 'public' }]

    expect(await search(VISITOR, 'acme')).toEqual([{ collection: 'organizations', title: 'Acme Ledger Co', path: '/organizations/acme' }])
  })

  it('never searches a collection that is not registered', async () => {
    registry = [{ collection: 'posts', fields: ['title'] }]
    store.posts = []
    store.secrets = [{ title: 'Ledger', path: '/secrets/ledger', visibility: 'public' }]

    expect(await search(OWNER, 'ledger')).toEqual([])
    expect(queried).toEqual(['posts'])
  })

  it('ranks a title match above a match elsewhere', async () => {
    registry = [{ collection: 'posts', fields: ['title', 'description'] }]
    store.posts = [
      { title: 'Notes on pricing', path: '/posts/a', visibility: 'public', description: 'the ledger, again' },
      { title: 'The ledger', path: '/posts/b', visibility: 'public' },
    ]

    expect((await search(VISITOR, 'ledger')).map(r => r.path)).toEqual(['/posts/b', '/posts/a'])
  })

  it('searches each collection once when a project and a layer register it', async () => {
    // Layer app config is merged by concatenation, highest priority first, so
    // the first registration of a collection is the one that stands.
    registry = [
      { collection: 'posts', fields: ['title', 'description'] },
      { collection: 'posts', fields: ['title'] },
    ]
    store.posts = [{ title: 'x', path: '/posts/x', visibility: 'public', description: 'ledger' }]

    expect(paths(await search(VISITOR, 'ledger'))).toEqual(['/posts/x'])
    expect(queried).toEqual(['posts'])
  })
})

describe('/api/search and locales', () => {
  beforeEach(() => {
    registry = [
      { collection: 'guides', fields: ['title'], localized: true },
      { collection: 'posts', fields: ['title'] },
    ]
    store.guides = [
      { title: 'Ledger setup', path: '/en/guides/setup', visibility: 'public' },
      { title: 'Ledger configuración', path: '/es/guides/setup', visibility: 'public' },
      { title: 'Ledger only in English', path: '/en/guides/english', visibility: 'public' },
    ]
    store.posts = [{ title: 'Ledger post', path: '/posts/ledger', visibility: 'public' }]
  })

  it('links English results to the unprefixed routes', async () => {
    expect(paths(await search(VISITOR, 'ledger'))).toEqual(['/guides/english', '/guides/setup', '/posts/ledger'])
  })

  it('links a non-English reader to the routes that render in their locale, one result per page', async () => {
    const results = await search(VISITOR, 'ledger', 'es')
    expect(paths(results)).toEqual(['/es/guides/english', '/es/guides/setup', '/es/posts/ledger'])
    expect(results.find(r => r.path === '/es/guides/setup')?.title).toBe('Ledger configuración')
  })

  it('reads an unknown locale as English', async () => {
    expect(paths(await search(VISITOR, 'ledger', 'xx'))).toEqual(['/guides/english', '/guides/setup', '/posts/ledger'])
  })

  it('applies visibility to the translation the reader would be shown', async () => {
    // The Spanish page is what /es/guides/setup renders, so its tier decides.
    store.guides = [
      { title: 'Ledger setup', path: '/en/guides/setup', visibility: 'public' },
      { title: 'Ledger configuración', path: '/es/guides/setup', visibility: 'private' },
    ]
    expect((await search(VISITOR, 'ledger', 'es')).filter(r => r.collection === 'guides')).toEqual([])
  })
})

describe('/api/search never fails the request', () => {
  it('answers empty with nothing registered', async () => {
    expect(await search(OWNER, 'anything')).toEqual([])
  })

  it('drops a collection that fails to query and keeps the rest', async () => {
    registry = [{ collection: 'broken', fields: ['title'] }, { collection: 'posts', fields: ['title'] }]
    store.broken = new Error('no such table: _content_broken')
    store.posts = [{ title: 'Ledger', path: '/posts/ledger', visibility: 'public' }]
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(paths(await search(VISITOR, 'ledger'))).toEqual(['/posts/ledger'])
    expect(error).toHaveBeenCalled()
    error.mockRestore()
  })

  it('ignores a registration it cannot use', async () => {
    registry = [{ collection: '', fields: ['title'] }, { fields: ['title'] } as unknown as SearchableCollection, { collection: 'posts', fields: [] }]
    expect(await search(OWNER, 'ledger')).toEqual([])
    expect(queried).toEqual([])
  })

  it('answers empty for a blank query without querying', async () => {
    registry = [{ collection: 'posts', fields: ['title'] }]
    store.posts = [{ title: 'Ledger', path: '/posts/ledger', visibility: 'public' }]

    expect(await search(OWNER, '   ')).toEqual([])
    expect(queried).toEqual([])
  })
})
