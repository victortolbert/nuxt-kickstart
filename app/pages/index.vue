<template>
  <div>
    <landing-hero-section></landing-hero-section>
    <landing-features-section></landing-features-section>
    <landing-tech-stack-section></landing-tech-stack-section>
    <landing-newsletter-section></landing-newsletter-section>
    <landing-contact-section></landing-contact-section>
  </div>
</template>

<script setup lang="ts">
// Use landing layout for marketing page
definePageMeta({
  layout: 'landing',
})

// Landing page SEO meta tags
useHead({
  title: 'Enterprise Nuxt Starter',
})

defineOgImage('NuxtSeoSatori', {
  title: 'Kickstart',
  description: 'Enterprise Nuxt Starter',
})

useSeoMeta({
  description: 'An opinionated, content-first Nuxt 4 starter with passwordless auth, an admin suite, an email subsystem, real-time examples, design tokens, themes, and i18n built in.',
  ogTitle: 'Kickstart - Enterprise Nuxt Starter',
  ogDescription: 'Start new projects with the foundations decided: auth, admin, email, content, theming, and i18n already wired up.',
  ogImage: '/og-image-landing.png',
})
</script>
