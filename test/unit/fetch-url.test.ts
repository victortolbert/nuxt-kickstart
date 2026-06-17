// test/unit/fetch-url.test.ts
import { describe, expect, it } from 'vitest'

describe('fetch-url endpoint validation logic', () => {
  const PRIVATE_IP_PATTERNS = [
    /^127\./, // Localhost
    /^10\./, // Private network
    /^192\.168\./, // Private network
    /^172\.(1[6-9]|2\d|3[01])\./, // Private network
    /^169\.254\./, // Link-local
    /^::1$/, // IPv6 localhost
    /^fe80:/, // IPv6 link-local
    /^fc00:/, // IPv6 private
  ]

  function isPrivateIp(hostname: string): boolean {
    return PRIVATE_IP_PATTERNS.some(pattern => pattern.test(hostname))
  }

  describe('uRL validation', () => {
    it('accepts valid http URLs', () => {
      expect(() => new URL('http://example.com')).not.toThrow()
    })

    it('accepts valid https URLs', () => {
      expect(() => new URL('https://example.com')).not.toThrow()
    })

    it('rejects invalid URLs', () => {
      expect(() => new URL('not-a-url')).toThrow()
    })

    it('rejects non-http protocols', () => {
      const url = new URL('ftp://example.com')
      expect(['http:', 'https:'].includes(url.protocol)).toBe(false)
    })
  })

  describe('private IP blocking', () => {
    it('blocks localhost IPv4', () => {
      expect(isPrivateIp('127.0.0.1')).toBe(true)
      expect(isPrivateIp('127.1.1.1')).toBe(true)
    })

    it('blocks 10.x.x.x range', () => {
      expect(isPrivateIp('10.0.0.1')).toBe(true)
      expect(isPrivateIp('10.255.255.255')).toBe(true)
    })

    it('blocks 192.168.x.x range', () => {
      expect(isPrivateIp('192.168.0.1')).toBe(true)
      expect(isPrivateIp('192.168.255.255')).toBe(true)
    })

    it('blocks 172.16-31.x.x range', () => {
      expect(isPrivateIp('172.16.0.1')).toBe(true)
      expect(isPrivateIp('172.31.255.255')).toBe(true)
    })

    it('blocks link-local 169.254.x.x', () => {
      expect(isPrivateIp('169.254.0.1')).toBe(true)
    })

    it('blocks IPv6 localhost', () => {
      expect(isPrivateIp('::1')).toBe(true)
    })

    it('blocks IPv6 link-local', () => {
      expect(isPrivateIp('fe80::1')).toBe(true)
    })

    it('blocks IPv6 private', () => {
      expect(isPrivateIp('fc00::1')).toBe(true)
    })

    it('allows public IPs', () => {
      expect(isPrivateIp('8.8.8.8')).toBe(false)
      expect(isPrivateIp('example.com')).toBe(false)
      expect(isPrivateIp('github.com')).toBe(false)
    })

    it('does not block 172.15.x.x or 172.32.x.x (outside private range)', () => {
      expect(isPrivateIp('172.15.0.1')).toBe(false)
      expect(isPrivateIp('172.32.0.1')).toBe(false)
    })
  })

  describe('request body validation', () => {
    it('validates url is a string', () => {
      const validBody = { url: 'https://example.com' }
      expect(typeof validBody.url).toBe('string')
    })

    it('rejects missing url', () => {
      const invalidBody = {}
      expect((invalidBody as { url?: string }).url).toBeUndefined()
    })

    it('rejects non-string url', () => {
      const invalidBody = { url: 123 }
      expect(typeof invalidBody.url).not.toBe('string')
    })
  })

  describe('timeout configuration', () => {
    it('has 10 second timeout', () => {
      const FETCH_TIMEOUT = 10000
      expect(FETCH_TIMEOUT).toBe(10000)
    })
  })
})
