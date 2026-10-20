import type { NavigateToOptions } from '#app/composables/router'

/**
 * Route target accepted by {@link navigateToPath}. Intentionally narrow — a
 * plain path string or a `{ path, query }` object — so it does not reference
 * the typed-routes union.
 */
type RedirectTarget = string | { path: string, query?: Record<string, string | undefined> }

/**
 * `navigateTo` exposed through a simplified, non-typed signature.
 *
 * With `experimental.typedPages` enabled and a large number of routes, calling
 * the typed `navigateTo` as the return value of a `defineNuxtRouteMiddleware`
 * callback forces TypeScript to instantiate a `RouteLocationRaw` union large
 * enough to trip the "union type too complex to represent" limit (TS2590).
 * Routing redirects through this simplified signature keeps that union from
 * being instantiated in middleware while preserving typed routes everywhere
 * else. Runtime behavior is identical — only the compile-time types differ.
 */
export const navigateToPath = navigateTo as unknown as (
  to: RedirectTarget,
  options?: NavigateToOptions,
) => Promise<void>
