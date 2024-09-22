import { ref } from 'vue'
import vitesseLight from 'shiki/themes/vitesse-light.mjs'
import vitesseDark from 'shiki/themes/vitesse-dark.mjs'

interface HeadingLevels {
  h1: number
  h2: number
  h3: number
  h4: number
  h5: number
  h6: number
}

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

const headingLevels: HeadingLevels = {
  h1: 1,
  h2: 2,
  h3: 3,
  h4: 4,
  h5: 5,
  h6: 6,
}

const responseConfig = {
  responseCodeSelector: ref<'tabs', 'select'>('tabs'),
  maxTabs: ref<number>(5),
}

const playgroundConfig = {
  /**
   * See:
   * - https://github.com/cloydlau/json-editor-vue?tab=readme-ov-file#props
   * - https://github.com/josdejong/svelte-jsoneditor/#properties
   */
  jsonEditor: {
    mode: ref<'text' | 'tree' | 'table'>('tree'),
    mainMenuBar: ref<boolean>(false),
    navigationBar: ref<boolean>(false),
  },
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

  function getHeadingLevels() {
    return headingLevels
  }

  function getHeadingLevel(level: keyof HeadingLevels): `h${1 | 2 | 3 | 4 | 5 | 6}` {
    const headingLevel = headingLevels[level]
    if (headingLevel < 1 || headingLevel > 6) {
      throw new Error(`Heading level for ${level} must be between 1 and 6.`)
    }
    return `h${headingLevel}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  }

  function setHeadingLevels(levels: Partial<HeadingLevels>) {
    for (const key of Object.keys(levels)) {
      const value = levels[key as keyof HeadingLevels]
      if (value < 1 || value > 6) {
        throw new Error(`Heading level for ${key} must be between 1 and 6.`)
      }
    }
    Object.assign(headingLevels, levels)
  }

  function getResponseCodeSelector(): 'tabs' | 'select' {
    return responseConfig.responseCodeSelector.value
  }

  function setResponseCodeSelector(value: 'tabs' | 'select') {
    responseConfig.responseCodeSelector.value = value
  }

  function getResponseCodeMaxTabs(): number {
    return responseConfig.maxTabs.value
  }

  function setResponseCodeMaxTabs(value: number) {
    responseConfig.maxTabs.value = value
  }

  function getPlaygroundJsonEditorMode(): 'text' | 'tree' | 'table' {
    return playgroundConfig.jsonEditor.mode.value
  }

  function setPlaygroundJsonEditorMode(value: 'text' | 'tree' | 'table') {
    playgroundConfig.jsonEditor.mode.value = value
  }

  function getPlaygroundJsonEditorMainMenuBar(): boolean {
    return playgroundConfig.jsonEditor.mainMenuBar.value
  }

  function setPlaygroundJsonEditorMainMenuBar(value: boolean) {
    playgroundConfig.jsonEditor.mainMenuBar.value = value
  }

  function getPlaygroundJsonEditorNavigationBar(): boolean {
    return playgroundConfig.jsonEditor.navigationBar.value
  }

  function setPlaygroundJsonEditorNavigationBar(value: boolean) {
    playgroundConfig.jsonEditor.navigationBar.value = value
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
    getHeadingLevels,
    getHeadingLevel,
    setHeadingLevels,
    getResponseCodeSelector,
    setResponseCodeSelector,
    getResponseCodeMaxTabs,
    setResponseCodeMaxTabs,
    getPlaygroundJsonEditorMode,
    setPlaygroundJsonEditorMode,
    getPlaygroundJsonEditorMainMenuBar,
    setPlaygroundJsonEditorMainMenuBar,
    getPlaygroundJsonEditorNavigationBar,
    setPlaygroundJsonEditorNavigationBar,
  }
}
