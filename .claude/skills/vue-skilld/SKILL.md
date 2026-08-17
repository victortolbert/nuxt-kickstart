---
name: vue-skilld
description: "ALWAYS use when editing or working with *.vue files or code importing \"vue\". Consult for debugging, best practices, or modifying vue, core."
metadata:
  version: 3.5.41
  generated_by: Anthropic · Haiku 4.5
  generated_at: 2026-08-17
---

# vuejs/core `vue@3.5.41`
**Tags:** csp: 1.0.28-csp, v2-latest: 2.7.16, legacy: 2.7.16

**References:** [package.json](./.skilld/pkg/package.json) • [README](./.skilld/pkg/README.md) • [Docs](./.skilld/docs/_INDEX.md) • [Issues](./.skilld/issues/_INDEX.md) • [Discussions](./.skilld/discussions/_INDEX.md) • [Releases](./.skilld/releases/_INDEX.md)

## Search

Use `skilld search "query" -p vue` instead of grepping `.skilld/` directories. Run `skilld search --guide -p vue` for full syntax, filters, and operators.

<!-- skilld:api-changes -->
## Vue 3.5.41 API Changes

This section documents version-specific API changes for Vue 3.5 and the migration from 3.4 → 3.5. Prioritize recent major/minor releases when using these APIs.

## API Changes

