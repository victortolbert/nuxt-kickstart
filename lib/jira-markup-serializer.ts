/**
 * Jira Markup Serializer
 *
 * Converts TipTap JSON content to Jira wiki markup format.
 *
 * @example
 * ```ts
 * import { serializeToJira } from './jira-markup-serializer'
 *
 * const json = {
 *   type: 'doc',
 *   content: [
 *     { type: 'paragraph', content: [{ type: 'text', text: 'Hello world' }] }
 *   ]
 * }
 *
 * const jira = serializeToJira(json) // Returns: 'Hello world'
 * ```
 */

import type { JSONContent } from '@tiptap/core'

interface SerializerContext {
  listDepth: number
  listType: 'bullet' | 'ordered' | null
  inListItem: boolean
}

/**
 * Serialize TipTap JSON content to Jira wiki markup
 */
export function serializeToJira(json: JSONContent): string {
  const context: SerializerContext = {
    listDepth: 0,
    listType: null,
    inListItem: false,
  }

  return serializeNode(json, context).trim()
}

function serializeNode(node: JSONContent, context: SerializerContext): string {
  if (!node) return ''

  // Handle text nodes with marks
  if (node.type === 'text') {
    return serializeTextWithMarks(node, context)
  }

  // Handle block nodes
  switch (node.type) {
    case 'doc':
      return serializeChildren(node, context)

    case 'paragraph':
      return serializeParagraph(node, context)

    case 'heading':
      return serializeHeading(node, context)

    case 'bulletList':
      return serializeList(node, context, 'bullet')

    case 'orderedList':
      return serializeList(node, context, 'ordered')

    case 'listItem':
      return serializeListItem(node, context)

    case 'blockquote':
      return serializeBlockquote(node, context)

    case 'codeBlock':
      return serializeCodeBlock(node, context)

    case 'horizontalRule':
      return '----\n\n'

    case 'hardBreak':
      return '\n'

    case 'image':
      return serializeImage(node)

    default:
      // Unknown node type, serialize children if any
      return serializeChildren(node, context)
  }
}

function serializeTextWithMarks(node: JSONContent, _context: SerializerContext): string {
  let text = node.text || ''

  if (!node.marks || node.marks.length === 0) {
    return text
  }

  // Apply marks in reverse order for proper nesting
  // (innermost mark is applied first)
  const marks = [...node.marks].reverse()

  for (const mark of marks) {
    switch (mark.type) {
      case 'bold':
        text = `*${text}*`
        break

      case 'italic':
        text = `_${text}_`
        break

      case 'strike':
        text = `-${text}-`
        break

      case 'code':
        text = `{{${text}}}`
        break

      case 'link':
        if (mark.attrs?.href) {
          text = `[${text}|${mark.attrs.href}]`
        }
        break
    }
  }

  return text
}

function serializeParagraph(node: JSONContent, context: SerializerContext): string {
  const content = serializeChildren(node, context)

  // In list items, don't add double newlines (list item handles spacing)
  if (context.inListItem) {
    return content
  }

  return content ? `${content}\n\n` : ''
}

function serializeHeading(node: JSONContent, context: SerializerContext): string {
  const level = node.attrs?.level || 1
  const content = serializeChildren(node, context)
  const prefix = `h${Math.min(level, 6)}.`
  return `${prefix} ${content}\n\n`
}

function serializeList(
  node: JSONContent,
  context: SerializerContext,
  listType: 'bullet' | 'ordered',
): string {
  const prevListType = context.listType
  const prevDepth = context.listDepth

  context.listType = listType
  context.listDepth = prevDepth + 1

  const content = serializeChildren(node, context)

  context.listType = prevListType
  context.listDepth = prevDepth

  return content
}

function serializeListItem(node: JSONContent, context: SerializerContext): string {
  const prefix = context.listType === 'ordered' ? '#' : '*'
  const indent = prefix.repeat(context.listDepth)

  // Mark that we're inside a list item to prevent paragraph double newlines
  const prevInListItem = context.inListItem
  context.inListItem = true

  // Serialize each child and join with newlines for nested lists
  const parts: string[] = []
  if (node.content) {
    for (const child of node.content) {
      const part = serializeNode(child, context)
      if (part) {
        parts.push(part.trimEnd())
      }
    }
  }

  context.inListItem = prevInListItem

  // Join parts - first part goes on same line as bullet, rest on new lines
  if (parts.length === 0) return ''
  if (parts.length === 1) return `${indent} ${parts[0]}\n`

  const [first, ...rest] = parts
  return `${indent} ${first}\n${rest.join('\n')}\n`
}

function serializeBlockquote(node: JSONContent, context: SerializerContext): string {
  const content = serializeChildren(node, context).trim()
  return `{quote}\n${content}\n{quote}\n\n`
}

function serializeCodeBlock(node: JSONContent, context: SerializerContext): string {
  const language = node.attrs?.language || ''
  const content = serializeChildren(node, context).trim()

  if (language) {
    return `{code:${language}}\n${content}\n{code}\n\n`
  }

  return `{code}\n${content}\n{code}\n\n`
}

function serializeImage(node: JSONContent): string {
  const src = node.attrs?.src || ''
  const alt = node.attrs?.alt || ''

  if (!src) return ''

  // Jira image syntax: !url! or !url|alt!
  if (alt) {
    return `!${src}|alt=${alt}!`
  }

  return `!${src}!`
}

function serializeChildren(node: JSONContent, context: SerializerContext): string {
  if (!node.content || node.content.length === 0) {
    return ''
  }

  return node.content
    .map(child => serializeNode(child, context))
    .join('')
}
