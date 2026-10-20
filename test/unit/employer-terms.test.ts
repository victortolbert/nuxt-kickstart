import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { EMPLOYER_TERMS, EMPLOYER_TERMS_IGNORE } from '../helpers/employer-terms'

// Nothing from the author's employer may reach this public template — see
// test/helpers/employer-terms.ts for why, and for the list. The surface is
// every file git tracks or would track — tracked plus untracked-but-not-ignored,
// so a new file is caught before it is staged — which leaves `node_modules/`,
// `.nuxt/` and `.git/` out by construction. Lockfiles and binaries are skipped.

const repoRoot = resolve(__dirname, '../..')

function trackedFiles(): string[] {
  return execFileSync('git', ['ls-files', '-z', '--cached', '--others', '--exclude-standard'], { cwd: repoRoot, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
    .split('\0')
    .filter(Boolean)
    .filter(file => !EMPLOYER_TERMS_IGNORE.some(re => re.test(file)))
}

const escape = (term: string) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const pattern = new RegExp(EMPLOYER_TERMS.map(escape).join('|'), 'gi')

describe('employer-term sweep', () => {
  describe('the check can still fail', () => {
    it('decodes a non-empty list of real words', () => {
      expect(EMPLOYER_TERMS.length).toBeGreaterThanOrEqual(7)
      for (const term of EMPLOYER_TERMS)
        expect(term, 'an entry did not decode to plain text').toMatch(/^[a-z ]{4,}$/)
    })

    it('matches a term regardless of case', () => {
      const sample = EMPLOYER_TERMS[0]!.toUpperCase()
      expect(`see ${sample} docs`.match(pattern)).not.toBeNull()
    })

    it('reads the tracked tree', () => {
      const files = trackedFiles()
      expect(files.length).toBeGreaterThan(100)
      expect(files).toContain('package.json')
      expect(files).not.toContain('pnpm-lock.yaml')
    })
  })

  it('no tracked file names the employer, its products, or its internal systems', () => {
    const findings: string[] = []
    for (const file of trackedFiles()) {
      let text: string
      try {
        text = readFileSync(join(repoRoot, file), 'utf8')
      }
      catch {
        // Tracked but absent from the working tree (deleted, not yet staged).
        continue
      }
      if (text.includes('\0'))
        continue
      text.split('\n').forEach((line, i) => {
        for (const m of line.matchAll(pattern))
          findings.push(`${file}:${i + 1}: "${m[0]}"`)
      })
    }

    expect(
      findings,
      'Employer or client terms in a tracked file. Remove or genericize them; do '
      + 'not shorten the list in test/helpers/employer-terms.ts to make one pass.',
    ).toEqual([])
  })
})
