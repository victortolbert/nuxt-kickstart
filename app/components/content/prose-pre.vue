<template>
  <client-only v-if="isMermaid">
    <div ref="container" class="mermaid-container not-prose my-6">
      <div
        v-if="svg"
        class="mermaid-diagram"
        v-html="svg"
      />
      <div v-else-if="error" class="mermaid-error p-4 border border-red-300 dark:border-red-700 rounded-lg bg-red-50 dark:bg-red-950">
        <p class="text-sm font-medium text-red-600 dark:text-red-400 mb-2">
          Diagram rendering error
        </p>
        <p class="text-xs text-red-500 dark:text-red-400 mb-2">
          {{ error }}
        </p>
        <details class="text-xs">
          <summary class="cursor-pointer text-muted hover:text-default">
            Show source
          </summary>
          <pre class="mt-2 bg-muted p-2 rounded overflow-x-auto">
            <code>{{ code }}</code>
          </pre>
        </details>
      </div>
      <div v-else class="mermaid-loading">
        <div class="animate-pulse bg-muted rounded h-32 flex items-center justify-center">
          <span class="text-muted text-sm">Loading diagram...</span>
        </div>
      </div>
    </div>
    <template #fallback>
      <pre class="mermaid-ssr-fallback not-prose my-6 p-4 bg-muted rounded-lg text-xs overflow-x-auto">
        <code>{{ code }}</code>
      </pre>
    </template>
  </client-only>

  <!-- Regular code block with optional filename header -->
  <div v-else class="code-block-wrapper relative group my-5">
    <!-- Header with filename -->
    <div
      v-if="filename"
      class="code-header flex items-center gap-1.5 border border-muted bg-default border-b-0 rounded-t-md px-4 py-3"
    >
      <u-icon :name="fileIcon" class="size-4 shrink-0 text-muted"></u-icon>
      <span class="text-sm text-default">{{ filename }}</span>
    </div>

    <!-- Copy button -->
    <button
      class="copy-button absolute top-3 right-3 inline-flex items-center justify-center rounded-md border border-muted bg-elevated p-1.5 text-muted transition-opacity hover:bg-accented hover:text-default opacity-0 group-hover:opacity-100 z-10"
      :class="{ 'top-14': filename }"
      :title="copied ? 'Copied!' : 'Copy code'"
      @click="copyCode"
    >
      <u-icon
        :name="copied ? resolveIcon('check') : resolveIcon('copy')"
        class="size-4 shrink-0"
      ></u-icon>
    </button>

    <!-- Code block - NO WHITESPACE inside pre to avoid indentation -->
    <pre v-bind="$attrs" :class="[$attrs.class, { 'rounded-t-none': filename }]"><slot /></pre>
  </div>
</template>

<script setup lang="ts">
/**
 * Custom ProseCode component that renders Mermaid diagrams
 * when the language is "mermaid", otherwise renders normal code blocks.
 *
 * Also supports filename headers and line highlighting.
 *
 * Usage in markdown:
 * ```mermaid
 * graph TD
 *     A --> B
 * ```
 *
 * ```ts [filename.ts] {1,3-5}
 * // Code with filename header and highlighted lines
 * ```
 */
import { computed, onMounted, ref, watch } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  code?: string
  language?: string | null
  filename?: string | null
  highlights?: number[]
  meta?: string | null
}>()

const colorMode = useColorMode()
const { resolveIcon } = useAppearance()
const container = ref<HTMLElement | null>(null)
const svg = ref('')
const error = ref<string | null>(null)
const id = ref(`mermaid-${Math.random().toString(36).substring(2, 9)}`)
const copied = ref(false)

const isMermaid = computed(() => props.language === 'mermaid')

// Get icon for file extension
const fileIcon = computed(() => {
  if (!props.filename)
    return resolveIcon('fileCode')

  const ext = props.filename.split('.').pop()?.toLowerCase()
  const iconMap: Record<string, string> = {
    ts: 'i-tabler-brand-typescript',
    tsx: 'i-tabler-brand-typescript',
    js: 'i-tabler-brand-javascript',
    jsx: 'i-tabler-brand-javascript',
    vue: 'i-tabler-brand-vue',
    css: 'i-tabler-brand-css3',
    scss: 'i-tabler-brand-sass',
    html: 'i-tabler-brand-html5',
    json: 'i-tabler-json',
    md: 'i-tabler-markdown',
    sh: resolveIcon('terminal'),
    bash: resolveIcon('terminal'),
    yml: resolveIcon('fileSettings'),
    yaml: resolveIcon('fileSettings'),
  }

  return iconMap[ext || ''] || resolveIcon('fileCode')
})

