import { ref } from 'vue'

const locale: Ref<'es' | 'en'> = ref('en')

const schemaDefaultView: Ref<'schema' | 'contentType', 'xml'> = ref('contentType')

const showBaseURL: Ref<boolean> = ref(false)

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
    schemaDefaultView,
    getLocale,
    setLocale,
    getSchemaDefaultView,
    setSchemaDefaultView,
    getShowBaseURL,
    setShowBaseURL,
  }
}
