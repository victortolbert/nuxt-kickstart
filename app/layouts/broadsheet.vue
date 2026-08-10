<template>
  <div class="bs-shell">
    <!-- The rail sits between the masthead and the article in DOM order, so a
         keyboard user would otherwise tab every section link before reaching
         the prose. -->
    <a
      v-if="links.length"
      href="#bs-content"
      class="bs-skip"
    >
      {{ t('common.skipToContent') }}
    </a>

    <header class="bs-masthead">
      <slot name="eyebrow">
        <p v-if="eyebrow" class="bs-eyebrow">
          {{ eyebrow }}
        </p>
      </slot>

      <slot name="title">
        <h1 v-if="title">
          {{ title }}
        </h1>
      </slot>

      <!-- The standfirst carries the whole thesis, so it is a slot: it needs
           inline <strong> and <code>, which a prop cannot express. -->
      <slot name="standfirst" />

      <slot name="status">
        <dl v-if="status.length" class="bs-status">
          <div v-for="fact in status" :key="fact.label">
            <dt>{{ fact.label }}</dt>
            <dd :class="fact.state">
              {{ fact.value }}
            </dd>
          </div>
        </dl>
      </slot>
    </header>

    <nav
      v-if="links.length"
      class="bs-rail"
      aria-label="Sections"
    >
      <p class="bs-rail-title">
        {{ railTitleText }}
      </p>
      <ol>
        <li v-for="link in links" :key="link.id">
          <a
            :href="`#${link.id}`"
            :data-active="activeId === link.id"
            :aria-current="activeId === link.id ? 'location' : undefined"
            :style="link.depth && link.depth > 2 ? { paddingLeft: '22px' } : undefined"
          >{{ link.label }}</a>
        </li>
      </ol>
    </nav>

    <main
      id="bs-content"
      class="bs-main"
      tabindex="-1"
    >
      <slot />
    </main>

    <footer v-if="footer.length || $slots.footer" class="bs-footer">
      <slot name="footer">
        <span v-for="item in footer" :key="item">{{ item }}</span>
      </slot>
    </footer>
  </div>
</template>

<script setup lang="ts">
interface RailLink {
  id: string
  label: string
  depth?: number
}

interface StatusFact {
  label: string
  value: string
  state?: 'on' | 'off'
}

const props = withDefaults(defineProps<{
  /** Mono, uppercase, dot-separated facts. Not a sentence. */
  eyebrow?: string
  /** A claim or a question, not a noun phrase. */
  title?: string
  /** Sticky table of contents. Hidden below 1000px. */
  links?: RailLink[]
  /** Hard facts with on/off states. Omit when there is no real state to report. */
  status?: StatusFact[]
  /** Provenance line. Say what the document was verified against. */
  footer?: string[]
  railTitle?: string
}>(), {
  links: () => [],
  status: () => [],
  footer: () => [],
  railTitle: 'Contents',
})

const { t } = useI18n()

const railTitleText = computed(() => props.railTitle ?? t('pages.toc'))

// Which rail entry is currently on screen. Plain IntersectionObserver rather
// than UContentToc: the rail is a hairline list, not a Nuxt UI component, and
// it has to work for hand-authored sections as well as rendered markdown.
const activeId = ref<string | null>(null)
let observer: IntersectionObserver | null = null

function observeHeadings() {
  observer?.disconnect()

  if (!props.links.length)
    return

  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

      if (visible[0])
        activeId.value = visible[0].target.id
    },
    // Bias the band to the upper third so a heading lights up as it arrives,
    // not once it has already scrolled past the middle of the viewport.
    { rootMargin: '-10% 0px -70% 0px', threshold: 0 },
  )

  for (const link of props.links) {
    const el = document.getElementById(link.id)
    if (el)
      observer.observe(el)
  }
}

onMounted(observeHeadings)
watch(() => props.links, () => nextTick(observeHeadings), { deep: true })
onBeforeUnmount(() => observer?.disconnect())
</script>
