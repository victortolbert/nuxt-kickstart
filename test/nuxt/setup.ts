// Filter known-benign Vue warnings emitted by the nuxt test runtime. Both are
// expected and not actionable:
//   - "<Suspense> is an experimental feature ..." — emitted internally by the
//     Nuxt test environment's render path, not by any test.
//   - "inject() can only be used inside setup() ..." — composable tests that
//     deliberately call a composable outside a component to exercise its
//     inject() fallback path (e.g. use-component-defaults).
//   - "... is called when there is no active component instance ..." — the same
//     pattern for lifecycle hooks (onMounted/onUnmounted/etc.) in composables
//     invoked outside a component (e.g. use-token-history); the hook simply
//     doesn't fire, which those tests account for.
// Any other warning still passes through, so new issues remain visible.
const SUPPRESSED_VUE_WARNINGS = [
  '<Suspense> is an experimental feature',
  'inject() can only be used inside setup()',
  'is called when there is no active component instance',
]
// Vue emits these via different console methods — lifecycle/inject warnings go
// through console.warn, but the <Suspense> notice uses console.info — so filter
// both.
for (const method of ['warn', 'info'] as const) {
  const original = console[method].bind(console)
  console[method] = (...args: unknown[]) => {
    const first = args[0]
    if (typeof first === 'string' && SUPPRESSED_VUE_WARNINGS.some(msg => first.includes(msg))) {
      return
    }
    original(...args)
  }
}

// Nuxt's payload.client.js schedules a setTimeout via requestIdleCallback that
// references `navigator` after the nuxt test environment tears down the DOM
// globals. This causes "ReferenceError: navigator is not defined".
// Catch and suppress this known Nuxt test environment teardown error.
const originalListeners = process.listeners('uncaughtException')
process.removeAllListeners('uncaughtException')
process.on('uncaughtException', (err) => {
  if (
    err instanceof ReferenceError
    && err.message === 'navigator is not defined'
    && err.stack?.includes('payload.client')
  ) {
    return
  }
  // Re-throw for any other uncaught exceptions
  for (const listener of originalListeners) {
    listener(err, 'uncaughtException')
  }
})
