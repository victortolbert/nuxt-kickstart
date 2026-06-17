/**
 * Validate API endpoint
 * Validates token JSON and returns format detection and validation errors
 */

import type { HeliumMetadata } from '../../../shared/utils/token-normalizer'
import type { TokenError } from '../../../shared/utils/token-validator'
import { detectTokenFormat } from '../../../shared/utils/token-detector'
import { extractHeliumMetadata } from '../../../shared/utils/token-normalizer'
import { parseTokens } from '../../../shared/utils/token-parser'
import { validateTokens } from '../../../shared/utils/token-validator'

interface ValidateRequestBody {
  tokens: string | object
}

interface ValidateResponse {
  valid: boolean
  format: 'dtcg' | 'legacy' | 'helium' | 'unknown'
  tokenCount: number
  metadata?: HeliumMetadata
  errors: TokenError[]
}

interface ErrorResponse {
  error: string
  details?: unknown
}

export default defineEventHandler(async (event): Promise<ValidateResponse | ErrorResponse> => {
  try {
    // Parse request body
    const body = await readBody<ValidateRequestBody>(event)

    if (!body || !body.tokens) {
      setResponseStatus(event, 400)
      return {
        error: 'Missing tokens field in request body',
      }
    }

    // Handle string input (JSON)
    let tokensObject: unknown
    if (typeof body.tokens === 'string') {
      try {
        const parsed = parseTokens(body.tokens)
        tokensObject = parsed.tokens

        // Extract metadata if Helium format
        const metadata = parsed.format === 'helium' ? parsed.metadata : undefined

        // Validate tokens
        const validation = validateTokens(tokensObject, parsed.format)

        return {
          valid: validation.valid,
          format: parsed.format,
          tokenCount: parsed.tokenCount,
          metadata,
          errors: validation.errors,
        }
      }
      catch (error) {
        setResponseStatus(event, 400)
        return {
          error: 'Failed to parse JSON',
          details: error,
        }
      }
    }

    // Handle object input
    if (typeof body.tokens === 'object') {
      tokensObject = body.tokens

      // Detect format
      const format = detectTokenFormat(tokensObject)

      // Extract metadata if Helium format
      const metadata = format === 'helium' ? extractHeliumMetadata(tokensObject) : undefined

      // Validate tokens
      const validation = validateTokens(tokensObject, format)

      // Count tokens
      const { countTokens } = await import('../../../shared/utils/token-parser')
      const tokenCount = countTokens(tokensObject)

      return {
        valid: validation.valid,
        format,
        tokenCount,
        metadata,
        errors: validation.errors,
      }
    }

    setResponseStatus(event, 400)
    return {
      error: 'Tokens must be a string or object',
    }
  }
  catch (error) {
    console.error('Validation error:', error)
    setResponseStatus(event, 500)
    return {
      error: 'Internal server error during validation',
      details: error instanceof Error ? error.message : String(error),
    }
  }
})
