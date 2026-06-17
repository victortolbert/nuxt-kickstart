<template>
  <div v-if="page" class="flex gap-8 lg:gap-12 min-w-0">
    <!-- Main content -->
    <article
      class="prose max-w-[70ch] min-w-0 flex-1 overflow-hidden"
      :data-page-url="`${$config.public.siteUrl || 'https://nuxt-kickstart.example.com'}${$route.fullPath}`"
    >
      <div class="not-prose mb-8 print:mb-0">
        <!-- Breadcrumb and actions - hidden in print -->
        <div class="flex items-center justify-between gap-3 mb-2 print:hidden">
          <nav aria-label="Breadcrumb" class="flex items-center gap-2 text-sm text-muted min-w-0">
            <nuxt-link :to="parentPath" class="shrink-0 whitespace-nowrap hover:underline">
              {{ parentLabel }}
            </nuxt-link>
            <u-icon :name="resolveIcon('chevronRight')" class="size-4 shrink-0"></u-icon>
            <span class="truncate min-w-0" :title="page.title ?? 'Untitled'">{{ page.title ?? 'Untitled' }}</span>
          </nav>
          <div class="flex items-center gap-2 shrink-0">
            <content-edit-link :path="`${slug}.md`" :collection="page._collection"></content-edit-link>
            <content-actions :title="page.title ?? ''" :description="page.description ?? ''"></content-actions>
          </div>
        </div>

        <h1 class="text-3xl font-bold">
          {{ page.title ?? 'Untitled' }}
        </h1>

        <!-- Status badges - hidden in print -->
        <div class="flex flex-wrap items-center gap-2 mt-4 print:hidden">
          <u-badge
            v-if="page.status"
            :label="formatLabel(page.status ?? '')"
            variant="subtle"
          ></u-badge>
          <u-badge
            v-if="page.visibility"
            :label="formatLabel(page.visibility ?? '')"
            variant="outline"
          ></u-badge>
        </div>

        <!-- Tags - hidden in print -->
        <div v-if="page.tags?.length" class="flex flex-wrap gap-1 mt-4 print:hidden">
          <u-badge
            v-for="tag in page.tags ?? []"
            :key="tag"
            :label="formatTag(tag)"
            size="sm"
            variant="subtle"
          ></u-badge>
        </div>
      </div>

      <content-renderer :value="page"></content-renderer>
    </article>

    <!-- Table of Contents sidebar -->
    <aside
      v-if="page.body && typeof page.body !== 'string' && page.body?.toc?.links?.length"
      class="hidden lg:block w-56 shrink-0 print:hidden"
    >
      <div class="sticky top-20">
        <u-content-toc
          :links="(page.body && typeof page.body !== 'string' && page.body.toc?.links) ? page.body.toc.links : []"
          :title="$t('pages.toc')"
          highlight
          color="neutral"
          highlight-color="primary"
          :ui="{ link: 'text-xs', trigger: 'text-xs' }"
          @move="onTocMove"
        ></u-content-toc>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import type { Collections } from '@nuxt/content'

// TOC link type for UContentToc
interface TocLink {
  id: string
  depth: number
  text: string
  children?: TocLink[]
}

// Helper type for content with common base fields
interface ContentPage {
  _collection: keyof Collections
  title?: string
  description?: string
  status?: string
  visibility?: 'public' | 'internal' | 'private'
  tags?: string[]
  body?: { toc?: { links?: TocLink[] } } | string
}

const route = useRoute()
const { resolveIcon } = useAppearance()
const slug = computed(() => {
  const s = route.params.slug
  return Array.isArray(s) ? s.join('/') : (s ?? '')
})

// Try to find content in any collection
const { data: page } = await useAsyncData(`page-${slug.value}`, async () => {
  const collections: (keyof Collections)[] = [
    'tech',
    'posts',
  ]

  const currentSlug = slug.value
  if (!currentSlug)
    return null

  for (const collection of collections) {
    if (currentSlug.startsWith(collection)) {
      try {
        const result = await queryCollection(collection).path(`/${currentSlug}`).first()
        if (result)
          return { ...result, _collection: collection } as ContentPage
      }
      catch {
        // Continue to next collection
      }
    }
  }
  return null
})

if (!page.value) {
  throw createError({ statusCode: 404, message: 'Page not found' })
}

useHead({
  title: () => page.value?.title ?? 'Untitled',
})

const access = useContentAccess(page.value)
if (!access.canAccess) {
  if (access.redirectTo) {
    await navigateTo(access.redirectTo)
  }
  else {
    throw createError({ statusCode: access.errorCode ?? 404, message: 'Page not found' })
  }
}

const parentPath = computed(() => {
  const parts = slug.value.split('/')
  const first = parts[0] ?? ''
  return `/${first}`
})

const parentLabel = computed(() => {
  const parts = slug.value.split('/')
  const first = parts[0] ?? ''
  return first.charAt(0).toUpperCase() + first.slice(1)
})

// Handle TOC navigation - scroll to section
function onTocMove(id: string) {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>
