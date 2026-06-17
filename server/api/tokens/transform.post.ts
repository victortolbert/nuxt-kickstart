import { isStyleDictionaryFormat, transformWithStyleDictionary } from '../../utils/style-dictionary'
import { transformTokens } from '../../utils/token-generators'

interface TransformRequest {
  tokens: Record<string, any>
  formats: string[]
  options?: Record<string, any>
  /** Use Style Dictionary library instead of custom transformers */
  useStyleDictionary?: boolean
  /** Metadata from Helium tokens (brand, franchise) for filename generation */
  metadata?: {
    brand?: string
    franchise?: string
  }
}

interface TransformResponse {
  files: Array<{
    filename: string
    content: string
    format: string
  }>
}

interface ErrorResponse {
  error: string
  details?: any
}

export default defineEventHandler(async (event): Promise<TransformResponse | ErrorResponse> => {
  try {
    const body = await readBody<TransformRequest>(event)

    // Validate request
    if (!body.tokens || typeof body.tokens !== 'object') {
      setResponseStatus(event, 400)
      return {
        error: 'Invalid request: tokens must be an object',
      }
    }

    if (!body.formats || !Array.isArray(body.formats) || body.formats.length === 0) {
      setResponseStatus(event, 400)
      return {
        error: 'Invalid request: formats must be a non-empty array',
      }
    }

    const files: Array<{ filename: string, content: string, format: string }> = []
    const useSD = body.useStyleDictionary ?? false

    // Process each requested format
    for (const formatId of body.formats) {
      try {
        const formatOptions = body.options?.[formatId] || {}

        // Use Style Dictionary if requested and format is supported
        if (useSD && isStyleDictionaryFormat(formatId)) {
          const result = await transformWithStyleDictionary(body.tokens, formatId, formatOptions)
          files.push({
            filename: result.filename,
            content: result.content,
            format: formatId,
          })
        }
        else {
          // Fall back to custom transformer
          const result = transformTokens(body.tokens, formatId, formatOptions, body.metadata)
          files.push(result)
        }
      }
      catch (error) {
        console.error(`Transform error for format ${formatId}:`, error)
        setResponseStatus(event, 500)
        return {
          error: `Transformation failed for format: ${formatId}`,
          details: error instanceof Error ? { message: error.message } : undefined,
        }
      }
    }

    return { files }
  }
  catch (error) {
    console.error('Transform endpoint error:', error)
    setResponseStatus(event, 500)
    return {
      error: 'Internal server error during transformation',
      details: error instanceof Error ? { message: error.message } : undefined,
    }
  }
})
