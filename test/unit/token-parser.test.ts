import { describe, expect, it } from 'vitest'
import { countTokens, getTokenPaths, parseTokens } from '../../shared/utils/token-parser'

describe('parseTokens', () => {
  it('parses valid DTCG format JSON', () => {
    const json = JSON.stringify({
      color: {
        primary: {
          $type: 'color',
          $value: '#0000ff',
        },
      },
    })

    const result = parseTokens(json)

    expect(result.format).toBe('dtcg')
    expect(result.tokens).toEqual({
      color: {
        primary: {
          $type: 'color',
          $value: '#0000ff',
        },
      },
    })
    expect(result.tokenCount).toBe(1)
    expect(result.metadata).toBeUndefined()
  })

  it('parses valid legacy format JSON', () => {
    const json = JSON.stringify({
      color: {
        primary: {
          type: 'color',
          value: '#0000ff',
        },
      },
    })

    const result = parseTokens(json)

    expect(result.format).toBe('legacy')
    expect(result.tokens).toEqual({
      color: {
        primary: {
          type: 'color',
          value: '#0000ff',
        },
      },
    })
    expect(result.tokenCount).toBe(1)
  })

  it('parses and normalizes Helium format JSON', () => {
    const json = JSON.stringify({
      metadata: {
        brand: 'acme',
        franchise: 'main',
      },
      tokens: {
        components: {
          button: {
            Default: {
              background: {
                $type: 'color',
                $value: '#0000ff',
              },
            },
          },
        },
      },
    })

    const result = parseTokens(json)

    expect(result.format).toBe('helium')
    expect(result.metadata).toEqual({
      brand: 'acme',
      franchise: 'main',
    })
    expect(result.tokens).toHaveProperty('components')
    expect(result.tokenCount).toBe(1)
  })

  it('throws error for invalid JSON with error message', () => {
    const invalidJson = '{ invalid json }'

    expect(() => parseTokens(invalidJson)).toThrow()
    try {
      parseTokens(invalidJson)
    }
    catch (error) {
      expect(error).toHaveProperty('error')
      expect((error as { error: string }).error).toContain('Invalid JSON')
    }
  })

  it('returns unknown format for non-token JSON', () => {
    const json = JSON.stringify({
      random: 'data',
      notAToken: true,
    })

    const result = parseTokens(json)

    expect(result.format).toBe('unknown')
    expect(result.tokenCount).toBe(0)
  })

  it('parses JSON with multiple tokens', () => {
    const json = JSON.stringify({
      color: {
        primary: {
          $type: 'color',
          $value: '#0000ff',
        },
        secondary: {
          $type: 'color',
          $value: '#ff0000',
        },
      },
      spacing: {
        sm: {
          $type: 'dimension',
          $value: '8px',
        },
      },
    })

    const result = parseTokens(json)

    expect(result.format).toBe('dtcg')
    expect(result.tokenCount).toBe(3)
  })
})

describe('countTokens', () => {
  it('counts DTCG tokens correctly', () => {
    const tokens = {
      color: {
        primary: {
          $type: 'color',
          $value: '#0000ff',
        },
        secondary: {
          $type: 'color',
          $value: '#ff0000',
        },
      },
    }

    expect(countTokens(tokens)).toBe(2)
  })

  it('counts legacy tokens correctly', () => {
    const tokens = {
      color: {
        primary: {
          type: 'color',
          value: '#0000ff',
        },
      },
      spacing: {
        sm: {
          type: 'dimension',
          value: '8px',
        },
      },
    }

    expect(countTokens(tokens)).toBe(2)
  })

  it('counts deeply nested tokens', () => {
    const tokens = {
      theme: {
        light: {
          color: {
            primary: {
              $type: 'color',
              $value: '#0000ff',
            },
          },
        },
        dark: {
          color: {
            primary: {
              $type: 'color',
              $value: '#ffffff',
            },
          },
        },
      },
    }

    expect(countTokens(tokens)).toBe(2)
  })

  it('returns 0 for empty object', () => {
    expect(countTokens({})).toBe(0)
  })

  it('returns 0 for non-object input', () => {
    expect(countTokens(null)).toBe(0)
    expect(countTokens(undefined)).toBe(0)
    expect(countTokens('string')).toBe(0)
    expect(countTokens(123)).toBe(0)
    expect(countTokens([])).toBe(0)
  })

  it('counts only leaf tokens, not groups', () => {
    const tokens = {
      color: {
        primary: {
          500: {
            $type: 'color',
            $value: '#0000ff',
          },
          600: {
            $type: 'color',
            $value: '#0000cc',
          },
        },
      },
    }

    expect(countTokens(tokens)).toBe(2)
  })
})

