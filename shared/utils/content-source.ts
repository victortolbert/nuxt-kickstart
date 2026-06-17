/**
 * Content source configuration utilities
 * Determines whether to use local or external content repositories
 */

interface ContentSource {
  repository?: string
  authToken?: string
  branch: string
  isExternal: boolean
}

/**
 * Get content source configuration from environment variables
 */
export function getContentSource(): ContentSource {
  // eslint-disable-next-line node/no-process-env
  const repository = process.env.NUXT_CONTENT_REPO_URL || ''
  // eslint-disable-next-line node/no-process-env
  const authToken = process.env.NUXT_CONTENT_AUTH_TOKEN || ''
  // eslint-disable-next-line node/no-process-env
  const branch = process.env.NUXT_CONTENT_BRANCH || 'main'
  const isExternal = Boolean(repository)

  return {
    repository: repository || undefined,
    authToken: authToken || undefined,
    branch,
    isExternal,
  }
}

/**
 * Check if external content is configured
 */
export function isExternalContent(): boolean {
  // eslint-disable-next-line node/no-process-env
  return Boolean(process.env.NUXT_CONTENT_REPO_URL)
}

/**
 * Get list of collections that should remain local even when external repo is configured
 */
export function getLocalCollections(): string[] {
  // eslint-disable-next-line node/no-process-env
  const localCollectionsEnv = process.env.NUXT_CONTENT_LOCAL_COLLECTIONS || ''
  if (!localCollectionsEnv) {
    return []
  }
  return localCollectionsEnv.split(',').map(s => s.trim()).filter(Boolean)
}

/**
 * Collection source configuration
 */
interface CollectionSourceConfig {
  repository: string
  include: string
  authToken?: string
}

/**
 * Create collection source configuration based on environment
 * Returns either a local path string or external repository config
 */
export function createCollectionSource(
  localPath: string,
  collectionName: string,
): string | CollectionSourceConfig {
  const contentSource = getContentSource()
  const localCollections = getLocalCollections()

  // No external repo configured - use local path
  if (!contentSource.isExternal || !contentSource.repository) {
    return localPath
  }

  // External repo configured, but this collection is in local-only list
  if (localCollections.includes(collectionName)) {
    return localPath
  }

  // External repo configured and collection should be external
  return {
    repository: contentSource.repository,
    include: localPath,
    authToken: contentSource.authToken,
  }
}
