/**
 * Composable for generating GitHub edit links for content
 * Returns null if content is local-only or no external repo is configured
 */

export function useContentEditLink(path: string, collection?: string) {
  const appConfig = useAppConfig()
  const runtimeConfig = useRuntimeConfig()

  // Get repo configuration from app config. @nuxt/content declares `content`
  // as `{}` in AppConfigInput, so narrow to our custom shape here.
  const content = appConfig.content as
    | { repo?: string, branch?: string, basePath?: string }
    | undefined
  const repo = content?.repo || ''
  const branch = content?.branch || 'main'
  const basePath = content?.basePath || ''

  // Return null if no repo is configured
  if (!repo) {
    return null
  }

  // Check if collection is in local-only list
  if (collection) {
    const localCollections = runtimeConfig.public.contentLocalCollections || ''
    const localCollectionsList = localCollections
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)

    if (localCollectionsList.includes(collection)) {
      return null
    }
  }

  // Build the GitHub edit URL
  // Format: https://github.com/{owner}/{repo}/edit/{branch}/{basePath}/{path}
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path
  const normalizedBasePath = basePath ? `${basePath}/` : ''

  return `https://github.com/${repo}/edit/${branch}/${normalizedBasePath}${normalizedPath}`
}
