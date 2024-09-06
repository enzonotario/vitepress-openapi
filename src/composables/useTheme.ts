import { ref } from 'vue'
import vitesseLight from 'shiki/themes/vitesse-light.mjs'
import vitesseDark from 'shiki/themes/vitesse-dark.mjs'

const locale: Ref<'es' | 'en'> = ref('en')

const schemaDefaultView: Ref<'schema' | 'contentType', 'xml'> = ref('contentType')

const showBaseURL: Ref<boolean> = ref(false)

const highlighterTheme = {
  light: vitesseLight,
  dark: vitesseDark,
}

export function useTheme() {
  function getLocale() {
    return locale.value
  }

  function setLocale(value: 'es' | 'en') {
    locale.value = value
  }

  function getSchemaDefaultView() {
    return schemaDefaultView.value
  }

  function setSchemaDefaultView(value: 'schema' | 'contentType') {
    schemaDefaultView.value = value
  }

  function getShowBaseURL() {
    return showBaseURL.value
  }

  function setShowBaseURL(value: boolean) {
    showBaseURL.value = value
  }

  return {
    highlighterTheme,
    schemaDefaultView,
    getLocale,
    setLocale,
    getSchemaDefaultView,
    setSchemaDefaultView,
    getShowBaseURL,
    setShowBaseURL,
  }
}
