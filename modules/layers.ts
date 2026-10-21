import type { ProtectedPathsContribution } from '../shared/utils/protected-paths'
import { defineNuxtModule } from 'nuxt/kit'
import { noindexRouteRules, resolveProtectedPaths, sitemapExcludePatterns } from '../shared/utils/protected-paths'

/**
 * The parts of the layer convention Nuxt does not merge on its own.
 *
 * Collections (`content.config.ts`), locale messages (`i18n.locales`), app
 * config (the search registry) and routes all merge across layers natively.
 * Protected paths do not: they are one list read by three surfaces. A layer
 * declares its own under `protectedPaths` in its `nuxt.config.ts`; this module
 * merges every layer's with the base list in `shared/utils/protected-paths.ts`
 * and hands the result to all three — the noindex route rules, the sitemap
 * excludes and, through public runtime config, the global middleware.
 *
 * Local modules in `modules/` are registered automatically, so a layer needs
 * nothing beyond the key.
 */

declare module 'nuxt/schema' {
  interface NuxtConfig {
    /** Routes this layer gates; merged with the base Protected path list. */
    protectedPaths?: ProtectedPathsContribution
  }
  interface NuxtOptions {
    protectedPaths?: ProtectedPathsContribution
  }
  interface PublicRuntimeConfig {
    /** The merged Protected path list the global middleware reads. */
    protectedPaths: { protected: string[], public: string[], noindex: string[] }
  }
}

export default defineNuxtModule({
  meta: { name: 'kickstart-layers' },
  setup(_options, nuxt) {
    const contributions = nuxt.options._layers
      .map(layer => (layer.config as { protectedPaths?: ProtectedPathsContribution }).protectedPaths)
      .filter((c): c is ProtectedPathsContribution => !!c)
    const paths = resolveProtectedPaths(contributions)

    nuxt.options.runtimeConfig.public.protectedPaths = {
      protected: [...paths.protected],
      public: [...paths.public],
      noindex: [...paths.noindex],
    }

    // The base rules are already in nuxt.config; adding the merged set again
    // is idempotent for those and covers what layers brought.
    nuxt.options.routeRules = { ...noindexRouteRules(paths.noindex, paths.public), ...nuxt.options.routeRules }

    const sitemap = (nuxt.options as { sitemap?: { exclude?: unknown[] } }).sitemap ??= {}
    sitemap.exclude = [...(sitemap.exclude ?? []), ...sitemapExcludePatterns(paths.noindex, undefined, paths.public)]
  },
})
