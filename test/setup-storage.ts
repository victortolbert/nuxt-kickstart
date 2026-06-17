// Provides a localStorage/sessionStorage polyfill for the test environments.
//
// Neither jsdom (unit project, via `@vitest-environment jsdom`) nor the
// happy-dom-backed `nuxt` environment expose Web Storage unless a non-opaque
// document origin is configured. Composables/utilities that read or write
// localStorage therefore throw "Cannot read properties of undefined" in tests.
// Installing a small in-memory implementation keeps those code paths working.

class MemoryStorage implements Storage {
  #store = new Map<string, string>()

  get length(): number {
    return this.#store.size
  }

  clear(): void {
    this.#store.clear()
  }

  getItem(key: string): string | null {
    return this.#store.has(key) ? this.#store.get(key)! : null
  }

  setItem(key: string, value: string): void {
    this.#store.set(key, String(value))
  }

  removeItem(key: string): void {
    this.#store.delete(key)
  }

  key(index: number): string | null {
    return [...this.#store.keys()][index] ?? null
  }
}

// Probe for an existing storage via its property descriptor rather than reading
// `target[name]`. Under Node's experimental Web Storage, *reading*
// globalThis.localStorage emits a noisy ExperimentalWarning (once per worker)
// even though the value is undefined without --localstorage-file. A descriptor
// lookup checks presence without triggering that getter.
function hasStorage(target: object, name: string): boolean {
  const desc = Object.getOwnPropertyDescriptor(target, name)
  return desc != null && desc.value != null
}

function install(name: 'localStorage' | 'sessionStorage'): void {
  const storage = new MemoryStorage()

  if (typeof globalThis !== 'undefined' && !hasStorage(globalThis, name)) {
    Object.defineProperty(globalThis, name, { value: storage, configurable: true, writable: true })
  }
  if (typeof window !== 'undefined' && !hasStorage(window, name)) {
    Object.defineProperty(window, name, { value: storage, configurable: true, writable: true })
  }
}

install('localStorage')
install('sessionStorage')