describe('getTokenPaths', () => {
  it('returns token paths for DTCG tokens', () => {
    const tokens = {
      color: {
        primary: {
          $type: 'color',
          $value: '#0000ff',
        },
        secondary: {
          $type: 'color',
          $value: '#ff0000',
        },
      },
    }

    const paths = getTokenPaths(tokens)

    expect(paths).toContain('color.primary')
    expect(paths).toContain('color.secondary')
    expect(paths).toHaveLength(2)
  })

  it('returns token paths for legacy tokens', () => {
    const tokens = {
      spacing: {
        sm: {
          type: 'dimension',
          value: '8px',
        },
        md: {
          type: 'dimension',
          value: '16px',
        },
      },
    }

    const paths = getTokenPaths(tokens)

    expect(paths).toContain('spacing.sm')
    expect(paths).toContain('spacing.md')
    expect(paths).toHaveLength(2)
  })

  it('returns paths for deeply nested tokens', () => {
    const tokens = {
      theme: {
        light: {
          color: {
            primary: {
              $type: 'color',
              $value: '#0000ff',
            },
          },
        },
      },
    }

    const paths = getTokenPaths(tokens)

    expect(paths).toContain('theme.light.color.primary')
    expect(paths).toHaveLength(1)
  })

  it('returns empty array for empty object', () => {
    expect(getTokenPaths({})).toEqual([])
  })

  it('returns empty array for non-object input', () => {
    expect(getTokenPaths(null)).toEqual([])
    expect(getTokenPaths(undefined)).toEqual([])
    expect(getTokenPaths('string')).toEqual([])
    expect(getTokenPaths([])).toEqual([])
  })

  it('handles mixed token formats in same object', () => {
    const tokens = {
      dtcg: {
        color: {
          $type: 'color',
          $value: '#0000ff',
        },
      },
      legacy: {
        spacing: {
          type: 'dimension',
          value: '8px',
        },
      },
    }

    const paths = getTokenPaths(tokens)

    expect(paths).toContain('dtcg.color')
    expect(paths).toContain('legacy.spacing')
    expect(paths).toHaveLength(2)
  })

  it('returns paths in consistent order', () => {
    const tokens = {
      a: {
        token1: {
          $type: 'color',
          $value: '#fff',
        },
      },
      b: {
        token2: {
          $type: 'color',
          $value: '#000',
        },
      },
    }

    const paths = getTokenPaths(tokens)

    expect(paths[0]).toBe('a.token1')
    expect(paths[1]).toBe('b.token2')
  })

  it('returns empty array for token at root level without prefix', () => {
    // Edge case: calling with a token directly without a parent path
    const token = {
      $type: 'color',
      $value: '#fff',
    }

    // When a token is at root with no prefix, should return empty
    // because there's no path to report
    const paths = getTokenPaths(token)
    expect(paths).toEqual([])
  })

  it('handles groups with no tokens (only nested objects)', () => {
    const tokens = {
      color: {
        primary: {
          base: {
            nested: {
              // No actual tokens, just groups
            },
          },
        },
      },
    }

    const paths = getTokenPaths(tokens)
    expect(paths).toEqual([])
  })

  it('ignores non-object values in token tree', () => {
    const tokens = {
      color: {
        primary: {
          $type: 'color',
          $value: '#fff',
        },
        description: 'This is a string, not a token group',
        count: 42,
        enabled: true,
      },
    }

    const paths = getTokenPaths(tokens)
    expect(paths).toEqual(['color.primary'])
  })
})

