import { access, mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { isAdmin } from '~~/shared/utils/abilities'

export default defineEventHandler(async (event) => {
  // Only admins can update email lists
  await authorize(event, isAdmin)

  // Get slug from route params
  const slug = getRouterParam(event, 'slug')

  // Validate slug
  if (!slug || typeof slug !== 'string' || slug.trim().length === 0) {
    throw createError({
      statusCode: 400,
      message: 'slug is required',
    })
  }

  // Read request body
  const body = await readBody(event)
  const { name, description, contacts } = body

  // Validate request structure
  if (!name || typeof name !== 'string') {
    throw createError({
      statusCode: 400,
      message: 'name is required',
    })
  }

  if (!Array.isArray(contacts)) {
    throw createError({
      statusCode: 400,
      message: 'contacts array is required',
    })
  }

  // Validate contacts structure
  for (const contact of contacts) {
    if (!contact.email || typeof contact.email !== 'string') {
      throw createError({
        statusCode: 400,
        message: 'Each contact must have an email',
      })
    }
  }

  // Check if file exists
  // eslint-disable-next-line node/no-process-env
  const isVercel = process.env.VERCEL === '1'
  const contentDir = isVercel
    ? join('/tmp', 'kickstart', 'content', 'email-lists')
    : join(process.cwd(), 'content', 'email-lists')
  const filePath = join(contentDir, `${slug}.md`)

  try {
    await access(filePath)
  }
  catch {
    throw createError({
      statusCode: 404,
      message: `Email list ${slug} does not exist`,
    })
  }

  // Build frontmatter
  const frontmatter: Record<string, any> = {
    title: name,
    name,
    tags: ['email-list'],
    status: 'evergreen',
    visibility: 'internal',
    contacts,
    createdAt: new Date().toISOString().split('T')[0],
  }

  // Add optional description
  if (description && typeof description === 'string') {
    frontmatter.description = description
  }

  // Build markdown content
  const lines = ['---']
  for (const [key, value] of Object.entries(frontmatter)) {
    if (value === undefined || value === null)
      continue

    if (key === 'contacts') {
      // Format contacts array with proper YAML structure
      lines.push('contacts:')
      for (const contact of contacts) {
        lines.push(`  - email: ${contact.email}`)
        if (contact.name) {
          lines.push(`    name: ${contact.name}`)
        }
      }
    }
    else if (Array.isArray(value)) {
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
  lines.push('---', '', `# ${name}`, '')
  if (description) {
    lines.push(description, '')
  }

  const content = lines.join('\n')

  // Update file
  try {
    await mkdir(contentDir, { recursive: true })
    await writeFile(filePath, content, 'utf-8')
    return {
      success: true,
      slug,
      path: `${contentDir}/${slug}.md`,
    }
  }
  catch {
    throw createError({
      statusCode: 500,
      message: 'Failed to update email list',
    })
  }
})
