import process from 'node:process'
import { defineConfig, devices } from '@playwright/test'

// eslint-disable-next-line node/no-process-env -- CI detection is standard in Playwright configs
const IS_CI = !!process.env.CI

/**
 * Playwright end-to-end tests.
 *
 * Specs live in `test/e2e/` — kept out of vitest's reach by the include
 * globs in vitest.config.ts (vitest owns test/unit and test/nuxt).
 * The web server is started automatically; against an already-running dev
 * server the existing instance is reused (except in CI).
 *
 * Run with: pnpm run test:e2e (also :ui, :debug)
 */
export default defineConfig({
  testDir: './test/e2e',
  fullyParallel: true,
  forbidOnly: IS_CI,
  retries: IS_CI ? 2 : 0,
  workers: IS_CI ? 1 : undefined,
  reporter: IS_CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    // Dedicated port so e2e never collides with (or reuses) an unrelated
    // dev server already running on 3000
    baseURL: 'http://localhost:3210',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'pnpm dev --port 3210',
    url: 'http://localhost:3210',
    reuseExistingServer: !IS_CI,
    // Nuxt dev cold start (prepare + vite) can take a while
    timeout: 180_000,
  },
})
