/**
 * Glossary utilities for terminology lookup and formatting
 *
 * Note: These utilities work with a static acronym set for synchronous lookups.
 */

/**
 * Definition structure matching the glossary schema
 */
export interface GlossaryDefinition {
  meaning: string
  context?: string
  description?: string
}

/**
 * Glossary item interface for utility functions
 * Matches the schema defined in content.config.ts
 */
export interface GlossaryItem {
  term: string
  slug: string
  aliases?: string[]
  isAcronym?: boolean
  definitions?: GlossaryDefinition[]
  related?: string[]
  seeAlso?: string[]
}

/**
 * Known acronyms that should render as uppercase
 * This set is used for synchronous formatting (formatTag, isAcronym)
 * Add new acronyms here as they're added to content/glossary/
 */
export const ACRONYMS = new Set([
  // AI/ML
  'ai',
  'ml',
  'llm',
  'nlp',
  'gpt',
  // Productivity/Methodology
  'raci',
  'rasci',
  'gtd',
  'para',
  'okr',
  'kpi',
  // Tech - General
  'aem',
  'htl',
  'api',
  'ui',
  'ux',
  'css',
  'html',
  'sql',
  'cli',
  'gui',
  'sdk',
  'ide',
  'url',
  'uri',
  // Tech - Web rendering / frameworks
  'ssr',
  'ssg',
  'csr',
  'isr',
  'spa',
  'pwa',
  'seo',
  // Tech - Protocols
  'http',
  'https',
  'rest',
  'grpc',
  'tcp',
  'udp',
  'ip',
  'dns',
  'ssl',
  'tls',
  'ssh',
  'ftp',
  'smtp',
  // Tech - Formats
  'json',
  'xml',
  'yaml',
  'csv',
  'pdf',
  'svg',
  // Tech - Auth
  'jwt',
  'sso',
  'oauth',
  'saml',
  'mfa',
  // Tech - Cloud/Infra
  'aws',
  'gcp',
  'cdn',
  'vm',
  'ci',
  'cd',
  // Tech - Data
  'crud',
  'orm',
  'etl',
  'olap',
  'oltp',
  // Business
  'roi',
  'b2b',
  'b2c',
  'saas',
  'paas',
  'iaas',
  'poc',
  'mvp',
  'nda',
  'sla',
  'sow',
])

/**
 * Check if a string is a known acronym
 */
export function isAcronym(str: string): boolean {
  if (!str)
    return false
  return ACRONYMS.has(str.toLowerCase())
}

/**
 * Get the display form of a term (uppercase if acronym)
 */
export function getTermDisplay(term: string): string {
  if (!term)
    return ''
  return isAcronym(term) ? term.toUpperCase() : term
}

/**
 * Get the primary definition for a term, optionally filtered by context
 * This is a helper for use with glossary query results
 */
export function getPrimaryDefinition(
  item: GlossaryItem,
  context?: string,
): GlossaryDefinition | undefined {
  if (!item.definitions?.length)
    return undefined

  if (context) {
    const contextMatch = item.definitions.find((d: GlossaryDefinition) => d.context === context)
    if (contextMatch)
      return contextMatch
  }

  return item.definitions[0]
}

/**
 * Get all definitions for a specific context
 */
export function getDefinitionsByContext(
  item: GlossaryItem,
  context: string,
): GlossaryDefinition[] {
  if (!item.definitions?.length)
    return []
  return item.definitions.filter((d: GlossaryDefinition) => d.context === context)
}

/**
 * Check if a glossary item has multiple meanings (disambiguation needed)
 */
export function hasMultipleMeanings(item: GlossaryItem): boolean {
  return (item.definitions?.length ?? 0) > 1
}

/**
 * Get unique contexts from a glossary item's definitions
 */
export function getContexts(item: GlossaryItem): string[] {
  if (!item.definitions?.length)
    return []
  return [...new Set(item.definitions.map((d: GlossaryDefinition) => d.context).filter(Boolean) as string[])]
}
