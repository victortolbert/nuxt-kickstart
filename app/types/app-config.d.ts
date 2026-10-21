import type { SearchableCollection } from '#shared/utils/search-registry'

declare module 'nuxt/schema' {
  interface AppConfigInput {
    /** The search registry; see `shared/utils/search-registry.ts`. */
    search?: {
      collections?: SearchableCollection[]
    }
    content?: {
      repo?: string
      branch?: string
      basePath?: string
    }
  }
}

export {}
