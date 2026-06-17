<template>
  <div v-if="shouldShow" class="metadata-display">
    <div v-if="metadata?.brand" class="metadata-item">
      <span class="metadata-label">Brand:</span>
      <span class="metadata-value">{{ metadata.brand }}</span>
    </div>
    <div v-if="metadata?.franchise" class="metadata-item">
      <span class="metadata-label">Franchise:</span>
      <span class="metadata-value">{{ metadata.franchise }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface HeliumMetadata {
  brand?: string
  franchise?: string
}

interface Props {
  metadata: HeliumMetadata | null
}

const props = defineProps<Props>()

// Compute whether to show the component
const shouldShow = computed(() => {
  if (!props.metadata)
    return false
  return !!(props.metadata.brand || props.metadata.franchise)
})
</script>

<style scoped>
.metadata-display {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 0.375rem;
  background-color: var(--ui-bg-muted);
  font-size: 0.875rem;
}

.metadata-item {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.metadata-label {
  font-weight: 600;
  color: var(--ui-text-muted);
}

.metadata-value {
  color: var(--ui-text);
}
</style>