async function copyCode() {
  if (!props.code)
    return

  try {
    await navigator.clipboard.writeText(props.code)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }
  catch (e) {
    console.error('Failed to copy code:', e)
  }
}

async function renderDiagram() {
  if (!isMermaid.value || !props.code)
    return

  // Generate a new unique ID for each render
  id.value = `mermaid-${Math.random().toString(36).substring(2, 9)}`

  try {
    const mermaid = await import('mermaid').then(m => m.default)

    const isDark = colorMode.value === 'dark'

    // Custom theme variables mapped to Lyra theme (hex equivalents of OKLCH)
    const themeVariables = isDark
      ? {
          // Dark mode - Lyra dark palette
          background: '#1e293b', // --ui-bg-elevated
          primaryColor: '#1e3a5f', // primary-900 (darker blue for nodes)
          primaryBorderColor: '#3b82f6', // primary-500
          primaryTextColor: '#f8fafc', // --ui-text
          secondaryColor: '#334155', // --ui-bg-muted (subgraph)
          secondaryBorderColor: '#475569', // --ui-border-accented
          secondaryTextColor: '#f8fafc', // --ui-text
          tertiaryColor: '#1e293b', // --ui-bg-elevated
          tertiaryBorderColor: '#475569', // --ui-border
          tertiaryTextColor: '#f8fafc',
          lineColor: '#94a3b8', // --ui-text-muted
          textColor: '#f8fafc', // --ui-text
          mainBkg: '#1e3a5f', // primary-900
          nodeBorder: '#3b82f6', // primary-500
          clusterBkg: '#334155', // --ui-bg-muted
          clusterBorder: '#475569', // --ui-border-accented
          edgeLabelBackground: '#1e293b', // --ui-bg-elevated
          nodeTextColor: '#f8fafc',
        }
      : {
          // Light mode - Lyra light palette
          background: '#f8fafc', // --ui-bg-elevated
          primaryColor: '#dbeafe', // primary-100 for nodes
          primaryBorderColor: '#3b82f6', // primary-500
          primaryTextColor: '#0f172a', // --ui-text
          secondaryColor: '#f1f5f9', // --ui-bg-muted (subgraph)
          secondaryBorderColor: '#e2e8f0', // --ui-border
          secondaryTextColor: '#0f172a', // --ui-text
          tertiaryColor: '#f8fafc', // --ui-bg-elevated
          tertiaryBorderColor: '#e2e8f0', // --ui-border
          tertiaryTextColor: '#0f172a',
          lineColor: '#64748b', // --ui-text-muted
          textColor: '#0f172a', // --ui-text
          mainBkg: '#dbeafe', // primary-100
          nodeBorder: '#3b82f6', // primary-500
          clusterBkg: '#f1f5f9', // --ui-bg-muted
          clusterBorder: '#e2e8f0', // --ui-border
          edgeLabelBackground: '#f8fafc', // --ui-bg-elevated
          nodeTextColor: '#0f172a',
        }

    mermaid.initialize({
      startOnLoad: false,
      theme: 'base', // Use 'base' to allow full customization
      themeVariables,
      securityLevel: 'loose',
      fontFamily: 'JetBrains Mono, monospace',
    })

    const { svg: renderedSvg } = await mermaid.render(id.value, props.code)
    svg.value = renderedSvg
    error.value = null
  }
  catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to render diagram'
    console.error('Mermaid render error:', e)
  }
}

onMounted(() => {
  if (isMermaid.value) {
    renderDiagram()
  }
})

watch(() => colorMode.value, () => {
  if (isMermaid.value) {
    renderDiagram()
  }
})

watch(() => props.code, () => {
  if (isMermaid.value) {
    renderDiagram()
  }
})
</script>

<style scoped>
.mermaid-container {
  overflow-x: auto;
}

.mermaid-diagram :deep(svg) {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
}

.mermaid-diagram :deep(.nodeLabel),
.mermaid-diagram :deep(.edgeLabel),
.mermaid-diagram :deep(.label) {
  font-family: 'JetBrains Mono', monospace;
}

.code-block-wrapper pre {
  margin: 0;
  overflow-x: auto;
  border: 1px solid var(--ui-border-muted);
  border-radius: 0.375rem;
  padding: 1rem;
  font-size: 0.875rem;
  line-height: 1.7;
}

.code-block-wrapper pre.rounded-t-none {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

@media print {
  .mermaid-container {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  .copy-button {
    display: none;
  }
}
</style>
