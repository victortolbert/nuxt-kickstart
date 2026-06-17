import { computed, queryCollection, ref, watch } from '#imports'

type AllowedCollection = 'guides' | 'posts'

interface ContentItem {
  body?: unknown
  [key: string]: unknown
}

export function useContentEditor(collection: AllowedCollection, slug?: string) {
  // State
  const frontmatter = ref<Record<string, unknown>>({})
  const body = ref('')
  const isDirty = ref(false)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Determine if this is a new content item
  const isNew = computed(() => !slug)

  // Load existing content for edit mode
  async function loadContent(collectionName: AllowedCollection, contentSlug: string) {
    isLoading.value = true
    error.value = null

    try {
      // Note: Using type assertion for queryCollection due to Nuxt Content typing limitations
      const query = queryCollection as (name: string) => { path: (p: string) => { first: () => Promise<ContentItem | null> } }
      // Editing targets the English source; localized collections store it
      // under /en/<collection>/<slug> (see use-localized-collection.ts)
      const sourcePath = isLocalizedCollection(collectionName)
        ? `/en/${collectionName}/${contentSlug}`
        : `/${collectionName}/${contentSlug}`
      const content = await query(collectionName)
        .path(sourcePath)
        .first()

      if (!content) {
        error.value = 'Content not found'
        return
      }

      // Extract frontmatter and body from content
      // Content from Nuxt Content includes both frontmatter fields and _path, _id, etc.
      const { body: contentBody, ...fm } = content

      // Filter out internal Nuxt Content fields (starting with _)
      const cleanFrontmatter = Object.fromEntries(
        Object.entries(fm).filter(([key]) => !key.startsWith('_')),
      )

      frontmatter.value = cleanFrontmatter
      body.value = typeof contentBody === 'string' ? contentBody : ''
      isDirty.value = false
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load content'
    }
    finally {
      isLoading.value = false
    }
  }

  // Save content (POST for new, PUT for existing)
  async function saveContent() {
    isLoading.value = true
    error.value = null

    try {
      const payload = {
        frontmatter: frontmatter.value,
        body: body.value,
      }

      if (isNew.value) {
        // POST to create new content
        const response = await $fetch(`/api/content/${collection}`, {
          method: 'POST',
          body: payload,
        })
        return response
      }
      else {
        // PUT to update existing content
        const response = await $fetch(`/api/content/${collection}/${slug}`, {
          method: 'PUT',
          body: payload,
        })
        return response
      }
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to save content'
      throw err
    }
    finally {
      isLoading.value = false
    }
  }

  // Reset dirty flag (called after successful save)
  function resetDirty() {
    isDirty.value = false
  }

  // Watch for changes to frontmatter and body to track dirty state
  watch(frontmatter, () => {
    isDirty.value = true
  }, { deep: true })

  watch(body, () => {
    isDirty.value = true
  })

  return {
    frontmatter,
    body,
    isDirty,
    isLoading,
    error,
    isNew,
    loadContent,
    saveContent,
    resetDirty,
  }
}
