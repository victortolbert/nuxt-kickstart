<template>
  <nuxt-link
    v-if="editLink"
    :href="editLink"
    target="_blank"
    rel="noopener"
    class="inline-flex items-center gap-1.5 text-sm text-muted hover:text-default transition-colors"
  >
    <u-icon :name="resolveIcon('edit')" class="size-4"></u-icon>
    <span>{{ t('content.actions.editPage') }}</span>
  </nuxt-link>
</template>

<script setup lang="ts">
interface Props {
  path: string
  collection?: string
}

const props = defineProps<Props>()

const { t } = useI18n()
const { resolveIcon } = useAppearance()

const editLink = useContentEditLink(props.path, props.collection)
</script>
