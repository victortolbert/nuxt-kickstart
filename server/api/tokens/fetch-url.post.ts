// server/api/tokens/fetch-url.post.ts
// URL fetch proxy endpoint to avoid CORS issues when fetching tokens from external sources

interface FetchUrlRequest {
  url: string
}

interface FetchUrlResponse {
  content: string
  contentType: string
}

interface ErrorResponse {
  error: string
  status?: number
}

const PRIVATE_IP_PATTERNS = [
  /^127\./, // Localhost
  /^10\./, // Private network
  /^192\.168\./, // Private network
  /^172\.(1[6-9]|2\d|3[01])\./, // Private network
  /^169\.254\./, // Link-local
  /^::1$/, // IPv6 localhost
  /^fe80:/, // IPv6 link-local
  /^fc00:/, // IPv6 private
]

const FETCH_TIMEOUT = 10000 // 10 seconds

export default defineEventHandler(async (event): Promise<FetchUrlResponse | ErrorResponse> => {
  try {
    // Parse and validate request body
    const body = await readBody<FetchUrlRequest>(event)

    if (!body || typeof body.url !== 'string') {
      setResponseStatus(event, 400)
      return {
        error: 'Invalid request body. Expected { url: string }',
      }
    }

    const { url } = body

    // Validate URL format
    let parsedUrl: URL
    try {
      parsedUrl = new URL(url)
    }
    catch {
      setResponseStatus(event, 400)
      return {
        error: 'Invalid URL format',
      }
    }

    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      setResponseStatus(event, 400)
      return {
        error: 'Only http:// and https:// URLs are allowed',
      }
    }

    // Block private IP ranges for security
    const hostname = parsedUrl.hostname
    const isPrivateIp = PRIVATE_IP_PATTERNS.some(pattern => pattern.test(hostname))

    if (isPrivateIp) {
      setResponseStatus(event, 403)
      return {
        error: 'Access to private IP ranges is blocked for security',
      }
    }

    // Fetch the URL with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT)

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Kickstart-TokenTransformer/1.0',
        },
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        setResponseStatus(event, 502)
        return {
          error: `Failed to fetch URL: ${response.statusText}`,
          status: response.status,
        }
      }

      const content = await response.text()
      const contentType = response.headers.get('content-type') || 'text/plain'

      return {
        content,
        contentType,
      }
    }
    catch (fetchError: unknown) {
      clearTimeout(timeoutId)

      if ((fetchError as Error).name === 'AbortError') {
        setResponseStatus(event, 504)
        return {
          error: 'Request timeout after 10 seconds',
        }
      }

      setResponseStatus(event, 502)
      return {
        error: `Network error: ${(fetchError as Error).message}`,
      }
    }
  }
  catch (error: unknown) {
    setResponseStatus(event, 500)
    return {
      error: `Internal server error: ${(error as Error).message}`,
    }
  }
})
