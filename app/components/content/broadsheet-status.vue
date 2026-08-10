<template>
  <dl v-if="facts.length" class="bs-status">
    <div v-for="fact in facts" :key="fact.label">
      <dt>{{ fact.label }}</dt>
      <dd :class="fact.state">
        {{ fact.value }}
      </dd>
    </div>
  </dl>
</template>

<script setup lang="ts">
/**
 * Status strip — 3–6 hard facts with on/off states. This is what makes a
 * document situated rather than generic: version, wiring, what is not turned
 * on yet. Omit it when there is no real state to report.
 *
 * ::broadsheet-status
 * ---
 * facts:
 *   - label: Package
 *     value: 2.24.0
 *     state: on
 *   - label: Drain
 *     value: none yet
 *     state: off
 * ---
 * ::
 */
interface StatusFact {
  label: string
  value: string
  state?: 'on' | 'off'
}

withDefaults(defineProps<{ facts?: StatusFact[] }>(), {
  facts: () => [],
})
</script>
