import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * The content tree and the collection globs that partition it, shared by the
 * two specs that hold `content/` to `schemas/`: coverage (every file matches a
 * collection, `content-collection-coverage.test.ts`) and validation (every
 * file satisfies the collection it matches, `content-schema-validation.test.ts`).
 *
 * One matcher for both, so a glob feature the coverage check learns to read is
 * read the same way by the validation check — the two would otherwise disagree
 * about which collection a file belongs to, and a document could be "covered"
 * by one and validated against nothing by the other.
 */

export const contentDir = fileURLToPath(new URL('../../content', import.meta.url))

/** Every file under `dir`, as paths relative to it, in directory order. */
export function walk(dir: string, base = ''): string[] {
  const out: string[] = []
  for (const entry of readdirSync(join(dir, base), { withFileTypes: true })) {
    const rel = base ? join(base, entry.name) : entry.name
    if (entry.isDirectory())
      out.push(...walk(dir, rel))
    else out.push(rel)
  }
  return out
}

/**
 * The subset of glob syntax the collection sources actually use: `**` across
 * directory boundaries, `*` within a segment, literals elsewhere.
 */
export function globToRegExp(glob: string): RegExp {
  let pattern = ''
  for (let i = 0; i < glob.length; i++) {
    const char = glob[i]!
    if (char !== '*') {
      pattern += char.replace(/[.+^${}()|[\]\\?]/g, '\\$&')
      continue
    }
    if (glob[i + 1] === '*') {
      // `**/` may match zero directories, so `a/**/*.md` matches `a/b.md`.
      if (glob[i + 2] === '/') {
        pattern += '(?:.*/)?'
        i += 2
      }
      else {
        pattern += '.*'
        i += 1
      }
      continue
    }
    pattern += '[^/]*'
  }
  return new RegExp(`^${pattern}$`)
}
