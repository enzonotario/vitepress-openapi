import { ref } from 'vue'
import vitesseLight from 'shiki/themes/vitesse-light.mjs'
import vitesseDark from 'shiki/themes/vitesse-dark.mjs'
import { locales } from '../locales'

interface HeadingLevels {
  h1: number
  h2: number
  h3: number
  h4: number
  h5: number
  h6: number
}

type PlaygroundJsonEditorMode = 'text' | 'tree' | 'table'

const themeConfig = {
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
    mode: ref<PlaygroundJsonEditorMode>('tree'),
    mainMenuBar: ref<boolean>(false),
    navigationBar: ref<boolean>(false),
  },
}

const securityConfig = {
  defaultScheme: ref<string | null>(null),
  selectedScheme: ref<string | null>(null),
}

type OperationBadges = 'deprecated' | 'operationId'

const operationConfig = {
  badges: ref<OperationBadges[]>(['deprecated']),
}

interface I18nConfig {
  locale: Ref<'es' | 'en' | string>
  fallbackLocale: Ref<'es' | 'en' | string>
  messages: Record<'es' | 'en', Record<string, Record<string, string>>>
}

const i18nConfig: I18nConfig = {
  locale: ref<'es' | 'en'>('en'),
  fallbackLocale: ref<'es' | 'en'>('en'),
  messages: locales,
}

export function useTheme() {
  function getLocale(): 'es' | 'en' | string {
    return getI18nConfig().locale.value
  }

  /**
   * @deprecated Use `setI18nConfig({ locale: value })` instead.
   * @param value
   */
  function setLocale(value: 'es' | 'en' | string) {
    console.warn('`setLocale` is deprecated. Use `setI18nConfig({ locale: value })` instead.')
    setI18nConfig({ locale: value })
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

  function getPlaygroundJsonEditorMode(): PlaygroundJsonEditorMode {
    return playgroundConfig.jsonEditor.mode.value
  }

  function setPlaygroundJsonEditorMode(value: PlaygroundJsonEditorMode) {
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

  function getOperationBadges(): OperationBadges[] {
    return [...operationConfig.badges.value]
  }

  function setOperationBadges(value: OperationBadges[]) {
    operationConfig.badges.value = value
  }

  function getI18nConfig(): I18nConfig {
    return i18nConfig
  }

  function setI18nConfig(config: Partial<I18nConfig>) {
    if (config.locale) {
      i18nConfig.locale.value = config.locale
    }

    if (config.fallbackLocale) {
      i18nConfig.fallbackLocale.value = config.fallbackLocale
    }

    if (config.messages) {
      i18nConfig.messages = config.messages
    }
  }

  return {
    schemaConfig,
    securityConfig,
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
    getOperationBadges,
    setOperationBadges,
    getI18nConfig,
    setI18nConfig,
  }
}
