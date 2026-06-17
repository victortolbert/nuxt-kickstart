<template>
  <div class="example-picker">
    <p class="block text-sm font-medium mb-2">
      Load Example Tokens
    </p>
    <u-select-menu
      v-model="selectedExample"
      :items="items"
      value-key="value"
      placeholder="Choose an example..."
      aria-label="Load Example Tokens"
      @update:model-value="handleSelect"
    >
      <template #item-label="{ item }">
        <div class="flex flex-col gap-1">
          <div class="font-medium">
            {{ typeof item === 'object' && item !== null ? item.label : item }}
          </div>
          <div class="text-sm" style="color: var(--ui-text-muted)">
            {{ typeof item === 'object' && item !== null && 'description' in item ? item.description : '' }}
          </div>
          <div class="text-xs" style="color: var(--ui-text-dimmed)">
            {{ typeof item === 'object' && item !== null && 'value' in item ? examples.find(ex => ex.id === item.value)?.tokenCount : '' }} tokens
          </div>
        </div>
      </template>
    </u-select-menu>
  </div>
</template>

<script setup lang="ts">
import type { SelectMenuItem } from '@nuxt/ui'
import heliumTokens from '#shared/data/example-tokens/helium-sample.json'
import simpleTokens from '#shared/data/example-tokens/simple.json'

interface Example {
  id: string
  name: string
  description: string
  tokens: Record<string, unknown>
  tokenCount: number
}

const emit = defineEmits<{
  select: [exampleId: string]
}>()

// Count tokens in an object
function countTokens(obj: Record<string, unknown>): number {
  let count = 0
  for (const key in obj) {
    const value = obj[key]
    if (value && typeof value === 'object') {
      // DTCG format
      if ('$type' in value && '$value' in value) {
        count++
      }
      // Legacy format
      else if ('type' in value && 'value' in value) {
        count++
      }
      // Nested group
      else {
        count += countTokens(value as Record<string, unknown>)
      }
    }
  }
  return count
}

// Define examples
const examples: Example[] = [
  {
    id: 'simple',
    name: 'Simple (DTCG)',
    description: 'Basic design tokens in DTCG format with colors, spacing, typography, borders, and shadows',
    tokens: simpleTokens as Record<string, unknown>,
    tokenCount: countTokens(simpleTokens as Record<string, unknown>),
  },
  {
    id: 'helium',
    name: 'Helium Sample',
    description: 'Sample tokens from Helium Figma plugin with component variants and metadata',
    tokens: heliumTokens as Record<string, unknown>,
    tokenCount: countTokens((heliumTokens as Record<string, unknown>).tokens as Record<string, unknown> || {}),
  },
]

const selectedExample = ref<Example | null>(null)

function handleSelect(example: Example | null) {
  if (example) {
    emit('select', example.id)
  }
}

// Create items for USelectMenu
const items: SelectMenuItem[] = examples.map(ex => ({
  label: ex.name,
  value: ex.id,
  description: ex.description,
}))

function getExample(id: string): Example | undefined {
  return examples.find(ex => ex.id === id)
}

defineExpose({
  examples,
  getExample,
})
</script>

<style scoped>
.example-picker {
  width: 100%;
}
</style>
