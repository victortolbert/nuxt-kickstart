import type { GlossaryItem } from '../../shared/utils/glossary'
import { describe, expect, it } from 'vitest'
import {
  getContexts,
  getDefinitionsByContext,
  getPrimaryDefinition,
  getTermDisplay,
  hasMultipleMeanings,
  isAcronym,
} from '../../shared/utils/glossary'

describe('glossary utilities', () => {
  describe('isAcronym', () => {
    it('returns true for known acronyms', () => {
      expect(isAcronym('api')).toBe(true)
      expect(isAcronym('raci')).toBe(true)
      expect(isAcronym('gtd')).toBe(true)
    })

    it('returns false for non-acronyms', () => {
      expect(isAcronym('leadership')).toBe(false)
      expect(isAcronym('project')).toBe(false)
    })

    it('handles empty string', () => {
      expect(isAcronym('')).toBe(false)
    })

    it('is case-insensitive', () => {
      expect(isAcronym('API')).toBe(true)
      expect(isAcronym('Api')).toBe(true)
      expect(isAcronym('api')).toBe(true)
    })
  })

  describe('getTermDisplay', () => {
    it('returns uppercase for acronyms', () => {
      expect(getTermDisplay('api')).toBe('API')
      expect(getTermDisplay('raci')).toBe('RACI')
    })

    it('returns original case for non-acronyms', () => {
      expect(getTermDisplay('leadership')).toBe('leadership')
      expect(getTermDisplay('Project')).toBe('Project')
    })

    it('handles empty string', () => {
      expect(getTermDisplay('')).toBe('')
    })
  })

  describe('getPrimaryDefinition', () => {
    it('returns first definition when no context provided', () => {
      const mockItem: GlossaryItem = {
        term: 'API',
        slug: 'api',
        definitions: [
          { meaning: 'Application Programming Interface', context: 'tech' },
          { meaning: 'Active Pharmaceutical Ingredient', context: 'pharma' },
        ],
      }

      const result = getPrimaryDefinition(mockItem)
      expect(result?.meaning).toBe('Application Programming Interface')
      expect(result?.context).toBe('tech')
    })

    it('returns context-matched definition when context provided', () => {
      const mockItem: GlossaryItem = {
        term: 'API',
        slug: 'api',
        definitions: [
          { meaning: 'Application Programming Interface', context: 'tech' },
          { meaning: 'Active Pharmaceutical Ingredient', context: 'pharma' },
        ],
      }

      const result = getPrimaryDefinition(mockItem, 'pharma')
      expect(result?.meaning).toBe('Active Pharmaceutical Ingredient')
      expect(result?.context).toBe('pharma')
    })

    it('returns first definition when context not found', () => {
      const mockItem: GlossaryItem = {
        term: 'API',
        slug: 'api',
        definitions: [
          { meaning: 'Application Programming Interface', context: 'tech' },
        ],
      }

      const result = getPrimaryDefinition(mockItem, 'nonexistent')
      expect(result?.meaning).toBe('Application Programming Interface')
    })

    it('returns undefined when no definitions exist', () => {
      const mockItem: GlossaryItem = {
        term: 'Test',
        slug: 'test',
      }

      expect(getPrimaryDefinition(mockItem)).toBeUndefined()
    })

    it('returns undefined when definitions array is empty', () => {
      const mockItem: GlossaryItem = {
        term: 'Test',
        slug: 'test',
        definitions: [],
      }

      expect(getPrimaryDefinition(mockItem)).toBeUndefined()
    })
  })

  describe('getDefinitionsByContext', () => {
    it('returns filtered definitions matching context', () => {
      const mockItem: GlossaryItem = {
        term: 'API',
        slug: 'api',
        definitions: [
          { meaning: 'Application Programming Interface', context: 'tech' },
          { meaning: 'Another tech meaning', context: 'tech' },
          { meaning: 'Active Pharmaceutical Ingredient', context: 'pharma' },
        ],
      }

      const results = getDefinitionsByContext(mockItem, 'tech')
      expect(results).toHaveLength(2)
      expect(results[0].meaning).toBe('Application Programming Interface')
      expect(results[1].meaning).toBe('Another tech meaning')
    })

    it('returns empty array when no matching context', () => {
      const mockItem: GlossaryItem = {
        term: 'API',
        slug: 'api',
        definitions: [
          { meaning: 'Application Programming Interface', context: 'tech' },
        ],
      }

      const results = getDefinitionsByContext(mockItem, 'nonexistent')
      expect(results).toEqual([])
    })

    it('returns empty array when no definitions exist', () => {
      const mockItem: GlossaryItem = {
        term: 'Test',
        slug: 'test',
      }

      const results = getDefinitionsByContext(mockItem, 'tech')
      expect(results).toEqual([])
    })
  })

  describe('hasMultipleMeanings', () => {
    it('returns true when more than one definition', () => {
      const mockItem: GlossaryItem = {
        term: 'API',
        slug: 'api',
        definitions: [
          { meaning: 'Application Programming Interface' },
          { meaning: 'Active Pharmaceutical Ingredient' },
        ],
      }

      expect(hasMultipleMeanings(mockItem)).toBe(true)
    })

    it('returns false when one or fewer definitions', () => {
      const mockItemOne: GlossaryItem = {
        term: 'GTD',
        slug: 'gtd',
        definitions: [
          { meaning: 'Getting Things Done' },
        ],
      }

      const mockItemNone: GlossaryItem = {
        term: 'Test',
        slug: 'test',
      }

      expect(hasMultipleMeanings(mockItemOne)).toBe(false)
      expect(hasMultipleMeanings(mockItemNone)).toBe(false)
    })

    it('returns false when definitions array is empty', () => {
      const mockItem: GlossaryItem = {
        term: 'Test',
        slug: 'test',
        definitions: [],
      }

      expect(hasMultipleMeanings(mockItem)).toBe(false)
    })
  })

  describe('getContexts', () => {
    it('returns unique context values from definitions', () => {
      const mockItem: GlossaryItem = {
        term: 'API',
        slug: 'api',
        definitions: [
          { meaning: 'Application Programming Interface', context: 'tech' },
          { meaning: 'Another tech meaning', context: 'tech' },
          { meaning: 'Active Pharmaceutical Ingredient', context: 'pharma' },
        ],
      }

      const contexts = getContexts(mockItem)
      expect(contexts).toHaveLength(2)
      expect(contexts).toContain('tech')
      expect(contexts).toContain('pharma')
    })

    it('filters out undefined contexts', () => {
      const mockItem: GlossaryItem = {
        term: 'Test',
        slug: 'test',
        definitions: [
          { meaning: 'A definition without context' },
          { meaning: 'A definition with context', context: 'tech' },
        ],
      }

      const contexts = getContexts(mockItem)
      expect(contexts).toHaveLength(1)
      expect(contexts).toEqual(['tech'])
    })

    it('returns empty array when no definitions exist', () => {
      const mockItem: GlossaryItem = {
        term: 'Test',
        slug: 'test',
      }

      expect(getContexts(mockItem)).toEqual([])
    })

    it('returns empty array when all definitions lack context', () => {
      const mockItem: GlossaryItem = {
        term: 'Test',
        slug: 'test',
        definitions: [
          { meaning: 'First definition' },
          { meaning: 'Second definition' },
        ],
      }

      expect(getContexts(mockItem)).toEqual([])
    })
  })
})
