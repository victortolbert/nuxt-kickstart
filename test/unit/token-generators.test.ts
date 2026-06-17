import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { beforeAll, describe, expect, it } from 'vitest'

/**
 * Characterization snapshots for the token transform generators.
 *
 * These lock the exact output of every export format BEFORE the generators
 * were extracted out of the endpoint and de-duplicated. The snapshots are the
 * safety net: the extraction/dedup refactor must keep them byte-identical.
 */

const FORMATS = [
  'css',
  'css-components',
  'helium-css',
  'scss-vars',
  'scss-map',
  'tailwind',
  'js-esm',
  'ts',
  'json-flat',
  'json-nested',
  'ios-swift',
  'android-xml',
  'android-compose',
] as const

const DTCG = JSON.parse(
  readFileSync(resolve(__dirname, '../../shared/data/example-tokens/tokens-dtcg.json'), 'utf-8'),
)
const HELIUM = JSON.parse(
  readFileSync(resolve(__dirname, '../../shared/data/example-tokens/tokens-helium.json'), 'utf-8'),
)

// helium-css embeds a generation timestamp — normalize it so snapshots are stable
function stable(content: string): string {
  return content.replace(/AUTO GENERATED ON .*/g, 'AUTO GENERATED ON <timestamp>')
}

let transformTokens: (
  tokens: Record<string, any>,
  formatId: string,
  options?: Record<string, any>,
  metadata?: { brand?: string, franchise?: string },
) => { filename: string, content: string, format: string }

beforeAll(async () => {
  const mod = await import('../../server/utils/token-generators')
  transformTokens = mod.transformTokens
})

describe('token generators — DTCG input', () => {
  for (const format of FORMATS) {
    it(`generates ${format}`, () => {
      const result = transformTokens(DTCG, format, {})
      expect({
        filename: result.filename,
        format: result.format,
        content: stable(result.content),
      }).toMatchSnapshot()
    })
  }
})

describe('token generators — Helium input', () => {
  const metadata = { brand: 'acme', franchise: 'retail' }
  for (const format of FORMATS) {
    it(`generates ${format}`, () => {
      const result = transformTokens(HELIUM, format, {}, metadata)
      expect({
        filename: result.filename,
        format: result.format,
        content: stable(result.content),
      }).toMatchSnapshot()
    })
  }
})

// Exercises formatTokenValue's complex-value branches (typography / shadow /
// border) — shared by css/scss/helium-css, which the dedup touches.
const COMPLEX = {
  tokens: {
    components: {
      card: {
        default: {
          heading: { $type: 'typography', $value: { fontFamily: 'Inter', fontSize: '24px', fontWeight: 700, lineHeight: '1.2' } },
          elevation: { $type: 'shadow', $value: { offsetX: '0px', offsetY: '2px', blur: '4px', spread: '0px', color: 'rgba(0,0,0,0.1)' } },
          outline: { $type: 'border', $value: { width: '1px', style: 'solid', color: '#cccccc' } },
        },
      },
    },
  },
}

describe('token generators — complex values (typography/shadow/border)', () => {
  for (const format of ['css', 'scss-vars', 'helium-css'] as const) {
    it(`formats complex values for ${format}`, () => {
      const result = transformTokens(COMPLEX, format, {})
      expect(stable(result.content)).toMatchSnapshot()
    })
  }
})

describe('token generators — contract', () => {
  it('throws on an unsupported format', () => {
    expect(() => transformTokens(DTCG, 'nonsense', {})).toThrow(/Unsupported format/)
  })

  it('applies Helium brand/franchise filename for helium-css with metadata', () => {
    const result = transformTokens(HELIUM, 'helium-css', {}, { brand: 'Acme Co', franchise: 'Retail X' })
    expect(result.filename).toBe('tokens-acme-co-retail-x.css')
  })
})
