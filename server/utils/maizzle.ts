/**
 * Maizzle email rendering — compiles the Vue email templates in `app/emails/`
 * to inlined, email-ready HTML at runtime via `@maizzle/framework`'s `render()`
 * (per Maizzle's Nuxt guide). Centralized here so the preview + send routes
 * share one implementation.
 *
 * Note: `render()` reads the template source relative to the process working
 * directory, so this works in dev. For serverless production builds, ship the
 * `app/emails/` sources or switch to the build output in `server/assets/emails`.
 */
import { readdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { render } from '@maizzle/framework'

const EMAILS_DIR = resolve(process.cwd(), 'app/emails')
const VALID_NAME = /^[a-z0-9-]+$/i

/** Available template names (file stems of `app/emails/*.vue`). */
export async function listMaizzleTemplates(): Promise<string[]> {
  try {
    const files = await readdir(EMAILS_DIR)
    return files.filter(f => f.endsWith('.vue')).map(f => f.slice(0, -4)).sort()
  }
  catch {
    return []
  }
}

export interface RenderedEmail {
  html: string
  plaintext?: string
  /** Resolved Maizzle config, incl. the template's `defineConfig` values. */
  config: Record<string, unknown>
}

/**
 * Render an email template by name. Optional `data` is merged into the Maizzle
 * config (templates bound to those values can use them).
 */
export async function renderMaizzleTemplate(name: string, data?: Record<string, unknown>): Promise<RenderedEmail> {
  if (!VALID_NAME.test(name)) {
    throw createError({ statusCode: 400, message: `Invalid email template name: ${name}` })
  }
  const available = await listMaizzleTemplates()
  if (!available.includes(name)) {
    throw createError({ statusCode: 404, message: `Email template not found: ${name}` })
  }
  const { html, plaintext, config } = await render(
    resolve(EMAILS_DIR, `${name}.vue`),
    data as Parameters<typeof render>[1],
  )
  return { html, plaintext, config: config as Record<string, unknown> }
}
