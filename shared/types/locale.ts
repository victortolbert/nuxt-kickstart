export type LocaleId = 'en' | 'es'

export interface LocaleConfig {
  id: LocaleId
  label: string
  nativeLabel: string
  icon: string
  direction: 'ltr' | 'rtl'
}
