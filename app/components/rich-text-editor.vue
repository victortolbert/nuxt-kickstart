/**
 * RichTextEditor - A WYSIWYG rich text editor component wrapping Nuxt UI's UEditor (TipTap-based)
 *
 * Supports multiple output formats (Markdown, HTML, JSON, Jira markup) with optional raw mode toggle.
 * Includes paste handling from Word/Google Docs and clipboard images (converted to base64).
 *
 * @component
 *
 * @prop {string} modelValue - Content string in the format specified by contentType
 * @prop {'markdown' | 'html' | 'json' | 'jira'} [contentType='markdown'] - Output format for content
 * @prop {string} [placeholder=''] - Placeholder text shown when editor is empty
 * @prop {string} [minHeight='200px'] - Minimum height CSS value for the editor
 * @prop {boolean} [toolbar=true] - Show/hide the formatting toolbar
 * @prop {boolean} [showRawToggle=false] - Enable toggle button to switch between WYSIWYG and raw view
 *
 * @emits update:modelValue - Emitted when content changes, returns content in specified format
 *
 * @example
 * // Basic Markdown editor
 * <RichTextEditor v-model="content" />

 *
 * @example
 * // HTML output with custom height
 * <RichTextEditor v-model="htmlContent" content-type="html" min-height="400px" />

 *
 * @example
 * // Jira markup with raw toggle for power users
 * <RichTextEditor v-model="jiraContent" content-type="jira" :show-raw-toggle="true" />

 *
 * @example
 * // Minimal editor (no toolbar) for short descriptions
 * <RichTextEditor v-model="description" :toolbar="false" min-height="100px" />

 *
 * @example
 * // JSON output for storing editor state
 * <RichTextEditor v-model="jsonContent" content-type="json" />

 *
 * @remarks
 * Paste behavior:
 * - Rich text from Word/Google Docs preserves: bold, italic, headings, lists, links
 * - Unsupported formatting (colors, fonts) is automatically stripped
 * - Images pasted from clipboard are embedded as base64 data URLs
 * - StarterKit handles standard paste scenarios; custom handlePaste handles clipboard images
 */
<template>
  <div class="rich-text-editor">
    <client-only>
      <div v-if="showRawToggle" class="raw-toggle-container">
        <u-button
          :icon="showRaw ? resolveIcon('eye') : resolveIcon('code')"
          color="neutral"
          variant="ghost"
          size="sm"
          :aria-label="showRaw ? 'Switch to WYSIWYG editor' : 'Switch to raw markup view'"
          @click="toggleRawMode"
        >
          {{ showRaw ? 'Show WYSIWYG' : 'Show Raw' }}
        </u-button>
      </div>

      <template v-if="!showRaw">
        <u-editor
          ref="editor"
          :model-value="modelValue"
          :content-type="contentType === 'jira' ? 'json' : contentType"
          :placeholder="placeholder"
          :starter-kit="starterKitConfig"
          :image="imageConfig"
          :editor-props="editorPropsConfig"
          :style="{ minHeight }"
          @update:model-value="handleUpdate"
        >
          <template #default="{ editor: editorInstance }">
            <!-- @vue-ignore - toolbarItems is const but component expects mutable -->
            <u-editor-toolbar
              v-if="toolbar"
              :editor="editorInstance"
              :items="toolbarItems"
            ></u-editor-toolbar>
          </template>
        </u-editor>
      </template>

      <template v-else>
        <div class="raw-editor-container" :style="{ minHeight }">
          <u-textarea
            :model-value="rawContent"
            :placeholder="placeholder"
            :rows="Math.floor(Number.parseInt(minHeight) / 20)"
            class="raw-textarea"
            @input="handleRawUpdate"
          ></u-textarea>
        </div>
      </template>

      <template #fallback>
        <u-textarea
          :model-value="modelValue"
          :placeholder="placeholder"
          :rows="Math.floor(Number.parseInt(minHeight) / 20)"
          @update:model-value="emit('update:modelValue', $event)"
        ></u-textarea>
      </template>
    </client-only>
  </div>
</template>

<script setup lang="ts">
import type { JSONContent } from '@tiptap/core'
import { computed, ref, watch } from 'vue'
import { serializeToJira } from '../../lib/jira-markup-serializer'

