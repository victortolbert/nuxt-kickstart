<template>
  <div class="w-full max-w-3xl mx-auto px-4 py-8 flex flex-col gap-8 md:px-6 md:py-12">
    <header class="flex flex-col gap-3">
      <h1 class="text-3xl font-bold posts-heading">
        {{ t('nav.posts') }}
      </h1>
      <p class="text-sm posts-subheading">
        {{ t('pages.posts.subtitle') }}
      </p>
      <u-input
        v-model="searchQuery"
        :icon="resolveIcon('filter')"
        :placeholder="t('pages.posts.filterPlaceholder')"
        :aria-label="t('pages.posts.filterPlaceholder')"
        class="w-full sm:max-w-sm"
      ></u-input>
    </header>

    <div v-if="filtered.length" class="flex flex-col gap-4">
      <nuxt-link
        v-for="post in filtered"
        :key="post.path"
        :to="post.path"
        class="flex flex-col gap-1 rounded-sm border p-4 post-item"
      >
        <div class="flex items-center justify-between gap-3">
          <h2 class="text-lg font-semibold post-item__title">
            {{ post.title }}
          </h2>
          <span class="text-xs shrink-0 post-item__date">{{ formatDate(post.date) }}</span>
        </div>
        <p v-if="post.description" class="text-sm post-item__description">
          {{ post.description }}
        </p>
      </nuxt-link>
    </div>
    <p v-else class="text-sm posts-subheading">
      {{ t('pages.posts.empty') }}
    </p>
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useI18n()
const { resolveIcon } = useAppearance()

useHead({
  title: () => t('nav.posts'),
})

const { data: posts } = await useAsyncData('posts-index', () =>
  queryCollection('posts').order('date', 'DESC').all())

// URL-synced filter
const searchQuery = useUrlStringFilter('q')

const filtered = computed(() => {
  if (!posts.value)
    return []
  const items = useVisibilityFilter(posts.value)
  if (!searchQuery.value)
    return items
  const query = searchQuery.value.toLowerCase()
  return items.filter(item =>
    item.title?.toLowerCase().includes(query)
    || item.description?.toLowerCase().includes(query),
  )
})

const dateFormatter = computed(() => new Intl.DateTimeFormat(locale.value, {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
}))

function formatDate(dateStr: string | undefined): string {
  if (!dateStr)
    return ''
  return dateFormatter.value.format(new Date(dateStr))
}
</script>

<style scoped>
.posts-heading {
  color: var(--ui-text);
}

.posts-subheading {
  color: var(--ui-text-muted);
}

.post-item {
  border-color: var(--ui-border);
  background: var(--ui-bg);
  transition: border-color 0.15s, background 0.15s;
}

.post-item:hover {
  border-color: var(--ui-border-accented);
  background: var(--ui-bg-elevated);
}

.post-item:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: -2px;
}

.post-item__title {
  color: var(--ui-text);
}

.post-item__date,
.post-item__description {
  color: var(--ui-text-muted);
}
</style>
