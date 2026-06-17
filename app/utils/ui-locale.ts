import type { LocaleId } from '~~/shared/types/locale'
import { en, es } from '@nuxt/ui/locale'

export const SUPPORTED_UI_LOCALES = ['en', 'es'] as const

// Map of i18n locale codes to Nuxt UI locales
const uiLocaleMap = {
  en,
  es,
} as const

/**
 * Get the Nuxt UI locale for a given i18n locale code.
 * Falls back to English if the locale is not supported.
 */
export function getUiLocale(localeCode: string) {
  if (localeCode in uiLocaleMap) {
    return uiLocaleMap[localeCode as LocaleId]
  }
  return en
}
