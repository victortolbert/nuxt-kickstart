<template>
  <div
    class="h-full w-full flex flex-col justify-between p-16"
    :class="theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'"
  >
    <!-- Header with logo -->
    <div class="flex items-center gap-4">
      <div
        class="w-16 h-16 rounded-xl flex items-center justify-center"
        :class="theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'"
      >
        <svg
          class="w-10 h-10 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M7 15h10M7 11h10M7 7h10M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21z" />
        </svg>
      </div>
      <span
        class="text-3xl font-bold tracking-tight"
        :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-500'"
      >
        Kickstart
      </span>
    </div>

    <!-- Main content -->
    <div class="flex-1 flex flex-col justify-center">
      <h1 class="text-7xl font-bold leading-tight tracking-tight mb-6">
        {{ title }}
      </h1>
      <p
        v-if="description"
        class="text-3xl leading-relaxed"
        :class="theme === 'dark' ? 'text-slate-400' : 'text-slate-600'"
      >
        {{ description }}
      </p>
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-between">
      <div
        class="flex items-center gap-3 text-xl"
        :class="theme === 'dark' ? 'text-slate-500' : 'text-slate-400'"
      >
        <span>Digital Garden</span>
        <span class="text-slate-600">•</span>
        <span>GTD + PARA</span>
      </div>
      <div
        class="px-4 py-2 rounded-lg text-lg font-medium"
        :class="theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'"
      >
        nuxt-kickstart.example.com
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  description?: string
  icon?: string
  theme?: 'light' | 'dark'
}>(), {
  title: 'Kickstart',
  description: 'A content-first digital garden',
  icon: 'i-tabler-plant-2',
  theme: 'dark',
})
</script>
