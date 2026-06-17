import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import DefaultLayout from '~/layouts/default.vue'

describe('defaultLayout', () => {
  it('renders without errors', async () => {
    const component = await mountSuspended(DefaultLayout, {
      slots: {
        default: '<div>Test content</div>',
      },
    })
    expect(component.exists()).toBe(true)
  })

  it('includes LanguageSwitcher component', async () => {
    const component = await mountSuspended(DefaultLayout, {
      slots: {
        default: '<div>Test content</div>',
      },
    })
    // LanguageSwitcher should be present somewhere in the layout
    const languageSwitcher = component.findComponent({ name: 'LanguageSwitcher' })
    expect(languageSwitcher.exists()).toBe(true)
  })

  it('has LanguageSwitcher for both mobile and desktop', async () => {
    const component = await mountSuspended(DefaultLayout, {
      slots: {
        default: '<div>Test content</div>',
      },
    })
    // Should have at least 2 LanguageSwitcher instances (mobile + desktop)
    const languageSwitchers = component.findAllComponents({ name: 'LanguageSwitcher' })
    expect(languageSwitchers.length).toBeGreaterThanOrEqual(2)
  })
})
