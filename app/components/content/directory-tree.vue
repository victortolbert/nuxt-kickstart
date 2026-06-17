<template>
  <u-tree
    :items="decoratedItems"
    :default-expanded="expandedKeys"
    :collapsed-icon="resolveIcon('folder')"
    :expanded-icon="resolveIcon('folderOpen')"
    class="my-5 not-prose"
  >
    <template #item-label="{ item }">
      <span class="font-medium">{{ item.label }}</span>
      <span
        v-if="(item as DirectoryTreeItem).comment"
        class="ms-3 text-xs text-muted"
      >{{ (item as DirectoryTreeItem).comment }}</span>
    </template>
  </u-tree>
</template>

<script setup lang="ts">
import type { TreeItem } from '@nuxt/ui'

/**
 * Directory layout tree for markdown content.
 *
 * Usage in MDC:
 *   ::directory-tree
 *   ---
 *   items:
 *     - label: app/
 *       comment: Nuxt app (alias ~ or @)
 *       children:
 *         - label: components/
 *           comment: Vue components, kebab-case
 *   ---
 *   ::
 *
 * Labels ending in `/` are treated as directories; everything else gets a
 * file icon. Parent folders use the expand/collapse folder icons.
 */
interface DirectoryTreeItem extends TreeItem {
  comment?: string
  children?: DirectoryTreeItem[]
}

const props = defineProps<{
  items: DirectoryTreeItem[]
}>()

const { resolveIcon } = useAppearance()

// Leaves get an explicit icon (parents use the tree's folder icons)
const decoratedItems = computed(() => {
  const decorate = (item: DirectoryTreeItem): DirectoryTreeItem => ({
    ...item,
    icon: item.icon ?? (item.children?.length
      ? undefined
      : resolveIcon(item.label?.endsWith('/') ? 'folder' : 'file')),
    children: item.children?.map(decorate),
  })
  return props.items.map(decorate)
})

// Documentation tree: everything visible by default
const expandedKeys = computed(() => {
  const keys: string[] = []
  const walk = (items: DirectoryTreeItem[]) => {
    for (const item of items) {
      if (item.children?.length && item.label) {
        keys.push(item.label)
        walk(item.children)
      }
    }
  }
  walk(props.items)
  return keys
})
</script>
