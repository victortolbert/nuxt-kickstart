<template>
  <div class="bs-steps-wrap">
    <slot />
  </div>
</template>

<script setup lang="ts">
/**
 * Ordered steps with leading-zero counters in bordered squares. Numbered
 * because order matters — if it does not, use a plain list.
 *
 * Wraps an ordinary markdown ordered list, so each `1.` item becomes a step:
 *
 * ::broadsheet-steps
 * 1. ### Register the module
 *    One line in `nuxt.config.ts`.
 * 2. ### Add a drain
 *    Events print to the console until something catches them.
 * ::
 */
</script>

<style scoped>
/* The slot renders a plain <ol>; promote it to the steps treatment. Scoped
   styles need :deep() because the list is slotted content, not this template's. */
.bs-steps-wrap :deep(> ol) {
  counter-reset: s;
  list-style: none;
  padding: 0;
  margin: 26px 0 0;
}

.bs-steps-wrap :deep(> ol > li) {
  counter-increment: s;
  position: relative;
  padding-left: 42px;
  margin-bottom: 34px;
  list-style: none;
}

.bs-steps-wrap :deep(> ol > li::before) {
  content: counter(s, decimal-leading-zero);
  position: absolute;
  left: 0;
  top: 0;
  font-family: var(--bs-mono);
  font-size: 12px;
  font-weight: 700;
  color: var(--bs-signal);
  border: 1px solid var(--bs-signal);
  width: 28px;
  height: 24px;
  display: grid;
  place-items: center;
  letter-spacing: 0.02em;
}

.bs-steps-wrap :deep(> ol > li > h3:first-child) {
  margin-top: 0;
}
</style>
