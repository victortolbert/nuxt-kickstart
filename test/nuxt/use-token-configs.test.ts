import type { FormatOptions } from '#shared/data/style-dictionary-formats'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useTokenConfigs } from '~/composables/use-token-configs'

describe('useTokenConfigs', () => {
  beforeEach(() => {
    // Reset composable state before each test
    const { _resetState } = useTokenConfigs()
    _resetState()
    vi.clearAllMocks()
  })

  it('initializes with empty configs', () => {
    const { configs } = useTokenConfigs()
    expect(configs.value).toEqual([])
  })

  it('adds a new config', () => {
    const { configs, addConfig } = useTokenConfigs()

    const formats = ['css', 'scss-vars']
    const options: Record<string, FormatOptions> = {
      css: { prefix: 'token', outputReferences: true },
    }

    addConfig('My Config', formats, options)

    expect(configs.value).toHaveLength(1)
    const firstConfig = configs.value[0]
    expect(firstConfig).toBeDefined()
    expect(firstConfig).toMatchObject({
      name: 'My Config',
      formats,
    })
    expect(firstConfig?.id).toBeDefined()
    expect(firstConfig?.createdAt).toBeGreaterThan(0)
  })

  it('deletes a config by id', () => {
    const { configs, addConfig, deleteConfig } = useTokenConfigs()

    addConfig('Config 1', ['css'], {})
    addConfig('Config 2', ['scss-vars'], {})

    // Configs are added newest first, so array is ['Config 2', 'Config 1']
    const firstConfig = configs.value[0]
    expect(firstConfig).toBeDefined()
    expect(firstConfig?.name).toBe('Config 2')

    const idToDelete = firstConfig!.id
    deleteConfig(idToDelete)

    expect(configs.value).toHaveLength(1)
    expect(configs.value[0]?.name).toBe('Config 1')
  })

  it('retrieves a config by id', () => {
    const { configs, addConfig, getConfig } = useTokenConfigs()

    addConfig('Test Config', ['css'], {})
    const firstConfig = configs.value[0]
    expect(firstConfig).toBeDefined()
    const configId = firstConfig!.id

    const retrieved = getConfig(configId)
    expect(retrieved).toBeDefined()
    expect(retrieved?.name).toBe('Test Config')
  })

  it('clears all configs', () => {
    const { configs, addConfig, clearConfigs } = useTokenConfigs()

    addConfig('Config 1', ['css'], {})
    addConfig('Config 2', ['scss-vars'], {})

    expect(configs.value).toHaveLength(2)

    clearConfigs()

    expect(configs.value).toHaveLength(0)
  })

  it('enforces max 10 configs limit', () => {
    const { configs, addConfig } = useTokenConfigs()

    // Add 12 configs
    for (let i = 1; i <= 12; i++) {
      addConfig(`Config ${i}`, ['css'], {})
    }

    // Should only keep the 10 most recent
    expect(configs.value).toHaveLength(10)
    expect(configs.value[0]?.name).toBe('Config 12')
    expect(configs.value[9]?.name).toBe('Config 3')
  })

  it('deep clones formats and options when adding', () => {
    const { configs, addConfig } = useTokenConfigs()

    const formats = ['css']
    const options: Record<string, FormatOptions> = {
      css: { prefix: 'token', outputReferences: true },
    }

    addConfig('Test', formats, options)

    // Modify original arrays/objects
    formats.push('scss-vars')
    if (options.css) {
      options.css.prefix = 'modified'
    }

    // Config should not be affected
    const firstConfig = configs.value[0]
    expect(firstConfig).toBeDefined()
    expect(firstConfig?.formats).toEqual(['css'])
    expect(firstConfig?.options.css?.prefix).toBe('token')
  })
})
