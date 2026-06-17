<template>
  <div class="output-preview">
    <div class="preview-toolbar">
      <div class="toolbar-left">
        <span v-if="language" class="language-badge">
          {{ language.toUpperCase() }}
        </span>
      </div>
      <div class="toolbar-right">
        <u-button
          :icon="copySuccess ? resolveIcon('check') : resolveIcon('copy')"
          color="neutral"
          variant="ghost"
          size="sm"
          :disabled="!content || loading || !!error"
          @click="copyToClipboard"
        >
          {{ copySuccess ? 'Copied!' : 'Copy' }}
        </u-button>
      </div>
    </div>

    <div class="preview-content">
      <!-- Loading State -->
      <div v-if="loading" class="preview-state loading-state">
        <u-icon :name="resolveIcon('loading')" class="spinner"></u-icon>
        <span>Transforming...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="preview-state error-state">
        <u-icon :name="resolveIcon('caution')"></u-icon>
        <span>{{ error }}</span>
      </div>

      <!-- Empty State -->
      <div v-else-if="!content" class="preview-state empty-state">
        <u-icon :name="resolveIcon('fileCode')"></u-icon>
        <span>Select a format to see preview</span>
      </div>

      <!-- Highlighted Code -->
      <div
        v-else-if="highlightedCode"
        class="code-container"
        v-html="highlightedCode"
      />

      <!-- Highlighting in Progress -->
      <div v-else-if="isHighlighting" class="preview-state loading-state">
        <u-icon :name="resolveIcon('loading')" class="spinner"></u-icon>
        <span>Highlighting...</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BundledLanguage } from 'shiki'
import { computed, ref, watch } from 'vue'

interface Props {
  content: string
  language: string
  loading?: boolean
  error?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: null,
})

const { resolveIcon } = useAppearance()

const highlightedCode = ref('')
const isHighlighting = ref(false)
const copySuccess = ref(false)

// Language mapping for Shiki
const languageMap: Record<string, BundledLanguage> = {
  css: 'css',
  scss: 'scss',
  js: 'javascript',
  ts: 'typescript',
  json: 'json',
  swift: 'swift',
  xml: 'xml',
  kotlin: 'kotlin',
}

const shikiLanguage = computed<BundledLanguage>(() => {
  return (languageMap[props.language] || 'json') as BundledLanguage
})

async function highlightCode() {
  if (!props.content || props.loading || props.error) {
    highlightedCode.value = ''
    return
  }

  isHighlighting.value = true

  try {
    // Dynamic import of shiki for client-side only
    const { codeToHtml } = await import('shiki')

    const html = await codeToHtml(props.content, {
      lang: shikiLanguage.value,
      theme: 'github-dark-default',
      structure: 'classic',
    })

    highlightedCode.value = html
  }
  catch (error) {
    console.error('Shiki highlighting error:', error)
    // Fallback to plain text with basic formatting
    highlightedCode.value = `<pre><code>${escapeHtml(props.content)}</code></pre>`
  }
  finally {
    isHighlighting.value = false
  }
}

function escapeHtml(text: string): string {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

async function copyToClipboard() {
  if (!props.content)
    return

  try {
    await navigator.clipboard.writeText(props.content)
    copySuccess.value = true
    setTimeout(() => {
      copySuccess.value = false
    }, 2000)
  }
  catch (error) {
    console.error('Failed to copy to clipboard:', error)
  }
}

// Highlight code when content or language changes
watch([() => props.content, () => props.language], () => {
  highlightCode()
}, { immediate: true })
</script>

<style scoped>
.output-preview {
  width: 100%;
  border: 1px solid var(--ui-border);
  border-radius: var(--ui-radius);
  overflow: hidden;
  background-color: var(--ui-bg);
}

.preview-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  border-bottom: 1px solid var(--ui-border);
  background-color: var(--ui-bg-elevated);
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.language-badge {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--ui-text-muted);
  background-color: var(--ui-bg-muted);
  border-radius: var(--ui-radius);
  text-transform: uppercase;
}

.preview-content {
  min-height: 300px;
  max-height: 600px;
  overflow: auto;
}

.preview-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  min-height: 300px;
  padding: 2rem;
  text-align: center;
}

.loading-state {
  color: var(--ui-text-muted);
}

.error-state {
  color: var(--color-error-500);
}

.empty-state {
  color: var(--ui-text-muted);
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.code-container {
  padding: 0;
  overflow: auto;
}

/* Shiki code styling */
.code-container :deep(pre) {
  margin: 0;
  padding: 1rem;
  background-color: transparent !important;
  overflow-x: auto;
}

.code-container :deep(code) {
  font-family: 'JetBrains Mono Variable', monospace;
  font-size: 0.875rem;
  line-height: 1.6;
  counter-reset: line;
}

/* Line numbers */
.code-container :deep(.line) {
  display: inline-block;
  width: 100%;
}

.code-container :deep(.line::before) {
  counter-increment: line;
  content: counter(line);
  display: inline-block;
  width: 3ch;
  margin-right: 1.5rem;
  text-align: right;
  color: var(--ui-text-dimmed);
  user-select: none;
}
</style>
