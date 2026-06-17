<template>
  <div class="flex flex-col gap-4">
    <!-- Search input -->
    <div v-if="showSearch" class="w-full">
      <u-input
        v-model="search"
        type="search"
        :icon="resolveIcon('filter')"
        placeholder="Filter…"
        size="sm"
        class="w-full"
      ></u-input>
    </div>

    <div class="flex flex-wrap items-center justify-between gap-4">
      <!-- Status filters -->
      <div
        class="flex items-center gap-2"
        role="group"
        aria-label="Filter by status"
      >
        <div class="flex gap-1">
          <u-button
            v-for="status in statusOptions"
            :key="status.value"
            :icon="status.icon"
            :label="status.label"
            :color="status.color"
            :variant="selectedStatuses.includes(status.value) ? 'subtle' : 'ghost'"
            size="xs"
            @click="toggleStatus(status.value)"
          ></u-button>
        </div>
      </div>

      <!-- Visibility filters — only relevant to authenticated users
           (guests only ever see public content via useVisibilityFilter) -->
      <div
        v-if="loggedIn"
        class="flex items-center gap-2"
        role="group"
        aria-label="Filter by visibility"
      >
        <div class="flex gap-1">
          <u-button
            v-for="visibility in visibilityOptions"
            :key="visibility.value"
            :icon="visibility.icon"
            :label="visibility.label"
            :color="selectedVisibilities.includes(visibility.value) ? 'primary' : 'neutral'"
            :variant="selectedVisibilities.includes(visibility.value) ? 'subtle' : 'ghost'"
            size="xs"
            @click="toggleVisibility(visibility.value)"
          ></u-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Filters {
  search: string
  statuses: string[]
  visibilities: string[]
}

const props = defineProps<{
  statuses?: string[]
  visibilities?: string[]
  showSearch?: boolean
}>()

const emit = defineEmits<{
  'update:filters': [filters: Filters]
}>()

const { resolveIcon } = useAppearance()
const { loggedIn } = useSessionState()

// Derived from the garden-status source of truth so the filter shows each
// status in its own color + icon (see app/utils/garden-status.ts).
const statusOptions = computed(() =>
  GARDEN_STATUSES.map(value => ({
    label: formatLabel(value),
    value,
    icon: resolveIcon(gardenStatus(value).icon),
    color: gardenStatus(value).color,
  })),
)

const visibilityOptions = computed(() => [
  { label: 'Public', value: 'public', icon: resolveIcon('globe') },
  { label: 'Internal', value: 'internal', icon: resolveIcon('lock') },
  { label: 'Private', value: 'private', icon: resolveIcon('eyeOff') },
])

const search = ref('')
const selectedStatuses = ref<string[]>(props.statuses || [])
const selectedVisibilities = ref<string[]>(props.visibilities || [])

function toggleStatus(status: string) {
  const current = [...selectedStatuses.value]
  const index = current.indexOf(status)
  if (index === -1) {
    current.push(status)
  }
  else {
    current.splice(index, 1)
  }
  selectedStatuses.value = current
  emitFilters()
}

function toggleVisibility(visibility: string) {
  const current = [...selectedVisibilities.value]
  const index = current.indexOf(visibility)
  if (index === -1) {
    current.push(visibility)
  }
  else {
    current.splice(index, 1)
  }
  selectedVisibilities.value = current
  emitFilters()
}

function emitFilters() {
  emit('update:filters', {
    search: search.value,
    statuses: selectedStatuses.value,
    visibilities: selectedVisibilities.value,
  })
}

// Watch search input and emit changes
watch(search, () => {
  emitFilters()
})
</script>
