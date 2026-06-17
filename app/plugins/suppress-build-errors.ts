// Suppress harmless build-time errors that don't affect functionality
export default defineNuxtPlugin(() => {
  // Only run in development
  if (!import.meta.dev)
    return

  // Suppress harmless WASM source map errors that occur during initial builds
  // These don't affect functionality and are resolved after the build completes
  const originalError = console.error
  console.error = function (...args: any[]) {
    const message = args[0]?.toString?.() || String(args[0])

    // Suppress WASM source map "unreachable" errors during build
    if (message.includes('unreachable') && message.includes('wasm')) {
      return
    }

    // Suppress SQLite column errors during schema initialization
    // These occur when the build cache is stale and are resolved by clearing .nuxt
    if (message.includes('no such column') && message.includes('name')) {
      console.warn(
        '⚠️  Content schema migration detected. This is normal after updating the schema.\n'
        + '   Run `pnpm run clean` to clear the build cache if this error persists.',
      )
      return
    }

    // Suppress source map stringify errors that occur during initial page loads
    if (message.includes('DevalueError') && message.includes('stringify')) {
      return
    }

    // Pass through all other errors
    originalError.apply(console, args as any)
  }
})
