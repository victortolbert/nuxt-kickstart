import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import LanguageSwitcher from '~/components/language-switcher.vue'

describe('languageSwitcher', () => {
  it('renders without errors', async () => {
    const component = await mountSuspended(LanguageSwitcher)
    expect(component.exists()).toBe(true)
  })

  it('displays a trigger button', async () => {
    const component = await mountSuspended(LanguageSwitcher)
    const button = component.find('button')
    expect(button.exists()).toBe(true)
  })

  it('has accessible label', async () => {
    const component = await mountSuspended(LanguageSwitcher)
    const button = component.find('button')
    // Button should have aria-label or visible text
    const hasLabel = button.attributes('aria-label')
      || button.text().length > 0
      || button.find('[class*="sr-only"]').exists()
    expect(hasLabel).toBeTruthy()
  })

  it('shows language icon', async () => {
    const component = await mountSuspended(LanguageSwitcher)
    // Should have an icon element
    const hasIcon = component.find('[class*="i-tabler"]').exists()
      || component.find('svg').exists()
      || component.find('[class*="icon"]').exists()
    expect(hasIcon).toBeTruthy()
  })
})
