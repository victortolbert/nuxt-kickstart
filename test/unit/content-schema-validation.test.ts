import type { ZodType } from 'zod'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it, vi } from 'vitest'
import { parse as parseYaml } from 'yaml'
import { contentDir, globToRegExp, walk } from '../helpers/content-tree'
import { layers } from '../helpers/layers'

// Nuxt Content does not validate frontmatter against the Zod schemas in
// `schemas/` — not refinements, not enums, not anything. `defineCollection`
// converts the schema to JSON Schema for the SQL column types and the generated
// TypeScript, then discards the Zod object; the insert step stringifies an
// enum column like any other. A guide with `category: NOT_A_CATEGORY` is stored
// unchallenged and nothing is logged. ADR-0009 records this.
//
// So the schemas are enforced here and nowhere else: every document under
// `content/` is parsed with the Zod schema of the collection whose source glob
// matches it. A document that fails `.safeParse()` fails the suite, which is
// the only place a constraint written in `schemas/` bites.
//
// `defineCollection` is mocked to hand back its own argument, because the real
// one runs the JSON Schema conversion at import time with a converter only the
// Nuxt build injects, and throws outside it. The mock is the seam that makes
// the Zod schema reachable at all.

vi.mock('@nuxt/content', () => ({
  defineCollection: (collection: unknown) => collection,
  // A layer's `content.config.ts` calls this; the mock hands back the config.
  defineContentConfig: (config: unknown) => config,
}))

const { collections } = await import('../../schemas')

interface RawSource {
  include: string
  prefix?: string
  repository?: unknown
}

/** What `defineCollection` was handed, which the mock passes through intact. */
interface RawCollection {
  type: 'page' | 'data'
  source: string | RawSource | RawSource[]
  schema: ZodType
}

const raw = collections as unknown as Record<string, RawCollection>

function includeGlobs(name: string, source: RawCollection['source']): string[] {
  if (typeof source === 'string')
    return [source]
  return (Array.isArray(source) ? source : [source]).map((entry) => {
    // `createCollectionSource` returns a remote source when
    // `NUXT_CONTENT_REPO_URL` is set. The documents under test are the local ones.
    if (entry.repository)
      throw new Error(`${name}: source is a remote repository; this check reads the local tree`)
    return entry.include
  })
}

function matchersFor(collectionsByName: Record<string, RawCollection>) {
  return Object.entries(collectionsByName).map(([name, collection]) => {
    const res = includeGlobs(name, collection.source).map(globToRegExp)
    return {
      name,
      schema: collection.schema,
      matches: (file: string) => res.some(re => re.test(file)),
    }
  })
}

const matchers = matchersFor(raw)

/**
 * Each layer's collections, read from its `content.config.ts`, against the
 * documents under the layer's own `content/` — where Nuxt Content resolves a
 * layer collection's sources.
 */
const layerSets = await Promise.all(layers()
  .filter(layer => layer.contentConfig)
  .map(async (layer) => {
    const config = (await import(layer.contentConfig!)).default as { collections?: Record<string, RawCollection> }
    return { layer, matchers: matchersFor(config.collections ?? {}) }
  }))

/**
 * The data a document contributes to its collection row, read the way Nuxt
 * Content reads it: markdown frontmatter between `---` fences parsed with
 * `yaml` (remark-mdc's `parseFrontMatter`, default YAML 1.2 — so an unquoted
 * `2024-01-01` stays a string), and a `.json` / `.yml` file as a whole.
 *
 * A markdown file without frontmatter contributes `{}`. Nuxt Content then
 * derives `title` from the filename, but that is a fallback for a document
 * that declared nothing, and the schema says every document declares a title.
 *
 * YAML that does not parse is returned as an error rather than thrown, so one
 * broken document does not hide every finding after it.
 */
function documentData(file: string, dir = contentDir): { data: unknown, error?: string } {
  const text = readFileSync(join(dir, file), 'utf-8')
  try {
    if (file.endsWith('.json'))
      return { data: JSON.parse(text) }
    if (file.endsWith('.yml') || file.endsWith('.yaml'))
      return { data: parseYaml(text) }
    if (!text.startsWith('---'))
      return { data: {} }
    const end = text.indexOf('\n---')
    if (end === -1)
      return { data: {} }
    const frontmatter = text.slice(4, text[end - 1] === '\r' ? end - 1 : end)
    return { data: frontmatter ? parseYaml(frontmatter) : {} }
  }
  catch (error) {
    return { data: {}, error: `does not parse: ${(error as Error).message.split('\n')[0]}` }
  }
}

const documents = walk(contentDir)
  .flatMap(file => matchers
    .filter(({ matches }) => matches(file))
    .map(({ name, schema }) => ({ file, collection: name, schema, dir: contentDir, label: file })))

const layerDocuments = layerSets.flatMap(({ layer, matchers: layerMatchers }) =>
  (existsSync(layer.content) ? walk(layer.content) : [])
    .flatMap(file => layerMatchers
      .filter(({ matches }) => matches(file))
      .map(({ name, schema }) => ({ file, collection: name, schema, dir: layer.content, label: `layers/${layer.name}/content/${file}` }))))

describe('content schema validation', () => {
  // Without these the suite passes when the mock hands back nothing usable,
  // when the matcher assigns no documents, and when `.safeParse()` accepts
  // anything — the three ways this check goes green and worthless.
  describe('the check can still fail', () => {
    it('reaches a Zod schema on every collection', () => {
      expect(matchers.map(m => m.name).sort()).toEqual(['apps', 'blocks', 'guides', 'meta', 'posts', 'tech'])
      for (const { name, schema } of matchers)
        expect(typeof schema.safeParse, `${name} has no Zod schema`).toBe('function')
    })

    it('assigns documents to the collections that own them', () => {
      const of = (file: string) => documents.filter(d => d.file === file).map(d => d.collection)
      expect(of('en/guides/getting-started.md')).toEqual(['guides'])
      expect(of('es/guides/getting-started.md')).toEqual(['guides'])
      expect(of('tech/nuxt.md')).toEqual(['tech'])
      expect(of('_meta/home.md')).toEqual(['meta'])
      // A floor, not a count. Lower it by hand when documents are genuinely removed.
      expect(documents.length).toBeGreaterThanOrEqual(70)
    })

    it('rejects a document that Nuxt Content would store unchallenged', () => {
      const guides = raw.guides!.schema
      expect(guides.safeParse({ title: 'Guide', category: 'NOT_A_CATEGORY' }).success).toBe(false)
      expect(guides.safeParse({ title: 'Guide', category: 'content' }).success).toBe(true)
    })
  })

  it('every document under content/ satisfies its collection schema', () => {
    const failures = [...documents, ...layerDocuments]
      .map(({ file, collection, schema, dir, label }) => {
        const { data, error } = documentData(file, dir)
        if (error)
          return `${label} [${collection}] ${error}`
        const result = schema.safeParse(data)
        if (result.success)
          return null
        const issues = result.error.issues
          .map(issue => `${issue.path.join('.') || '(root)'}: ${issue.message}`)
          .join('; ')
        return `${label} [${collection}] ${issues}`
      })
      .filter((line): line is string => line !== null)
      .sort()

    expect(
      failures,
      'These documents violate the Zod schema of their collection. Nuxt Content '
      + 'would store them anyway (ADR-0009); fix the document, or if the schema '
      + 'is wrong, fix the schema — but do not loosen it to make a finding go away.',
    ).toEqual([])
  })
})
