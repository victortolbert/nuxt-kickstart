import { isAdmin } from '#shared/utils/abilities'

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin)

  return {
    nuxtVersion: '4.x',
    environment: import.meta.dev ? 'development' : 'production',
    databaseUrl: import.meta.dev
      // eslint-disable-next-line node/no-process-env -- cspell:ignore TURSO
      ? (process.env.TURSO_DATABASE_URL || 'file:.data/auth.db')
      : '(configured)',
    uptimeSeconds: Math.floor(process.uptime()),
    nodeVersion: process.version,
    platform: process.platform,
  }
})
