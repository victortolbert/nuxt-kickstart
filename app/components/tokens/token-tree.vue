<template>
  <div class="token-tree">
    <!-- Header with search and controls -->
    <div class="tree-header">
      <u-input
        v-model="searchQuery"
        :icon="resolveIcon('search')"
        placeholder="Search tokens..."
        class="search-input"
      ></u-input>
      <div class="tree-controls">
        <u-button
          variant="ghost"
          size="xs"
          @click="expandAll"
        >
          Expand All
        </u-button>
        <u-button
          variant="ghost"
          size="xs"
          @click="collapseAll"
        >
          Collapse All
        </u-button>
        <span class="token-count">{{ tokenCount }} token{{ tokenCount !== 1 ? 's' : '' }}</span>
      </div>
    </div>

    <!-- Tree content -->
    <div v-if="tokenCount > 0" class="tree-content">
      <tokens-token-tree-node
        :tokens="filteredTokens"
        :expanded-nodes="expandedNodes"
        :is-token-leaf="isTokenLeaf"
        :get-token-type="getTokenType"
        :get-token-value="getTokenValue"
        :format-value="formatValue"
        :is-color-value="isColorValue"
        :is-typography-token="isTypographyToken"
        :get-type-badge-color="getTypeBadgeColor"
        :toggle-node="toggleNode"
        :is-expanded="isExpanded"
        :normalize-key="normalizeKey"
      ></tokens-token-tree-node>
    </div>

    <!-- Empty state -->
    <div v-else class="tree-empty">
      <u-icon :name="resolveIcon('searchOff')" class="empty-icon"></u-icon>
      <p class="empty-text">
        No tokens found
      </p>
      <u-button
        v-if="searchQuery"
        variant="ghost"
        size="sm"
        @click="searchQuery = ''"
      >
        Clear search
      </u-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UiColor } from '#shared/types/appearance'

const props = withDefaults(defineProps<Props>(), {
  expanded: false,
})

const COLOR_VALUE_REGEX = /^(?:#[0-9a-fA-F]{3,8}|rgb|hsl)/

const { resolveIcon } = useAppearance()

interface Props {
  tokens: Record<string, unknown>
  expanded?: boolean
}

/**
 * Normalize a token key for display (replace spaces with dashes, lowercase)
 */
function normalizeKey(key: string): string {
  return key.replaceAll(' ', '-').toLowerCase()
}

// Search state
const searchQuery = ref('')

// Root level expansion state
const expandedNodes = ref<Set<string>>(new Set())

// Initialize expansion state based on prop
onMounted(() => {
  if (props.expanded) {
    expandAll()
  }
})

// Watch for tokens changes to reset expansion
watch(() => props.tokens, () => {
  expandedNodes.value.clear()
  if (props.expanded) {
    expandAll()
  }
})

/**
 * Recursively expand all nodes
 */
function expandAll() {
  const expandNode = (obj: Record<string, unknown>, path: string = '') => {
    for (const [key, value] of Object.entries(obj)) {
      const nodePath = path ? `${path}.${key}` : key
      if (typeof value === 'object' && value !== null && !isTokenLeaf(value)) {
        expandedNodes.value.add(nodePath)
        expandNode(value as Record<string, unknown>, nodePath)
      }
    }
  }
  expandNode(props.tokens)
}

/**
 * Collapse all nodes
 */
function collapseAll() {
  expandedNodes.value.clear()
}

/**
 * Toggle node expansion
 */
function toggleNode(path: string) {
  if (expandedNodes.value.has(path)) {
    expandedNodes.value.delete(path)
  }
  else {
    expandedNodes.value.add(path)
  }
}

/**
 * Check if a node is expanded
 */
function isExpanded(path: string): boolean {
  return expandedNodes.value.has(path)
}

/**
 * Check if an object is a token leaf node
 */
function isTokenLeaf(value: unknown): boolean {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false
  }
  const obj = value as Record<string, unknown>
  return ('$type' in obj && '$value' in obj) || ('type' in obj && 'value' in obj)
}

/**
 * Get token type from leaf node
 */
