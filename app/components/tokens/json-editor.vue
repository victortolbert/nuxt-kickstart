<template>
  <div class="json-editor">
    <div class="editor-toolbar">
      <div class="toolbar-left">
        <span v-if="!isValid" class="validation-error">
          <u-icon :name="resolveIcon('caution')" class="error-icon"></u-icon>
          {{ errors[0] }}
        </span>
      </div>
      <div class="toolbar-right">
        <u-button
          :icon="resolveIcon('code')"
          color="neutral"
          variant="ghost"
          size="sm"
          :disabled="readonly || !modelValue || !isValid"
          @click="formatJSON"
        >
          Format JSON
        </u-button>
        <u-button
          :icon="resolveIcon('trash')"
          color="neutral"
          variant="ghost"
          size="sm"
          :disabled="readonly || !modelValue"
          @click="clearEditor"
        >
          Clear
        </u-button>
      </div>
    </div>

    <client-only>
      <component
        :is="MonacoEditor"
        v-if="MonacoEditor"
        :value="modelValue"
        language="json"
        :options="{
          readOnly: readonly,
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          automaticLayout: true,
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          theme: monacoTheme,
        }"
        :height="300"
        @mount="handleEditorMount"
        @change="handleChange"
      ></component>
      <template #fallback>
        <u-textarea
          :model-value="modelValue"
          :placeholder="placeholder"
          :readonly="readonly"
          :rows="15"
          class="fallback-textarea"
          @update:model-value="handleChange"
        ></u-textarea>
      </template>
    </client-only>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, shallowRef, watch } from 'vue'

interface Props {
  modelValue: string
  readonly?: boolean
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false,
  placeholder: 'Paste or edit JSON here...',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'validation-change': [payload: { valid: boolean, errors: string[] }]
}>()

const colorMode = useColorMode()
const { resolveIcon } = useAppearance()
const editorInstance = ref()
const isValid = ref(true)
const errors = ref<string[]>([])
const MonacoEditor = shallowRef()

// Compute Monaco theme based on color mode
const monacoTheme = computed(() => colorMode.value === 'dark' ? 'vs-dark' : 'vs')

// Load Monaco editor dynamically for client-side only
if (import.meta.client) {
  import('@guolao/vue-monaco-editor').then((module) => {
    MonacoEditor.value = module.default
  })
}

// Monaco editor instance type
interface MonacoEditorInstance {
  getValue: () => string
  setValue: (value: string) => void
}

function handleEditorMount(editor: MonacoEditorInstance) {
  editorInstance.value = editor
}

function handleChange(value: string | undefined) {
  const newValue = value || ''
  emit('update:modelValue', newValue)
  validateJSON(newValue)
}

function validateJSON(value: string) {
  if (!value.trim()) {
    isValid.value = true
    errors.value = []
    emit('validation-change', { valid: true, errors: [] })
    return
  }

  try {
    JSON.parse(value)
    isValid.value = true
    errors.value = []
    emit('validation-change', { valid: true, errors: [] })
  }
  catch (error) {
    isValid.value = false
    const errorMessage = error instanceof Error ? error.message : 'Invalid JSON'
    errors.value = [errorMessage]
    emit('validation-change', { valid: false, errors: [errorMessage] })
  }
}

function formatJSON() {
  if (!props.modelValue)
    return

  try {
    const parsed = JSON.parse(props.modelValue)
    const formatted = JSON.stringify(parsed, null, 2)
    emit('update:modelValue', formatted)
  }
  catch {
    // Ignore format errors - user will see validation error
  }
}

function clearEditor() {
  emit('update:modelValue', '')
  validateJSON('')
}

// Validate on mount
watch(() => props.modelValue, (newVal) => {
  validateJSON(newVal)
}, { immediate: true })
</script>

<style scoped>
.json-editor {
  width: 100%;
  border: 1px solid var(--ui-border);
  border-radius: var(--ui-radius);
  overflow: hidden;
}

.editor-toolbar {
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

.validation-error {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--color-error-500);
  font-size: 0.875rem;
}

.error-icon {
  flex-shrink: 0;
}

.fallback-textarea {
  font-family: 'JetBrains Mono Variable', monospace;
  font-size: 0.875rem;
  line-height: 1.5;
}
</style>
