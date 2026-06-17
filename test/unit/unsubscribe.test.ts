import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { loadUnsubscribedEmails } from '../../server/utils/unsubscribe'

const originalCwd = process.cwd()
const tempDirs: string[] = []

function setupTempWorkspace() {
  const dir = mkdtempSync(join(tmpdir(), 'kickstart-unsubscribe-'))
  tempDirs.push(dir)
  process.chdir(dir)
  return dir
}

afterEach(() => {
  process.chdir(originalCwd)
  for (const dir of tempDirs) {
    rmSync(dir, { recursive: true, force: true })
  }
  tempDirs.length = 0
})

describe('loadUnsubscribedEmails', () => {
  it('returns an empty list when file is missing', async () => {
    setupTempWorkspace()
    const emails = await loadUnsubscribedEmails()
    expect(emails).toEqual([])
  })

  it('extracts emails from frontmatter', async () => {
    const dir = setupTempWorkspace()
    const contentDir = join(dir, 'content', 'email-unsubscribes')
    mkdirSync(contentDir, { recursive: true })
    const filePath = join(contentDir, 'unsubscribed.md')

    writeFileSync(filePath, `---\nemails: ['a@example.com', \"b@example.com\" , c@example.com]\n---\n`)

    const emails = await loadUnsubscribedEmails()
    expect(emails).toEqual(['a@example.com', 'b@example.com', 'c@example.com'])
  })

  it('returns empty list when frontmatter has no emails', async () => {
    const dir = setupTempWorkspace()
    const contentDir = join(dir, 'content', 'email-unsubscribes')
    mkdirSync(contentDir, { recursive: true })
    const filePath = join(contentDir, 'unsubscribed.md')

    writeFileSync(filePath, `---\nstatus: active\n---\n`)

    const emails = await loadUnsubscribedEmails()
    expect(emails).toEqual([])
  })
})
