import type { Client } from '@libsql/client'
import { createClient } from '@libsql/client'

// Database client with automatic fallback to local SQLite on connection errors
// Internal state for fallback logic
let _dbClient: Client
let usingLocal = false

// eslint-disable-next-line node/no-process-env
const tursoUrl = process.env.TURSO_DATABASE_URL
// eslint-disable-next-line node/no-process-env
const tursoToken = process.env.TURSO_AUTH_TOKEN
const localUrl = 'file:.data/auth.db'
// eslint-disable-next-line node/no-process-env
const isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV

// In dev, prefer local SQLite to avoid hanging on unreachable Turso
const useRemote = !isDev && !!tursoUrl && !!tursoToken
if (!useRemote) {
  console.info('📁 Using local SQLite database:', localUrl)
  _dbClient = createClient({ url: localUrl })
  usingLocal = true
}
else {
  console.info('🌐 Connecting to Turso database')
  _dbClient = createClient({ url: tursoUrl!, authToken: tursoToken })
}

// Export as a getter function to avoid mutable exports
export const db = _dbClient

// Initialize tables (runs on first import)
async function initDb() {
  if (usingLocal) {
    // The app and Better Auth open separate connections to the same local file.
    // WAL lets a reader (auth) and the writer (app) coexist instead of
    // deadlocking the rollback-journal default; busy_timeout bounds any
    // remaining writer-vs-writer contention so writes never hang forever. WAL
    // persists on the file, so this also covers the auth connection.
    await _dbClient.execute('PRAGMA journal_mode=WAL')
    await _dbClient.execute('PRAGMA busy_timeout=5000')
  }

  await _dbClient.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      password_hash TEXT,
      role TEXT DEFAULT 'viewer',
      avatar TEXT,
      provider TEXT DEFAULT 'credentials',
      created_at INTEGER DEFAULT (unixepoch()),
      updated_at INTEGER DEFAULT (unixepoch())
    )
  `)

  await _dbClient.execute('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)')
}

// Initialize on module load with automatic fallback
const dbReady = initDb().catch((err) => {
  // Check if this is a certificate or connection error
  const errorMsg = err instanceof Error ? err.message : String(err)
  const isCertError = errorMsg.includes('certificate') || errorMsg.includes('ECONNREFUSED') || errorMsg.includes('ETIMEDOUT')

  if (isCertError && !usingLocal) {
    console.warn('⚠️  Remote database connection failed (likely corporate proxy/firewall)')
    console.info('📁 Falling back to local SQLite database:', localUrl)

    // Recreate client with local file
    _dbClient = createClient({ url: localUrl })
    usingLocal = true

    // Retry initialization with local database
    return initDb().catch((localErr) => {
      console.error('❌ Failed to initialize local auth database:', localErr)
      throw localErr
    })
  }
  else {
    console.error('❌ Failed to initialize auth database:', err)
    throw err
  }
})

export interface DbUser {
  id: string
  email: string
  name: string | null
  password_hash: string | null
  role: 'admin' | 'editor' | 'viewer'
  avatar: string | null
  provider: string
  created_at: number
  updated_at: number
}

// User operations (all async now)
export async function findUserByEmail(email: string): Promise<DbUser | undefined> {
  await dbReady
  const result = await _dbClient.execute({
    sql: 'SELECT * FROM users WHERE email = ?',
    args: [email],
  })
  return result.rows[0] as unknown as DbUser | undefined
}

export async function findUserById(id: string): Promise<DbUser | undefined> {
  await dbReady
  const result = await _dbClient.execute({
    sql: 'SELECT * FROM users WHERE id = ?',
    args: [id],
  })
  return result.rows[0] as unknown as DbUser | undefined
}

export async function createUser(user: {
  id: string
  email: string
  name?: string
  password_hash?: string
  provider?: string
  avatar?: string
}): Promise<DbUser> {
  await dbReady
  await _dbClient.execute({
    sql: `INSERT INTO users (id, email, name, password_hash, provider, avatar)
          VALUES (?, ?, ?, ?, ?, ?)`,
    args: [
      user.id,
      user.email,
      user.name || null,
      user.password_hash || null,
      user.provider || 'credentials',
      user.avatar || null,
    ],
  })
  return (await findUserById(user.id))!
}

export async function updateUser(id: string, updates: Partial<DbUser>): Promise<void> {
  await dbReady
  const fields = Object.keys(updates)
    .filter(k => k !== 'id')
    .map(k => `${k} = ?`)
    .join(', ')
  const values = Object.keys(updates)
    .filter(k => k !== 'id')
    .map(k => updates[k as keyof DbUser] ?? null)

  await _dbClient.execute({
    sql: `UPDATE users SET ${fields}, updated_at = unixepoch() WHERE id = ?`,
    args: [...(values as (string | number | null)[]), id],
  })
}
