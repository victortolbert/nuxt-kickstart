import { readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * The review gate keys on a document's `path` and `reviewed`, and the archive
 * verdict on its `status`. A query that `.select()`s `visibility` without them
 * hands the rules an item they cannot place, and the rules leave such an item
 * ungated — so a wilted or unreviewed public page would slip into a visitor's
 * listing through that one query. This sweeps every `.select(` that names
 * `visibility` and requires the other three beside it.
 */
const ROOT = join(__dirname, '../..')
const DIRS = ['app', 'server', 'shared']

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory())
      return entry.name === 'node_modules' ? [] : sourceFiles(path)
    return /\.(?:ts|vue)$/.test(entry.name) ? [path] : []
  })
}

function offendingSelects(source: string): string[] {
  const offenders: string[] = []
  for (const match of source.matchAll(/\.select\(([^)]*)\)/g)) {
    const args = match[1]!
    if (!/['"]visibility['"]/.test(args))
      continue
    const complete = ['path', 'reviewed', 'status'].every(field => new RegExp(`['"]${field}['"]`).test(args))
    if (!complete)
      offenders.push(`.select(${args.trim()})`)
  }
  return offenders
}

describe('selects that carry visibility carry path, reviewed and status', () => {
  it('flags a select that names visibility alone', () => {
    // A detector that matches nothing is indistinguishable from a broken one.
    expect(offendingSelects(`queryCollection('posts').select('title', 'visibility').all()`)).toHaveLength(1)
    expect(offendingSelects(`queryCollection('posts').select('title', 'path', 'visibility', 'reviewed', 'status').all()`)).toEqual([])
    expect(offendingSelects(`queryCollection('posts').select('title', 'path').all()`)).toEqual([])
  })

  it('every .select(…"visibility"…) in app, server and shared also selects path, reviewed and status', () => {
    const offenders = DIRS.flatMap(dir =>
      sourceFiles(join(ROOT, dir)).flatMap(file =>
        offendingSelects(readFileSync(file, 'utf8')).map(o => `${relative(ROOT, file)}: ${o}`)))
    expect(offenders, `selects missing path/reviewed/status:\n  ${offenders.join('\n  ')}`).toEqual([])
  })
})
