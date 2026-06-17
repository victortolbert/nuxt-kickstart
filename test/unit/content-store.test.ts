import { describe, expect, it, vi } from 'vitest'

// `createError` is a nitro auto-import in server context; stub it for node env
vi.stubGlobal('createError', (input: { statusCode: number, message: string }) => {
  const err = new Error(input.message) as Error & { statusCode: number }
  err.statusCode = input.statusCode
  return err
})

const { serializeMarkdown, slugFromTitle, trashKey, validateCollection } = await import('../../server/utils/content-store')

describe('content store', () => {
  describe('serializeMarkdown', () => {
    it('serializes scalar frontmatter with quoted strings', () => {
      const md = serializeMarkdown({ title: 'Hello', order: 2, draft: false }, 'Body text')
      expect(md).toContain('title: \'Hello\'')
      expect(md).toContain('order: 2')
      expect(md).toContain('draft: false')
      expect(md.endsWith('Body text\n')).toBe(true)
    })

    it('serializes arrays as quoted inline lists', () => {
      const md = serializeMarkdown({ tags: ['a', 'b'] }, '')
      expect(md).toContain('tags: [\'a\', \'b\']')
    })

    it('skips null and undefined values', () => {
      const md = serializeMarkdown({ title: 'X', description: undefined, image: null }, '')
      expect(md).not.toContain('description')
      expect(md).not.toContain('image')
    })

    it('serializes nested objects as JSON', () => {
      const md = serializeMarkdown({ icon: { provider: 'iconify', name: 'x' } }, '')
      expect(md).toContain('icon: {"provider":"iconify","name":"x"}')
    })

    it('wraps content in frontmatter delimiters', () => {
      const md = serializeMarkdown({ title: 'T' }, 'B')
      expect(md.startsWith('---\n')).toBe(true)
      expect(md).toContain('\n---\n\nB')
    })
  })

  describe('slugFromTitle', () => {
    it('kebab-cases titles', () => {
      expect(slugFromTitle('Hello World!')).toBe('hello-world')
      expect(slugFromTitle('  Spaces  &  Symbols  ')).toBe('spaces-symbols')
    })
  })

  describe('trashKey', () => {
    it('keys by collection/slug', () => {
      expect(trashKey('guides', 'x')).toBe('guides/x')
    })
  })

  describe('validateCollection', () => {
    it('accepts editable collections', () => {
      expect(validateCollection('guides')).toBe('guides')
      expect(validateCollection('posts')).toBe('posts')
    })

    it('rejects unknown collections', () => {
      expect(() => validateCollection('people')).toThrow()
      expect(() => validateCollection(undefined)).toThrow()
    })
  })
})
