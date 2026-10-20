import { beforeEach, describe, expect, it, vi } from 'vitest'

// `getRequestViewer` reduces the Better Auth session to the descriptor the
// visibility rules take. The auth instance is mocked at its module boundary;
// `getRequestHeaders` is a Nitro auto-import, stubbed as a global.
const getSession = vi.fn()
vi.mock('#server/auth', () => ({ auth: { api: { getSession } } }))
vi.stubGlobal('getRequestHeaders', () => ({ cookie: 'session=abc' }))

const { getRequestViewer } = await import('../../server/utils/session')
const event = {} as Parameters<typeof getRequestViewer>[0]

beforeEach(() => {
  getSession.mockReset()
})

describe('getRequestViewer', () => {
  it('reads no session as a visitor', async () => {
    getSession.mockResolvedValue(null)
    expect(await getRequestViewer(event)).toEqual({ loggedIn: false, isAdmin: false })
  })

  it('reads a non-admin session as a member', async () => {
    getSession.mockResolvedValue({ user: { id: '1', role: 'viewer' } })
    expect(await getRequestViewer(event)).toEqual({ loggedIn: true, isAdmin: false })
  })

  it('reads an admin session as the owner', async () => {
    getSession.mockResolvedValue({ user: { id: '1', role: 'admin' } })
    expect(await getRequestViewer(event)).toEqual({ loggedIn: true, isAdmin: true })
  })

  it('denies rather than grants when the lookup throws, and says so', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    getSession.mockRejectedValue(new Error('database is locked'))

    expect(await getRequestViewer(event)).toEqual({ loggedIn: false, isAdmin: false })
    expect(error).toHaveBeenCalled()
    error.mockRestore()
  })
})
