import { describe, expect, it } from 'vitest'
import { useTokenTransformer } from '../../app/composables/use-token-transformer'

describe('useTokenTransformer', () => {
  it('initializes with default state', () => {
    const transformer = useTokenTransformer()

    expect(transformer.tokens.value).toBeNull()
    expect(transformer.selectedFormats.value).toEqual([])
    expect(transformer.options.value).toEqual({})
    expect(transformer.preview.value).toBe('')
    expect(transformer.files.value).toEqual([])
    expect(transformer.loading.value).toBe(false)
    expect(transformer.error.value).toBeNull()
    expect(transformer.metadata.value).toBeNull()
    expect(transformer.detectedFormat.value).toBe('unknown')
  })

  it('computes isHeliumFormat correctly', () => {
    const transformer = useTokenTransformer()

    expect(transformer.isHeliumFormat.value).toBe(false)

    transformer.detectedFormat.value = 'helium'
    expect(transformer.isHeliumFormat.value).toBe(true)

    transformer.detectedFormat.value = 'dtcg'
    expect(transformer.isHeliumFormat.value).toBe(false)
  })

  it('exposes required methods', () => {
    const transformer = useTokenTransformer()

    expect(typeof transformer.transform).toBe('function')
    expect(typeof transformer.validateTokens).toBe('function')
    expect(typeof transformer.fetchFromUrl).toBe('function')
  })

  it('exposes all required state refs', () => {
    const transformer = useTokenTransformer()

    // Check that all state is reactive (has .value property)
    expect(transformer.tokens).toHaveProperty('value')
    expect(transformer.selectedFormats).toHaveProperty('value')
    expect(transformer.options).toHaveProperty('value')
    expect(transformer.preview).toHaveProperty('value')
    expect(transformer.files).toHaveProperty('value')
    expect(transformer.loading).toHaveProperty('value')
    expect(transformer.error).toHaveProperty('value')
    expect(transformer.metadata).toHaveProperty('value')
    expect(transformer.detectedFormat).toHaveProperty('value')
  })
})
