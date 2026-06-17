import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const CONTENT_DIR = resolve(__dirname, '../../content')

describe('sample translated content', () => {
  describe('contributing-translations guide exists', () => {
    it('english version exists at content/en/guides/contributing-translations.md', () => {
      const path = resolve(CONTENT_DIR, 'en/guides/contributing-translations.md')
      expect(existsSync(path)).toBe(true)
    })

    it('spanish version exists at content/es/guides/contributing-translations.md', () => {
      const path = resolve(CONTENT_DIR, 'es/guides/contributing-translations.md')
      expect(existsSync(path)).toBe(true)
    })
  })

  describe('translated content has machineTranslated frontmatter', () => {
    it('spanish version has machineTranslated: true', () => {
      const path = resolve(CONTENT_DIR, 'es/guides/contributing-translations.md')
      const content = readFileSync(path, 'utf-8')
      expect(content).toContain('machineTranslated: true')
    })

    it('english version does NOT have machineTranslated: true in frontmatter', () => {
      const path = resolve(CONTENT_DIR, 'en/guides/contributing-translations.md')
      const content = readFileSync(path, 'utf-8')
      // Extract frontmatter (between --- delimiters)
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)
      expect(frontmatterMatch).not.toBeNull()
      const frontmatter = frontmatterMatch![1]
      expect(frontmatter).not.toContain('machineTranslated: true')
    })
  })
})
