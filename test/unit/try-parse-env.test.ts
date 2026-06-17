import { afterEach, describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import tryParseEnv from '../../lib/try-parse-env'

describe('tryParseEnv', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('does not throw when all required values are present', () => {
    const schema = z.object({ FOO: z.string(), BAR: z.string() })

    expect(() => tryParseEnv(schema, { FOO: 'a', BAR: 'b' })).not.toThrow()
  })

  it('throws listing each missing key', () => {
    const schema = z.object({ FOO: z.string(), BAR: z.string() })

    expect(() => tryParseEnv(schema, { FOO: 'a' })).toThrowError(/Missing required values in \.env/)
    expect(() => tryParseEnv(schema, {})).toThrowError(/FOO[\s\S]*BAR/)
  })

  it('strips the stack trace on the thrown env error', () => {
    const schema = z.object({ FOO: z.string() })

    try {
      tryParseEnv(schema, {})
      throw new Error('should have thrown')
    }
    catch (err) {
      expect(err).toBeInstanceOf(Error)
      expect((err as Error).stack).toBe('')
    }
  })

  it('logs non-Zod errors instead of throwing', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const boom = new Error('parse exploded')
    const schema = {
      parse: () => {
        throw boom
      },
    } as unknown as z.ZodObject<any>

    expect(() => tryParseEnv(schema, {})).not.toThrow()
    expect(consoleError).toHaveBeenCalledWith(boom)
  })

  it('defaults to process.env when no build env is supplied', () => {
    const schema = z.object({ NODE_ENV: z.string().optional() })

    expect(() => tryParseEnv(schema)).not.toThrow()
  })
})
