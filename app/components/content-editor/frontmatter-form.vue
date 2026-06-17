<template>
  <div class="space-y-4">
    <!-- Title (required) -->
    <div>
      <label for="title" class="block text-sm font-medium mb-1">
        Title <span class="text-red-500" aria-hidden="true">*</span>
        <span class="sr-only">(required)</span>
      </label>
      <u-input
        id="title"
        :model-value="formData.title"
        placeholder="Enter title..."
        required
        class="w-full"
        @blur="handleTitleBlur"
        @update:model-value="updateField('title', $event)"
      ></u-input>
    </div>

    <!-- Slug -->
    <div>
      <label for="slug" class="block text-sm font-medium mb-1">
        Slug
      </label>
      <u-input
        id="slug"
        :model-value="formData.slug"
        placeholder="auto-generated-from-title"
        class="w-full"
        @update:model-value="updateField('slug', $event)"
      ></u-input>
      <p class="text-xs text-muted mt-1">
        Leave empty to auto-generate from title
      </p>
    </div>

    <!-- Description -->
    <div>
      <label for="description" class="block text-sm font-medium mb-1">
        Description
      </label>
      <rich-text-editor
        :model-value="formData.description"
        content-type="markdown"
        :toolbar="false"
        min-height="100px"
        placeholder="Brief description..."
        @update:model-value="updateField('description', $event)"
      ></rich-text-editor>
    </div>

    <!-- Status -->
    <div>
      <label for="status" class="block text-sm font-medium mb-1">
        Status
      </label>
      <u-select
        id="status"
        :model-value="formData.status"
        :items="statusOptions"
        class="w-full"
        @update:model-value="updateField('status', $event)"
      ></u-select>
    </div>

    <!-- Visibility -->
    <div>
      <label for="visibility" class="block text-sm font-medium mb-1">
        Visibility
      </label>
      <u-select
        id="visibility"
        :model-value="formData.visibility"
        :items="visibilityOptions"
        class="w-full"
        @update:model-value="updateField('visibility', $event)"
      ></u-select>
    </div>

    <!-- Created Date -->
    <div>
      <label for="created" class="block text-sm font-medium mb-1">
        Created
      </label>
      <u-input
        id="created"
        :model-value="formData.created"
        type="date"
        @update:model-value="updateField('created', $event)"
      ></u-input>
    </div>

    <!-- Tags (all collections) -->
    <div>
      <label for="tags" class="block text-sm font-medium mb-1">
        Tags
      </label>
      <u-input
        id="tags"
        :model-value="formData.tags?.join(', ') || ''"
        placeholder="tag1, tag2, tag3"
        class="w-full"
        @update:model-value="updateTags($event ? $event.split(',').map((t: string) => t.trim()).filter(Boolean) : [])"
      ></u-input>
      <p class="text-xs text-muted mt-1">
        Comma-separated tags
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  collection: string
  modelValue: Record<string, any>
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, any>]
}>()

const { resolveIcon } = useAppearance()

// Status options for dropdown. Computed so the icons react to the user's
// icon-collection appearance setting (see app/utils/garden-status.ts).
const statusOptions = computed(() => [
  { label: 'Seed', value: 'seed', icon: resolveIcon(gardenStatus('seed').icon) },
  { label: 'Sprout', value: 'sprout', icon: resolveIcon(gardenStatus('sprout').icon) },
  { label: 'Evergreen', value: 'evergreen', icon: resolveIcon(gardenStatus('evergreen').icon) },
  { label: 'Wilted', value: 'wilted', icon: resolveIcon(gardenStatus('wilted').icon) },
])

// Visibility options for dropdown
const visibilityOptions = [
  { label: 'Private', value: 'private' },
  { label: 'Internal', value: 'internal' },
  { label: 'Public', value: 'public' },
]

// Local reactive state for form fields
const formData = ref<Record<string, any>>({
  title: '',
  slug: '',
  description: '',
  status: 'seed',
  visibility: 'private',
  created: new Date().toISOString().split('T')[0],
  tags: [],
  ...props.modelValue,
})

// Watch for external changes to modelValue
watch(() => props.modelValue, (newValue) => {
  formData.value = { ...formData.value, ...newValue }
}, { deep: true })

// Update parent when form data changes
watch(formData, (newValue) => {
  emit('update:modelValue', { ...newValue })
}, { deep: true })

// Auto-generate slug from title on blur if slug is empty
function handleTitleBlur() {
  if (!formData.value.slug && formData.value.title) {
    formData.value.slug = toKebabCase(formData.value.title)
  }
}

// Update individual field
function updateField(field: string, value: any) {
  formData.value[field] = value
}

// Handle tag input updates
function updateTags(value: string[]) {
  formData.value.tags = value
}
</script>
