<template>
  <div class="h-full w-full flex flex-col bg-slate-900 text-white p-12">
    <!-- Top bar with collection badge -->
    <div class="flex items-center justify-between mb-8">
      <div v-if="collection" class="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg">
        <span class="text-xl text-slate-400 capitalize">{{ collection }}</span>
      </div>
      <div
        v-if="status"
        class="px-4 py-2 rounded-lg text-xl font-medium capitalize"
        :class="statusColors[status] || 'bg-slate-700'"
      >
        {{ status }}
      </div>
    </div>

    <!-- Main content -->
    <div class="flex-1 flex flex-col justify-center">
      <h1 class="text-6xl font-bold leading-tight tracking-tight mb-4">
        {{ title }}
      </h1>
      <p v-if="description" class="text-2xl text-slate-400 leading-relaxed line-clamp-2">
        {{ description }}
      </p>
    </div>

    <!-- Tags -->
    <div v-if="tags.length" class="flex flex-wrap gap-3 mb-6">
      <span
        v-for="tag in tags.slice(0, 4)"
        :key="tag"
        class="px-3 py-1 bg-slate-800 text-slate-400 rounded-full text-lg"
      >
        #{{ formatTag(tag) }}
      </span>
      <span v-if="tags.length > 4" class="px-3 py-1 text-slate-500 text-lg">
        +{{ tags.length - 4 }} more
      </span>
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-between pt-4" style="border-top: 1px solid #1e293b">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
          <svg
            class="w-6 h-6 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M7 15h10M7 11h10M7 7h10M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21z" />
          </svg>
        </div>
        <span class="text-xl font-semibold text-slate-400">Kickstart</span>
      </div>
      <span class="text-lg text-slate-600">nuxt-kickstart.example.com</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatTag } from '~~/shared/utils/case'

withDefaults(defineProps<{
  title?: string
  description?: string
  collection?: string
  status?: string
  tags?: string[]
}>(), {
  title: 'Kickstart',
  description: '',
  collection: '',
  status: '',
  tags: () => [],
})

// Mirrors the digital-garden "traffic light" in app/utils/garden-status.ts.
// Satori renders ahead of theme/appearance, so these are literal Tailwind
// colors rather than CSS vars: neutral / warning / success / error.
const statusColors: Record<string, string> = {
  seed: 'bg-slate-600',
  sprout: 'bg-amber-600',
  evergreen: 'bg-emerald-600',
  wilted: 'bg-red-600',
}

const _collectionIcons: Record<string, string> = {
  projects: 'folder',
  notes: 'note',
  areas: 'category',
  resources: 'bookmark',
  tech: 'code',
  people: 'users',
  milestones: 'flag',
}
</script>
