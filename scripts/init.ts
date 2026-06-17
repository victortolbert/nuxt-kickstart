/**
 * Template initialization script — run once after creating a project
 * from the nuxt-kickstart template:
 *
 *   pnpm run init
 *
 * Prompts for your project's names and rewrites the template tokens
 * (`nuxt-kickstart`, `Kickstart`, `kickstart-*` storage keys, the
 * placeholder domain) across the repo. Idempotent: re-running after a
 * rename simply finds zero occurrences and changes nothing.
 */
import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import process from 'node:process'
import { createInterface } from 'node:readline'

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

  if (changedFiles === 0) {
    console.log('Nothing to rename — the template tokens were not found (already initialized?).')
  }
  else {
    console.log(`
Next steps:
  1. Review the diff:        git diff
  2. Update package.json author and repository fields
  3. Rewrite the README intro for ${displayName}
  4. Rename public/img/screenshots/kickstart/ to match your project
  5. Start developing:        pnpm dev
     (the local database was already created by pnpm install)
`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