- NEW: `useTemplateRef(key)` — composable for accessing template refs via string key, supports dynamic refs unlike the static ref pattern [source](./.skilld/releases/blog-3.5.md#usetemplateref)

- NEW: `useId()` — generates application-unique IDs stable across SSR server/client renders, prevents hydration mismatches on form/accessibility attributes [source](./.skilld/releases/blog-3.5.md#useid)

- NEW: `onWatcherCleanup(cleanupFn)` — registers cleanup functions in `watch()` and `watchEffect()` callbacks, called before re-run; supports async functions via synchronous call (unlike `onCleanup` parameter) [source](./.skilld/releases/blog-3.5.md#onwatchercleanup)

- NEW: `defineAsyncComponent` `hydrate` option — controls lazy hydration strategy via `hydrateOnVisible()` or `hydrateOnMediaQuery(strategy)` for SSR, deferring component hydration until condition met [source](./.skilld/releases/blog-3.5.md#lazy-hydration)

- NEW: `useHost()` — custom-element-only composable returning the host element of the current custom element [source](./.skilld/releases/blog-3.5.md#custom-elements-improvements)

- NEW: `useShadowRoot()` — custom-element-only composable returning the shadow root of the current custom element [source](./.skilld/releases/blog-3.5.md#custom-elements-improvements)

- NEW: `this.$host` property — Options API equivalent to `useHost()`, exposes host element in custom elements [source](./.skilld/releases/blog-3.5.md#custom-elements-improvements)

- NEW: `<Teleport defer>` prop — mounts teleport after current render cycle, allowing target to be rendered by Vue after the teleport; requires explicit opt-in for backwards compatibility [source](./.skilld/releases/blog-3.5.md#deferred-teleport)

- NEW: `defineCustomElement` options (v3.5+) — `configureApp(app)` for app config, `shadowRoot: false` to disable shadow DOM, `nonce` for CSP style tags [source](./.skilld/releases/blog-3.5.md#custom-elements-improvements)

- STABILIZED: Reactive Props Destructure — variables destructured from `defineProps()` in `<script setup>` now reactive by default; compiler converts access to `props.x`, watch requires getter wrapper [source](./.skilld/releases/blog-3.5.md#reactive-props-destructure)

- STABILIZED: `defineModel()` — v3.4 marked stable (experimental in 3.3); simplifies v-model binding with getter/setter support and modifier handling [source](./.skilld/releases/blog-3.4.md#definemodel-is-now-stable)

- BREAKING: `watchEffect` return type — v3.5 adds `pause()` and `resume()` methods to handle; handle returned via destructuring or property access [source](./.skilld/releases/CHANGELOG.md:L290)

- NEW: `v-bind` same-name shorthand — `:id :src :alt` expands to `:id="id" :src="src" :alt="alt"` [source](./.skilld/releases/blog-3.4.md#v-bind-same-name-shorthand)

- BREAKING: Global JSX namespace — no longer registered by default in 3.4; set `jsxImportSource: "vue"` in tsconfig.json or add per-file `/* @jsxImportSource vue */` for TSX [source](./.skilld/releases/blog-3.4.md#global-jsx-namespace)

- REMOVED: Reactivity Transform — removed in 3.4 (marked deprecated in 3.3); use Vue Macros plugin to continue [source](./.skilld/releases/blog-3.4.md#other-removed-features)

- REMOVED: `app.config.unwrapInjectedRef` — removed in 3.4, was deprecated and enabled by default in 3.3; no longer possible to disable [source](./.skilld/releases/blog-3.4.md#other-removed-features)

- BREAKING: `@vnodeXXX` event listeners — v3.4 makes these a compiler error (was deprecation warning); use `@vue:XXX` listeners instead [source](./.skilld/releases/blog-3.4.md#other-removed-features)

- REMOVED: `v-is` directive — removed in 3.4 (deprecated in 3.3); use `is` attribute with `vue:` prefix instead [source](./.skilld/releases/blog-3.4.md#other-removed-features)

- NEW: `data-allow-mismatch` attribute (v3.5+) — suppresses hydration mismatch warnings; value limits to type: `text`, `children`, `class`, `style`, `attribute` [source](./.skilld/releases/blog-3.5.md#data-allow-mismatch)

**Also changed:** Reactivity system refactor in v3.5 (-56% memory, better tracking efficiency) · Reactivity system refactor in v3.4 (computed stability, array operation batching) · Template parser 2x faster in 3.4 · Improved hydration mismatch error messages in 3.4 with DOM node references · Volar / vue-tsc 1.8.27+ required for full 3.4 feature support · `once: true` watch option (v3.4+) · Error code reference page for production errors
<!-- /skilld:api-changes -->

<!-- skilld:best-practices -->
## Best Practices

- Use reactive props destructuring with native default syntax in Vue 3.5+ instead of `withDefaults()` — the compiler automatically compiles destructured variables to `props.access`, simplifying prop declarations and enabling native JavaScript defaults [source](./.skilld/docs/guide/components/props.md#L122:L155)

- Return plain objects with refs from composables instead of reactive objects — destructuring refs retains reactivity while destructuring from reactive objects breaks it [source](./.skilld/docs/guide/reusability/composables.md#L263:L284)

- Normalize input arguments in composables with `toValue()` to handle refs, getters, and plain values uniformly — call it inside `watchEffect()` to ensure proper dependency tracking [source](./.skilld/docs/guide/reusability/composables.md#L244:L261)

- Leverage computed stability in Vue 3.4+ which only triggers effects when the computed value actually changes — manually return old values for computed properties that create new objects each time to enable this optimization [source](./.skilld/docs/guide/best-practices/performance.md#L127:L170)

- Keep props passed to child components as stable as possible to minimize unnecessary updates — move active-state computations to the parent and pass stable boolean props rather than derived comparisons [source](./.skilld/docs/guide/best-practices/performance.md#L95:L117)

- Use `shallowRef()` and `shallowReactive()` for large immutable data structures to reduce reactivity tracking overhead — requires treating nested objects as immutable and replacing the root state to trigger updates [source](./.skilld/docs/guide/best-practices/performance.md#L188:L214)

- Never mount Vue on nodes containing server-rendered user-provided content to prevent XSS vulnerabilities — Vue templates are compiled to JavaScript and expressions execute during rendering, creating unsafe conditions for untrusted input [source](./.skilld/docs/guide/best-practices/security.md#L160:L164)

- Sanitize and validate user-provided URLs on the backend before saving them, not on the frontend — backend validation is enforced for all clients and prevents vulnerabilities even if frontend checks are bypassed [source](./.skilld/docs/guide/best-practices/security.md#L103:L113)

- Use `useTemplateRef()` in Vue 3.5+ instead of declaring ref variables that match template ref names — supports dynamic ref bindings and provides better IDE support and type inference [source](./.skilld/docs/guide/essentials/template-refs.md#L15:L33)

- Always wrap destructured props in a getter function when passing them to `watch()`, watchers, or external composables to maintain reactivity — Vue's compiler will warn on direct usage [source](./.skilld/docs/guide/components/props.md#L157:L181)

- Use `onWatcherCleanup()` for cleanup logic in watchers instead of returning cleanup functions — this new 3.5+ API provides a clearer pattern for managing side effect cleanup like aborting fetch requests [source](./.skilld/releases/blog-3.5.md#L238:L259)

- Call composables only synchronously in `<script setup>` or `setup()` — composables must be called in these contexts for Vue to properly track the active component instance and manage lifecycle/watchers [source](./.skilld/docs/guide/reusability/composables.md#L294:L306)

- Use `useId()` in SSR applications for generating stable IDs in form elements and accessibility attributes — guarantees consistency across server and client renders without hydration mismatches [source](./.skilld/releases/blog-3.5.md#L135:L156)

- Use `v-memo` and `v-once` directives to skip updating large subtrees or static content — `v-once` skips all future updates while `v-memo` conditionally skips updates based on dependency changes [source](./.skilld/docs/guide/best-practices/performance.md#L119:L125)
<!-- /skilld:best-practices -->
