<template>
  <div class="output-preview-tabs">
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
    <div v-else-if="selectedFormats.length === 0" class="preview-state empty-state">
      <u-icon :name="resolveIcon('fileCode')"></u-icon>
      <span>Select output formats to see preview</span>
    </div>

    <!-- Single Format (no tabs needed) -->
    <div v-else-if="selectedFormats.length === 1 && selectedFormats[0]" class="single-format">
      <div class="preview-toolbar">
        <div class="toolbar-left">
          <span class="language-badge">
            {{ getFormatLabel(selectedFormats[0]) }}
          </span>
        </div>
        <div class="toolbar-right">
          <u-button
            :icon="copySuccess === selectedFormats[0] ? resolveIcon('check') : resolveIcon('copy')"
            color="neutral"
            variant="ghost"
            size="sm"
            :disabled="!getFileContent(selectedFormats[0])"
            @click="copyToClipboard(selectedFormats[0]!)"
          >
            {{ copySuccess === selectedFormats[0] ? 'Copied!' : 'Copy' }}
          </u-button>
        </div>
      </div>
      <div class="preview-content">
        <div
          v-if="selectedFormats[0] && highlightedContent[selectedFormats[0]]"
          class="code-container"
          v-html="highlightedContent[selectedFormats[0]!]"
        />
        <div v-else-if="selectedFormats[0] && !getFileContent(selectedFormats[0])" class="preview-state empty-state">
          <u-icon :name="resolveIcon('fileCode')"></u-icon>
          <span>Click "Transform All Formats" to generate output</span>
        </div>
      </div>
    </div>

    <!-- Multiple Formats (with tabs) -->
    <div v-else class="multi-format">
      <u-tabs
        v-model="activeTab"
        :items="tabItems"
        color="neutral"
        variant="link"
        size="sm"
        :content="false"
        class="preview-tabs"
      ></u-tabs>

      <!-- Tab content panels -->
      <div
        v-for="(format, index) in selectedFormats"
        :key="format"
        class="tab-panel"
        :class="[{ 'tab-panel--active': activeTab === index || activeTab === index.toString() }]"
      >
        <div class="preview-toolbar">
          <div class="toolbar-left">
            <span class="language-badge">
              {{ getFormatLabel(format) }}
            </span>
            <span v-if="files.find(f => f.format === format)" class="file-indicator">
              {{ files.find(f => f.format === format)?.filename }}
            </span>
          </div>
          <div class="toolbar-right">
            <u-button
              :icon="copySuccess === format ? resolveIcon('check') : resolveIcon('copy')"
              color="neutral"
              variant="ghost"
              size="sm"
              :disabled="!getFileContent(format)"
              @click="copyToClipboard(format)"
            >
              {{ copySuccess === format ? 'Copied!' : 'Copy' }}
            </u-button>
          </div>
        </div>
        <div class="preview-content">
          <div
            v-if="highlightedContent[format]"
            class="code-container"
            v-html="highlightedContent[format]"
          />
          <div v-else-if="!getFileContent(format)" class="preview-state empty-state">
            <u-icon :name="resolveIcon('fileCode')"></u-icon>
            <span>Click "Transform All Formats" to generate output</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'
import type { BundledLanguage } from 'shiki'
import type { TransformFile } from '~/composables/use-token-transformer'

interface Props {
  files: TransformFile[]
  loading?: boolean
  error?: string | null
  selectedFormats: string[]
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: null,
})

const { resolveIcon } = useAppearance()

const activeTab = ref<string | number>(0)
const highlightedContent = ref<Record<string, string>>({})
const copySuccess = ref<string | null>(null)

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
  tailwind: 'javascript',
}

// Format display names
const formatLabels: Record<string, string> = {
  css: 'CSS',
  scss: 'SCSS',
  js: 'JavaScript',
  ts: 'TypeScript',
  json: 'JSON',
  swift: 'Swift',
  xml: 'Android XML',
  kotlin: 'Kotlin',
  tailwind: 'Tailwind',
}

function getShikiLanguage(format: string): BundledLanguage {
  return languageMap[format] || 'json'
}

function getFormatLabel(format: string): string {
  return formatLabels[format] || format.toUpperCase()
}

// Build tab items from selected formats
const tabItems = computed<TabsItem[]>(() => {
  return props.selectedFormats.map((format, index) => ({
    label: getFormatLabel(format),
    value: index.toString(),
    slot: `tab-${index}`,
  }))
})

// Get file content for a format
function getFileContent(format: string): string {
  const file = props.files.find(f => f.format === format)
  return file?.content || ''
}

// Highlight code for all formats
async function highlightAllFormats() {
  if (props.loading || props.error || props.files.length === 0) {
    highlightedContent.value = {}
    return
  }

  try {
    const { codeToHtml } = await import('shiki')

    const results: Record<string, string> = {}

    for (const format of props.selectedFormats) {
      const content = getFileContent(format)
      if (content) {
        const html = await codeToHtml(content, {
          lang: getShikiLanguage(format),
          theme: 'github-dark-default',
          structure: 'classic',
        })
        results[format] = html
      }
    }

    highlightedContent.value = results
  }
  catch (error) {
    console.error('Shiki highlighting error:', error)
  }
}

// Copy content for a specific format
async function copyToClipboard(format: string) {
  const content = getFileContent(format)
  if (!content)
    return

  try {
    await navigator.clipboard.writeText(content)
    copySuccess.value = format
    setTimeout(() => {
      copySuccess.value = null
    }, 2000)
  }
  catch (err) {
    console.error('Failed to copy to clipboard:', err)
  }
}

// Watch for file changes and re-highlight
watch(() => props.files, () => {
  highlightAllFormats()
}, { immediate: true, deep: true })

// Reset active tab when formats change
watch(() => props.selectedFormats, () => {
  activeTab.value = 0
})
</script>

<style scoped>
.output-preview-tabs {
  width: 100%;
  border: 1px solid var(--ui-border);
  border-radius: var(--ui-radius);
  overflow: hidden;
  background-color: var(--ui-bg);
}

.preview-tabs {
  border-bottom: 1px solid var(--ui-border);
  background-color: var(--ui-bg-elevated);
  padding: 0.25rem 0.5rem 0;
}

.preview-tabs :deep(.tabs-list) {
  gap: 0;
}

.tab-panel {
  display: none;
}

.tab-panel--active {
  display: block;
}

.single-format,
.multi-format {
  display: flex;
  flex-direction: column;
}

.preview-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  border-bottom: 1px solid var(--ui-border);
  background-color: var(--ui-bg-elevated);
}

.single-format .preview-toolbar {
  border-bottom: none;
}

.multi-format .preview-toolbar {
  border-top: none;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.language-badge {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--color-primary-600);
  background-color: color-mix(in oklch, var(--color-primary-500) 15%, transparent);
  border-radius: 0.25rem;
  text-transform: uppercase;
}

.dark .language-badge {
  color: var(--color-primary-400);
}

.file-indicator {
  font-size: 0.75rem;
  color: var(--ui-text-muted);
  font-family: 'JetBrains Mono Variable', monospace;
}

.preview-content {
  min-height: 250px;
  max-height: 500px;
  overflow: auto;
}

.preview-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  min-height: 250px;
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
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.code-container {
  padding: 0;
  overflow: auto;
}

.code-container :deep(pre) {
  margin: 0;
  padding: 1rem;
  background-color: transparent !important;
  overflow-x: auto;
}

.code-container :deep(code) {
  font-family: 'JetBrains Mono Variable', monospace;
  font-size: 0.8125rem;
  line-height: 1.6;
  counter-reset: line;
}

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
