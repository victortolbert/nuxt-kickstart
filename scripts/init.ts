/**
 * Template initialization script — run once after creating a project
 * from the nuxt-kickstart template:
 *
 *   pnpm run init
 *
 * Prompts for your project's names and rewrites the template tokens
 * (`nuxt-kickstart`, `Kickstart`, `kickstart-*` storage keys, the
 * placeholder domain) across the repo, then replaces the template author's
 * identity: the package.json author block, the repository/bugs/homepage URLs
 * and .github/FUNDING.yml, none of which a generated project should inherit.
 * Idempotent: re-running after a rename simply finds zero occurrences and
 * changes nothing.
 */
import { execSync } from 'node:child_process'
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import process from 'node:process'
import { createInterface } from 'node:readline'
import { pathToFileURL } from 'node:url'

// Note: svg is intentionally NOT here — SVGs are text and may carry the
// display name (placeholder screenshots, favicon title)
const BINARY_EXTENSIONS = new Set([
  'png', 'jpg', 'jpeg', 'gif', 'webp', 'avif', 'ico',
  'woff', 'woff2', 'ttf', 'otf', 'eot',
  'mp3', 'mp4', 'webm', 'ogg', 'wav',
  'pdf', 'zip', 'gz', 'db', 'sqlite', 'ics',
])

