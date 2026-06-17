import { describe, expect, it } from 'vitest'
import { getTechConfig, hasTechConfig } from '../../app/utils/tech-config'

describe('tech-config utilities', () => {
  describe('getTechConfig', () => {
    it('returns correct config for nuxt', () => {
      const config = getTechConfig('nuxt')
      expect(config).toEqual({
        label: 'Nuxt',
        icon: 'logos:nuxt-icon',
        color: '#00DC82',
      })
    })

    it('returns correct config for vue', () => {
      const config = getTechConfig('vue')
      expect(config).toEqual({
        label: 'Vue',
        icon: 'logos:vue',
        color: '#4FC08D',
      })
    })

    it('returns correct config for react', () => {
      const config = getTechConfig('react')
      expect(config).toEqual({
        label: 'React',
        icon: 'logos:react',
        color: '#61DAFB',
      })
    })

    it('returns correct config for typescript', () => {
      const config = getTechConfig('typescript')
      expect(config).toEqual({
        label: 'TypeScript',
        icon: 'logos:typescript-icon',
        color: '#3178C6',
      })
    })

    it('returns fallback config for unknown tech with formatted label', () => {
      const config = getTechConfig('unknown-tech')
      expect(config).toEqual({
        label: 'Unknown Tech',
        icon: 'i-tabler-code',
        color: 'var(--ui-text-muted)',
      })
    })

    it('returns fallback config for empty string', () => {
      const config = getTechConfig('')
      expect(config).toEqual({
        label: '',
        icon: 'i-tabler-code',
        color: 'var(--ui-text-muted)',
      })
    })

    it('formats label with formatLabel for unknown tech', () => {
      const config = getTechConfig('my-custom-framework')
      expect(config.label).toBe('My Custom Framework')
      expect(config.icon).toBe('i-tabler-code')
      expect(config.color).toBe('var(--ui-text-muted)')
    })
  })

  describe('hasTechConfig', () => {
    it('returns true for known tech: nuxt', () => {
      expect(hasTechConfig('nuxt')).toBe(true)
    })

    it('returns true for known tech: vue', () => {
      expect(hasTechConfig('vue')).toBe(true)
    })

    it('returns true for known tech: typescript', () => {
      expect(hasTechConfig('typescript')).toBe(true)
    })

    it('returns false for unknown tech', () => {
      expect(hasTechConfig('unknown-tech')).toBe(false)
    })

    it('returns false for empty string', () => {
      expect(hasTechConfig('')).toBe(false)
    })

    it('returns true for all configured techs', () => {
      const knownTechs = ['nuxt', 'vue', 'react', 'next', 'svelte', 'angular', 'astro', 'tailwind', 'sass', 'css', 'typescript', 'javascript', 'python', 'rust', 'go', 'postgresql', 'mysql', 'mongodb', 'redis', 'supabase', 'docker', 'vercel', 'netlify', 'cloudflare', 'aws', 'github', 'figma', 'nuxt-content', 'nuxt-ui', 'pinia', 'vitest', 'playwright', 'cypress']

      knownTechs.forEach((tech) => {
        expect(hasTechConfig(tech)).toBe(true)
      })
    })
  })
})
