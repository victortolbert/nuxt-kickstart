import { getContentSource } from '../../../shared/utils/content-source'

export default defineEventHandler((event) => {
  const contentSource = getContentSource()

  if (!contentSource.isExternal) {
    // Local content source
    return {
      status: 'ok',
      source: 'local',
    }
  }

  // External content source configured
  if (!contentSource.repository) {
    // External configured but no repository URL
    setResponseStatus(event, 503)
    return {
      status: 'error',
      source: 'external',
      message: 'External content repository not configured',
    }
  }

  // External content source configured and available
  return {
    status: 'ok',
    source: 'external',
    repoUrl: contentSource.repository,
    branch: contentSource.branch,
  }
})
