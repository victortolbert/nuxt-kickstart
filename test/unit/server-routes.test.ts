import type { H3Event } from 'h3'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// A lightweight harness for unit-testing Nitro event handlers without booting a
// server. The handlers reference h3 helpers (`defineEventHandler`, `readBody`,
// `getQuery`, `getRouterParam`, `createError`) as auto-imported globals that run
// at module load, so we stub them before dynamically importing each route.
// `defineEventHandler` is the identity function, exposing the raw handler so we
// can invoke it with a fabricated event.

function createError(input: { statusCode: number, message: string }) {
  const err = new Error(input.message) as Error & { statusCode: number }
  err.statusCode = input.statusCode
  return err
}

const readBody = vi.fn()
const getQuery = vi.fn()
const getRouterParam = vi.fn()

vi.stubGlobal('defineEventHandler', (fn: unknown) => fn)
vi.stubGlobal('createError', createError)
vi.stubGlobal('readBody', readBody)
vi.stubGlobal('getQuery', getQuery)
vi.stubGlobal('getRouterParam', getRouterParam)
vi.stubGlobal('getHeader', vi.fn())

// Real implementations of our own server utils (nitro auto-imports them)
const scoreboardAuth = await import('../../server/utils/scoreboard-auth')
vi.stubGlobal('isValidScoreboardPin', scoreboardAuth.isValidScoreboardPin)

// Mock the scoreboard data layer for routes that depend on it.
const findJudgeByToken = vi.hoisted(() => vi.fn())
vi.mock('#server/utils/scoreboard-db', () => ({ findJudgeByToken }))

type Handler = (event: H3Event) => Promise<unknown> | unknown

async function loadRoute(path: string): Promise<Handler> {
  const mod = await import(path)
  return mod.default as Handler
}

const event = {} as H3Event

beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(() => {
  vi.resetModules()
})

describe('pOST /api/scoreboard/auth/verify-pin', () => {
  const path = '../../server/api/scoreboard/auth/verify-pin.post'

  it('returns valid:true for the correct PIN', async () => {
    readBody.mockResolvedValue({ pin: '1234' })
    const handler = await loadRoute(path)

    expect(await handler(event)).toEqual({ valid: true })
  })

  it('throws 401 for an incorrect PIN', async () => {
    readBody.mockResolvedValue({ pin: '0000' })
    const handler = await loadRoute(path)

    await expect(handler(event)).rejects.toMatchObject({ statusCode: 401 })
  })

  it('throws 400 when the PIN is missing or not a string', async () => {
    const handler = await loadRoute(path)

    readBody.mockResolvedValue({})
    await expect(handler(event)).rejects.toMatchObject({ statusCode: 400 })

    readBody.mockResolvedValue({ pin: 1234 })
    await expect(handler(event)).rejects.toMatchObject({ statusCode: 400 })
  })

  it('honours the SCOREBOARD_ADMIN_PIN environment override', async () => {
    vi.stubEnv('SCOREBOARD_ADMIN_PIN', 'secret-pin')
    readBody.mockResolvedValue({ pin: 'secret-pin' })
    const handler = await loadRoute(path)

    expect(await handler(event)).toEqual({ valid: true })

    readBody.mockResolvedValue({ pin: '1234' })
    await expect(handler(event)).rejects.toMatchObject({ statusCode: 401 })
    vi.unstubAllEnvs()
  })
})

describe('gET /api/scoreboard/judges/validate/[token]', () => {
  const path = '../../server/api/scoreboard/judges/validate/[token].get'

  it('throws 400 when the token router param is absent', async () => {
    getRouterParam.mockReturnValue(undefined)
    const handler = await loadRoute(path)

    await expect(handler(event)).rejects.toMatchObject({ statusCode: 400 })
    expect(findJudgeByToken).not.toHaveBeenCalled()
  })

  it('throws 404 for an unknown token', async () => {
    getRouterParam.mockReturnValue('nope')
    findJudgeByToken.mockResolvedValue(undefined)
    const handler = await loadRoute(path)

    await expect(handler(event)).rejects.toMatchObject({ statusCode: 404 })
  })

  it('returns the judge identity for a valid token without leaking the token', async () => {
    getRouterParam.mockReturnValue('valid-token')
    findJudgeByToken.mockResolvedValue({ id: 7, name: 'Raj', event_id: 1, token: 'valid-token' })
    const handler = await loadRoute(path)

    const result = await handler(event)

    expect(result).toEqual({ id: 7, name: 'Raj', eventId: 1 })
    expect(result).not.toHaveProperty('token')
  })
})
