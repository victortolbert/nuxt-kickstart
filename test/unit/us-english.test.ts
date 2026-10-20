import { globSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { BRITISH_TO_AMERICAN, US_ENGLISH_GLOBS, US_ENGLISH_IGNORE, US_ENGLISH_KEEP } from '../helpers/us-english'

/**
 * The template is written in United States English — prose, strings,
 * comments, identifiers — because its author is, and a project started from
 * it should not inherit a mix. A British spelling anywhere on the authored
 * surface is the failure; vendored upstream text (the curated agent skills
 * under `.claude/skills/`) is left as its authors wrote it and is outside the
 * surface.
 *
 * Fix a red here with `node scripts/us-english.mjs`, which rewrites the same
 * list over the same files; the list is test/helpers/us-english.ts.
 */
const pattern = new RegExp(`\\b(${Object.keys(BRITISH_TO_AMERICAN).join('|')})\\b`, 'gi')

describe('the US English sweep', () => {
  it('is what the authored surface is written in', () => {
    const files = globSync(US_ENGLISH_GLOBS, { exclude: US_ENGLISH_IGNORE.map(g => g.replace(/\/\*\*$/, '')) })
    expect(files.length, 'the surface should be non-empty').toBeGreaterThan(100)

    const findings: string[] = []
    for (const file of files) {
      const lines = readFileSync(file, 'utf8').split('\n')
      lines.forEach((raw, i) => {
        const line = US_ENGLISH_KEEP.reduce((l, token) => l.split(token).join(''), raw)
        for (const m of line.matchAll(pattern))
          findings.push(`${file}:${i + 1}: "${m[0]}" → ${BRITISH_TO_AMERICAN[m[0].toLowerCase()]}`)
      })
    }

    expect(findings, 'British spellings on the authored surface — run `node scripts/us-english.mjs`').toEqual([])
  })

  it('maps every listed word to a different one', () => {
    // The sweep once rewrote its own keys; this is the guard against that.
    for (const [from, to] of Object.entries(BRITISH_TO_AMERICAN))
      expect(to, from).not.toBe(from)
  })
})
