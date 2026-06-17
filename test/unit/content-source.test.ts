import { describe, expect, it, vi } from 'vitest'
import {
  createCollectionSource,
  getContentSource,
  getLocalCollections,
  isExternalContent,
} from '../../shared/utils/content-source'

describe('content-source utilities', () => {
  describe('getContentSource', () => {
    it('returns default values without environment variables', () => {
      vi.stubEnv('NUXT_CONTENT_REPO_URL', '')
      vi.stubEnv('NUXT_CONTENT_AUTH_TOKEN', '')
      vi.stubEnv('NUXT_CONTENT_BRANCH', '')

      const result = getContentSource()

      expect(result).toEqual({
        repository: undefined,
        authToken: undefined,
        branch: 'main',
        isExternal: false,
      })
    })

    it('returns external configuration when NUXT_CONTENT_REPO_URL is set', () => {
      vi.stubEnv('NUXT_CONTENT_REPO_URL', 'https://github.com/user/repo.git')
      vi.stubEnv('NUXT_CONTENT_AUTH_TOKEN', 'token123')
      vi.stubEnv('NUXT_CONTENT_BRANCH', 'develop')

      const result = getContentSource()

      expect(result).toEqual({
        repository: 'https://github.com/user/repo.git',
        authToken: 'token123',
        branch: 'develop',
        isExternal: true,
      })
    })

    it('defaults to main branch when not specified', () => {
      vi.stubEnv('NUXT_CONTENT_REPO_URL', 'https://github.com/user/repo.git')
      vi.stubEnv('NUXT_CONTENT_BRANCH', '')

      const result = getContentSource()

      expect(result.branch).toBe('main')
    })
  })

  describe('isExternalContent', () => {
    it('returns false without NUXT_CONTENT_REPO_URL', () => {
      vi.stubEnv('NUXT_CONTENT_REPO_URL', '')

      expect(isExternalContent()).toBe(false)
    })

    it('returns true with NUXT_CONTENT_REPO_URL', () => {
      vi.stubEnv('NUXT_CONTENT_REPO_URL', 'https://github.com/user/repo.git')

      expect(isExternalContent()).toBe(true)
    })
  })

  describe('getLocalCollections', () => {
    it('returns empty array without NUXT_CONTENT_LOCAL_COLLECTIONS', () => {
      vi.stubEnv('NUXT_CONTENT_LOCAL_COLLECTIONS', '')

      expect(getLocalCollections()).toEqual([])
    })

    it('parses comma-separated collection names', () => {
      vi.stubEnv('NUXT_CONTENT_LOCAL_COLLECTIONS', 'notes,prompts,logs')

      expect(getLocalCollections()).toEqual(['notes', 'prompts', 'logs'])
    })

    it('trims whitespace from collection names', () => {
      vi.stubEnv('NUXT_CONTENT_LOCAL_COLLECTIONS', ' notes , prompts , logs ')

      expect(getLocalCollections()).toEqual(['notes', 'prompts', 'logs'])
    })

    it('filters out empty strings', () => {
      vi.stubEnv('NUXT_CONTENT_LOCAL_COLLECTIONS', 'notes,,prompts,')

      expect(getLocalCollections()).toEqual(['notes', 'prompts'])
    })
  })

  describe('createCollectionSource', () => {
    it('returns local path when no external repo is configured', () => {
      vi.stubEnv('NUXT_CONTENT_REPO_URL', '')
      vi.stubEnv('NUXT_CONTENT_LOCAL_COLLECTIONS', '')

      const result = createCollectionSource('content/projects', 'projects')

      expect(result).toBe('content/projects')
    })

    it('returns external config when repo is configured', () => {
      vi.stubEnv('NUXT_CONTENT_REPO_URL', 'https://github.com/user/repo.git')
      vi.stubEnv('NUXT_CONTENT_AUTH_TOKEN', 'token123')
      vi.stubEnv('NUXT_CONTENT_LOCAL_COLLECTIONS', '')

      const result = createCollectionSource('content/projects', 'projects')

      expect(result).toEqual({
        repository: 'https://github.com/user/repo.git',
        include: 'content/projects',
        authToken: 'token123',
      })
    })

    it('returns local path for collections in local-only list', () => {
      vi.stubEnv('NUXT_CONTENT_REPO_URL', 'https://github.com/user/repo.git')
      vi.stubEnv('NUXT_CONTENT_AUTH_TOKEN', 'token123')
      vi.stubEnv('NUXT_CONTENT_LOCAL_COLLECTIONS', 'notes,prompts')

      const notesResult = createCollectionSource('content/notes', 'notes')
      const promptsResult = createCollectionSource('content/prompts', 'prompts')
      const projectsResult = createCollectionSource('content/projects', 'projects')

      expect(notesResult).toBe('content/notes')
      expect(promptsResult).toBe('content/prompts')
      expect(projectsResult).toEqual({
        repository: 'https://github.com/user/repo.git',
        include: 'content/projects',
        authToken: 'token123',
      })
    })

    it('handles collection with external repo but no auth token', () => {
      vi.stubEnv('NUXT_CONTENT_REPO_URL', 'https://github.com/user/repo.git')
      vi.stubEnv('NUXT_CONTENT_AUTH_TOKEN', '')
      vi.stubEnv('NUXT_CONTENT_LOCAL_COLLECTIONS', '')

      const result = createCollectionSource('content/projects', 'projects')

      expect(result).toEqual({
        repository: 'https://github.com/user/repo.git',
        include: 'content/projects',
        authToken: undefined,
      })
    })
  })
})
