import { describe, expect, it } from 'vitest'
import { detectTokenFormat, isHeliumFormat } from '../../shared/utils/token-detector'

describe('token-detector', () => {
  describe('detectTokenFormat', () => {
    it('detects DTCG format with $type and $value keys', () => {
      const dtcgTokens = {
        colors: {
          primary: {
            $type: 'color',
            $value: '#0000ff',
          },
        },
      }
      expect(detectTokenFormat(dtcgTokens)).toBe('dtcg')
    })

    it('detects DTCG format at any nesting level', () => {
      const nestedDtcg = {
        semantic: {
          colors: {
            brand: {
              primary: {
                $type: 'color',
                $value: '#0000ff',
              },
            },
          },
        },
      }
      expect(detectTokenFormat(nestedDtcg)).toBe('dtcg')
    })

    it('detects legacy format with value keys', () => {
      const legacyTokens = {
        colors: {
          primary: {
            value: '#0000ff',
          },
        },
      }
      expect(detectTokenFormat(legacyTokens)).toBe('legacy')
    })

    it('detects Helium format with metadata and tokens.components', () => {
      const heliumTokens = {
        metadata: {
          brand: 'test-brand',
          franchise: 'test-franchise',
        },
        tokens: {
          components: {
            button: {
              primary: {
                background: {
                  $type: 'color',
                  $value: '#0000ff',
                },
              },
            },
          },
        },
      }
      expect(detectTokenFormat(heliumTokens)).toBe('helium')
    })

    it('returns unknown for invalid input', () => {
      expect(detectTokenFormat(null)).toBe('unknown')
      expect(detectTokenFormat(undefined)).toBe('unknown')
      expect(detectTokenFormat([])).toBe('unknown')
      expect(detectTokenFormat('string')).toBe('unknown')
      expect(detectTokenFormat(123)).toBe('unknown')
      expect(detectTokenFormat({})).toBe('unknown')
    })

    it('returns unknown for objects without recognized token structure', () => {
      const notTokens = {
        foo: {
          bar: 'baz',
        },
      }
      expect(detectTokenFormat(notTokens)).toBe('unknown')
    })

    it('prioritizes Helium detection over DTCG', () => {
      // Helium tokens also contain DTCG-style tokens, but should be detected as Helium
      const heliumWithDtcg = {
        metadata: {
          brand: 'test',
        },
        tokens: {
          components: {
            button: {
              $type: 'color',
              $value: '#fff',
            },
          },
        },
      }
      expect(detectTokenFormat(heliumWithDtcg)).toBe('helium')
    })
  })

  describe('isHeliumFormat', () => {
    it('returns true for valid Helium format', () => {
      const heliumTokens = {
        metadata: {
          brand: 'test-brand',
        },
        tokens: {
          components: {},
        },
      }
      expect(isHeliumFormat(heliumTokens)).toBe(true)
    })

    it('returns false when metadata is missing', () => {
      const noMetadata = {
        tokens: {
          components: {},
        },
      }
      expect(isHeliumFormat(noMetadata)).toBe(false)
    })

    it('returns false when tokens is missing', () => {
      const noTokens = {
        metadata: {},
      }
      expect(isHeliumFormat(noTokens)).toBe(false)
    })

    it('returns false when tokens.components is missing', () => {
      const noComponents = {
        metadata: {},
        tokens: {
          other: {},
        },
      }
      expect(isHeliumFormat(noComponents)).toBe(false)
    })

    it('returns false for invalid input types', () => {
      expect(isHeliumFormat(null)).toBe(false)
      expect(isHeliumFormat(undefined)).toBe(false)
      expect(isHeliumFormat([])).toBe(false)
      expect(isHeliumFormat('string')).toBe(false)
    })
  })

  describe('array handling in recursive checks', () => {
    it('handles arrays in nested DTCG token structures', () => {
      // Arrays inside the token tree should not break detection
      const tokensWithArray = {
        colors: {
          palette: ['#fff', '#000'], // Array, not a token
          primary: {
            $type: 'color',
            $value: '#0000ff',
          },
        },
      }
      expect(detectTokenFormat(tokensWithArray)).toBe('dtcg')
    })

    it('handles arrays at top level returning unknown', () => {
      const arrayAtTop = ['item1', 'item2']
      expect(detectTokenFormat(arrayAtTop)).toBe('unknown')
    })

    it('handles nested arrays without tokens returning unknown', () => {
      const nestedArraysNoTokens = {
        data: {
          items: [
            { name: 'Item 1' },
            { name: 'Item 2' },
          ],
        },
      }
      expect(detectTokenFormat(nestedArraysNoTokens)).toBe('unknown')
    })

    it('handles arrays containing objects that look like tokens', () => {
      // Arrays are skipped during DTCG/legacy detection
      const tokensInArray = {
        colors: [
          { $type: 'color', $value: '#fff' },
          { $type: 'color', $value: '#000' },
        ],
      }
      // Since tokens are inside array, they won't be detected
      expect(detectTokenFormat(tokensInArray)).toBe('unknown')
    })

    it('detects legacy tokens when arrays are present elsewhere', () => {
      const legacyWithArrays = {
        fontFamily: ['Arial', 'sans-serif'], // This is an array value
        colors: {
          primary: {
            value: '#0000ff', // Legacy token
          },
        },
      }
      expect(detectTokenFormat(legacyWithArrays)).toBe('legacy')
    })

    it('handles null values in nested structure for DTCG detection', () => {
      const withNulls = {
        colors: {
          empty: null,
          primary: {
            $type: 'color',
            $value: '#0000ff',
          },
        },
      }
      expect(detectTokenFormat(withNulls)).toBe('dtcg')
    })

    it('handles null values in nested structure for legacy detection', () => {
      const legacyWithNulls = {
        colors: {
          empty: null,
          primary: {
            value: '#0000ff',
          },
        },
      }
      expect(detectTokenFormat(legacyWithNulls)).toBe('legacy')
    })
  })
})
