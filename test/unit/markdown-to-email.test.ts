import { describe, expect, it } from 'vitest'
import { renderMarkdownToEmailHtml } from '../../server/utils/markdown-to-email'

describe('renderMarkdownToEmailHtml', () => {
  it('converts basic markdown to HTML with inline styles', () => {
    const markdown = '# Hello World\n\nThis is a **bold** paragraph.'
    const html = renderMarkdownToEmailHtml(markdown)

    expect(html).toContain('<h1')
    expect(html).toContain('style=')
    expect(html).toContain('Hello World')
    expect(html).toContain('<strong')
    expect(html).toContain('bold')
  })

  it('handles lists with inline styles', () => {
    const markdown = '- Item 1\n- Item 2\n- Item 3'
    const html = renderMarkdownToEmailHtml(markdown)

    expect(html).toContain('<ul')
    expect(html).toContain('<li')
    expect(html).toContain('style=')
    expect(html).toContain('Item 1')
  })

  it('handles links with inline styles', () => {
    const markdown = '[Click here](https://example.com)'
    const html = renderMarkdownToEmailHtml(markdown)

    expect(html).toContain('<a')
    expect(html).toContain('href="https://example.com"')
    expect(html).toContain('style=')
    expect(html).toContain('Click here')
  })

  it('handles code blocks with inline styles', () => {
    const markdown = 'Here is `inline code` in text.'
    const html = renderMarkdownToEmailHtml(markdown)

    expect(html).toContain('<code')
    expect(html).toContain('style=')
    expect(html).toContain('inline code')
  })

  it('handles blockquotes with inline styles', () => {
    const markdown = '> This is a quote'
    const html = renderMarkdownToEmailHtml(markdown)

    expect(html).toContain('<blockquote')
    expect(html).toContain('style=')
    expect(html).toContain('This is a quote')
  })

  it('handles multiple heading levels', () => {
    const markdown = '# H1\n## H2\n### H3'
    const html = renderMarkdownToEmailHtml(markdown)

    expect(html).toContain('<h1')
    expect(html).toContain('<h2')
    expect(html).toContain('<h3')
    expect(html).toMatch(/style="[^"]*font-size: 28px[^"]*"/)
    expect(html).toMatch(/style="[^"]*font-size: 24px[^"]*"/)
    expect(html).toMatch(/style="[^"]*font-size: 20px[^"]*"/)
  })
})
