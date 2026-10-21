import { existsSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { contentDir, globToRegExp, walk } from '../helpers/content-tree'
import { layers } from '../helpers/layers'

// A markdown file under `content/` that no collection's source glob matches is
// parsed, reported in the build's file count, and belongs to nothing: no route,
// no search, no nav, and no error anywhere. A content rebuild that reports one
// more file parsed looks like it worked.
//
// The likeliest way in is a new locale: a translated guide dropped under
// `content/fr/guides/` before `schemas/publishing/guides.ts` gains a matching
// source entry renders nowhere and says nothing.
//
// Deliberately textual: this runs in the `unit` project with no Nuxt build, and
// `defineCollection` converts its schema to JSON Schema at import time using a
// converter only the Nuxt build injects, so importing a collection module
// throws outside it. (The sibling `content-schema-validation.test.ts` gets past
// that by mocking `defineCollection` — it needs the Zod schemas; this file only
// needs the globs, and reading them off the source keeps it independent of
// that mock.)
//
// Scoped to markdown. The `.yml` sources (`content/navigation/`) are read by
// `/api/navigation`, not by a collection, and are not documents that can
// silently fail to render.

const repoRoot = resolve(__dirname, '../..')
const schemasDir = join(repoRoot, 'schemas')

/**
 * Markdown under `content/` that is knowingly in no collection.
 *
 * Every entry needs a reason. An orphan that is merely tolerated belongs here
 * where somebody can see it; one that is invisible is the bug this file exists
 * to prevent.
 */
const EXPECTED_ORPHANS: Record<string, string> = {
  'README.md': 'Documents the content tree for humans reading the repo; not a page.',
}

/**
 * Every source glob declared across `schemas/`, in all three forms a collection
 * uses: an inline `source: '<glob>'`, a `{ include: '<glob>' }` (alone or in a
 * source array), and `createCollectionSource('<glob>', '<name>')`.
 */
function collectionGlobs(sources: string[]): string[] {
  const globs = new Set<string>()
  for (const file of sources) {
    const src = readFileSync(file, 'utf-8')
    for (const [, glob] of src.matchAll(/include:\s*'([^']+)'/g))
      globs.add(glob!)
    for (const [, glob] of src.matchAll(/createCollectionSource\(\s*'([^']+)'/g))
      globs.add(glob!)
    for (const [, glob] of src.matchAll(/source:\s*'([^']+)'/g))
      globs.add(glob!)
  }
  return [...globs]
}

const globs = collectionGlobs(walk(schemasDir).filter(f => f.endsWith('.ts')).map(f => join(schemasDir, f)))
const matchers = globs.map(globToRegExp)
const isCollected = (path: string) => matchers.some(re => re.test(path))

/**
 * A layer's collections resolve their sources under the layer's own
 * `content/`, so each layer is checked against the globs it declares — in its
 * `content.config.ts` and anything beside it under `schemas/`.
 */
const layerTrees = layers()
  .filter(layer => existsSync(layer.content))
  .map((layer) => {
    const schemaDir = join(layer.root, 'schemas')
    const sources = [
      ...(layer.contentConfig ? [layer.contentConfig] : []),
      ...(existsSync(schemaDir) ? walk(schemaDir).filter(f => f.endsWith('.ts')).map(f => join(schemaDir, f)) : []),
    ]
    const res = collectionGlobs(sources).map(globToRegExp)
    return { name: layer.name, content: layer.content, isCollected: (path: string) => res.some(re => re.test(path)) }
  })

describe('content collection coverage', () => {
  // Without these the suite passes when the extractor finds nothing and when the
  // matcher matches everything — the two ways this check could go green and be
  // worthless.
  describe('the check can still fail', () => {
    // One glob per collection, plus the second `guides` locale. Raise it when a
    // collection or locale source is added; lower it by hand when one is removed.
    it('extracts a glob from every collection', () => {
      expect(globs.length).toBeGreaterThanOrEqual(7)
    })

    it('matches a file that is in a collection', () => {
      expect(isCollected('tech/nuxt.md')).toBe(true)
      expect(isCollected('en/guides/getting-started.md')).toBe(true)
      expect(isCollected('es/guides/getting-started.md')).toBe(true)
      expect(isCollected('_meta/home.md')).toBe(true)
    })

    it('does not match a file that is in none', () => {
      // A locale with no source entry: the shape a new translation would take.
      expect(isCollected('fr/guides/getting-started.md')).toBe(false)
      // `posts` reads `en/posts/` only.
      expect(isCollected('es/posts/hello-world.md')).toBe(false)
      expect(isCollected('unregistered/anything.md')).toBe(false)
      // `**` must not cross into a sibling directory.
      expect(isCollected('tech-archive/deep/note.md')).toBe(false)
    })
  })

  it('every markdown file under content/ belongs to a collection', () => {
    const orphans = walk(contentDir)
      .filter(file => file.endsWith('.md'))
      .filter(file => !isCollected(file))
      .filter(file => !(file in EXPECTED_ORPHANS))
      .sort()

    expect(
      orphans,
      'These files are parsed but belong to no collection, so they render nowhere '
      + 'and fail silently. Add a collection source that matches them, move them '
      + 'under one that already does, or record them in EXPECTED_ORPHANS with a reason.',
    ).toEqual([])
  })

  it('every markdown file under a layer\'s content/ belongs to one of its collections', () => {
    const orphans = layerTrees.flatMap(tree => walk(tree.content)
      .filter(file => file.endsWith('.md') && !tree.isCollected(file))
      .map(file => `layers/${tree.name}/content/${file}`))
    expect(orphans, 'A layer\'s content renders only through the collections the layer defines.').toEqual([])
  })

  it('every recorded exception still exists and is still an orphan', () => {
    const present = new Set(walk(contentDir).filter(f => f.endsWith('.md')))
    for (const [file, reason] of Object.entries(EXPECTED_ORPHANS)) {
      expect(present.has(file), `EXPECTED_ORPHANS lists ${file}, which no longer exists`).toBe(true)
      expect(isCollected(file), `EXPECTED_ORPHANS lists ${file}, which now belongs to a collection — drop the entry`).toBe(false)
      expect(reason.length, `EXPECTED_ORPHANS entry for ${file} needs a reason`).toBeGreaterThan(0)
    }
  })
})
