<template>
  <u-slideover
    v-model:open="isOpen"
    title="Component Catalog"
    description="Browse available UI components and preview themes"
    side="right"
  >
    <template #body>
      <div class="p-4 space-y-6">
        <!-- Theme Selector -->
        <div>
          <h3 class="text-sm font-medium text-muted mb-2">
            Quick Theme Switch
          </h3>
          <div class="flex flex-wrap gap-2">
            <u-button
              v-for="t in themes"
              :key="t.id"
              :variant="theme === t.id ? 'solid' : 'outline'"
              :color="theme === t.id ? 'primary' : 'neutral'"
              size="sm"
              :icon="t.icon"
              @click="selectTheme(t.id)"
            >
              {{ t.label }}
            </u-button>
          </div>
        </div>

        <u-separator></u-separator>

        <!-- Component Categories -->
        <div class="space-y-2">
          <div
            v-for="category in categories"
            :key="category.label"
            class="border border-default rounded-lg overflow-hidden"
          >
            <!-- Category Header -->
            <button
              class="w-full p-3 flex items-center justify-between bg-muted hover:bg-accented focus-visible:ring-2 focus-visible:ring-(--color-primary-500) focus-visible:outline-none transition-colors"
              @click="toggleCategory(category.label)"
            >
              <div class="flex items-center gap-2">
                <u-icon :name="category.icon" class="size-4"></u-icon>
                <span class="font-medium text-sm">{{ category.label }}</span>
                <u-badge color="neutral" size="sm">
                  {{ category.items.length }}
                </u-badge>
              </div>
              <u-icon
                :name="isExpanded(category.label) ? resolveIcon('chevronUp') : resolveIcon('chevronDown')"
                class="size-4"
              ></u-icon>
            </button>

            <!-- Category Items -->
            <div v-if="isExpanded(category.label)" class="p-2 space-y-1">
              <nuxt-link
                v-for="item in category.items"
                :key="item.name"
                :to="item.to"
                class="block p-2 rounded hover:bg-muted transition-colors"
                :class="{ 'cursor-default': !item.to }"
              >
                <div class="font-mono text-sm">
                  {{ item.name }}
                </div>
                <div class="text-xs text-muted">
                  {{ item.description }}
                </div>
              </nuxt-link>
            </div>
          </div>
        </div>

        <!-- Preview Area -->
        <div>
          <h3 class="text-sm font-medium text-muted mb-2">
            Live Preview
          </h3>
          <div class="p-4 border border-default rounded-lg bg-elevated space-y-4">
            <div class="flex flex-wrap gap-2">
              <u-button color="primary" size="sm">
                Primary
              </u-button>
              <u-button color="neutral" size="sm">
                Neutral
              </u-button>
              <u-button
                color="primary"
                variant="outline"
                size="sm"
              >
                Outline
              </u-button>
            </div>
            <div class="flex flex-wrap gap-2">
              <u-badge color="primary">
                Primary
              </u-badge>
              <u-badge color="success">
                Success
              </u-badge>
              <u-badge color="warning">
                Warning
              </u-badge>
              <u-badge color="error">
                Error
              </u-badge>
            </div>
            <u-input
              placeholder="Input field preview…"
              size="sm"
              aria-label="Input preview"
            ></u-input>
            <div class="flex items-center gap-4">
              <u-checkbox label="Checkbox"></u-checkbox>
              <u-switch label="Switch"></u-switch>
            </div>
          </div>
        </div>
      </div>
    </template>
  </u-slideover>
</template>

<script setup lang="ts">
import type { ThemeId } from '~~/shared/types/theme'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const isOpen = computed({
  get: () => props.open,
  set: value => emit('update:open', value),
})

const { theme, themes, setTheme } = useTheme()
const { resolveIcon } = useAppearance()

interface ComponentItem {
  name: string
  description: string
  to?: string
}

interface ComponentCategory {
  label: string
  icon: string
  items: ComponentItem[]
}

const categories = computed<ComponentCategory[]>(() => [
  {
    label: 'Layout',
    icon: resolveIcon('layout'),
    items: [
      { name: 'UContainer', description: 'Responsive container' },
      { name: 'UCard', description: 'Card component' },
      { name: 'USeparator', description: 'Visual separator' },
      { name: 'USkeleton', description: 'Loading placeholder' },
    ],
  },
  {
    label: 'Forms',
    icon: resolveIcon('forms'),
    items: [
      { name: 'UButton', description: 'Clickable button' },
      { name: 'UInput', description: 'Text input field' },
      { name: 'UTextarea', description: 'Multi-line text input' },
      { name: 'USelect', description: 'Dropdown select' },
      { name: 'UCheckbox', description: 'Checkbox input' },
      { name: 'URadio', description: 'Radio input' },
      { name: 'USwitch', description: 'Toggle switch' },
    ],
  },
  {
    label: 'Data Display',
    icon: resolveIcon('table'),
    items: [
      { name: 'UTable', description: 'Data table' },
      { name: 'UBadge', description: 'Status badge' },
      { name: 'UAvatar', description: 'User avatar' },
      { name: 'UIcon', description: 'Icon display' },
      { name: 'UProgress', description: 'Progress indicator' },
    ],
  },
  {
    label: 'Navigation',
    icon: resolveIcon('compass'),
    items: [
      { name: 'UNavigationMenu', description: 'Nav menu' },
      { name: 'UTabs', description: 'Tab navigation' },
      { name: 'UBreadcrumb', description: 'Breadcrumb trail' },
      { name: 'UPagination', description: 'Page navigation' },
    ],
  },
  {
    label: 'Overlay',
    icon: resolveIcon('stack'),
    items: [
      { name: 'UModal', description: 'Modal dialog' },
      { name: 'USlideover', description: 'Slide-out panel' },
      { name: 'UDropdownMenu', description: 'Dropdown menu' },
      { name: 'UTooltip', description: 'Hover tooltip' },
      { name: 'UPopover', description: 'Popover content' },
    ],
  },
  {
    label: 'Custom',
    icon: resolveIcon('puzzle'),
    items: [
      { name: 'TechBadge', description: 'Tech stack badge' },
      { name: 'WorldClock', description: 'Multiple timezone clock' },
    ],
  },
])

const expandedCategories = ref<string[]>(['Layout', 'Forms'])

function toggleCategory(label: string) {
  const index = expandedCategories.value.indexOf(label)
  if (index === -1) {
    expandedCategories.value.push(label)
  }
  else {
    expandedCategories.value.splice(index, 1)
  }
}

function isExpanded(label: string) {
  return expandedCategories.value.includes(label)
}

function selectTheme(id: ThemeId) {
  setTheme(id)
}
</script>
