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

// Connection pragmas (runs on first import). The tables themselves come from
// the migration chain (`pnpm run db:migrate`, ADR-0010), never from here.
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
  else {
    // Reach the remote once at boot, so an unreachable Turso is reported (and
    // a local fallback opened) here rather than at the first sign-in.
    await _dbClient.execute('SELECT 1')
  }
}

// Initialize on module load with automatic fallback
void initDb().catch((err) => {
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
