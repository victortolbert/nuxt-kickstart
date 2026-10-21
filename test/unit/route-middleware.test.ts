import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Route middleware reference Nuxt auto-imports (`defineNuxtRouteMiddleware`,
// `$fetch`, `navigateToPath`, `useRequestHeaders`) as globals that are evaluated
// at module load. We stub them before dynamically importing each middleware so
// we can assert exactly where the guard sends an unauthenticated/unauthorized
// request. `import.meta.server` is falsy in the node env, so the cookie-header
// branch is skipped — these tests exercise the redirect logic, which is the
// security-critical behavior.
//
// Middleware redirect via `navigateToPath` (a thin `navigateTo` wrapper with a
// simplified signature — see app/utils/navigate.ts) to avoid the typed-routes
// union tripping TS2590, so the redirect spy is stubbed under both names.

const navigateTo = vi.fn((to: unknown) => to)
const useRequestHeaders = vi.fn(() => ({}))
const $fetch = vi.fn()

vi.stubGlobal('defineNuxtRouteMiddleware', (fn: unknown) => fn)
vi.stubGlobal('navigateTo', navigateTo)
vi.stubGlobal('navigateToPath', navigateTo)
vi.stubGlobal('useRequestHeaders', useRequestHeaders)
vi.stubGlobal('$fetch', $fetch)
// The merged Protected path list (modules/layers.ts) reaches the global
// middleware through public runtime config. Empty means "no layer added any".
const publicConfig: { protectedPaths?: { protected: string[], public: string[], noindex: string[] } } = {}
vi.stubGlobal('useRuntimeConfig', () => ({ public: publicConfig }))

// Real Session Identity module (it reads $fetch/useRequestHeaders as globals
// at call time, so the stubs above apply)
const sessionIdentity = await import('../../app/utils/session-identity')
vi.stubGlobal('fetchSessionIdentity', sessionIdentity.fetchSessionIdentity)

type Middleware = (to: any, from?: any) => Promise<unknown> | unknown

async function loadMiddleware(path: string): Promise<Middleware> {
  const mod = await import(path)
  return mod.default as Middleware
}

function route(fullPath: string, query: Record<string, unknown> = {}) {
  return { fullPath, path: fullPath.split('?')[0], query }
}

beforeEach(() => {
  vi.clearAllMocks()
  $fetch.mockResolvedValue(null)
})

afterEach(() => {
  vi.resetModules()
})

describe('auth middleware', () => {
  it('redirects unauthenticated users to /login preserving the target path', async () => {
    $fetch.mockResolvedValue(null)
    const mw = await loadMiddleware('../../app/middleware/auth')

    const result = await mw(route('/settings'))

    expect($fetch).toHaveBeenCalledWith('/api/auth/get-session', expect.anything())
    expect(navigateTo).toHaveBeenCalledWith({
      path: '/login',
      query: { redirect: '/settings' },
    })
    expect(result).toEqual({ path: '/login', query: { redirect: '/settings' } })
  })

  it('allows authenticated users through without redirecting', async () => {
    $fetch.mockResolvedValue({ user: { id: '1', role: 'viewer' } })
    const mw = await loadMiddleware('../../app/middleware/auth')

    const result = await mw(route('/settings'))

    expect(navigateTo).not.toHaveBeenCalled()
    expect(result).toBeUndefined()
  })
})

describe('admin middleware', () => {
  it('redirects unauthenticated users to /login', async () => {
    $fetch.mockResolvedValue(null)
    const mw = await loadMiddleware('../../app/middleware/admin')

    await mw(route('/admin'))

    expect(navigateTo).toHaveBeenCalledWith('/login')
  })

  it('redirects authenticated non-admins to the home page', async () => {
    $fetch.mockResolvedValue({ user: { id: '1', role: 'viewer' } })
    const mw = await loadMiddleware('../../app/middleware/admin')

    await mw(route('/admin'))

    expect(navigateTo).toHaveBeenCalledWith('/')
  })

  it('allows admins through', async () => {
    $fetch.mockResolvedValue({ user: { id: '1', role: 'admin' } })
    const mw = await loadMiddleware('../../app/middleware/admin')

    const result = await mw(route('/admin'))

    expect(navigateTo).not.toHaveBeenCalled()
    expect(result).toBeUndefined()
  })
})

describe('guest middleware', () => {
  it('does nothing for anonymous visitors', async () => {
    $fetch.mockResolvedValue(null)
    const mw = await loadMiddleware('../../app/middleware/guest')

    const result = await mw(route('/login'))

    expect(navigateTo).not.toHaveBeenCalled()
    expect(result).toBeUndefined()
  })

  it('redirects logged-in users to a safe local redirect target', async () => {
    $fetch.mockResolvedValue({ user: { id: '1' } })
    const mw = await loadMiddleware('../../app/middleware/guest')

    await mw(route('/login?redirect=/app/dashboard', { redirect: '/app/dashboard' }))

    expect(navigateTo).toHaveBeenCalledWith('/app/dashboard')
  })

  it('ignores protocol-relative redirect targets (open-redirect guard)', async () => {
    $fetch.mockResolvedValue({ user: { id: '1' } })
    const mw = await loadMiddleware('../../app/middleware/guest')

    await mw(route('/login', { redirect: '//evil.com' }))

    expect(navigateTo).toHaveBeenCalledWith('/app')
  })

  it('ignores absolute (non-local) redirect targets', async () => {
    $fetch.mockResolvedValue({ user: { id: '1' } })
    const mw = await loadMiddleware('../../app/middleware/guest')

    await mw(route('/login', { redirect: 'https://evil.com' }))

    expect(navigateTo).toHaveBeenCalledWith('/app')
  })

  it('falls back to /app when no redirect is supplied', async () => {
    $fetch.mockResolvedValue({ user: { id: '1' } })
    const mw = await loadMiddleware('../../app/middleware/guest')

    await mw(route('/login'))

    expect(navigateTo).toHaveBeenCalledWith('/app')
  })
})

describe('app-auth global middleware', () => {
  it('ignores unprotected routes without checking the session', async () => {
    const mw = await loadMiddleware('../../app/middleware/app-auth.global')

    const result = await mw(route('/about'))

    expect($fetch).not.toHaveBeenCalled()
    expect(navigateTo).not.toHaveBeenCalled()
    expect(result).toBeUndefined()
  })

  it('does not guard public siblings of protected prefixes (/blocks)', async () => {
    const mw = await loadMiddleware('../../app/middleware/app-auth.global')

    const result = await mw(route('/blocks'))

    expect($fetch).not.toHaveBeenCalled()
    expect(navigateTo).not.toHaveBeenCalled()
    expect(result).toBeUndefined()
  })

  it.each([
    '/app',
    '/admin',
    '/settings',
    '/labs',
  ])('guards protected prefix %s', async (path) => {
    $fetch.mockResolvedValue(null)
    const mw = await loadMiddleware('../../app/middleware/app-auth.global')

    await mw(route(`${path}/sub`))

    expect($fetch).toHaveBeenCalledWith('/api/auth/get-session', expect.anything())
    expect(navigateTo).toHaveBeenCalledWith({
      path: '/login',
      query: { redirect: `${path}/sub` },
    })
  })

  it.each([
    '/labs/broadsheet',
  ])('exempts the public broadsheet reference %s from the login gate', async (path) => {
    const mw = await loadMiddleware('../../app/middleware/app-auth.global')

    const result = await mw(route(path))

    expect($fetch).not.toHaveBeenCalled()
    expect(navigateTo).not.toHaveBeenCalled()
    expect(result).toBeUndefined()
  })

  it('guards a protected prefix behind a non-default locale (/es/settings)', async () => {
    $fetch.mockResolvedValue(null)
    const mw = await loadMiddleware('../../app/middleware/app-auth.global')

    await mw(route('/es/settings'))

    expect(navigateTo).toHaveBeenCalledWith({
      path: '/login',
      query: { redirect: '/es/settings' },
    })
  })

  it('guards a prefix a layer contributed, read from runtime config', async () => {
    const { resolveProtectedPaths } = await import('../../shared/utils/protected-paths')
    const merged = resolveProtectedPaths([{ protected: ['/planner'] }])
    publicConfig.protectedPaths = { protected: [...merged.protected], public: [...merged.public], noindex: [...merged.noindex] }
    $fetch.mockResolvedValue(null)
    const mw = await loadMiddleware('../../app/middleware/app-auth.global')

    try {
      await mw(route('/es/planner/today'))
      expect(navigateTo).toHaveBeenCalledWith({ path: '/login', query: { redirect: '/es/planner/today' } })
      // The base list still holds with the merged one in place.
      navigateTo.mockClear()
      await mw(route('/settings'))
      expect(navigateTo).toHaveBeenCalled()
    }
    finally {
      delete publicConfig.protectedPaths
    }
  })

  it('lets authenticated users reach protected routes', async () => {
    $fetch.mockResolvedValue({ user: { id: '1' } })
    const mw = await loadMiddleware('../../app/middleware/app-auth.global')

    const result = await mw(route('/app'))

    expect(navigateTo).not.toHaveBeenCalled()
    expect(result).toBeUndefined()
  })
})

describe('dev-only middleware', () => {
  it('redirects to home when not running in dev (import.meta.dev is falsy)', async () => {
    const mw = await loadMiddleware('../../app/middleware/dev-only')

    const result = await mw(route('/dev-tools'))

    expect(navigateTo).toHaveBeenCalledWith('/')
    expect(result).toEqual('/')
  })
})
