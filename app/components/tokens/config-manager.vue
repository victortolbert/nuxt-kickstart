<template>
  <div class="config-manager">
    <div class="config-manager__header">
      <h3 class="config-manager__title">
        Saved Configurations
      </h3>
      <u-button
        :icon="resolveIcon('plus')"
        size="sm"
        variant="outline"
        :disabled="disabled || formats.length === 0"
        @click="isSaveModalOpen = true"
      >
        Save Current
      </u-button>
    </div>

    <!-- Show loading state during SSR, then actual content on client -->
    <div v-if="!isMounted" class="config-manager__empty">
      <u-icon :name="resolveIcon('loading')" class="config-manager__empty-icon animate-spin"></u-icon>
      <p class="config-manager__empty-text">
        Loading configurations...
      </p>
    </div>

    <template v-else>
      <div v-if="configs.length > 0" class="config-manager__content">
        <p class="text-xs text-muted mb-2">
          {{ configs.length }} saved configuration(s)
        </p>
        <u-select-menu
          v-model="selectedConfigId"
          :items="configItems"
          value-key="id"
          placeholder="Select a saved configuration..."
          :disabled="disabled"
          class="config-manager__select"
        ></u-select-menu>

        <div v-if="selectedConfig" class="config-manager__actions">
          <u-button
            :icon="resolveIcon('upload')"
            variant="outline"
            size="sm"
            :disabled="disabled"
            @click="handleLoad"
          >
            Load
          </u-button>
          <u-button
            :icon="resolveIcon('trash')"
            color="error"
            variant="outline"
            size="sm"
            :disabled="disabled"
            @click="openDeleteModal(selectedConfig)"
          >
            Delete
          </u-button>
        </div>

        <div v-if="selectedConfig" class="config-manager__details">
          <div class="config-manager__detail">
            <span class="config-manager__detail-label">Formats:</span>
            <span class="config-manager__detail-value">{{ selectedConfig.formats.join(', ') }}</span>
          </div>
          <div class="config-manager__detail">
            <span class="config-manager__detail-label">Saved:</span>
            <span class="config-manager__detail-value">{{ formatDate(selectedConfig.createdAt) }}</span>
          </div>
        </div>
      </div>

      <div v-else class="config-manager__empty">
        <u-icon :name="resolveIcon('settings')" class="config-manager__empty-icon"></u-icon>
        <p class="config-manager__empty-text">
          No saved configurations yet
        </p>
      </div>
    </template>

    <!-- Save Modal -->
    <u-modal
      v-model:open="isSaveModalOpen"
      title="Save Configuration"
      description="Save your current format selections and options for quick access later."
    >
      <template #body>
        <div class="config-manager__save-form">
          <u-input-menu
            v-model="configName"
            :items="existingNames"
            placeholder="Enter configuration name..."
            class="w-full"
            autofocus
            create-item="always"
            @keydown.enter.prevent="handleSave"
          ></u-input-menu>

          <!-- Duplicate name warning -->
          <div v-if="hasNameConflict" class="config-manager__warning">
            <u-icon :name="resolveIcon('warning')" class="config-manager__warning-icon"></u-icon>
            <span>A configuration named "{{ existingConfigWithSameName?.name }}" already exists.</span>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="config-manager__modal-footer">
          <u-button variant="outline" @click="isSaveModalOpen = false">
            Cancel
          </u-button>
          <u-button
            :disabled="!configName.trim()"
            :color="hasNameConflict ? 'warning' : 'primary'"
            @click="handleSave"
          >
            {{ hasNameConflict ? 'Review...' : 'Save' }}
          </u-button>
        </div>
      </template>
    </u-modal>

    <!-- Overwrite Confirmation Modal -->
    <u-modal
      v-model:open="isOverwriteModalOpen"
      title="Configuration Exists"
      description="A configuration with this name already exists."
    >
      <template #body>
        <p class="config-manager__overwrite-text">
          "{{ existingConfigWithSameName?.name }}" already exists. What would you like to do?
        </p>
      </template>

      <template #footer>
        <div class="config-manager__modal-footer config-manager__modal-footer--three">
          <u-button variant="outline" @click="isOverwriteModalOpen = false">
            Cancel
          </u-button>
          <u-button variant="outline" @click="handleSaveAsNew">
            Save as New
          </u-button>
          <u-button color="warning" @click="handleOverwrite">
            Overwrite
          </u-button>
        </div>
      </template>
    </u-modal>

    <!-- Delete Confirmation Modal -->
    <u-modal
      v-model:open="isDeleteModalOpen"
      title="Delete Configuration"
      description="This action cannot be undone."
    >
      <template #body>
        <p>Are you sure you want to delete "{{ configToDelete?.name }}"?</p>
      </template>

      <template #footer>
        <div class="config-manager__modal-footer">
          <u-button variant="outline" @click="cancelDelete">
            Cancel
          </u-button>
          <u-button color="error" @click="confirmDelete">
            Delete
          </u-button>
        </div>
      </template>
    </u-modal>
  </div>
