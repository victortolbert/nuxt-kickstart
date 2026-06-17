/**
 * Composable for building absolute asset URLs
 *
 * Uses NUXT_PUBLIC_SITE_URL from environment for the base.
 * Useful for:
 * - OG images and social sharing
 * - Emails and external contexts
 * - Server-side rendering where absolute URLs are needed
 *
 * @example
 * const { getAssetUrl, getScreenshotUrl } = useAssetUrl()
 * const ogImage = getScreenshotUrl('kickstart', 'dashboard.png')
 * // => 'http://localhost:3000/screenshots/kickstart/dashboard.png'
 */
export function useAssetUrl() {
  const config = useRuntimeConfig()
  const siteUrl = config.public.siteUrl || ''

  /**
   * Build an absolute URL for any asset path
   * @param path - Asset path starting with / (e.g., '/screenshots/project/image.png')
   */
  function getAssetUrl(path: string): string {
    const cleanPath = path.startsWith('/') ? path : `/${path}`
    return `${siteUrl}${cleanPath}`
  }

  /**
   * Build an absolute URL for a project screenshot
   * @param projectSlug - Project identifier
   * @param filename - Screenshot filename
   */
  function getScreenshotUrl(projectSlug: string, filename: string): string {
    return getAssetUrl(`/screenshots/${projectSlug}/${filename}`)
  }

  /**
   * Build an absolute URL for an image in public/images
   * @param filename - Image path relative to public/images
   */
  function getImageUrl(filename: string): string {
    return getAssetUrl(`/images/${filename}`)
  }

  return {
    siteUrl,
    getAssetUrl,
    getScreenshotUrl,
    getImageUrl,
  }
}
