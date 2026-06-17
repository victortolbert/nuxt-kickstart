<template>
  <u-button
    v-if="shouldRender"
    :to="editUrl"
    target="_blank"
    icon="i-tabler-brand-github"
    size="sm"
    variant="ghost"
    external
    aria-label="Edit this page on GitHub"
  >
    Edit on GitHub
  </u-button>
</template>

<script setup lang="ts">
const props = defineProps<{
  collection: string
  slug: string
}>()

const appConfig = useAppConfig()

// Only render if contentRepo is configured
const shouldRender = computed(() => !!appConfig.contentRepo)

// Construct the GitHub edit URL
const editUrl = computed(() => {
  if (!appConfig.contentRepo)
    return ''
  return `${appConfig.contentRepo}/edit/${appConfig.contentBranch}/content/${props.collection}/${props.slug}.md`
})
</script>
