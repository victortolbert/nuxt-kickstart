import { describe, expect, it } from 'vitest'
import { extractHeliumMetadata, normalizeHeliumTokens } from '../../shared/utils/token-normalizer'

describe('extractHeliumMetadata', () => {
  it('extracts brand and franchise from valid Helium format', () => {
    const json = {
      metadata: {
        brand: 'Image',
        franchise: 'Compare',
      },
      tokens: {},
    }

    const result = extractHeliumMetadata(json)

    expect(result).toEqual({
      brand: 'Image',
      franchise: 'Compare',
    })
  })

  it('returns empty strings when metadata is missing', () => {
    const json = {
      tokens: {},
    }

    const result = extractHeliumMetadata(json)

    expect(result).toEqual({
      brand: '',
      franchise: '',
    })
  })

  it('returns empty strings when metadata is not an object', () => {
    const json = {
      metadata: 'invalid',
      tokens: {},
    }

    const result = extractHeliumMetadata(json)

    expect(result).toEqual({
      brand: '',
      franchise: '',
    })
  })

  it('handles missing brand or franchise fields', () => {
    const json = {
      metadata: {
        brand: 'Image',
      },
      tokens: {},
    }

    const result = extractHeliumMetadata(json)

    expect(result).toEqual({
      brand: 'Image',
      franchise: '',
    })
  })

  it('returns empty strings for non-object input', () => {
    expect(extractHeliumMetadata(null)).toEqual({ brand: '', franchise: '' })
    expect(extractHeliumMetadata(undefined)).toEqual({ brand: '', franchise: '' })
    expect(extractHeliumMetadata('string')).toEqual({ brand: '', franchise: '' })
    expect(extractHeliumMetadata(123)).toEqual({ brand: '', franchise: '' })
    expect(extractHeliumMetadata([])).toEqual({ brand: '', franchise: '' })
  })
})

