import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

/**
 * `toWebRequest(event)` takes ownership of the request body stream. The
 * authorization resolver runs on every request, before the handler, so a
 * resolver that called it leaves every `authorizeUser()`-then-`readBody()`
 * route waiting forever on a body nothing will deliver, with no error. The
 * session is in the cookie header; headers are all the resolver may read.
 */
describe('authorization resolver', () => {
  const source = readFileSync(new URL('../../server/plugins/authorization.ts', import.meta.url), 'utf8')

  it('never wraps the event in a web Request', () => {
    // The call, not the word — the comment that explains why is allowed to name it.
    const code = source.split('\n').filter(line => !line.trim().startsWith('//')).join('\n')
    expect(code).not.toMatch(/toWebRequest\s*\(/)
  })

  it('resolves the session from the request headers alone', () => {
    expect(source).toMatch(/headers:\s*requestHeaders\(event\)/)
  })

  it('shares the session helper\'s header copy rather than building its own', () => {
    // One headers-only implementation (server/utils/session.ts), so a fix to it
    // reaches both callers.
    expect(source).toMatch(/import \{ requestHeaders \} from '#server\/utils\/session'/)
  })
})

describe('session helpers', () => {
  const source = readFileSync(new URL('../../server/utils/session.ts', import.meta.url), 'utf8')

  it('never wrap the event in a web Request either', () => {
    const code = source.split('\n').filter(line => !/^\s*(?:\/\/|\*)/.test(line)).join('\n')
    expect(code).not.toMatch(/toWebRequest\s*\(/)
    expect(code.match(/headers:\s*requestHeaders\(event\)/g)).toHaveLength(2)
  })
})
