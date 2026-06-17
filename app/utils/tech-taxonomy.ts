/**
 * Maps the fine-grained tech `category` values (see schemas/registries/tech.ts)
 * into the coarse display buckets used by the /tech registry filters + section
 * headings. Pure + exported so the rollup is testable through its interface.
 */

export type TechBucket = 'languages' | 'frameworks' | 'libraries' | 'tooling' | 'platforms' | 'other'

/** Ordered buckets → the categories they contain. Order drives the UI. */
export const TECH_BUCKETS: { id: TechBucket, categories: string[] }[] = [
  { id: 'languages', categories: ['programming-language', 'scripting-language', 'markup-language', 'templating-language'] },
  { id: 'frameworks', categories: ['frontend-framework', 'backend-framework', 'full-stack-framework', 'meta-framework', 'mobile-framework', 'data-app-framework', 'full-stack-adapter'] },
  { id: 'libraries', categories: ['library', 'ui-library'] },
  { id: 'tooling', categories: ['build-tool', 'testing-framework', 'testing-tool', 'linting-tool', 'design-tool', 'tool'] },
  { id: 'platforms', categories: ['platform'] },
  { id: 'other', categories: ['other'] },
]

const CATEGORY_TO_BUCKET: Record<string, TechBucket> = Object.fromEntries(
  TECH_BUCKETS.flatMap(b => b.categories.map(c => [c, b.id])),
)

/** Coarse bucket for a category (unknown/missing → 'other'). */
export function techBucket(category?: string | null): TechBucket {
  return (category && CATEGORY_TO_BUCKET[category]) || 'other'
}
