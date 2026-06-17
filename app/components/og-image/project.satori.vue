<template>
  <div class="h-full w-full flex flex-col bg-slate-900 text-white p-12">
    <!-- Top bar with domain badges -->
    <div class="flex items-center justify-between mb-8">
      <div v-if="domains.length" class="flex items-center gap-2">
        <span
          v-for="domain in domains.slice(0, 3)"
          :key="domain"
          class="px-3 py-1 bg-slate-800 text-slate-400 rounded-lg text-lg capitalize"
        >
          {{ formatLabel(domain) }}
        </span>
      </div>
      <div class="px-4 py-2 bg-blue-600 text-white rounded-lg text-lg font-medium">
        Project
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

    <!-- Tech stack -->
    <div v-if="techStack.length" class="mb-6">
      <div class="text-slate-500 text-sm mb-3 uppercase tracking-wide">
        Tech Stack
      </div>
      <div class="flex items-center gap-4">
        <div
          v-for="techSlug in techStack"
          :key="techSlug"
          class="flex items-center gap-2 px-3 py-2 rounded-lg"
          :style="{ backgroundColor: `${getTechConfig(techSlug).color}15` }"
        >
          <div class="w-6 h-6 flex items-center justify-center">
            <svg
              v-if="getTechConfig(techSlug).icon.startsWith('logos:')"
              class="w-6 h-6"
              viewBox="0 0 24 24"
            >
              <circle
                :fill="getTechConfig(techSlug).color"
                cx="12"
                cy="12"
                r="10"
              />
            </svg>
            <div v-else class="w-6 h-6 bg-slate-700 rounded" />
          </div>
          <span
            class="text-lg font-medium"
            :style="{ color: getTechConfig(techSlug).color }"
          >
            {{ getTechConfig(techSlug).label }}
          </span>
        </div>
        <span v-if="hasMoreTech" class="text-slate-500 text-lg">
          +{{ extraTechCount }} more
        </span>
      </div>
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
import { computed } from 'vue'
import { getTechConfig } from '~~/app/utils/tech-config'
import { formatLabel } from '~~/shared/utils/case'

const props = withDefaults(defineProps<{
  title?: string
  description?: string
  tech?: string[]
  domains?: string[]
}>(), {
  title: 'Project',
  description: '',
  tech: () => [],
  domains: () => [],
})

// Limit tech stack to 5 items for display
const techStack = computed(() => props.tech.slice(0, 5))
const hasMoreTech = computed(() => props.tech.length > 5)
const extraTechCount = computed(() => props.tech.length - 5)
</script>