interface Props {
  modelValue: string
  contentType?: 'markdown' | 'html' | 'json' | 'jira'
  placeholder?: string
  minHeight?: string
  toolbar?: boolean
  showRawToggle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  contentType: 'markdown',
  placeholder: '',
  minHeight: '200px',
  toolbar: true,
  showRawToggle: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editor = ref()
const showRaw = ref(false)
const rawContent = ref(props.modelValue)

const { resolveIcon } = useAppearance()

// Toolbar items for the editor
// Use 'text' prop for UTooltip in Nuxt UI v4 (not 'content' which expects Object)
const toolbarItems = computed(() => [
  [
    { kind: 'mark' as const, mark: 'bold' as const, icon: resolveIcon('bold'), tooltip: { text: 'Bold' } },
    { kind: 'mark' as const, mark: 'italic' as const, icon: resolveIcon('italic'), tooltip: { text: 'Italic' } },
    { kind: 'mark' as const, mark: 'strike' as const, icon: resolveIcon('strikethrough'), tooltip: { text: 'Strikethrough' } },
    { kind: 'mark' as const, mark: 'code' as const, icon: resolveIcon('code'), tooltip: { text: 'Code' } },
  ],
  [
    {
      icon: resolveIcon('heading'),
      tooltip: { text: 'Heading' },
      items: [
        { kind: 'heading' as const, level: 1 as const, label: 'Heading 1' },
        { kind: 'heading' as const, level: 2 as const, label: 'Heading 2' },
        { kind: 'heading' as const, level: 3 as const, label: 'Heading 3' },
      ],
    },
  ],
  [
    { kind: 'bulletList' as const, icon: resolveIcon('list'), tooltip: { text: 'Bullet List' } },
    { kind: 'orderedList' as const, icon: resolveIcon('listNumbers'), tooltip: { text: 'Ordered List' } },
  ],
  [
    { kind: 'blockquote' as const, icon: resolveIcon('blockquote'), tooltip: { text: 'Blockquote' } },
    { kind: 'codeBlock' as const, icon: resolveIcon('code'), tooltip: { text: 'Code Block' } },
    { kind: 'horizontalRule' as const, icon: resolveIcon('separatorHorizontal'), tooltip: { text: 'Horizontal Rule' } },
  ],
  [
    { kind: 'link' as const, icon: resolveIcon('link'), tooltip: { text: 'Link' } },
    { kind: 'image' as const, icon: resolveIcon('photo'), tooltip: { text: 'Image' } },
  ],
  [
    { kind: 'undo' as const, icon: resolveIcon('undo'), tooltip: { text: 'Undo' } },
    { kind: 'redo' as const, icon: resolveIcon('redo'), tooltip: { text: 'Redo' } },
  ],
] as const)

// Configure StarterKit with headings 1-3
const starterKitConfig = {
  heading: {
    levels: [1, 2, 3] as [1, 2, 3],
  },
}

// Configure Image extension to allow base64
const imageConfig = {
  allowBase64: true,
}

// Configure editor props to handle clipboard image pastes
const editorPropsConfig = {
  handlePaste: (_view: unknown, event: ClipboardEvent) => {
    // Check if clipboard contains image files
    const items = event.clipboardData?.items
    if (!items)
      return false

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (!item)
        continue

      // If clipboard contains an image file
      if (item.type.includes('image')) {
        event.preventDefault()

        const file = item.getAsFile()
        if (!file)
          continue

        // Convert image to base64 data URL
        const reader = new FileReader()
        reader.onload = (e) => {
          const base64 = e.target?.result as string
          if (editor.value?.editor) {
            // Insert image at current cursor position
            editor.value.editor.commands.insertContent({
              type: 'image',
              attrs: {
                src: base64,
              },
            })
          }
        }
        reader.readAsDataURL(file)

        return true
      }
    }

    return false
  },
}

// Handle content updates from the editor
function handleUpdate(value: string | JSONContent) {
  if (showRaw.value) {
    return
  }

  let output = ''

  if (props.contentType === 'markdown') {
    output = typeof value === 'string' ? value : ''
  }
  else if (props.contentType === 'html') {
    output = typeof value === 'string' ? value : ''
  }
  else if (props.contentType === 'json') {
    output = typeof value === 'object' ? JSON.stringify(value, null, 2) : value
  }
  else if (props.contentType === 'jira') {
    const json = typeof value === 'object' ? value : JSON.parse(value)
    output = serializeToJira(json)
  }

  emit('update:modelValue', output)
}

// Toggle between WYSIWYG and raw Markdown mode
function toggleRawMode() {
  showRaw.value = !showRaw.value

  if (showRaw.value) {
    // Switching to raw mode: get current content from editor
    if (editor.value?.editor) {
      if (props.contentType === 'markdown') {
        rawContent.value = editor.value.editor.getMarkdown()
      }
      else if (props.contentType === 'html') {
        rawContent.value = editor.value.editor.getHTML()
      }
      else if (props.contentType === 'json') {
        rawContent.value = JSON.stringify(editor.value.editor.getJSON(), null, 2)
      }
      else if (props.contentType === 'jira') {
        rawContent.value = serializeToJira(editor.value.editor.getJSON())
      }
    }
  }
  else {
    // Switching back to WYSIWYG: sync raw content to editor
    if (editor.value?.editor) {
      editor.value.editor.commands.setContent(rawContent.value, { contentType: props.contentType })
    }
  }
}

// Handle raw textarea updates
function handleRawUpdate(event: Event) {
  const target = event.target as HTMLTextAreaElement
  rawContent.value = target.value
  emit('update:modelValue', target.value)
}

// Watch for external changes to modelValue
watch(() => props.modelValue, (newVal) => {
  if (showRaw.value && newVal !== rawContent.value) {
    rawContent.value = newVal
  }
})
</script>

<style scoped>
.rich-text-editor {
  width: 100%;
}

.raw-toggle-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0.5rem;
}

.raw-editor-container {
  border: 1px solid var(--ui-border);
  border-radius: var(--ui-radius);
  padding: 0.5rem;
}

.raw-textarea {
  font-family: 'JetBrains Mono Variable', monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  width: 100%;
  resize: vertical;
}
</style>
