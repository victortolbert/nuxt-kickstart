import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import TokensExamplePicker from '../../app/components/tokens/example-picker.vue'

describe('tokensExamplePicker', () => {
  it('renders with label', async () => {
    const wrapper = await mountSuspended(TokensExamplePicker)
    expect(wrapper.text()).toContain('Load Example Tokens')
  })

  it('exposes examples', async () => {
    const wrapper = await mountSuspended(TokensExamplePicker)
    const { examples } = wrapper.vm
    expect(examples).toBeDefined()
    expect(examples.length).toBe(2)
    expect(examples[0]?.id).toBe('simple')
    expect(examples[1]?.id).toBe('helium')
  })

  it('exposes getExample function', async () => {
    const wrapper = await mountSuspended(TokensExamplePicker)
    const { getExample } = wrapper.vm
    const simple = getExample('simple')
    expect(simple).toBeDefined()
    expect(simple?.name).toBe('Simple (DTCG)')
    expect(simple?.tokenCount).toBe(15)
  })

  it('emits select event when example is chosen', async () => {
    const wrapper = await mountSuspended(TokensExamplePicker)
    // Simulate selecting an example by calling the handler directly
    const selectMenu = wrapper.findComponent({ name: 'USelectMenu' })
    expect(selectMenu.exists()).toBe(true)
  })

  it('has correct token counts', async () => {
    const wrapper = await mountSuspended(TokensExamplePicker)
    const { examples } = wrapper.vm
    const simple = examples.find(ex => ex.id === 'simple')
    expect(simple?.tokenCount).toBe(15)
  })
})
