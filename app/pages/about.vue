<template>
  <u-page>
    <u-page-header
      title="About"
      description="What this project is built on."
    ></u-page-header>
    <u-page-body>
      <div class="prose max-w-[70ch]">
        <p>
          This site is built on <strong>Kickstart</strong> (<code>nuxt-kickstart</code>),
          an opinionated, content-first starter for Nuxt 4 — passwordless
          authentication, an admin suite, an email subsystem, real-time
          examples, design tokens tooling, seven themes, and i18n, already
          wired up and tested.
        </p>
        <p>
          The <nuxt-link to="/guides">
            guides
          </nuxt-link> double as the template's
          documentation: how the content architecture works, how to add
          collections, and how to make the project your own.
        </p>
        <p>
          Replace this page with your own story — it's listed on the
          <nuxt-link to="/guides/using-this-template">
            Using This Template
          </nuxt-link>
          checklist.
        </p>
      </div>
    </u-page-body>
  </u-page>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'About',
})

useSeoMeta({
  description: 'About Kickstart — an opinionated, content-first Nuxt 4 starter.',
})
</script>
