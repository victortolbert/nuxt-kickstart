declare module 'nuxt/schema' {
  interface AppConfigInput {
    content?: {
      repo?: string
      branch?: string
      basePath?: string
    }
  }
}

export {}
