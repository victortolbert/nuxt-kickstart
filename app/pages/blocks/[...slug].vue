<template>
  <div v-if="block" class="flex gap-8 lg:gap-12">
    <article class="prose max-w-[70ch] min-w-0 flex-1">
      <div class="not-prose mb-8">
        <div class="flex items-center justify-between gap-3 mb-2">
          <nav aria-label="Breadcrumb" class="flex items-center gap-2 text-sm text-[var(--ui-text-muted)] min-w-0">
            <nuxt-link to="/blocks" class="shrink-0 whitespace-nowrap transition-colors hover:text-[var(--ui-text)]">
              {{ $t('nav.blocks') }}
            </nuxt-link>
            <u-icon :name="resolveIcon('chevronRight')" class="size-3.5 shrink-0"></u-icon>
            <span class="text-[var(--ui-text)] truncate min-w-0" :title="block.title">{{ block.title }}</span>
          </nav>
          <div class="flex items-center gap-2 shrink-0">
            <content-edit-link :path="`blocks/${slug}.md`" collection="blocks"></content-edit-link>
            <content-actions :title="block.title" :description="block.description"></content-actions>
          </div>
        </div>

        <h1 class="text-2xl sm:text-3xl font-bold text-[var(--ui-text)] mb-4">
          {{ block.title }}
        </h1>

        <div class="flex flex-wrap items-center gap-2">
          <u-badge
            v-if="block.blockType"
            :label="formatLabel(block.blockType)"
            variant="subtle"
          ></u-badge>
          <nuxt-link v-if="parentApp" :to="parentApp.path">
            <u-badge :label="parentApp.title" variant="outline"></u-badge>
          </nuxt-link>
          <status-indicator
            v-if="block.status"
            :status="block.status"
            size="md"
          ></status-indicator>
        </div>

        <div v-if="block.platforms?.length" class="flex flex-wrap gap-1 mt-4">
          <u-badge
            v-for="platform in block.platforms"
            :key="platform"
            :label="platform"
            size="sm"
            variant="subtle"
          ></u-badge>
        </div>
      </div>

      <content-renderer :value="block"></content-renderer>

      <div v-if="block.entryPoints?.length" class="not-prose mt-8">
        <h2 class="text-lg font-semibold mb-3">
          Entry Points
        </h2>
        <div class="flex flex-wrap gap-2">
          <u-badge
            v-for="entry in block.entryPoints"
            :key="entry"
            :label="entry"
            variant="outline"
          ></u-badge>
        </div>
      </div>

      <div v-if="block.jobsToBeDone?.length" class="not-prose mt-8">
        <h2 class="text-lg font-semibold mb-3">
          Jobs To Be Done
        </h2>
        <ul class="space-y-2">
          <li
            v-for="job in block.jobsToBeDone"
            :key="job"
            class="flex items-center gap-2"
          >
            <u-icon :name="resolveIcon('target')" class="size-4 text-[var(--ui-text-muted)]"></u-icon>
            <span>{{ job }}</span>
          </li>
        </ul>
      </div>
    </article>

    <aside v-if="block.body?.toc?.links?.length" class="hidden lg:block w-56 shrink-0">
      <div class="sticky top-20">
        <u-content-toc
          :links="block.body.toc.links"
          :title="$t('pages.toc')"
          highlight
        ></u-content-toc>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { resolveIcon } = useAppearance()

const { data: block } = await useAsyncData(`block-${route.path}`, () =>
  queryCollection('blocks').path(route.path).first())

if (!block.value) {
  throw createError({ statusCode: 404, message: 'Block not found' })
}

const { canAccess, redirectTo, errorCode } = useContentAccess(block.value)

if (!canAccess) {
  if (errorCode)
    throw createError({ statusCode: errorCode, message: 'Block not found' })
  if (redirectTo)
    await navigateTo(redirectTo)
}

const slug = computed(() => {
  const s = route.params.slug
  return Array.isArray(s) ? s.join('/') : s
})

// Fetch parent app
const { data: parentApp } = await useAsyncData(`parent-app-${block.value?.app}`, () =>
  queryCollection('apps').where('slug', '=', block.value?.app || '').first(), { watch: [() => block.value?.app] })
</script>
