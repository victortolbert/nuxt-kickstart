import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import TranslationDisclaimer from '../../app/components/translation-disclaimer.vue'

describe('translation-disclaimer component', () => {
  it('renders without errors', async () => {
    const wrapper = await mountSuspended(TranslationDisclaimer, {
      props: {
        isFallback: true,
        isMachineTranslated: false,
      },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('shows when isFallback is true', async () => {
    const wrapper = await mountSuspended(TranslationDisclaimer, {
      props: {
        isFallback: true,
        isMachineTranslated: false,
      },
    })
    // Component should be visible
    expect(wrapper.isVisible()).toBe(true)
  })

  it('shows when isMachineTranslated is true', async () => {
    const wrapper = await mountSuspended(TranslationDisclaimer, {
      props: {
        isFallback: false,
        isMachineTranslated: true,
      },
    })
    // Component should be visible
    expect(wrapper.isVisible()).toBe(true)
  })

  it('has contribution link when provided', async () => {
    const wrapper = await mountSuspended(TranslationDisclaimer, {
      props: {
        isFallback: true,
        isMachineTranslated: false,
        contributionUrl: 'https://github.com/example/repo',
      },
    })
    // Should contain link
    const link = wrapper.find('a[href="https://github.com/example/repo"]')
    expect(link.exists()).toBe(true)
  })
})
