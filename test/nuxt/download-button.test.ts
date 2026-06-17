import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import DownloadButton from '~/components/tokens/download-button.vue'

describe('download-button', () => {
  it('renders with correct text for single file', () => {
    const files = [
      { filename: 'tokens.css', content: ':root { --color: blue; }', format: 'css' },
    ]
    const wrapper = mount(DownloadButton, {
      props: { files },
    })

    expect(wrapper.text()).toContain('Download')
  })

  it('renders with correct text for multiple files', () => {
    const files = [
      { filename: 'tokens.css', content: ':root { --color: blue; }', format: 'css' },
      { filename: 'tokens.scss', content: '$color: blue;', format: 'scss' },
    ]
    const wrapper = mount(DownloadButton, {
      props: { files },
    })

    expect(wrapper.text()).toContain('Download 2 Files')
  })

  it('is disabled when no files provided', () => {
    const wrapper = mount(DownloadButton, {
      props: { files: [] },
    })

    const button = wrapper.find('button')
    expect(button.attributes('disabled')).toBeDefined()
  })

  it('is disabled when disabled prop is true', () => {
    const files = [
      { filename: 'tokens.css', content: ':root { --color: blue; }', format: 'css' },
    ]
    const wrapper = mount(DownloadButton, {
      props: { files, disabled: true },
    })

    const button = wrapper.find('button')
    expect(button.attributes('disabled')).toBeDefined()
  })

  it('calls download handler when clicked', async () => {
    const files = [
      { filename: 'tokens.css', content: ':root { --color: blue; }', format: 'css' },
    ]

    // Mock URL and DOM methods
    globalThis.URL.createObjectURL = vi.fn(() => 'blob:mock-url')
    globalThis.URL.revokeObjectURL = vi.fn()

    const wrapper = mount(DownloadButton, {
      props: { files },
    })

    await wrapper.find('button').trigger('click')

    // Wait for async operation
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(globalThis.URL.createObjectURL).toHaveBeenCalled()
  })
})
