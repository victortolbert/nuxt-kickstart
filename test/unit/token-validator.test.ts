import { describe, expect, it } from 'vitest'
import { validateTokens } from '../../shared/utils/token-validator'

describe('validateTokens', () => {
  describe('basic validation', () => {
    it('rejects non-object input', () => {
      const result = validateTokens('invalid', 'dtcg')
      expect(result.valid).toBe(false)
      expect(result.errors).toHaveLength(1)
      expect(result.errors[0].message).toBe('Tokens must be an object')
    })

    it('rejects array input', () => {
      const result = validateTokens([], 'dtcg')
      expect(result.valid).toBe(false)
      expect(result.errors).toHaveLength(1)
      expect(result.errors[0].message).toBe('Tokens cannot be an array')
    })

    it('rejects null input', () => {
      const result = validateTokens(null, 'dtcg')
      expect(result.valid).toBe(false)
      expect(result.errors).toHaveLength(1)
      expect(result.errors[0].message).toBe('Tokens must be an object')
    })

    it('accepts empty object', () => {
      const result = validateTokens({}, 'dtcg')
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })
  })

  describe('dTCG format validation', () => {
    it('validates valid DTCG color token', () => {
      const tokens = {
        color: {
          primary: {
            $type: 'color',
            $value: '#007bff',
          },
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('rejects DTCG token missing $type', () => {
      const tokens = {
        color: {
          primary: {
            $value: '#007bff',
          },
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(false)
      expect(result.errors[0].message).toContain('missing $type')
    })

    it('rejects invalid color value', () => {
      const tokens = {
        color: {
          primary: {
            $type: 'color',
            $value: 'not-a-color-123',
          },
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(false)
      expect(result.errors[0].message).toContain('Invalid value for type "color"')
    })

    it('rejects null token values', () => {
      const tokens = {
        color: {
          primary: null,
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(false)
      expect(result.errors[0].message).toContain('cannot be null or undefined')
    })
  })

  describe('legacy format validation', () => {
    it('validates valid legacy token', () => {
      const tokens = {
        color: {
          primary: {
            type: 'color',
            value: '#007bff',
          },
        },
      }
      const result = validateTokens(tokens, 'legacy')
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('rejects invalid dimension value', () => {
      const tokens = {
        spacing: {
          small: {
            type: 'dimension',
            value: 'invalid',
          },
        },
      }
      const result = validateTokens(tokens, 'legacy')
      expect(result.valid).toBe(false)
      expect(result.errors[0].message).toContain('Invalid value for type "dimension"')
    })
  })

  describe('color validation', () => {
    it('accepts hex colors', () => {
      const tokens = {
        color: {
          hex3: { $type: 'color', $value: '#fff' },
          hex6: { $type: 'color', $value: '#ffffff' },
          hex8: { $type: 'color', $value: '#ffffffff' },
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(true)
    })

    it('accepts rgb/rgba colors', () => {
      const tokens = {
        color: {
          rgb: { $type: 'color', $value: 'rgb(255, 255, 255)' },
          rgba: { $type: 'color', $value: 'rgba(255, 255, 255, 0.5)' },
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(true)
    })

    it('accepts hsl/hsla colors', () => {
      const tokens = {
        color: {
          hsl: { $type: 'color', $value: 'hsl(0, 100%, 50%)' },
          hsla: { $type: 'color', $value: 'hsla(0, 100%, 50%, 0.5)' },
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(true)
    })

    it('accepts named colors', () => {
      const tokens = {
        color: {
          named: { $type: 'color', $value: 'red' },
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(true)
    })
  })

  describe('dimension validation', () => {
    it('accepts valid dimension units', () => {
      const tokens = {
        spacing: {
          px: { $type: 'dimension', $value: '16px' },
          rem: { $type: 'dimension', $value: '1rem' },
          em: { $type: 'dimension', $value: '2em' },
          percent: { $type: 'dimension', $value: '50%' },
          vh: { $type: 'dimension', $value: '100vh' },
          vw: { $type: 'dimension', $value: '100vw' },
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(true)
    })

    it('accepts negative dimensions', () => {
      const tokens = {
        spacing: {
          negative: { $type: 'dimension', $value: '-8px' },
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(true)
    })

    it('rejects invalid dimension units', () => {
      const tokens = {
        spacing: {
          invalid: { $type: 'dimension', $value: '16pixels' },
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(false)
    })
  })

  describe('typography validation', () => {
    it('accepts valid typography token', () => {
      const tokens = {
        typography: {
          heading: {
            $type: 'typography',
            $value: {
              fontFamily: 'Arial',
              fontSize: '24px',
              fontWeight: 700,
              lineHeight: 1.5,
            },
          },
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(true)
    })

    it('accepts partial typography token', () => {
      const tokens = {
        typography: {
          heading: {
            $type: 'typography',
            $value: {
              fontFamily: 'Arial',
            },
          },
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(true)
    })
  })

  describe('shadow validation', () => {
    it('accepts shadow as string', () => {
      const tokens = {
        shadow: {
          card: {
            $type: 'shadow',
            $value: '0 2px 4px rgba(0,0,0,0.1)',
          },
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(true)
    })

    it('accepts shadow as object', () => {
      const tokens = {
        shadow: {
          card: {
            $type: 'shadow',
            $value: {
              offsetX: '0px',
              offsetY: '2px',
              blur: '4px',
              color: 'rgba(0,0,0,0.1)',
            },
          },
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(true)
    })
  })

  describe('border validation', () => {
    it('accepts border as string', () => {
      const tokens = {
        border: {
          thin: {
            $type: 'border',
            $value: '1px solid black',
          },
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(true)
    })

    it('accepts border as object', () => {
      const tokens = {
        border: {
          thin: {
            $type: 'border',
            $value: {
              width: '1px',
              style: 'solid',
              color: 'black',
            },
          },
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(true)
    })
  })

  describe('fontFamily validation', () => {
    it('accepts fontFamily as string', () => {
      const tokens = {
        font: {
          body: {
            $type: 'fontFamily',
            $value: 'Arial, sans-serif',
          },
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(true)
    })

    it('accepts fontFamily as array', () => {
      const tokens = {
        font: {
          body: {
            $type: 'fontFamily',
            $value: ['Arial', 'Helvetica', 'sans-serif'],
          },
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(true)
    })
  })

  describe('fontWeight validation', () => {
    it('accepts numeric font weights', () => {
      const tokens = {
        weight: {
          light: { $type: 'fontWeight', $value: 300 },
          normal: { $type: 'fontWeight', $value: 400 },
          bold: { $type: 'fontWeight', $value: 700 },
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(true)
    })

    it('accepts named font weights', () => {
      const tokens = {
        weight: {
          normal: { $type: 'fontWeight', $value: 'normal' },
          bold: { $type: 'fontWeight', $value: 'bold' },
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(true)
    })

    it('rejects invalid font weights', () => {
      const tokens = {
        weight: {
          invalid: { $type: 'fontWeight', $value: 50 },
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(false)
    })
  })

  describe('duration validation', () => {
    it('accepts milliseconds', () => {
      const tokens = {
        duration: {
          fast: { $type: 'duration', $value: '200ms' },
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(true)
    })

    it('accepts seconds', () => {
      const tokens = {
        duration: {
          slow: { $type: 'duration', $value: '2s' },
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(true)
    })

    it('rejects invalid duration units', () => {
      const tokens = {
        duration: {
          invalid: { $type: 'duration', $value: '200' },
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(false)
    })
  })

  describe('cubicBezier validation', () => {
    it('accepts cubic-bezier as string', () => {
      const tokens = {
        easing: {
          ease: { $type: 'cubicBezier', $value: 'cubic-bezier(0.4, 0.0, 0.2, 1)' },
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(true)
    })

    it('accepts cubic-bezier as array', () => {
      const tokens = {
        easing: {
          ease: { $type: 'cubicBezier', $value: [0.4, 0.0, 0.2, 1] },
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(true)
    })

    it('rejects invalid cubic-bezier array', () => {
      const tokens = {
        easing: {
          invalid: { $type: 'cubicBezier', $value: [0.4, 0.0] },
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(false)
    })
  })

  describe('nested tokens', () => {
    it('validates deeply nested tokens', () => {
      const tokens = {
        color: {
          brand: {
            primary: {
              base: {
                $type: 'color',
                $value: '#007bff',
              },
            },
          },
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(true)
    })

    it('reports errors with correct path', () => {
      const tokens = {
        color: {
          brand: {
            primary: {
              $type: 'color',
              $value: 'invalid-color-xyz',
            },
          },
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(false)
      expect(result.errors[0].path).toEqual(['color', 'brand', 'primary'])
    })
  })

  describe('unknown token types', () => {
    it('accepts unknown token types as valid', () => {
      const tokens = {
        custom: {
          token: {
            $type: 'customType',
            $value: 'any value',
          },
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(true)
    })
  })

  describe('width and height tokens', () => {
    it('validates width as dimension', () => {
      const tokens = {
        width: {
          button: {
            $type: 'width',
            $value: '120px',
          },
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(true)
    })

    it('validates height as dimension', () => {
      const tokens = {
        height: {
          button: {
            $type: 'height',
            $value: '48px',
          },
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(true)
    })
  })

  describe('fontWeight edge cases', () => {
    it('accepts string numeric font weights', () => {
      const tokens = {
        weight: {
          medium: { $type: 'fontWeight', $value: '500' },
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(true)
    })

    it('rejects string numeric font weight out of range', () => {
      const tokens = {
        weight: {
          invalid: { $type: 'fontWeight', $value: '50' },
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(false)
    })

    it('rejects font weight as object', () => {
      const tokens = {
        weight: {
          invalid: { $type: 'fontWeight', $value: { weight: 400 } },
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(false)
    })

    it('rejects font weight as array', () => {
      const tokens = {
        weight: {
          invalid: { $type: 'fontWeight', $value: [400, 500] },
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(false)
    })

    it('rejects font weight as null', () => {
      const tokens = {
        weight: {
          invalid: { $type: 'fontWeight', $value: null },
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(false)
    })

    it('accepts bolder and lighter named weights', () => {
      const tokens = {
        weight: {
          bolder: { $type: 'fontWeight', $value: 'bolder' },
          lighter: { $type: 'fontWeight', $value: 'lighter' },
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(true)
    })

    it('rejects invalid named font weight', () => {
      const tokens = {
        weight: {
          invalid: { $type: 'fontWeight', $value: 'heavy' },
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(false)
    })

    it('rejects font weight number above 900', () => {
      const tokens = {
        weight: {
          invalid: { $type: 'fontWeight', $value: 1000 },
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(false)
    })
  })

  describe('duration edge cases', () => {
    it('rejects duration as number', () => {
      const tokens = {
        duration: {
          invalid: { $type: 'duration', $value: 200 },
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(false)
    })

    it('rejects duration as object', () => {
      const tokens = {
        duration: {
          invalid: { $type: 'duration', $value: { time: '200ms' } },
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(false)
    })

    it('rejects duration as null', () => {
      const tokens = {
        duration: {
          invalid: { $type: 'duration', $value: null },
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(false)
    })

    it('accepts decimal durations', () => {
      const tokens = {
        duration: {
          precise: { $type: 'duration', $value: '0.5s' },
          decimal: { $type: 'duration', $value: '150.5ms' },
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(true)
    })
  })

  describe('cubicBezier edge cases', () => {
    it('rejects cubic-bezier as object', () => {
      const tokens = {
        easing: {
          invalid: { $type: 'cubicBezier', $value: { x1: 0.4, y1: 0, x2: 0.2, y2: 1 } },
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(false)
    })

    it('rejects cubic-bezier as number', () => {
      const tokens = {
        easing: {
          invalid: { $type: 'cubicBezier', $value: 123 },
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(false)
    })

    it('rejects cubic-bezier as null', () => {
      const tokens = {
        easing: {
          invalid: { $type: 'cubicBezier', $value: null },
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(false)
    })

    it('rejects cubic-bezier array with non-number values', () => {
      const tokens = {
        easing: {
          invalid: { $type: 'cubicBezier', $value: ['0.4', '0', '0.2', '1'] },
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(false)
    })

    it('rejects cubic-bezier array with 3 values', () => {
      const tokens = {
        easing: {
          invalid: { $type: 'cubicBezier', $value: [0.4, 0, 0.2] },
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(false)
    })

    it('rejects cubic-bezier array with 5 values', () => {
      const tokens = {
        easing: {
          invalid: { $type: 'cubicBezier', $value: [0.4, 0, 0.2, 1, 0.5] },
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(false)
    })
  })

  describe('color edge cases', () => {
    it('rejects color as number', () => {
      const tokens = {
        color: {
          invalid: { $type: 'color', $value: 0xFF0000 },
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(false)
    })

    it('rejects color as object', () => {
      const tokens = {
        color: {
          invalid: { $type: 'color', $value: { r: 255, g: 0, b: 0 } },
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(false)
    })
  })

  describe('dimension edge cases', () => {
    it('rejects dimension as number without unit', () => {
      const tokens = {
        spacing: {
          invalid: { $type: 'dimension', $value: 16 },
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(false)
    })

    it('accepts decimal dimensions', () => {
      const tokens = {
        spacing: {
          decimal: { $type: 'dimension', $value: '1.5rem' },
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(true)
    })
  })

  describe('typography edge cases', () => {
    it('rejects typography as string', () => {
      const tokens = {
        typography: {
          invalid: { $type: 'typography', $value: 'Arial 16px bold' },
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(false)
    })

    it('rejects typography as null', () => {
      const tokens = {
        typography: {
          invalid: { $type: 'typography', $value: null },
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(false)
    })
  })

  describe('shadow edge cases', () => {
    it('rejects shadow as number', () => {
      const tokens = {
        shadow: {
          invalid: { $type: 'shadow', $value: 123 },
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(false)
    })

    it('rejects shadow as null', () => {
      const tokens = {
        shadow: {
          invalid: { $type: 'shadow', $value: null },
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(false)
    })
  })

  describe('border edge cases', () => {
    it('rejects border as number', () => {
      const tokens = {
        border: {
          invalid: { $type: 'border', $value: 123 },
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(false)
    })

    it('rejects border as null', () => {
      const tokens = {
        border: {
          invalid: { $type: 'border', $value: null },
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(false)
    })
  })

  describe('fontFamily edge cases', () => {
    it('rejects fontFamily as number', () => {
      const tokens = {
        font: {
          invalid: { $type: 'fontFamily', $value: 123 },
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(false)
    })

    it('rejects fontFamily array with non-string values', () => {
      const tokens = {
        font: {
          invalid: { $type: 'fontFamily', $value: ['Arial', 123, 'sans-serif'] },
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(false)
    })
  })

  describe('undefined token values', () => {
    it('rejects undefined token values', () => {
      const tokens = {
        color: {
          primary: undefined,
        },
      }
      const result = validateTokens(tokens, 'dtcg')
      expect(result.valid).toBe(false)
      expect(result.errors[0].message).toContain('cannot be null or undefined')
    })
  })
})
