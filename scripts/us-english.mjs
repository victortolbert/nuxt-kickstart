// Rewrite British spellings to American across the authored tree, word-bounded
// and case-preserving: a lowercase, capitalized or all-caps word keeps its
// case. The list and the surface are shared with test/unit/us-english.test.ts,
// which is the guard; this is the sweep. Usage: node scripts/us-english.mjs [--check]
import { readFileSync, writeFileSync } from 'node:fs'
import { globSync } from 'node:fs'
import process from 'node:process'
import { BRITISH_TO_AMERICAN, US_ENGLISH_GLOBS, US_ENGLISH_IGNORE, US_ENGLISH_KEEP } from '../test/helpers/us-english.ts'

const check = process.argv.includes('--check')
const pattern = new RegExp(`\\b(${Object.keys(BRITISH_TO_AMERICAN).join('|')})\\b`, 'gi')

function american(word) {
  const lower = word.toLowerCase()
  const to = BRITISH_TO_AMERICAN[lower]
  if (word === lower)
    return to
  if (word === word.toUpperCase())
    return to.toUpperCase()
  return to.charAt(0).toUpperCase() + to.slice(1)
}

// Kept identifiers are hidden behind placeholders for the duration of the
// rewrite, so their British halves never reach the pattern.
const keep = US_ENGLISH_KEEP.map((token, i) => [token, `\u0000KEEP${i}\u0000`])
const protect = text => keep.reduce((t, [token, ph]) => t.split(token).join(ph), text)
const restore = text => keep.reduce((t, [token, ph]) => t.split(ph).join(token), text)

const files = globSync(US_ENGLISH_GLOBS, { exclude: US_ENGLISH_IGNORE.map(g => g.replace(/\/\*\*$/, '')) })
let touched = 0
let hits = 0
for (const file of files) {
  const before = readFileSync(file, 'utf8')
  const after = restore(protect(before).replace(pattern, m => (hits++, american(m))))
  if (after !== before) {
    touched++
    if (!check)
      writeFileSync(file, after)
  }
}
console.log(`us-english: ${hits} word${hits === 1 ? '' : 's'} in ${touched} file${touched === 1 ? '' : 's'}${check ? ' (check only)' : ' rewritten'}`)
if (check && hits > 0)
  process.exit(1)
