import { ref } from 'vue'
import vitesseLight from 'shiki/themes/vitesse-light.mjs'
import vitesseDark from 'shiki/themes/vitesse-dark.mjs'

const themeConfig = {
  locale: ref<'es' | 'en'>('en'),
  highlighterTheme: {
    light: vitesseLight,
    dark: vitesseDark,
  },
}

const schemaConfig = {
  defaultView: ref<'schema' | 'contentType'>('contentType'),
  showBaseURL: ref<boolean>(false),
}

const jsonViewerConfig = {
  deep: ref<number>(Number.Infinity),
}

export function useTheme() {
  function getLocale() {
    return themeConfig.locale.value
  }

  function setLocale(value: 'es' | 'en') {
    themeConfig.locale.value = value
  }

  function getHighlighterTheme() {
    return themeConfig.highlighterTheme
  }

  function getSchemaDefaultView() {
    return schemaConfig.defaultView.value
  }

  function setSchemaDefaultView(value: 'schema' | 'contentType') {
    schemaConfig.defaultView.value = value
  }

  function getShowBaseURL() {
    return schemaConfig.showBaseURL.value
  }

  function setShowBaseURL(value: boolean) {
    schemaConfig.showBaseURL.value = value
  }

  function getJsonViewerDeep() {
    return jsonViewerConfig.deep.value
  }

  function setJsonViewerDeep(value: number) {
    jsonViewerConfig.deep.value = value
  }

  return {
    getLocale,
    setLocale,
    getHighlighterTheme,
    getSchemaDefaultView,
    setSchemaDefaultView,
    getShowBaseURL,
    setShowBaseURL,
    getJsonViewerDeep,
    setJsonViewerDeep,
  }
}
