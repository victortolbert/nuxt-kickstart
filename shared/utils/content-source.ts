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
 * Collection source configuration.
 *
 * Mirrors `@nuxt/content`'s `CollectionSource` with the object form of
 * `repository`. The flat `repository: string` + `authToken` form still works,
 * but it cannot carry a branch: when `repository` is a string the module
 * derives the ref by parsing the URL itself (`branch: ref || 'main'`), so a
 * plain `https://github.com/owner/repo` always resolves to `main`. The object
 * form is the only way `NUXT_CONTENT_BRANCH` reaches the module — and it also
 * avoids `authToken`, which `@nuxt/content` marks deprecated in favour of
 * `repository.auth`.
 */
interface CollectionSourceConfig {
  include: string
  repository: {
    url: string
    branch: string
    auth?: { token: string }
  }
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
    include: localPath,
    repository: {
      url: contentSource.repository,
      branch: contentSource.branch,
      ...(contentSource.authToken
        ? { auth: { token: contentSource.authToken } }
        : {}),
    },
  }
}
