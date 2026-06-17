<template>
  <u-dropdown-menu
    :items="localeItems"
    :content="{ align: 'end' }"
  >
    <u-button
      color="neutral"
      variant="ghost"
      :icon="currentLocale?.icon"
      :aria-label="`Current language: ${currentLocale?.nativeLabel ?? 'Unknown'}. Click to change language.`"
    ></u-button>
  </u-dropdown-menu>
</template>

<script setup lang="ts">
const { locale, locales, currentLocale, setLocale } = useAppLocale()

// Map locale configs to dropdown menu items
const localeItems = computed(() =>
  locales.value.map(l => ({
    label: l.nativeLabel,
    icon: l.icon,
    disabled: locale.value === l.id,
    onSelect: () => setLocale(l.id),
  })),
)
</script>
