<template>
  <div class="container mx-auto py-8 px-4">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <nuxt-link :to="`/${collection}`">
            <u-button
              :icon="resolveIcon('arrowLeft')"
              color="neutral"
              variant="ghost"
              size="sm"
              label="Back"
            ></u-button>
          </nuxt-link>
        </div>

        <u-button
          :icon="resolveIcon('save')"
          color="primary"
          label="Save"
          :loading="isLoading"
          :disabled="!isDirty || isLoading"
          @click="handleSave"
        ></u-button>
      </div>

      <h1 class="text-3xl font-bold">
        Edit {{ formatLabel(collection) }}
      </h1>
      <p class="text-muted mt-2">
        Editing: {{ slug }}
      </p>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading && !frontmatter.title" class="bg-elevated p-8 rounded-lg">
      <p class="text-muted">
        Loading content...
      </p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="bg-elevated p-8 rounded-lg">
      <p class="text-error">
        {{ error }}
      </p>
    </div>

    <!-- Editor content -->
    <template v-else>
      <!-- Frontmatter Form -->
      <div class="bg-elevated p-8 rounded-lg mb-6">
        <h2 class="text-xl font-semibold mb-4">
          Frontmatter
        </h2>
        <content-editor-frontmatter-form
          v-model="frontmatter"
          :collection="collection"
        ></content-editor-frontmatter-form>
      </div>

      <!-- Markdown Editor -->
      <div class="bg-elevated p-8 rounded-lg mb-6">
        <h2 class="text-xl font-semibold mb-4">
          Content Body
        </h2>
        <content-editor-markdown-editor v-model="body"></content-editor-markdown-editor>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'admin',
})

const route = useRoute()
const router = useRouter()
const toast = useToast()
const confirm = useConfirmDialog()
const { resolveIcon } = useAppearance()
const collection = computed(() => route.params.collection as string)
const slug = computed(() => {
  const s = route.params.slug
  return Array.isArray(s) ? s.join('/') : (s ?? '')
})

// Validate collection
const allowedCollections = ['guides', 'posts']
if (!allowedCollections.includes(collection.value)) {
  throw createError({ statusCode: 404, message: 'Collection not found' })
}

// Use the content editor composable
const {
  frontmatter,
  body,
  isDirty,
  isLoading,
  error,
  loadContent,
  saveContent,
  resetDirty,
} = useContentEditor(collection.value as 'guides' | 'posts', slug.value)

// Load existing content on mount
onMounted(async () => {
  if (slug.value) {
    await loadContent(collection.value as 'guides' | 'posts', slug.value)
  }
})

// Save functionality
async function handleSave() {
  try {
    const response = await saveContent() as { slug: string, path: string }

    toast.add({
      title: 'Content saved',
      description: 'Your changes have been saved successfully',
      color: 'success',
    })

    resetDirty()

    // Redirect to the content detail page
    await router.push(`/${collection.value}/${response.slug}`)
  }
  catch (err) {
    toast.add({
      title: 'Save failed',
      description: err instanceof Error ? err.message : 'Failed to save content',
      color: 'error',
    })
  }
}

// Keyboard shortcut for save (Cmd+S / Ctrl+S)
function handleKeyDown(event: KeyboardEvent) {
  if ((event.metaKey || event.ctrlKey) && event.key === 's') {
    event.preventDefault()
    if (!isLoading.value && isDirty.value) {
      handleSave()
    }
  }
}

// Unsaved changes warning - browser navigation
function handleBeforeUnload(event: BeforeUnloadEvent) {
  if (isDirty.value) {
    event.preventDefault()
    event.returnValue = '' // Required for Chrome
  }
}

// Unsaved changes warning - Vue Router navigation
onBeforeRouteLeave(async () => {
  if (isDirty.value) {
    const confirmed = await confirm({
      title: 'Unsaved changes',
      description: 'You have unsaved changes. Leave anyway?',
      confirmLabel: 'Leave',
      cancelLabel: 'Stay',
      confirmColor: 'error',
      icon: resolveIcon('warning'),
    })
    if (!confirmed) {
      return false
    }
  }
})

// Register keyboard listener
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('beforeunload', handleBeforeUnload)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('beforeunload', handleBeforeUnload)
})
</script>
