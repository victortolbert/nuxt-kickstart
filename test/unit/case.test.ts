import { describe, expect, it } from 'vitest'
import {
  formatLabel,
  formatTag,
  toCamelCase,
  toConstantCase,
  toKebabCase,
  toPascalCase,
  toSentenceCase,
  toSnakeCase,
  toTitleCase,
} from '../../shared/utils/case'

describe('case utilities', () => {
  describe('toTitleCase', () => {
    it('converts kebab-case to Title Case', () => {
      expect(toTitleCase('in-progress')).toBe('In Progress')
    })

    it('converts snake_case to Title Case', () => {
      expect(toTitleCase('waiting_for')).toBe('Waiting For')
    })

    it('handles empty string', () => {
      expect(toTitleCase('')).toBe('')
    })
  })

  describe('toSentenceCase', () => {
    it('converts kebab-case to Sentence case', () => {
      expect(toSentenceCase('in-progress')).toBe('In progress')
    })

    it('handles empty string', () => {
      expect(toSentenceCase('')).toBe('')
    })
  })

  describe('toCamelCase', () => {
    it('converts kebab-case to camelCase', () => {
      expect(toCamelCase('in-progress')).toBe('inProgress')
    })

    it('converts snake_case to camelCase', () => {
      expect(toCamelCase('some_value')).toBe('someValue')
    })

    it('handles empty string', () => {
      expect(toCamelCase('')).toBe('')
    })
  })

  describe('toPascalCase', () => {
    it('converts kebab-case to PascalCase', () => {
      expect(toPascalCase('in-progress')).toBe('InProgress')
    })

    it('handles empty string', () => {
      expect(toPascalCase('')).toBe('')
    })
  })

  describe('toKebabCase', () => {
    it('converts PascalCase to kebab-case', () => {
      expect(toKebabCase('InProgress')).toBe('in-progress')
    })

    it('converts snake_case to kebab-case', () => {
      expect(toKebabCase('in_progress')).toBe('in-progress')
    })

    it('handles empty string', () => {
      expect(toKebabCase('')).toBe('')
    })
  })

  describe('toSnakeCase', () => {
    it('converts PascalCase to snake_case', () => {
      expect(toSnakeCase('InProgress')).toBe('in_progress')
    })

    it('converts kebab-case to snake_case', () => {
      expect(toSnakeCase('in-progress')).toBe('in_progress')
    })

    it('handles empty string', () => {
      expect(toSnakeCase('')).toBe('')
    })
  })

  describe('toConstantCase', () => {
    it('converts PascalCase to CONSTANT_CASE', () => {
      expect(toConstantCase('InProgress')).toBe('IN_PROGRESS')
    })

    it('converts space-separated string to CONSTANT_CASE', () => {
      expect(toConstantCase('some value')).toBe('SOME_VALUE')
    })

    it('handles empty string', () => {
      expect(toConstantCase('')).toBe('')
    })
  })

  describe('formatLabel', () => {
    it('is an alias for toTitleCase', () => {
      expect(formatLabel('in-progress')).toBe('In Progress')
    })

    it('handles empty string', () => {
      expect(formatLabel('')).toBe('')
    })
  })

  describe('formatTag', () => {
    it('converts acronyms to uppercase', () => {
      expect(formatTag('raci')).toBe('RACI')
    })

    it('converts non-acronyms to Title Case', () => {
      expect(formatTag('leadership')).toBe('Leadership')
    })

    it('handles empty string', () => {
      expect(formatTag('')).toBe('')
    })
  })
})
