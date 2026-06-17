import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import TokenTree from '~/components/tokens/token-tree.vue'

describe('tokenTree', () => {
  const sampleTokens = {
    color: {
      primary: {
        500: {
          $type: 'color',
          $value: '#3b82f6',
        },
      },
    },
    spacing: {
      sm: {
        $type: 'dimension',
        $value: '0.5rem',
      },
    },
  }

  it('renders the component', async () => {
    const component = await mountSuspended(TokenTree, {
      props: {
        tokens: sampleTokens,
      },
    })

    // Component should render
    expect(component.exists()).toBe(true)
    expect(component.find('.token-tree').exists()).toBe(true)
  })

  it('shows correct token count', async () => {
    const component = await mountSuspended(TokenTree, {
      props: {
        tokens: sampleTokens,
      },
    })

    // Should count leaf tokens (primary.500 and sm = 2 tokens)
    expect(component.html()).toContain('2 tokens')
  })

  it('shows search input', async () => {
    const component = await mountSuspended(TokenTree, {
      props: {
        tokens: sampleTokens,
      },
    })

    expect(component.html()).toContain('Search tokens')
  })

  it('shows expand/collapse controls', async () => {
    const component = await mountSuspended(TokenTree, {
      props: {
        tokens: sampleTokens,
      },
    })

    expect(component.html()).toContain('Expand All')
    expect(component.html()).toContain('Collapse All')
  })

  it('handles empty tokens', async () => {
    const component = await mountSuspended(TokenTree, {
      props: {
        tokens: {},
      },
    })

    expect(component.html()).toContain('No tokens found')
    expect(component.html()).toContain('0 tokens')
  })

  it('initializes with expanded state', async () => {
    const component = await mountSuspended(TokenTree, {
      props: {
        tokens: sampleTokens,
        expanded: true,
      },
    })

    // Component should render with expanded state
    expect(component.props('expanded')).toBe(true)
  })
})
