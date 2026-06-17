import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import TokensHistoryPanel from '../../app/components/tokens/history-panel.vue'

describe('tokensHistoryPanel', () => {
  it('renders with title', async () => {
    const wrapper = await mountSuspended(TokensHistoryPanel)
    expect(wrapper.text()).toContain('Transformation History')
  })

  it('shows empty state when no history', async () => {
    const wrapper = await mountSuspended(TokensHistoryPanel)
    // The collapse trigger is a disclosure button (heading-wrapped), not the header div
    const toggle = wrapper.find('.panel-header button')
    await toggle.trigger('click')
    expect(wrapper.text()).toContain('No transformation history yet')
  })

  it('is collapsible', async () => {
    const wrapper = await mountSuspended(TokensHistoryPanel)
    const toggle = wrapper.find('.panel-header button')

    // Initially closed
    expect(wrapper.find('.panel-content').exists()).toBe(false)
    expect(toggle.attributes('aria-expanded')).toBe('false')

    // Click to open
    await toggle.trigger('click')
    expect(wrapper.find('.panel-content').exists()).toBe(true)
    expect(toggle.attributes('aria-expanded')).toBe('true')

    // Click to close
    await toggle.trigger('click')
    expect(wrapper.find('.panel-content').exists()).toBe(false)
    expect(toggle.attributes('aria-expanded')).toBe('false')
  })
})
