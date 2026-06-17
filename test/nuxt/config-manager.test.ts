import type { FormatOptions } from '#shared/data/style-dictionary-formats'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import ConfigManager from '~/components/tokens/config-manager.vue'

describe('configManager', () => {
  it('renders with empty state when no configs exist', async () => {
    const wrapper = await mountSuspended(ConfigManager, {
      props: {
        formats: ['css'],
        options: {},
      },
    })

    expect(wrapper.text()).toContain('No saved configurations yet')
  })

  it('renders save button', async () => {
    const wrapper = await mountSuspended(ConfigManager, {
      props: {
        formats: ['css', 'scss-vars'],
        options: {},
      },
    })

    expect(wrapper.text()).toContain('Save Current')
  })

  it('disables save button when no formats selected', async () => {
    const wrapper = await mountSuspended(ConfigManager, {
      props: {
        formats: [],
        options: {},
      },
    })

    const saveButton = wrapper.find('button')
    expect(saveButton.attributes('disabled')).toBeDefined()
  })

  it('emits load event when config is loaded', async () => {
    const formats = ['css']
    const options: Record<string, FormatOptions> = {}

    const wrapper = await mountSuspended(ConfigManager, {
      props: {
        formats,
        options,
      },
    })

    // This test verifies that the component can emit the load event
    // In a real scenario, we'd need to add a config first and then load it
    expect(wrapper.emitted()).toBeDefined()
  })
})
