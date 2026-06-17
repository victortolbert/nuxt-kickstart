import { describe, expect, it } from 'vitest'
import { convertTokenNames, toCamelTokenName, toKebabTokenName, toSnakeTokenName } from '../../shared/utils/token-name-converter'

describe('toKebabTokenName', () => {
  it('converts space-separated name to kebab-case', () => {
    expect(toKebabTokenName('border top')).toBe('border-top')
  })

  it('handles multi-word names', () => {
    expect(toKebabTokenName('text a background')).toBe('text-a-background')
  })

  it('handles single word', () => {
    expect(toKebabTokenName('color')).toBe('color')
  })

  it('handles multiple spaces', () => {
    expect(toKebabTokenName('text   a   background')).toBe('text-a-background')
  })

  it('handles leading/trailing spaces', () => {
    expect(toKebabTokenName('  border top  ')).toBe('border-top')
  })

  it('converts to lowercase', () => {
    expect(toKebabTokenName('Border Top')).toBe('border-top')
  })

  it('handles empty string', () => {
    expect(toKebabTokenName('')).toBe('')
  })
})

describe('toCamelTokenName', () => {
  it('converts space-separated name to camelCase', () => {
    expect(toCamelTokenName('border top')).toBe('borderTop')
  })

  it('handles multi-word names', () => {
    expect(toCamelTokenName('text a background')).toBe('textABackground')
  })

  it('handles single word', () => {
    expect(toCamelTokenName('color')).toBe('color')
  })

  it('handles multiple spaces', () => {
    expect(toCamelTokenName('text   a   background')).toBe('textABackground')
  })

  it('handles leading/trailing spaces', () => {
    expect(toCamelTokenName('  border top  ')).toBe('borderTop')
  })

  it('converts properly from mixed case', () => {
    expect(toCamelTokenName('Border Top')).toBe('borderTop')
  })

  it('handles empty string', () => {
    expect(toCamelTokenName('')).toBe('')
  })
})

describe('toSnakeTokenName', () => {
  it('converts space-separated name to snake_case', () => {
    expect(toSnakeTokenName('border top')).toBe('border_top')
  })

  it('handles multi-word names', () => {
    expect(toSnakeTokenName('text a background')).toBe('text_a_background')
  })

  it('handles single word', () => {
    expect(toSnakeTokenName('color')).toBe('color')
  })

  it('handles multiple spaces', () => {
    expect(toSnakeTokenName('text   a   background')).toBe('text_a_background')
  })

  it('handles leading/trailing spaces', () => {
    expect(toSnakeTokenName('  border top  ')).toBe('border_top')
  })

  it('converts to lowercase', () => {
    expect(toSnakeTokenName('Border Top')).toBe('border_top')
  })

  it('handles empty string', () => {
    expect(toSnakeTokenName('')).toBe('')
  })
})