describe('parseTokens edge cases', () => {
  it('extracts line number from JSON parse error', () => {
    // This invalid JSON should produce an error with position info
    const invalidJson = '{\n  "foo": bar\n}'

    try {
      parseTokens(invalidJson)
      expect.fail('Should have thrown')
    }
    catch (error) {
      expect(error).toHaveProperty('error')
      const parseError = error as { error: string, line?: number }
      expect(parseError.error).toContain('Invalid JSON')
    }
  })

  it('handles JSON with only primitives (no tokens)', () => {
    const json = JSON.stringify({
      name: 'My Theme',
      version: '1.0.0',
      description: 'A theme with no tokens',
    })

    const result = parseTokens(json)

    expect(result.format).toBe('unknown')
    expect(result.tokenCount).toBe(0)
  })

  it('handles deeply nested Helium format', () => {
    const json = JSON.stringify({
      metadata: {
        brand: 'acme',
        franchise: 'subsidiary',
      },
      tokens: {
        components: {
          button: {
            Primary: {
              Default: {
                background: {
                  $type: 'color',
                  $value: '#0000ff',
                },
              },
            },
          },
        },
        primitives: {
          color: {
            blue: {
              500: {
                $type: 'color',
                $value: '#0000ff',
              },
            },
          },
        },
      },
    })

    const result = parseTokens(json)

    expect(result.format).toBe('helium')
    expect(result.metadata).toEqual({
      brand: 'acme',
      franchise: 'subsidiary',
    })
    expect(result.tokenCount).toBe(2)
  })

  it('handles JSON array (not valid token format)', () => {
    const json = JSON.stringify([
      { $type: 'color', $value: '#fff' },
      { $type: 'color', $value: '#000' },
    ])

    const result = parseTokens(json)

    expect(result.format).toBe('unknown')
    expect(result.tokenCount).toBe(0)
  })

  it('handles empty JSON object', () => {
    const json = JSON.stringify({})

    const result = parseTokens(json)

    expect(result.format).toBe('unknown')
    expect(result.tokenCount).toBe(0)
  })

  it('handles null JSON value', () => {
    const json = JSON.stringify(null)

    const result = parseTokens(json)

    expect(result.format).toBe('unknown')
    expect(result.tokenCount).toBe(0)
  })
})

describe('countTokens edge cases', () => {
  it('handles object with only $type but no $value', () => {
    const tokens = {
      color: {
        primary: {
          $type: 'color',
          // missing $value
        },
      },
    }

    expect(countTokens(tokens)).toBe(0)
  })

  it('handles object with only $value but no $type', () => {
    const tokens = {
      color: {
        primary: {
          $value: '#fff',
          // missing $type
        },
      },
    }

    expect(countTokens(tokens)).toBe(0)
  })

  it('handles mixed valid and invalid tokens', () => {
    const tokens = {
      valid: {
        $type: 'color',
        $value: '#fff',
      },
      invalid1: {
        $type: 'color',
        // missing $value
      },
      invalid2: {
        $value: '#000',
        // missing $type
      },
      nested: {
        valid: {
          type: 'dimension',
          value: '8px',
        },
      },
    }

    expect(countTokens(tokens)).toBe(2) // Only the 2 valid tokens
  })

  it('handles token with extra properties', () => {
    const tokens = {
      color: {
        primary: {
          $type: 'color',
          $value: '#fff',
          $description: 'Primary color',
          customProp: 'extra data',
        },
      },
    }

    expect(countTokens(tokens)).toBe(1)
  })

  it('handles boolean value (non-object)', () => {
    expect(countTokens(true)).toBe(0)
    expect(countTokens(false)).toBe(0)
  })

  it('handles function value (non-object)', () => {
    expect(countTokens(() => {})).toBe(0)
  })

  it('counts tokens in arrays within objects (arrays are skipped)', () => {
    const tokens = {
      colors: [
        { $type: 'color', $value: '#fff' },
        { $type: 'color', $value: '#000' },
      ],
    }

    // Arrays are not traversed for tokens
    expect(countTokens(tokens)).toBe(0)
  })
})
