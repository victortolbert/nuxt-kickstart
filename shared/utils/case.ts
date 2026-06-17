/**
 * Case transformation utilities
 * Source of truth: kebab-case (slugs)
 * Display formats: Title Case, Sentence case, camelCase, PascalCase
 */

import { ACRONYMS } from './glossary'

// Shared regex patterns for case transformations
const SEPARATOR_RE = /[-_]/g
const WORD_START_RE = /\b\w/g
const SEPARATOR_CHAR_RE = /[-_](.)/g
const FIRST_CHAR_RE = /^./
const CAMEL_BOUNDARY_RE = /([a-z])([A-Z])/g
const UNDERSCORES_SPACES_RE = /[_\s]+/g
const HYPHENS_SPACES_RE = /[-\s]+/g

/**
 * Convert kebab-case or snake_case to Title Case
 * @example toTitleCase('in-progress') => 'In Progress'
 * @example toTitleCase('waiting_for') => 'Waiting For'
 */
export function toTitleCase(str: string): string {
  if (!str)
    return ''
  return str
    .replace(SEPARATOR_RE, ' ')
    .replace(WORD_START_RE, char => char.toUpperCase())
}

/**
 * Convert kebab-case or snake_case to Sentence case
 * @example toSentenceCase('in-progress') => 'In progress'
 */
export function toSentenceCase(str: string): string {
  if (!str)
    return ''
  const words = str.replace(SEPARATOR_RE, ' ')
  return words.charAt(0).toUpperCase() + words.slice(1).toLowerCase()
}

/**
 * Convert kebab-case or snake_case to camelCase
 * @example toCamelCase('in-progress') => 'inProgress'
 */
export function toCamelCase(str: string): string {
  if (!str)
    return ''
  return str
    .replace(SEPARATOR_CHAR_RE, (_, char) => char.toUpperCase())
    .replace(FIRST_CHAR_RE, char => char.toLowerCase())
}

/**
 * Convert kebab-case or snake_case to PascalCase
 * @example toPascalCase('in-progress') => 'InProgress'
 */
export function toPascalCase(str: string): string {
  if (!str)
    return ''
  return str
    .replace(SEPARATOR_CHAR_RE, (_, char) => char.toUpperCase())
    .replace(FIRST_CHAR_RE, char => char.toUpperCase())
}

/**
 * Convert any case to kebab-case
 * @example toKebabCase('InProgress') => 'in-progress'
 * @example toKebabCase('in_progress') => 'in-progress'
 */
export function toKebabCase(str: string): string {
  if (!str)
    return ''
  return str
    .replace(CAMEL_BOUNDARY_RE, '$1-$2')
    .replace(UNDERSCORES_SPACES_RE, '-')
    .toLowerCase()
}

/**
 * Convert any case to snake_case
 * @example toSnakeCase('InProgress') => 'in_progress'
 * @example toSnakeCase('in-progress') => 'in_progress'
 */
export function toSnakeCase(str: string): string {
  if (!str)
    return ''
  return str
    .replace(CAMEL_BOUNDARY_RE, '$1_$2')
    .replace(HYPHENS_SPACES_RE, '_')
    .toLowerCase()
}

/**
 * Convert any case to CONSTANT_CASE (screaming snake case)
 * @example toConstantCase('InProgress') => 'IN_PROGRESS'
 * @example toConstantCase('in-progress') => 'IN_PROGRESS'
 * @example toConstantCase('some value') => 'SOME_VALUE'
 */
export function toConstantCase(str: string): string {
  if (!str)
    return ''
  return str
    .replace(CAMEL_BOUNDARY_RE, '$1_$2')
    .replace(HYPHENS_SPACES_RE, '_')
    .toUpperCase()
}

/**
 * Format a label for display with acronym awareness
 * Acronyms render as uppercase, others as Title Case
 * Use this for badge labels, dropdown options, page titles, etc.
 * @example formatLabel('design-tokens') => 'Design Tokens'
 * @example formatLabel('api-design') => 'API Design'
 */
export function formatLabel(str: string): string {
  if (!str)
    return ''
  return str
    .replace(SEPARATOR_RE, ' ')
    .split(' ')
    .map((word) => {
      const lower = word.toLowerCase()
      if (ACRONYMS.has(lower)) {
        return lower.toUpperCase()
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    })
    .join(' ')
}

/**
 * Format a tag for display with acronym awareness
 * Acronyms render as uppercase, others as Title Case
 * @example formatTag('raci') => 'RACI'
 * @example formatTag('leadership') => 'Leadership'
 */
export function formatTag(tag: string): string {
  if (!tag)
    return ''
  const lower = tag.toLowerCase()
  if (ACRONYMS.has(lower)) {
    return lower.toUpperCase()
  }
  return toTitleCase(tag)
}
