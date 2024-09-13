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
  deep: ref<number>(Infinity),
}

const schemaViewerConfig = {
  deep: ref<number>(Infinity),
}

export function useTheme() {
  function getLocale(): 'es' | 'en' {
    return themeConfig.locale.value
  }

  function setLocale(value: 'es' | 'en') {
    themeConfig.locale.value = value
  }

  function getHighlighterTheme() {
    return themeConfig.highlighterTheme
  }

  function getSchemaDefaultView(): 'schema' | 'contentType' {
    return schemaConfig.defaultView.value
  }

  function setSchemaDefaultView(value: 'schema' | 'contentType') {
    schemaConfig.defaultView.value = value
  }

  function getShowBaseURL(): boolean {
    return schemaConfig.showBaseURL.value
  }

  function setShowBaseURL(value: boolean) {
    schemaConfig.showBaseURL.value = value
  }

  function getJsonViewerDeep(): number {
    return jsonViewerConfig.deep.value
  }

  function setJsonViewerDeep(value: number) {
    jsonViewerConfig.deep.value = value
  }

  function getSchemaViewerDeep(): number {
    return schemaViewerConfig.deep.value
  }

  function setSchemaViewerDeep(value: number) {
    schemaViewerConfig.deep.value = value
  }

  return {
    schemaConfig,
    getLocale,
    setLocale,
    getHighlighterTheme,
    getSchemaDefaultView,
    setSchemaDefaultView,
    getShowBaseURL,
    setShowBaseURL,
    getJsonViewerDeep,
    setJsonViewerDeep,
    getSchemaViewerDeep,
    setSchemaViewerDeep,
  }
}
