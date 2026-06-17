import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import process from 'node:process'

/**
 * The Content Store module.
 *
 * Owns everything the content editor API routes previously each knew:
 * which collections are editable, where their source files live (including
 * the authoring-locale directory layout), how frontmatter serializes to
 * markdown, and where trash + its manifest live. Routes are thin HTTP
 * adapters over this module.
 */

export const ALLOWED_COLLECTIONS = ['guides', 'posts'] as const
export type AllowedCollection = typeof ALLOWED_COLLECTIONS[number]

/** Editing writes the English source; translations live alongside (es/…). */
export const AUTHORING_LOCALE = 'en'

const NON_ALPHANUMERIC_RE = /[^a-z0-9]+/g
const LEADING_TRAILING_DASH_RE = /^-|-$/g

/** Throw 403 outside dev — content editing is a development-only feature. */
export function requireDevContentEditing(): void {
  if (!import.meta.dev) {
    throw createError({
      statusCode: 403,
      message: 'Content editing is only available in development mode',
    })
  }
}

/** Validate a route param into an editable collection (throws 400). */
export function validateCollection(collection: string | undefined): AllowedCollection {
  if (!collection || !ALLOWED_COLLECTIONS.includes(collection as AllowedCollection)) {
    throw createError({
      statusCode: 400,
      message: `Collection must be one of: ${ALLOWED_COLLECTIONS.join(', ')}`,
    })
  }
  return collection as AllowedCollection
}

export function validateSlug(slug: string | undefined): string {
  if (!slug || typeof slug !== 'string' || slug.trim().length === 0) {
    throw createError({ statusCode: 400, message: 'slug is required' })
  }
  return slug
}

export function slugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(NON_ALPHANUMERIC_RE, '-')
    .replace(LEADING_TRAILING_DASH_RE, '')
}

/** Source directory for an editable collection (authoring locale). */
export function collectionDir(collection: AllowedCollection): string {
  return join(process.cwd(), 'content', AUTHORING_LOCALE, collection)
}

export function contentFilePath(collection: AllowedCollection, slug: string): string {
  return join(collectionDir(collection), `${slug}.md`)
}

export function trashDir(collection: AllowedCollection): string {
  return join(process.cwd(), 'content', '_trash', collection)
}

export function trashFilePath(collection: AllowedCollection, slug: string): string {
  return join(trashDir(collection), `${slug}.md`)
}

export function trashManifestPath(): string {
  return join(process.cwd(), 'content', '_trash', '.manifest.json')
}

export interface TrashManifestEntry {
  slug: string
  collection: string
  deletedAt: string
  originalPath: string
}

/** Keyed by `${collection}/${slug}`. */
export type TrashManifest = Record<string, TrashManifestEntry>

export function trashKey(collection: string, slug: string): string {
  return `${collection}/${slug}`
}

export async function readTrashManifest(): Promise<TrashManifest> {
  try {
    const raw = await readFile(trashManifestPath(), 'utf-8')
    return JSON.parse(raw) as TrashManifest
  }
  catch {
    return {}
  }
}

export async function writeTrashManifest(manifest: TrashManifest): Promise<void> {
  await writeFile(trashManifestPath(), JSON.stringify(manifest, null, 2), 'utf-8')
}

/** Serialize frontmatter + body into a markdown document. */
export function serializeMarkdown(frontmatter: Record<string, unknown>, body: string): string {
  const lines = ['---']
  for (const [key, value] of Object.entries(frontmatter)) {
    if (value === undefined || value === null)
      continue
    if (Array.isArray(value)) {
      lines.push(`${key}: [${value.map(v => `'${v}'`).join(', ')}]`)
    }
    else if (typeof value === 'string') {
      lines.push(`${key}: '${value}'`)
    }
    else if (typeof value === 'boolean' || typeof value === 'number') {
      lines.push(`${key}: ${value}`)
    }
    else if (typeof value === 'object') {
      lines.push(`${key}: ${JSON.stringify(value)}`)
    }
  }
  lines.push('---', '', body, '')
  return lines.join('\n')
}

/** Validate the editor payload shape ({ frontmatter, body }), throws 400. */
export function validateEditorPayload(payload: unknown): { frontmatter: Record<string, unknown>, body: string } {
  const { frontmatter, body } = (payload ?? {}) as { frontmatter?: unknown, body?: unknown }
  if (!frontmatter || typeof frontmatter !== 'object') {
    throw createError({ statusCode: 400, message: 'frontmatter object is required' })
  }
  if (typeof body !== 'string') {
    throw createError({ statusCode: 400, message: 'body string is required' })
  }
  return { frontmatter: frontmatter as Record<string, unknown>, body }
}

/** Query path of an editable entry (matches the collection's source layout). */
export function authoringQueryPath(collection: AllowedCollection, slug: string): string {
  // guides: locale-prefixed paths (/en/guides/x); posts: prefixed (/posts/x)
  return collection === 'guides' ? `/${AUTHORING_LOCALE}/${collection}/${slug}` : `/${collection}/${slug}`
}
