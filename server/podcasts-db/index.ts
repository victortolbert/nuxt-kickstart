import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import * as schema from './schema'

const isDev = import.meta.dev

function resolvePodcastDbUrl() {
  // eslint-disable-next-line node/no-process-env
  const envPath = process.env.PODCAST_DB_PATH || process.env.NUXT_PODCAST_DB_PATH
  if (envPath) {
    return `file:${envPath}`
  }

  // Dev and build-time prerendering use an ephemeral in-memory DB. Prerendered
  // pages render with anonymous/empty data, so there's no reason to touch the
  // filesystem during a build (which previously failed with SQLITE_CANTOPEN).
  if (isDev || import.meta.prerender) {
    return ':memory:'
  }

  // eslint-disable-next-line node/no-process-env
  const isServerless = process.env.VERCEL === '1' || process.env.NETLIFY === 'true'
  const baseDir = isServerless ? '/tmp/kickstart' : `${process.cwd()}/data`

  return `file:${baseDir}/podcast-app.db`
}

const dbUrl = resolvePodcastDbUrl()

// libSQL does not create the parent directory for a `file:` URL — ensure it
// exists so a fresh deployment (first boot, no data/ dir) doesn't fail to open.
if (dbUrl.startsWith('file:')) {
  mkdirSync(dirname(dbUrl.slice('file:'.length)), { recursive: true })
}

const client = createClient({ url: dbUrl })

export const db = drizzle(client, { schema })

// Initialize tables (safe to run always with IF NOT EXISTS)
async function initPodcastTables() {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      podcast_slug TEXT NOT NULL,
      created_at INTEGER NOT NULL
    )
  `)

  await client.execute(`
    CREATE TABLE IF NOT EXISTS playback_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      episode_slug TEXT NOT NULL,
      position INTEGER NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0,
      updated_at INTEGER NOT NULL
    )
  `)
}

initPodcastTables().catch((err) => {
  console.error('Failed to initialize podcast database:', err)
})
