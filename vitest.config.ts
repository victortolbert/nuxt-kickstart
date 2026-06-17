import { fileURLToPath } from 'node:url'
import { defineVitestProject } from '@nuxt/test-utils/config'
import { defineConfig } from 'vitest/config'

// Workaround: @nuxt/test-utils@4.0.0 uses structuredClone on the resolved
// Nuxt runtimeConfig, which fails in vitest's config worker context.
// Patch structuredClone to fall back to JSON round-trip on DataCloneError.
const _origStructuredClone = globalThis.structuredClone
globalThis.structuredClone = (value: unknown, options?: StructuredSerializeOptions) => {
  try {
    return _origStructuredClone(value, options)
  }
  catch {
    return JSON.parse(JSON.stringify(value))
  }
}

// The Nuxt-flavoured `nuxt` project resolves the `#shared`/`#server` subpath
// aliases automatically, but the plain-node `unit` project does not. Map them
// here so server-side utilities (which import `#shared/...` / `#server/...` at
// runtime) can be unit-tested without spinning up Nuxt.
const sharedAlias = {
  '#shared': fileURLToPath(new URL('./shared', import.meta.url)),
  '#server': fileURLToPath(new URL('./server', import.meta.url)),
}

export default defineConfig({
  test: {
    projects: [
      {
        resolve: {
          alias: sharedAlias,
        },
        test: {
          name: 'unit',
          include: ['test/unit/*.{test,spec}.ts'],
          environment: 'node',
          globals: true,
          setupFiles: ['test/setup-storage.ts'],
        },
        define: {
          'import.meta.client': 'true',
        },
      },
      await defineVitestProject({
        test: {
          name: 'nuxt',
          include: ['test/nuxt/*.{test,spec}.ts'],
          environment: 'nuxt',
          globals: true,
          // Cold-start `mountSuspended` compiles the component graph on the
          // first mount, which can exceed vitest's 5s default and flake in CI.
          // Give Nuxt component tests more headroom.
          testTimeout: 15000,
          // The @nuxt/test-utils `beforeAll(setupNuxt)` hook boots a full Nuxt
          // instance on first use; on slower CI runners this routinely exceeds
          // vitest's 10s default hook timeout. Raise it so cold-start setup
          // doesn't flake.
          hookTimeout: 60000,
          setupFiles: ['test/setup-storage.ts', 'test/nuxt/setup.ts'],
        },
      }),
    ],
    // `teardownTimeout` is a root-only (global) option — Vitest omits it from
    // per-project config, so it must live here rather than inside a project.
    teardownTimeout: 5000,
    environmentOptions: {
      nuxt: {
        mock: {
          intersectionObserver: true,
          indexedDb: false,
        },
      },
    },
    coverage: {
      provider: 'v8',
      // Measure the application's real logic surface — not just leaf utilities.
      // Composables, route middleware, and server code carry the bulk of the
      // behaviour, so keeping them in scope makes the coverage number honest.
      include: [
        'shared/utils/**/*.ts',
        'app/utils/**/*.ts',
        'app/composables/**/*.ts',
        'app/middleware/**/*.ts',
        'server/**/*.ts',
        'lib/**/*.ts',
      ],
      exclude: ['**/*.test.ts', '**/*.d.ts', '**/types/**', '**/*.config.ts'],
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: 'coverage',
    },
  },
})