function toKebabCase(value: string): string {
  return value
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/gi, '')
    .toLowerCase()
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function toTitleCase(value: string): string {
  return value
    .split(/[-\s]+/)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const FUNDING_FILE = '.github/FUNDING.yml'
const GITHUB_REMOTE_RE = /github\.com[:/]([^/]+)\/([^/]+?)(?:\.git)?$/

/**
 * Run a git command for a default value, returning '' if git has nothing to
 * say (no config set, no remote, not a repo). Never throws: every caller
 * falls back to prompting.
 */
function gitOutput(command: string): string {
  try {
    return execSync(command, { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
  }
  catch {
    return ''
  }
}

/**
 * Extract `owner/name` from a GitHub remote URL, in either the https or the
 * ssh form. Returns '' for anything not recognisably a GitHub remote, so the
 * caller can fall back to prompting.
 */
export function parseGitHubSlug(remoteUrl: string): string {
  const match = GITHUB_REMOTE_RE.exec(remoteUrl.trim().replace(/\/+$/, ''))
  return match ? `${match[1]}/${match[2]}` : ''
}

export interface ProjectIdentity {
  authorName: string
  authorEmail: string
  authorUrl: string
  repoSlug: string
}

/**
 * Replace the template author's identity in a parsed package.json.
 *
 * The token pass rewrites names, not identity, so without this a generated
 * project would ship the template author's name, email, sponsor links and
 * repository URLs. Anything left blank is removed rather than inherited —
 * an absent author is correct, someone else's author is not.
 */
export function applyIdentity(pkg: Record<string, unknown>, identity: ProjectIdentity): Record<string, unknown> {
  const author: Record<string, string> = {}
  if (identity.authorName)
    author.name = identity.authorName
  if (identity.authorEmail)
    author.email = identity.authorEmail
  if (identity.authorUrl)
    author.url = identity.authorUrl

  if (Object.keys(author).length > 0)
    pkg.author = author
  else
    delete pkg.author

  if (identity.repoSlug) {
    pkg.repository = { type: 'git', url: `git+https://github.com/${identity.repoSlug}.git` }
    pkg.bugs = { url: `https://github.com/${identity.repoSlug}/issues` }
    pkg.homepage = `https://github.com/${identity.repoSlug}#readme`
  }
  else {
    delete pkg.repository
    delete pkg.bugs
    delete pkg.homepage
  }

  return pkg
}

/**
 * Prompt helper that works for both interactive TTYs and piped stdin.
 * readline's question() can drop lines that arrive while no question is
 * pending (e.g. `printf 'a\nb\n' | tsx init.ts`), so buffer every line
 * and hand them out in order.
 */
function createPrompter() {
  const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: process.stdin.isTTY })
  const buffered: string[] = []
  let pending: ((line: string) => void) | null = null
  let closed = false

  rl.on('line', (line) => {
    if (pending) {
      const resolve = pending
      pending = null
      resolve(line)
    }
    else {
      buffered.push(line)
    }
  })

  rl.on('close', () => {
    closed = true
    if (pending) {
      const resolve = pending
      pending = null
      resolve('')
    }
  })

  return {
    ask(prompt: string): Promise<string> {
      process.stdout.write(prompt)
      const next = buffered.shift()
      if (next !== undefined) {
        process.stdout.write(`${next}\n`)
        return Promise.resolve(next)
      }
      if (closed)
        return Promise.resolve('')
      return new Promise((resolve) => {
        pending = resolve
      })
    },
    close() {
      rl.close()
    },
  }
}

async function main() {
  const prompter = createPrompter()

  console.log('\nnuxt-kickstart → your project\n')

  const rawName = await prompter.ask('Project name (kebab-case, e.g. acme-portal): ')
  const kebabName = toKebabCase(rawName)
  if (!kebabName) {
    console.error('A project name is required.')
    process.exit(1)
  }

  const defaultDisplay = toTitleCase(kebabName)
  const displayName = (await prompter.ask(`Display name [${defaultDisplay}]: `)).trim() || defaultDisplay

  const defaultUrl = `https://${kebabName}.example.com`
  const siteUrl = (await prompter.ask(`Site URL [${defaultUrl}]: `)).trim() || defaultUrl

  const packageName = (await prompter.ask(`npm package name [${kebabName}]: `)).trim() || kebabName

  const defaultAuthorName = gitOutput('git config --get user.name')
  const authorName = (await prompter.ask(`Author name${defaultAuthorName ? ` [${defaultAuthorName}]` : ''}: `)).trim() || defaultAuthorName

  const defaultAuthorEmail = gitOutput('git config --get user.email')
  const authorEmail = (await prompter.ask(`Author email${defaultAuthorEmail ? ` [${defaultAuthorEmail}]` : ''}: `)).trim() || defaultAuthorEmail

  const authorUrl = (await prompter.ask('Author URL (optional): ')).trim()

  const defaultSlug = parseGitHubSlug(gitOutput('git remote get-url origin'))
  const repoSlug = (await prompter.ask(`GitHub repo owner/name${defaultSlug ? ` [${defaultSlug}]` : ''}: `)).trim() || defaultSlug

  prompter.close()

  const siteHost = siteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')

  // Ordered: most specific token first so later passes don't mangle earlier ones.
  const replacements: Array<[string, string]> = [
    ['nuxt-kickstart.example.com', siteHost],
    ['@victortolbert/nuxt-kickstart', packageName],
    ['nuxt-kickstart', kebabName],
    ['kickstart-', `${kebabName}-`], // storage keys: kickstart-theme, kickstart-locale, ...
    ['Kickstart', displayName],
    ['kickstart', kebabName],
  ]

  const files = execSync('git ls-files', { encoding: 'utf-8' })
    .split('\n')
    .filter(Boolean)
    .filter((file) => {
      const ext = file.split('.').pop()?.toLowerCase() ?? ''
      return !BINARY_EXTENSIONS.has(ext) && file !== 'scripts/init.ts'
    })

  let changedFiles = 0
  let totalReplacements = 0

  for (const file of files) {
    let content: string
    try {
      content = readFileSync(file, 'utf-8')
    }
    catch {
      continue // unreadable (deleted, submodule, etc.)
    }

    let updated = content
    for (const [from, to] of replacements) {
      updated = updated.split(from).join(to)
    }

    if (updated !== content) {
      const count = replacements.reduce(
        (sum, [from]) => sum + content.split(from).length - 1,
        0,
      )
      writeFileSync(file, updated)
      changedFiles++
      totalReplacements += count
      console.log(`  ✓ ${file}`)
    }
  }

  console.log(`\n${changedFiles} files updated (${totalReplacements} replacements).`)

  // The token pass rewrites names; identity is deliberately separate. Read
  // package.json back off disk so this builds on the rename above.
  const pkg = JSON.parse(readFileSync('package.json', 'utf-8')) as Record<string, unknown>
  const identity: ProjectIdentity = { authorName, authorEmail, authorUrl, repoSlug }
  writeFileSync('package.json', `${JSON.stringify(applyIdentity(pkg, identity), null, 2)}\n`)
  console.log('  ✓ package.json (author, repository, bugs, homepage)')

  if (existsSync(FUNDING_FILE)) {
    rmSync(FUNDING_FILE)
    console.log(`  ✓ ${FUNDING_FILE} (removed — it sponsored the template author)`)
  }

  if (changedFiles === 0) {
    console.log('Nothing to rename — the template tokens were not found (already initialized?).')
  }
  else {
    console.log(`
Next steps:
  1. Review the diff:        git diff
  2. Rewrite the README intro for ${displayName}
  3. Rename public/img/screenshots/kickstart/ to match your project
  4. Start developing:        pnpm dev
     (the local database was already created by pnpm install)
`)
  }
}

// Only run when invoked directly (`pnpm run init`), so the helpers above can
// be imported by tests without the prompt loop starting.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error)
    process.exit(1)
  })
}