describe('normalizeHeliumTokens', () => {
  it('normalizes Helium format with components', () => {
    const json = {
      metadata: {
        brand: 'Image',
        franchise: 'Compare',
      },
      tokens: {
        components: {
          'image-compare': {
            Default: {
              'background': {
                $type: 'color',
                $value: '#00000000',
              },
              'border top': {
                $type: 'border',
                $value: {
                  color: '#00000000',
                  style: 'solid',
                  width: '1px',
                },
              },
            },
            Variant2: {
              background: {
                $type: 'color',
                $value: '#ffffff',
              },
            },
          },
        },
        primitives: {},
        rte: {},
      },
    }

    const result = normalizeHeliumTokens(json)

    expect(result.metadata).toEqual({
      brand: 'Image',
      franchise: 'Compare',
    })

    expect(result.tokens).toHaveProperty('components')
    expect(result.tokens.components).toHaveProperty('image-compare')

    const imageCompare = (result.tokens.components as Record<string, unknown>)['image-compare'] as Record<string, unknown>
    expect(imageCompare).toHaveProperty('Default')
    expect(imageCompare).toHaveProperty('Variant2')

    const defaultVariant = imageCompare.Default as Record<string, unknown>
    expect(defaultVariant).toHaveProperty('background')
    expect(defaultVariant.background).toEqual({
      $type: 'color',
      $value: '#00000000',
    })

    expect(defaultVariant).toHaveProperty('border top')
    expect(defaultVariant['border top']).toEqual({
      $type: 'border',
      $value: {
        color: '#00000000',
        style: 'solid',
        width: '1px',
      },
    })
  })

  it('preserves $type and $value on tokens', () => {
    const json = {
      metadata: {
        brand: 'Test',
        franchise: 'Brand',
      },
      tokens: {
        components: {
          button: {
            Primary: {
              color: {
                $type: 'color',
                $value: '#ff0000',
              },
            },
          },
        },
        primitives: {},
        rte: {},
      },
    }

    const result = normalizeHeliumTokens(json)

    const button = (result.tokens.components as Record<string, unknown>).button as Record<string, unknown>
    const primary = button.Primary as Record<string, unknown>
    const color = primary.color as Record<string, unknown>

    expect(color).toHaveProperty('$type', 'color')
    expect(color).toHaveProperty('$value', '#ff0000')
  })

  it('includes primitives when present', () => {
    const json = {
      metadata: {
        brand: 'Test',
        franchise: 'Brand',
      },
      tokens: {
        components: {},
        primitives: {
          colors: {
            primary: {
              $type: 'color',
              $value: '#0000ff',
            },
          },
        },
        rte: {},
      },
    }

    const result = normalizeHeliumTokens(json)

    expect(result.tokens).toHaveProperty('primitives')
    expect(result.tokens.primitives).toEqual({
      colors: {
        primary: {
          $type: 'color',
          $value: '#0000ff',
        },
      },
    })
  })

  it('includes rte when present', () => {
    const json = {
      metadata: {
        brand: 'Test',
        franchise: 'Brand',
      },
      tokens: {
        components: {},
        primitives: {},
        rte: {
          spacing: {
            small: {
              $type: 'dimension',
              $value: '8px',
            },
          },
        },
      },
    }

    const result = normalizeHeliumTokens(json)

    expect(result.tokens).toHaveProperty('rte')
    expect(result.tokens.rte).toEqual({
      spacing: {
        small: {
          $type: 'dimension',
          $value: '8px',
        },
      },
    })
  })

  it('omits empty primitives and rte sections', () => {
    const json = {
      metadata: {
        brand: 'Test',
        franchise: 'Brand',
      },
      tokens: {
        components: {
          button: {
            Default: {
              color: {
                $type: 'color',
                $value: '#000000',
              },
            },
          },
        },
        primitives: {},
        rte: {},
      },
    }

    const result = normalizeHeliumTokens(json)

    expect(result.tokens).not.toHaveProperty('primitives')
    expect(result.tokens).not.toHaveProperty('rte')
  })

  it('handles missing tokens key', () => {
    const json = {
      metadata: {
        brand: 'Test',
        franchise: 'Brand',
      },
    }

    const result = normalizeHeliumTokens(json)

    expect(result.metadata).toEqual({
      brand: 'Test',
      franchise: 'Brand',
    })
    expect(result.tokens).toEqual({})
  })

  it('handles invalid input gracefully', () => {
    const result1 = normalizeHeliumTokens(null)
    expect(result1.tokens).toEqual({})
    expect(result1.metadata).toEqual({ brand: '', franchise: '' })

    const result2 = normalizeHeliumTokens(undefined)
    expect(result2.tokens).toEqual({})

    const result3 = normalizeHeliumTokens('string')
    expect(result3.tokens).toEqual({})

    const result4 = normalizeHeliumTokens([])
    expect(result4.tokens).toEqual({})
  })

  it('handles multiple components with multiple variants', () => {
    const json = {
      metadata: {
        brand: 'Test',
        franchise: 'Brand',
      },
      tokens: {
        components: {
          button: {
            Primary: {
              bg: { $type: 'color', $value: '#0000ff' },
            },
            Secondary: {
              bg: { $type: 'color', $value: '#ff0000' },
            },
          },
          card: {
            Default: {
              padding: { $type: 'dimension', $value: '16px' },
            },
          },
        },
        primitives: {},
        rte: {},
      },
    }

    const result = normalizeHeliumTokens(json)

    const components = result.tokens.components as Record<string, unknown>

    expect(components).toHaveProperty('button')
    expect(components).toHaveProperty('card')

    const button = components.button as Record<string, unknown>
    expect(button).toHaveProperty('Primary')
    expect(button).toHaveProperty('Secondary')

    const card = components.card as Record<string, unknown>
    expect(card).toHaveProperty('Default')
  })

  it('handles space-separated token names', () => {
    const json = {
      metadata: {
        brand: 'Test',
        franchise: 'Brand',
      },
      tokens: {
        components: {
          button: {
            Default: {
              'text a background': {
                $type: 'color',
                $value: '#ffffff',
              },
              'border top left': {
                $type: 'dimension',
                $value: '4px',
              },
            },
          },
        },
        primitives: {},
        rte: {},
      },
    }

    const result = normalizeHeliumTokens(json)

    const button = (result.tokens.components as Record<string, unknown>).button as Record<string, unknown>
    const defaultVariant = button.Default as Record<string, unknown>

    expect(defaultVariant).toHaveProperty('text a background')
    expect(defaultVariant).toHaveProperty('border top left')
  })

  it('skips non-object component values', () => {
    const json = {
      metadata: {
        brand: 'Test',
        franchise: 'Brand',
      },
      tokens: {
        components: {
          validButton: {
            Default: {
              color: { $type: 'color', $value: '#fff' },
            },
          },
          invalidString: 'not an object',
          invalidNumber: 123,
          invalidNull: null,
          invalidArray: ['item1', 'item2'],
        },
        primitives: {},
        rte: {},
      },
    }

    const result = normalizeHeliumTokens(json)

    // Only validButton should be in the result
    const components = result.tokens.components as Record<string, unknown>
    expect(components).toHaveProperty('validButton')
    expect(components).not.toHaveProperty('invalidString')
    expect(components).not.toHaveProperty('invalidNumber')
    expect(components).not.toHaveProperty('invalidNull')
    expect(components).not.toHaveProperty('invalidArray')
  })

  it('skips non-object variant values within components', () => {
    const json = {
      metadata: {
        brand: 'Test',
        franchise: 'Brand',
      },
      tokens: {
        components: {
          button: {
            ValidDefault: {
              color: { $type: 'color', $value: '#fff' },
            },
            invalidString: 'not an object',
            invalidNumber: 456,
            invalidNull: null,
          },
        },
        primitives: {},
        rte: {},
      },
    }

    const result = normalizeHeliumTokens(json)

    const button = (result.tokens.components as Record<string, unknown>).button as Record<string, unknown>
    expect(button).toHaveProperty('ValidDefault')
    expect(button).not.toHaveProperty('invalidString')
    expect(button).not.toHaveProperty('invalidNumber')
    expect(button).not.toHaveProperty('invalidNull')
  })

  it('handles components with only invalid variant values', () => {
    const json = {
      metadata: {
        brand: 'Test',
        franchise: 'Brand',
      },
      tokens: {
        components: {
          emptyButton: {
            notAVariant: 'string value',
            alsoNotAVariant: 123,
          },
        },
        primitives: {},
        rte: {},
      },
    }

    const result = normalizeHeliumTokens(json)

    // When all variants are invalid, components object is not created
    // because no valid variants were added
    expect(result.tokens).not.toHaveProperty('components')
  })
})
