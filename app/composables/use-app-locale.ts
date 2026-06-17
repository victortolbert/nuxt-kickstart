import type { LocaleConfig, LocaleId } from '~~/shared/types/locale'
import { computed, useAppearance, useI18n, useState, watch } from '#imports'

export const locales: LocaleConfig[] = [
  {
    id: 'en',
    label: 'English',
    nativeLabel: 'English',
    icon: 'i-tabler-language',
    direction: 'ltr',
  },
  {
    id: 'es',
    label: 'Spanish',
    nativeLabel: 'Español',
    icon: 'i-tabler-language',
    direction: 'ltr',
  },
]

const STORAGE_KEY = 'kickstart-locale'

export function useAppLocale() {
  const locale = useState<LocaleId>('locale', () => 'en')
  const { resolveIcon } = useAppearance()
  const i18n = useI18n() as unknown as { locale: { value: string }, setLocale: (locale: string) => Promise<void> }
  const i18nLocale = i18n.locale
  const setI18nLocale = i18n.setLocale

  // Appearance-aware locale configs — icons follow the icon-collection setting
  const localeOptions = computed<LocaleConfig[]>(() =>
    locales.map(l => ({ ...l, icon: resolveIcon('language') })),
  )

  const currentLocale = computed(() =>
    localeOptions.value.find(l => l.id === locale.value) || localeOptions.value[0],
  )

  async function setLocale(id: LocaleId) {
    locale.value = id

    // Sync with @nuxtjs/i18n
    await setI18nLocale(id)

    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, id)
      document.documentElement.lang = id
    }
  }

  function cycleLocale() {
    const currentIndex = locales.findIndex(l => l.id === locale.value)
    const nextIndex = (currentIndex + 1) % locales.length
    const nextLocale = locales[nextIndex]
    if (nextLocale) {
      setLocale(nextLocale.id)
    }
  }

  // Initialize from localStorage on client
  if (import.meta.client) {
    const saved = localStorage.getItem(STORAGE_KEY) as LocaleId | null
    if (saved && locales.some(l => l.id === saved)) {
      locale.value = saved
      document.documentElement.lang = saved
    }
    else {
      document.documentElement.lang = locale.value
    }
  }

  // Sync with i18n locale changes (e.g., from URL navigation)
  watch(() => i18nLocale.value, (newLocale) => {
    if (newLocale && newLocale !== locale.value && locales.some(l => l.id === newLocale)) {
      locale.value = newLocale as LocaleId
      if (import.meta.client) {
        localStorage.setItem(STORAGE_KEY, newLocale)
        document.documentElement.lang = newLocale
      }
    }
  })

  // Watch for locale changes and sync to DOM
  watch(locale, (newLocale) => {
    if (import.meta.client) {
      document.documentElement.lang = newLocale
    }
  })

  return {
    locale,
    locales: localeOptions,
    currentLocale,
    setLocale,
    cycleLocale,
  }
}
