import { ref } from 'vue'

const locale: Ref<'es' | 'en'> = ref('en')

export function useTheme() {
  function getLocale() {
    return locale.value
  }

  function setLocale(value: 'es' | 'en') {
    locale.value = value
  }

  return {
    getLocale,
    setLocale,
  }
}
