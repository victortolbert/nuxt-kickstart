<template>
  <ul class="tree-node-list">
    <li
      v-for="[key, value] of getSortedEntries(tokens)"
      :key="key"
      class="tree-node-item"
    >
      <div class="node-content">
        <!-- Expand/collapse button for non-leaf nodes -->
        <button
          v-if="hasChildren(value)"
          class="node-toggle"
          :aria-label="isExpanded(`${path ? `${path}.` : ''}${key}`) ? 'Collapse' : 'Expand'"
          @click="toggleNode(`${path ? `${path}.` : ''}${key}`)"
        >
          <u-icon
            :name="isExpanded(`${path ? `${path}.` : ''}${key}`) ? resolveIcon('chevronDown') : resolveIcon('chevronRight')"
            class="toggle-icon"
          ></u-icon>
        </button>
        <div v-else class="node-spacer" />

        <!-- Node label (normalized: spaces → dashes) -->
        <span class="node-label">{{ normalizeKey(key) }}</span>

        <!-- Token leaf information -->
        <template v-if="isTokenLeaf(value)">
          <!-- Type badge -->
          <u-badge
            :color="getTypeBadgeColor(getTokenType(value))"
            size="sm"
            class="type-badge"
          >
            {{ getTokenType(value) }}
          </u-badge>

          <!-- Color swatch preview -->
          <div
            v-if="isColorValue(getTokenType(value), getTokenValue(value))"
            class="color-swatch"
            :style="{ backgroundColor: String(getTokenValue(value)) }"
            :title="String(getTokenValue(value))"
          />

          <!-- Typography preview -->
          <div
            v-if="isTypographyToken(getTokenType(value))"
            class="typography-preview"
            :style="getTypographyPreview(getTokenValue(value))"
          >
            Abc
          </div>

          <!-- Value display -->
          <span class="node-value">{{ formatValue(getTokenValue(value)) }}</span>
        </template>

        <!-- Primitive value display (for metadata like brand, franchise, siteName) -->
        <template v-else-if="isPrimitive(value)">
          <u-badge
            color="neutral"
            size="sm"
            class="type-badge"
          >
            {{ typeof value }}
          </u-badge>
          <span class="node-value">{{ value }}</span>
        </template>
      </div>

      <!-- Recursive children -->
      <tokens-token-tree-node
        v-if="hasChildren(value) && isExpanded(`${path ? `${path}.` : ''}${key}`)"
        :tokens="value as Record<string, unknown>"
        :path="`${path ? `${path}.` : ''}${key}`"
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
        class="nested-tree"
      ></tokens-token-tree-node>
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { UiColor } from '#shared/types/appearance'

interface Props {
  tokens: Record<string, unknown>
  path?: string
  expandedNodes: Set<string>
  isTokenLeaf: (value: unknown) => boolean
  getTokenType: (value: unknown) => string | null
  getTokenValue: (value: unknown) => unknown
  formatValue: (value: unknown) => string
  isColorValue: (type: string | null, value: unknown) => boolean
  isTypographyToken: (type: string | null) => boolean
  getTypeBadgeColor: (type: string | null) => UiColor
  toggleNode: (path: string) => void
  isExpanded: (path: string) => boolean
  normalizeKey: (key: string) => string
}

const props = withDefaults(defineProps<Props>(), {
  path: '',
})

const { resolveIcon } = useAppearance()

/**
 * Extract value from a potentially nested $type/$value object
 */
function extractValue(value: unknown): unknown {
  if (value && typeof value === 'object' && '$value' in (value as Record<string, unknown>)) {
    return (value as Record<string, unknown>).$value
  }
  return value
}

/**
 * Get typography font preview
 */
function getTypographyPreview(value: unknown): string {
  if (!value || typeof value !== 'object')
    return ''
  const obj = value as Record<string, unknown>
  // Extract values, handling nested $value objects
  const family = extractValue(obj.fontFamily) as string | undefined
  const weight = extractValue(obj.fontWeight) as string | number | undefined
  const size = extractValue(obj.fontSize) as string | undefined

  if (!family)
    return ''

  return `font-family: ${family}; font-weight: ${weight || 400}; font-size: ${size || '14px'};`
}

/**
 * Check if node has children
 */
function hasChildren(value: unknown): boolean {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    return false
  if (props.isTokenLeaf(value))
    return false
  return Object.keys(value as Record<string, unknown>).length > 0
}

/**
 * Get sorted entries for consistent display
 */
function getSortedEntries(obj: Record<string, unknown>): [string, unknown][] {
  return Object.entries(obj).sort(([a], [b]) => a.localeCompare(b))
}

/**
 * Check if a value is a primitive (string, number, boolean)
 */
function isPrimitive(value: unknown): boolean {
  return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
}
</script>

<style scoped>
.tree-node-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.tree-node-item {
  margin: 0;
  padding: 0;
}

.node-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.5rem;
  border-radius: 0.25rem;
  transition: background-color 0.15s ease;
}

.node-content:hover {
  background-color: var(--ui-bg-elevated);
}

.node-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  padding: 0;
  border: none;
  background: none;
  color: var(--ui-text-muted);
  cursor: pointer;
  border-radius: 0.25rem;
  transition: all 0.15s ease;
  flex-shrink: 0;
}

.node-toggle:hover {
  background-color: var(--ui-bg-muted);
  color: var(--ui-text);
}

.node-toggle:active {
  transform: scale(0.95);
}

.toggle-icon {
  font-size: 1rem;
  transition: transform 0.15s ease;
}

.node-spacer {
  width: 1.25rem;
  flex-shrink: 0;
}

.node-label {
  font-family: 'JetBrains Mono Variable', monospace;
  font-size: 0.875rem;
  color: var(--ui-text);
  font-weight: 500;
  flex-shrink: 0;
}

.type-badge {
  flex-shrink: 0;
}

.color-swatch {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 0.25rem;
  border: 1px solid var(--ui-border);
  flex-shrink: 0;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.05);
}

.typography-preview {
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--ui-border);
  border-radius: 0.25rem;
  background-color: var(--ui-bg);
  flex-shrink: 0;
}

.node-value {
  font-family: 'JetBrains Mono Variable', monospace;
  font-size: 0.8125rem;
  color: var(--ui-text-muted);
  margin-left: auto;
  word-break: break-all;
  max-width: 30ch;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.nested-tree {
  margin-left: 1.5rem;
  padding-left: 0.5rem;
  border-left: 1px solid var(--ui-border);
}

/* Compact display for deeply nested structures */
.nested-tree .nested-tree {
  margin-left: 1rem;
}
</style>