</template>

<script setup lang="ts">
import type { FormatOptions } from '#shared/data/style-dictionary-formats'
import type { SavedConfig } from '~/composables/use-token-configs'

interface Props {
  formats: string[]
  options: Record<string, FormatOptions>
  disabled?: boolean
}

interface Emits {
  (e: 'load', config: SavedConfig): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { configs, addConfig, deleteConfig, updateConfig } = useTokenConfigs()
const { resolveIcon } = useAppearance()

// Track if component is mounted (client-side only)
const isMounted = ref(false)
onMounted(() => {
  isMounted.value = true
})

const isSaveModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const isOverwriteModalOpen = ref(false)
const configName = ref('')
const configToDelete = ref<SavedConfig | null>(null)
const selectedConfigId = ref<string | undefined>(undefined)

const selectedConfig = computed(() => {
  if (!selectedConfigId.value)
    return undefined
  return configs.value.find(c => c.id === selectedConfigId.value)
})

// Format items for USelectMenu v3 (uses 'items' prop with 'label' field, and 'value-key' for v-model binding)
const configItems = computed(() => configs.value.map(c => ({
  id: c.id,
  label: c.name,
})))

// Existing config names for autocomplete suggestions
const existingNames = computed(() => configs.value.map(c => c.name))

// Check if entered name already exists (case-insensitive)
const existingConfigWithSameName = computed(() => {
  const trimmedName = configName.value.trim().toLowerCase()
  if (!trimmedName)
    return null
  return configs.value.find(c => c.name.toLowerCase() === trimmedName)
})

const hasNameConflict = computed(() => !!existingConfigWithSameName.value)

function handleSave() {
  if (!configName.value.trim())
    return

  // If name exists, show overwrite confirmation
  if (existingConfigWithSameName.value) {
    isOverwriteModalOpen.value = true
    return
  }

  addConfig(configName.value.trim(), props.formats, props.options)
  configName.value = ''
  isSaveModalOpen.value = false
}

function handleOverwrite() {
  if (!existingConfigWithSameName.value)
    return

  updateConfig(existingConfigWithSameName.value.id, props.formats, props.options)
  configName.value = ''
  isOverwriteModalOpen.value = false
  isSaveModalOpen.value = false
}

function handleSaveAsNew() {
  // Add a suffix to make the name unique
  const baseName = configName.value.trim()
  let newName = baseName
  let counter = 2

  while (configs.value.some(c => c.name.toLowerCase() === newName.toLowerCase())) {
    newName = `${baseName} (${counter})`
    counter++
  }

  addConfig(newName, props.formats, props.options)
  configName.value = ''
  isOverwriteModalOpen.value = false
  isSaveModalOpen.value = false
}

function handleLoad() {
  if (!selectedConfig.value)
    return
  emit('load', selectedConfig.value)
}

function openDeleteModal(config: SavedConfig) {
  configToDelete.value = config
  isDeleteModalOpen.value = true
}

function confirmDelete() {
  if (!configToDelete.value)
    return
  deleteConfig(configToDelete.value.id)

  // Clear selection if the deleted config was selected
  if (selectedConfigId.value === configToDelete.value.id) {
    selectedConfigId.value = undefined
  }

  configToDelete.value = null
  isDeleteModalOpen.value = false
}

function cancelDelete() {
  configToDelete.value = null
  isDeleteModalOpen.value = false
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>

<style scoped>
.config-manager {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.config-manager__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.config-manager__title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--ui-text);
  margin: 0;
}

.config-manager__content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.config-manager__select {
  width: 100%;
}

.config-manager__actions {
  display: flex;
  gap: 0.5rem;
}

.config-manager__details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: var(--ui-bg-muted);
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.config-manager__detail {
  display: flex;
  gap: 0.5rem;
}

.config-manager__detail-label {
  color: var(--ui-text-muted);
  font-weight: 500;
}

.config-manager__detail-value {
  color: var(--ui-text);
}

.config-manager__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 2rem 1rem;
  color: var(--ui-text-muted);
}

.config-manager__empty-icon {
  font-size: 2rem;
  opacity: 0.5;
}

.config-manager__empty-text {
  font-size: 0.875rem;
  margin: 0;
}

.config-manager__modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.config-manager__modal-footer--three {
  flex-wrap: wrap;
}

.config-manager__save-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.config-manager__warning {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.8125rem;
  color: var(--color-warning-600);
  background-color: color-mix(in oklch, var(--color-warning-500) 10%, transparent);
  border: 1px solid color-mix(in oklch, var(--color-warning-500) 30%, transparent);
  border-radius: 0.375rem;
}

.dark .config-manager__warning {
  color: var(--color-warning-400);
}

.config-manager__warning-icon {
  flex-shrink: 0;
  width: 1rem;
  height: 1rem;
}

.config-manager__overwrite-text {
  margin: 0;
  color: var(--ui-text);
}
</style>
