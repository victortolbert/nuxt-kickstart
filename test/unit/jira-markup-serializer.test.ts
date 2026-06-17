import type { JSONContent } from '@tiptap/core'
import { describe, expect, it } from 'vitest'
import { serializeToJira } from '../../lib/jira-markup-serializer'

describe('jira markup serializer', () => {
  describe('text marks', () => {
    it('converts bold text to *bold*', () => {
      const json: JSONContent = {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                marks: [{ type: 'bold' }],
                text: 'hello',
              },
            ],
          },
        ],
      }

      expect(serializeToJira(json)).toBe('*hello*')
    })

    it('converts italic text to _italic_', () => {
      const json: JSONContent = {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                marks: [{ type: 'italic' }],
                text: 'hello',
              },
            ],
          },
        ],
      }

      expect(serializeToJira(json)).toBe('_hello_')
    })

    it('converts strikethrough text to -strikethrough-', () => {
      const json: JSONContent = {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                marks: [{ type: 'strike' }],
                text: 'hello',
              },
            ],
          },
        ],
      }

      expect(serializeToJira(json)).toBe('-hello-')
    })

    it('converts code text to {{code}}', () => {
      const json: JSONContent = {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                marks: [{ type: 'code' }],
                text: 'hello',
              },
            ],
          },
        ],
      }

      expect(serializeToJira(json)).toBe('{{hello}}')
    })

    it('converts nested formatting (bold + italic)', () => {
      const json: JSONContent = {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                marks: [{ type: 'bold' }, { type: 'italic' }],
                text: 'hello',
              },
            ],
          },
        ],
      }

      expect(serializeToJira(json)).toBe('*_hello_*')
    })

    it('converts links to [text|url]', () => {
      const json: JSONContent = {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                marks: [{ type: 'link', attrs: { href: 'https://example.com' } }],
                text: 'click here',
              },
            ],
          },
        ],
      }

      expect(serializeToJira(json)).toBe('[click here|https://example.com]')
    })
  })

  describe('headings', () => {
    it('converts h1 heading', () => {
      const json: JSONContent = {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 1 },
            content: [{ type: 'text', text: 'Title' }],
          },
        ],
      }

      expect(serializeToJira(json)).toBe('h1. Title')
    })

    it('converts h2 heading', () => {
      const json: JSONContent = {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: 'Subtitle' }],
          },
        ],
      }

      expect(serializeToJira(json)).toBe('h2. Subtitle')
    })

    it('converts h3 heading', () => {
      const json: JSONContent = {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 3 },
            content: [{ type: 'text', text: 'Section' }],
          },
        ],
      }

      expect(serializeToJira(json)).toBe('h3. Section')
    })
  })

  describe('lists', () => {
    it('converts bullet list', () => {
      const json: JSONContent = {
        type: 'doc',
        content: [
          {
            type: 'bulletList',
            content: [
              {
                type: 'listItem',
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'First item' }],
                  },
                ],
              },
              {
                type: 'listItem',
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'Second item' }],
                  },
                ],
              },
            ],
          },
        ],
      }

      expect(serializeToJira(json)).toBe('* First item\n* Second item')
    })

    it('converts ordered list', () => {
      const json: JSONContent = {
        type: 'doc',
        content: [
          {
            type: 'orderedList',
            content: [
              {
                type: 'listItem',
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'First item' }],
                  },
                ],
              },
              {
                type: 'listItem',
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'Second item' }],
                  },
                ],
              },
            ],
          },
        ],
      }

      expect(serializeToJira(json)).toBe('# First item\n# Second item')
    })

    it('converts nested bullet lists', () => {
      const json: JSONContent = {
        type: 'doc',
        content: [
          {
            type: 'bulletList',
            content: [
              {
                type: 'listItem',
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'Parent' }],
                  },
                  {
                    type: 'bulletList',
                    content: [
                      {
                        type: 'listItem',
                        content: [
                          {
                            type: 'paragraph',
                            content: [{ type: 'text', text: 'Child' }],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      }

      expect(serializeToJira(json)).toBe('* Parent\n** Child')
    })
  })

  describe('blockquote', () => {
    it('converts blockquote to {quote}...{quote}', () => {
      const json: JSONContent = {
        type: 'doc',
        content: [
          {
            type: 'blockquote',
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'This is a quote' }],
              },
            ],
          },
        ],
      }

      expect(serializeToJira(json)).toBe('{quote}\nThis is a quote\n{quote}')
    })
  })

  describe('code blocks', () => {
    it('converts code block without language', () => {
      const json: JSONContent = {
        type: 'doc',
        content: [
          {
            type: 'codeBlock',
            content: [{ type: 'text', text: 'const x = 1;' }],
          },
        ],
      }

      expect(serializeToJira(json)).toBe('{code}\nconst x = 1;\n{code}')
    })

    it('converts code block with language', () => {
      const json: JSONContent = {
        type: 'doc',
        content: [
          {
            type: 'codeBlock',
            attrs: { language: 'javascript' },
            content: [{ type: 'text', text: 'const x = 1;' }],
          },
        ],
      }

      expect(serializeToJira(json)).toBe('{code:javascript}\nconst x = 1;\n{code}')
    })
  })

  describe('images', () => {
    it('converts image to !url!', () => {
      const json: JSONContent = {
        type: 'doc',
        content: [
          {
            type: 'image',
            attrs: { src: 'https://example.com/image.png' },
          },
        ],
      }

      expect(serializeToJira(json)).toBe('!https://example.com/image.png!')
    })

    it('converts image with alt text to !url|alt=text!', () => {
      const json: JSONContent = {
        type: 'doc',
        content: [
          {
            type: 'image',
            attrs: { src: 'https://example.com/image.png', alt: 'Sample image' },
          },
        ],
      }

      expect(serializeToJira(json)).toBe('!https://example.com/image.png|alt=Sample image!')
    })
  })

  describe('complex documents', () => {
    it('converts document with mixed content', () => {
      const json: JSONContent = {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 1 },
            content: [{ type: 'text', text: 'My Document' }],
          },
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'This is ' },
              { type: 'text', marks: [{ type: 'bold' }], text: 'bold' },
              { type: 'text', text: ' and ' },
              { type: 'text', marks: [{ type: 'italic' }], text: 'italic' },
              { type: 'text', text: ' text.' },
            ],
          },
          {
            type: 'bulletList',
            content: [
              {
                type: 'listItem',
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'Item 1' }],
                  },
                ],
              },
            ],
          },
        ],
      }

      expect(serializeToJira(json)).toBe(
        'h1. My Document\n\nThis is *bold* and _italic_ text.\n\n* Item 1',
      )
    })
  })

  describe('edge cases', () => {
    it('handles empty document', () => {
      const json: JSONContent = {
        type: 'doc',
        content: [],
      }

      expect(serializeToJira(json)).toBe('')
    })

    it('handles document without content property', () => {
      const json: JSONContent = {
        type: 'doc',
      }

      expect(serializeToJira(json)).toBe('')
    })

    it('handles null/undefined node gracefully', () => {
      // @ts-expect-error Testing null input
      expect(serializeToJira(null)).toBe('')
    })

    it('handles horizontal rule', () => {
      const json: JSONContent = {
        type: 'doc',
        content: [
          { type: 'paragraph', content: [{ type: 'text', text: 'Before' }] },
          { type: 'horizontalRule' },
          { type: 'paragraph', content: [{ type: 'text', text: 'After' }] },
        ],
      }

      expect(serializeToJira(json)).toBe('Before\n\n----\n\nAfter')
    })

    it('handles hard break', () => {
      const json: JSONContent = {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'Line 1' },
              { type: 'hardBreak' },
              { type: 'text', text: 'Line 2' },
            ],
          },
        ],
      }

      expect(serializeToJira(json)).toBe('Line 1\nLine 2')
    })

    it('handles unknown node type by serializing children', () => {
      const json: JSONContent = {
        type: 'doc',
        content: [
          {
            type: 'unknownType',
            content: [{ type: 'text', text: 'child text' }],
          },
        ],
      }

      expect(serializeToJira(json)).toBe('child text')
    })

    it('handles text node without text property', () => {
      const json: JSONContent = {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text' }],
          },
        ],
      }

      expect(serializeToJira(json)).toBe('')
    })

    it('handles text node with empty marks array', () => {
      const json: JSONContent = {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                marks: [],
                text: 'plain text',
              },
            ],
          },
        ],
      }

      expect(serializeToJira(json)).toBe('plain text')
    })

    it('handles link without href attribute', () => {
      const json: JSONContent = {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                marks: [{ type: 'link' }],
                text: 'link text',
              },
            ],
          },
        ],
      }

      expect(serializeToJira(json)).toBe('link text')
    })

    it('handles link with empty href', () => {
      const json: JSONContent = {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                marks: [{ type: 'link', attrs: { href: '' } }],
                text: 'link text',
              },
            ],
          },
        ],
      }

      expect(serializeToJira(json)).toBe('link text')
    })

    it('handles empty paragraph', () => {
      const json: JSONContent = {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [],
          },
        ],
      }

      expect(serializeToJira(json)).toBe('')
    })

    it('handles heading without level attribute (defaults to 1)', () => {
      const json: JSONContent = {
        type: 'doc',
        content: [
          {
            type: 'heading',
            content: [{ type: 'text', text: 'No Level' }],
          },
        ],
      }

      expect(serializeToJira(json)).toBe('h1. No Level')
    })

    it('caps heading level at 6', () => {
      const json: JSONContent = {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 10 },
            content: [{ type: 'text', text: 'Deep Heading' }],
          },
        ],
      }

      expect(serializeToJira(json)).toBe('h6. Deep Heading')
    })

    it('handles empty list item', () => {
      const json: JSONContent = {
        type: 'doc',
        content: [
          {
            type: 'bulletList',
            content: [
              {
                type: 'listItem',
                content: [],
              },
            ],
          },
        ],
      }

      expect(serializeToJira(json)).toBe('')
    })

    it('handles list item without content property', () => {
      const json: JSONContent = {
        type: 'doc',
        content: [
          {
            type: 'bulletList',
            content: [
              {
                type: 'listItem',
              },
            ],
          },
        ],
      }

      expect(serializeToJira(json)).toBe('')
    })

    it('handles code block with empty language string', () => {
      const json: JSONContent = {
        type: 'doc',
        content: [
          {
            type: 'codeBlock',
            attrs: { language: '' },
            content: [{ type: 'text', text: 'code' }],
          },
        ],
      }

      expect(serializeToJira(json)).toBe('{code}\ncode\n{code}')
    })

    it('handles image without src', () => {
      const json: JSONContent = {
        type: 'doc',
        content: [
          {
            type: 'image',
            attrs: {},
          },
        ],
      }

      expect(serializeToJira(json)).toBe('')
    })

    it('handles image with empty src', () => {
      const json: JSONContent = {
        type: 'doc',
        content: [
          {
            type: 'image',
            attrs: { src: '' },
          },
        ],
      }

      expect(serializeToJira(json)).toBe('')
    })

    it('handles unknown mark type (ignores it)', () => {
      const json: JSONContent = {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                marks: [{ type: 'underline' }],
                text: 'underlined',
              },
            ],
          },
        ],
      }

      expect(serializeToJira(json)).toBe('underlined')
    })

    it('handles deeply nested ordered lists', () => {
      const json: JSONContent = {
        type: 'doc',
        content: [
          {
            type: 'orderedList',
            content: [
              {
                type: 'listItem',
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'Level 1' }],
                  },
                  {
                    type: 'orderedList',
                    content: [
                      {
                        type: 'listItem',
                        content: [
                          {
                            type: 'paragraph',
                            content: [{ type: 'text', text: 'Level 2' }],
                          },
                          {
                            type: 'orderedList',
                            content: [
                              {
                                type: 'listItem',
                                content: [
                                  {
                                    type: 'paragraph',
                                    content: [{ type: 'text', text: 'Level 3' }],
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      }

      expect(serializeToJira(json)).toBe('# Level 1\n## Level 2\n### Level 3')
    })

    it('handles list item with multiple children', () => {
      const json: JSONContent = {
        type: 'doc',
        content: [
          {
            type: 'bulletList',
            content: [
              {
                type: 'listItem',
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'First paragraph' }],
                  },
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'Second paragraph' }],
                  },
                ],
              },
            ],
          },
        ],
      }

      const result = serializeToJira(json)
      expect(result).toContain('First paragraph')
      expect(result).toContain('Second paragraph')
    })
  })
})
