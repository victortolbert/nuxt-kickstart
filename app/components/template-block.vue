<!-- components/TemplateBlock.vue -->
<template>
  <div class="border-l-4 border-blue-500 pl-4 my-4">
    <h4 class="font-semibold">
      {{ title }}
    </h4>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string }>()
</script>
