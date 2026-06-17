<template>
  <u-app :locale="currentUiLocale">
    <nuxt-layout>
      <nuxt-page></nuxt-page>
    </nuxt-layout>
  </u-app>
</template>

<script setup lang="ts">
import { getUiLocale } from '~/utils/ui-locale'

const { locale } = useI18n()

// Map i18n locale to Nuxt UI locale for component translations
const currentUiLocale = computed(() => getUiLocale(locale.value))

// Default SEO meta for the entire site
useSeoMeta({
  titleTemplate: '%s | Kickstart',
  ogSiteName: 'Kickstart',
  ogType: 'website',
  twitterCard: 'summary_large_image',
})
</script>