describe('convertTokenNames', () => {
  it('converts top-level token names to kebab-case', () => {
    const input = {
      'border top': { $type: 'dimension', $value: '1px' },
      'text color': { $type: 'color', $value: '#000000' },
    }
    const result = convertTokenNames(input, 'kebab')
    expect(result).toEqual({
      'border-top': { $type: 'dimension', $value: '1px' },
      'text-color': { $type: 'color', $value: '#000000' },
    })
  })

  it('converts top-level token names to camelCase', () => {
    const input = {
      'border top': { $type: 'dimension', $value: '1px' },
      'text color': { $type: 'color', $value: '#000000' },
    }
    const result = convertTokenNames(input, 'camel')
    expect(result).toEqual({
      borderTop: { $type: 'dimension', $value: '1px' },
      textColor: { $type: 'color', $value: '#000000' },
    })
  })

  it('converts top-level token names to snake_case', () => {
    const input = {
      'border top': { $type: 'dimension', $value: '1px' },
      'text color': { $type: 'color', $value: '#000000' },
    }
    const result = convertTokenNames(input, 'snake')
    expect(result).toEqual({
      border_top: { $type: 'dimension', $value: '1px' },
      text_color: { $type: 'color', $value: '#000000' },
    })
  })

  it('recursively converts nested token names', () => {
    const input = {
      'text colors': {
        'primary color': { $type: 'color', $value: '#0000ff' },
        'secondary color': { $type: 'color', $value: '#ff0000' },
      },
    }
    const result = convertTokenNames(input, 'kebab')
    expect(result).toEqual({
      'text-colors': {
        'primary-color': { $type: 'color', $value: '#0000ff' },
        'secondary-color': { $type: 'color', $value: '#ff0000' },
      },
    })
  })

  it('handles deeply nested structures', () => {
    const input = {
      'component a': {
        'variant b': {
          'border top': { $type: 'dimension', $value: '2px' },
        },
      },
    }
    const result = convertTokenNames(input, 'kebab')
    expect(result).toEqual({
      'component-a': {
        'variant-b': {
          'border-top': { $type: 'dimension', $value: '2px' },
        },
      },
    })
  })

  it('preserves token values and types', () => {
    const input = {
      'border width': {
        $type: 'dimension',
        $value: '1px',
        description: 'Default border width',
      },
    }
    const result = convertTokenNames(input, 'kebab')
    expect(result).toEqual({
      'border-width': {
        $type: 'dimension',
        $value: '1px',
        description: 'Default border width',
      },
    })
  })

  it('handles legacy format tokens (type/value instead of $type/$value)', () => {
    const input = {
      'border top': { type: 'dimension', value: '1px' },
    }
    const result = convertTokenNames(input, 'kebab')
    expect(result).toEqual({
      'border-top': { type: 'dimension', value: '1px' },
    })
  })

  it('handles mixed token formats in same object', () => {
    const input = {
      'border top': { $type: 'dimension', $value: '1px' },
      'colors': {
        primary: { type: 'color', value: '#0000ff' },
      },
    }
    const result = convertTokenNames(input, 'kebab')
    expect(result).toEqual({
      'border-top': { $type: 'dimension', $value: '1px' },
      'colors': {
        primary: { type: 'color', value: '#0000ff' },
      },
    })
  })

  it('handles empty object', () => {
    const result = convertTokenNames({}, 'kebab')
    expect(result).toEqual({})
  })

  it('preserves array values', () => {
    const input = {
      'font family': {
        $type: 'fontFamily',
        $value: ['Helvetica', 'Arial', 'sans-serif'],
      },
    }
    const result = convertTokenNames(input, 'kebab')
    expect(result).toEqual({
      'font-family': {
        $type: 'fontFamily',
        $value: ['Helvetica', 'Arial', 'sans-serif'],
      },
    })
  })

  it('handles string values', () => {
    const input = {
      color: 'red',
    }
    const result = convertTokenNames(input, 'kebab')
    expect(result).toEqual({
      color: 'red',
    })
  })

  it('handles number values', () => {
    const input = {
      'z index': 100,
    }
    const result = convertTokenNames(input, 'kebab')
    expect(result).toEqual({
      'z-index': 100,
    })
  })

  it('handles boolean values', () => {
    const input = {
      'is enabled': true,
    }
    const result = convertTokenNames(input, 'kebab')
    expect(result).toEqual({
      'is-enabled': true,
    })
  })

  it('handles null values', () => {
    const input = {
      'empty value': null,
    }
    const result = convertTokenNames(input, 'kebab')
    expect(result).toEqual({
      'empty-value': null,
    })
  })

  it('handles mixed nested structures with primitives', () => {
    const input = {
      'theme config': {
        'version': 1,
        'is dark': true,
        'colors': {
          primary: { $type: 'color', $value: '#fff' },
        },
      },
    }
    const result = convertTokenNames(input, 'camel')
    expect(result.themeConfig).toBeDefined()
    expect((result.themeConfig as Record<string, unknown>).version).toBe(1)
    expect((result.themeConfig as Record<string, unknown>).isDark).toBe(true)
  })
})

describe('toCamelTokenName edge cases', () => {
  it('handles whitespace-only string', () => {
    // After trim(), this becomes empty string, split returns ['']
    expect(toCamelTokenName('   ')).toBe('')
  })

  it('handles tab characters', () => {
    expect(toCamelTokenName('border\ttop')).toBe('borderTop')
  })

  it('handles newline characters', () => {
    expect(toCamelTokenName('border\ntop')).toBe('borderTop')
  })

  it('handles mixed whitespace', () => {
    expect(toCamelTokenName('  border \t top \n left  ')).toBe('borderTopLeft')
  })
})

describe('toKebabTokenName edge cases', () => {
  it('handles whitespace-only string', () => {
    expect(toKebabTokenName('   ')).toBe('')
  })

  it('handles already lowercase', () => {
    expect(toKebabTokenName('already lowercase')).toBe('already-lowercase')
  })
})

describe('toSnakeTokenName edge cases', () => {
  it('handles whitespace-only string', () => {
    expect(toSnakeTokenName('   ')).toBe('')
  })

  it('handles ALLCAPS input', () => {
    expect(toSnakeTokenName('BORDER TOP')).toBe('border_top')
  })
})