function getTokenType(value: unknown): string | null {
  if (!isTokenLeaf(value))
    return null
  const obj = value as Record<string, unknown>
  return (obj.$type as string) || (obj.type as string) || null
}

/**
 * Get token value from leaf node
 */
function getTokenValue(value: unknown): unknown {
  if (!isTokenLeaf(value))
    return null
  const obj = value as Record<string, unknown>
  return obj.$value ?? obj.value ?? null
}

/**
 * Format token value for display
 */
function formatValue(value: unknown): string {
  if (value === null || value === undefined)
    return ''
  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2)
  }
  return String(value)
}

/**
 * Check if a token value is a valid color
 */
function isColorValue(type: string | null, value: unknown): boolean {
  if (type !== 'color')
    return false
  if (typeof value !== 'string')
    return false
  // Simple check for hex, rgb, rgba, hsl, hsla
  return COLOR_VALUE_REGEX.test(value)
}

/**
 * Check if a token is a typography token
 */
function isTypographyToken(type: string | null): boolean {
  return type === 'typography'
}

/**
 * Get badge color for token type
 */
function getTypeBadgeColor(type: string | null): UiColor {
  if (!type)
    return 'neutral'
  const typeColorMap: Record<string, UiColor> = {
    color: 'primary',
    dimension: 'success',
    typography: 'info',
    shadow: 'warning',
    border: 'neutral',
    width: 'success',
    height: 'success',
    fontFamily: 'info',
    fontWeight: 'info',
    duration: 'warning',
    cubicBezier: 'warning',
    // Custom Helium types
    direction: 'secondary',
    justify: 'secondary',
    textcase: 'info',
  }
  return typeColorMap[type] || 'neutral'
}

/**
 * Filter tokens based on search query
 */
const filteredTokens = computed(() => {
  if (!searchQuery.value.trim())
    return props.tokens

  const query = searchQuery.value.toLowerCase()

  const filterNode = (obj: Record<string, unknown>, path: string = ''): Record<string, unknown> | null => {
    const result: Record<string, unknown> = {}
    let hasMatch = false

    for (const [key, value] of Object.entries(obj)) {
      const nodePath = path ? `${path}.${key}` : key

      // Check if key matches search
      if (key.toLowerCase().includes(query) || nodePath.toLowerCase().includes(query)) {
        result[key] = value
        hasMatch = true
        continue
      }

      // If it's a leaf token, check type and value
      if (isTokenLeaf(value)) {
        const type = getTokenType(value)
        const tokenValue = getTokenValue(value)
        if (
          type?.toLowerCase().includes(query)
          || String(tokenValue).toLowerCase().includes(query)
        ) {
          result[key] = value
          hasMatch = true
        }
      }
      // If it's a nested object, recurse
      else if (typeof value === 'object' && value !== null) {
        const filtered = filterNode(value as Record<string, unknown>, nodePath)
        if (filtered && Object.keys(filtered).length > 0) {
          result[key] = filtered
          hasMatch = true
          // Auto-expand parent nodes when filtering
          if (searchQuery.value.trim()) {
            expandedNodes.value.add(nodePath)
          }
        }
      }
    }

    return hasMatch ? result : null
  }

  const filtered = filterNode(props.tokens)
  return filtered || {}
})

/**
 * Count total tokens in tree
 */
const tokenCount = computed(() => {
  const countLeaves = (obj: Record<string, unknown>): number => {
    let count = 0
    for (const value of Object.values(obj)) {
      if (isTokenLeaf(value)) {
        count++
      }
      else if (typeof value === 'object' && value !== null) {
        count += countLeaves(value as Record<string, unknown>)
      }
    }
    return count
  }
  return countLeaves(filteredTokens.value)
})
</script>

<style scoped>
.token-tree {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
}

.tree-header {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.search-input {
  width: 100%;
}

.tree-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.token-count {
  margin-left: auto;
  font-size: 0.875rem;
  color: var(--ui-text-muted);
}

.tree-content {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem 0;
}

.tree-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 3rem 1rem;
  color: var(--ui-text-muted);
}

.empty-icon {
  font-size: 2.5rem;
  opacity: 0.5;
}

.empty-text {
  font-size: 0.875rem;
  margin: 0;
}
</style>
