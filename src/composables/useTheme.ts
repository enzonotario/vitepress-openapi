import { ref } from 'vue'
import vitesseLight from 'shiki/themes/vitesse-light.mjs'
import vitesseDark from 'shiki/themes/vitesse-dark.mjs'
import { deepUnref } from '../lib/deepUnref'
import { locales } from '../locales'
import type { OperationSlot } from '../types'

export interface ThemeConfig {
  highlighterTheme: {
    light: any
    dark: any
  }
}

export interface PathConfig {
  showBaseURL: Ref<boolean>
}

export interface RequestConfig {
  defaultView: Ref<'schema' | 'contentType'>
}

export interface JsonViewerConfig {
  deep: Ref<number>
}

export interface SchemaViewerConfig {
  deep: Ref<number>
}

export interface HeadingLevels {
  h1: number
  h2: number
  h3: number
  h4: number
  h5: number
  h6: number
}

export interface ResponseConfig {
  responseCodeSelector: Ref<'tabs' | 'select'>
  maxTabs: Ref<number>
}

type PlaygroundJsonEditorMode = 'text' | 'tree' | 'table'

export interface PlaygroundConfig {
  jsonEditor: {
    mode: Ref<PlaygroundJsonEditorMode>
    mainMenuBar: Ref<boolean>
    navigationBar: Ref<boolean>
  }
}

export interface SecurityConfig {
  defaultScheme: Ref<string | null>
  selectedScheme: Ref<string | null>
}

type OperationBadges = 'deprecated' | 'operationId'

export interface OperationConfig {
  badges?: Ref<OperationBadges[]>
  slots?: Ref<OperationSlot[]>
  hiddenSlots?: Ref<OperationSlot[]>
  cols?: Ref<1 | 2>
}

export interface I18nConfig {
  locale: Ref<'es' | 'en' | string>
  fallbackLocale: Ref<'es' | 'en' | string>
  messages: Record<'es' | 'en', Record<string, Record<string, string>>>
}

export interface SpecConfig {
  groupByTags: Ref<boolean>
  collapsePaths: Ref<boolean>
  showPathsSummary: Ref<boolean>
  avoidCirculars: Ref<boolean>
  lazyRendering: Ref<boolean>
}

export interface UseThemeConfig {
  theme?: Partial<ThemeConfig>
  path?: Partial<PathConfig>
  requestBody?: Partial<RequestConfig>
  jsonViewer?: Partial<JsonViewerConfig>
  schemaViewer?: Partial<SchemaViewerConfig>
  headingLevels?: Partial<HeadingLevels>
  response?: Partial<ResponseConfig>
  playground?: Partial<PlaygroundConfig>
  security?: Partial<SecurityConfig>
  operation?: Partial<OperationConfig>
  i18n?: Partial<I18nConfig>
  spec?: Partial<SpecConfig>
}

export const DEFAULT_OPERATION_SLOTS: OperationSlot[] = [
  'header',
  'path',
  'description',
  'security',
  'request-body',
  'responses',
  'try-it',
  'code-samples',
  'branding',
  'footer',
]

const themeConfig: UseThemeConfig = {
  theme: {
    highlighterTheme: {
      light: vitesseLight,
      dark: vitesseDark,
    },
  },
  path: {
    showBaseURL: ref<boolean>(false),
  },
  requestBody: {
    defaultView: ref<'schema' | 'contentType'>('contentType'),
  },
  jsonViewer: {
    deep: ref<number>(Number.POSITIVE_INFINITY),
  },
  schemaViewer: {
    deep: ref<number>(Number.POSITIVE_INFINITY),
  },
  headingLevels: {
    h1: 1,
    h2: 2,
    h3: 3,
    h4: 4,
    h5: 5,
    h6: 6,
  },
  response: {
    responseCodeSelector: ref<'tabs' | 'select'>('tabs'),
    maxTabs: ref<number>(5),
  },
  playground: {
    jsonEditor: {
      mode: ref<PlaygroundJsonEditorMode>('tree'),
      mainMenuBar: ref<boolean>(false),
      navigationBar: ref<boolean>(false),
    },
  },
  security: {
    defaultScheme: ref<string | null>(null),
    selectedScheme: ref<string | null>(null),
  },
  operation: {
    badges: ref<OperationBadges[]>(['deprecated']),
    slots: ref(DEFAULT_OPERATION_SLOTS),
    hiddenSlots: ref([]),
    cols: ref(2),
  },
  i18n: {
    locale: ref<'es' | 'en'>('en'),
    fallbackLocale: ref<'es' | 'en'>('en'),
    messages: locales,
  },
  spec: {
    groupByTags: ref(true),
    collapsePaths: ref(false),
    showPathsSummary: ref(true),
    avoidCirculars: ref(false),
    lazyRendering: ref(false),
  },
}

const defaultThemeConfig = { ...deepUnref(themeConfig) }

export function useTheme(config: Partial<UseThemeConfig> = {}) {
  if (Object.keys(config).length) {
    if (config?.theme?.highlighterTheme) {
      themeConfig.theme.highlighterTheme = {
        ...themeConfig.theme.highlighterTheme,
        ...config.theme.highlighterTheme,
      }
    }

    if (config?.requestBody?.defaultView !== undefined) {
      setSchemaDefaultView(config.requestBody.defaultView)
    }

    if (config?.path?.showBaseURL !== undefined) {
      setShowBaseURL(config.path.showBaseURL)
    }

    if (config?.jsonViewer?.deep !== undefined) {
      setJsonViewerDeep(config.jsonViewer.deep)
    }

    if (config?.schemaViewer?.deep !== undefined) {
      setSchemaViewerDeep(config.schemaViewer.deep)
    }

    if (config?.headingLevels !== undefined) {
      setHeadingLevels(config.headingLevels)
    }

    if (config?.response?.responseCodeSelector !== undefined) {
      setResponseCodeSelector(config.response.responseCodeSelector)
    }

    if (config?.response?.maxTabs !== undefined) {
      setResponseCodeMaxTabs(config.response.maxTabs)
    }

    if (config?.playground?.jsonEditor?.mode !== undefined) {
      setPlaygroundJsonEditorMode(config.playground.jsonEditor.mode)
    }

    if (config?.playground?.jsonEditor?.mainMenuBar !== undefined) {
      setPlaygroundJsonEditorMainMenuBar(config.playground.jsonEditor.mainMenuBar)
    }

    if (config?.playground?.jsonEditor?.navigationBar !== undefined) {
      setPlaygroundJsonEditorNavigationBar(config.playground.jsonEditor.navigationBar)
    }

    if (config?.security?.defaultScheme !== undefined) {
      setSecurityDefaultScheme(config.security.defaultScheme)
    }

    if (config?.security?.selectedScheme !== undefined) {
      setSecuritySelectedScheme(config.security.selectedScheme)
    }

    if (config?.operation?.badges !== undefined) {
      setOperationBadges(config.operation.badges)
    }

    if (config?.operation?.slots !== undefined) {
      setOperationSlots(config.operation.slots)
    }

    if (config?.operation?.hiddenSlots !== undefined) {
      setOperationHiddenSlots(config.operation.hiddenSlots)
    }

    if (config?.operation?.cols !== undefined) {
      setOperationCols(config.operation.cols)
    }

    if (config?.i18n !== undefined) {
      setI18nConfig(config.i18n)
    }

    if (config?.spec !== undefined) {
      setSpecConfig(config.spec)
    }
  }

  function reset() {
    useTheme({ ...defaultThemeConfig })
  }

  function getState() {
    return deepUnref(themeConfig)
  }

  function getLocale(): 'es' | 'en' | string {
    return themeConfig.i18n.locale.value
  }

  /**
   * @deprecated Use `setI18nConfig({ locale: value })` instead.
   * @param value
   */
  function setLocale(value: 'es' | 'en' | string) {
    console.warn('`setLocale` is deprecated. Use `setI18nConfig({ locale: value })` instead.')
    themeConfig.i18n.locale.value = value
  }

  function getHighlighterTheme() {
    return themeConfig.theme.highlighterTheme
  }

  function getSchemaDefaultView(): 'schema' | 'contentType' {
    return themeConfig.requestBody.defaultView.value
  }

  function setSchemaDefaultView(value: 'schema' | 'contentType') {
    themeConfig.requestBody.defaultView.value = value
  }

  function getShowBaseURL(): boolean {
    return themeConfig.path.showBaseURL.value
  }

  function setShowBaseURL(value: boolean) {
    themeConfig.path.showBaseURL.value = value
  }

  function getJsonViewerDeep(): number {
    return themeConfig.jsonViewer.deep.value
  }

  function setJsonViewerDeep(value: number) {
    themeConfig.jsonViewer.deep.value = value
  }

  function getSchemaViewerDeep(): number {
    return themeConfig.schemaViewer.deep.value
  }

  function setSchemaViewerDeep(value: number) {
    themeConfig.schemaViewer.deep.value = value
  }

  function getHeadingLevels() {
    return themeConfig.headingLevels
  }

  function getHeadingLevel(level: keyof HeadingLevels): `h${1 | 2 | 3 | 4 | 5 | 6}` {
    const headingLevel = themeConfig.headingLevels[level]
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
    Object.assign(themeConfig.headingLevels, levels)
  }

  function getResponseCodeSelector(): 'tabs' | 'select' {
    return themeConfig.response.responseCodeSelector.value
  }

  function setResponseCodeSelector(value: 'tabs' | 'select') {
    themeConfig.response.responseCodeSelector.value = value
  }

  function getResponseCodeMaxTabs(): number {
    return themeConfig.response.maxTabs.value
  }

  function setResponseCodeMaxTabs(value: number) {
    themeConfig.response.maxTabs.value = value
  }

  function getPlaygroundJsonEditorMode(): PlaygroundJsonEditorMode {
    return themeConfig.playground.jsonEditor.mode.value
  }

  function setPlaygroundJsonEditorMode(value: PlaygroundJsonEditorMode) {
    themeConfig.playground.jsonEditor.mode.value = value
  }

  function getPlaygroundJsonEditorMainMenuBar(): boolean {
    return themeConfig.playground.jsonEditor.mainMenuBar.value
  }

  function setPlaygroundJsonEditorMainMenuBar(value: boolean) {
    themeConfig.playground.jsonEditor.mainMenuBar.value = value
  }

  function getPlaygroundJsonEditorNavigationBar(): boolean {
    return themeConfig.playground.jsonEditor.navigationBar.value
  }

  function setPlaygroundJsonEditorNavigationBar(value: boolean) {
    themeConfig.playground.jsonEditor.navigationBar.value = value
  }

  function getSecurityDefaultScheme(): string | null {
    return themeConfig.security.defaultScheme.value
  }

  function setSecurityDefaultScheme(value: string | null) {
    themeConfig.security.defaultScheme.value = value
  }

  function getSecuritySelectedScheme(): string | null {
    return themeConfig.security.selectedScheme.value
  }

  function setSecuritySelectedScheme(value: string | null) {
    themeConfig.security.selectedScheme.value = value
  }

  function getOperationBadges(): OperationBadges[] {
    return [...themeConfig.operation.badges.value]
  }

  function setOperationBadges(value: OperationBadges[]) {
    themeConfig.operation.badges.value = value
  }

  function getOperationSlots(): OperationSlot[] {
    return themeConfig.operation.slots.value
  }

  function setOperationSlots(value: OperationSlot[]) {
    themeConfig.operation.slots.value = value
  }

  function getOperationHiddenSlots(): OperationSlot[] {
    return themeConfig.operation.hiddenSlots.value
  }

  function setOperationHiddenSlots(value: OperationSlot[]) {
    themeConfig.operation.hiddenSlots.value = value
  }

  function getOperationCols(): 1 | 2 {
    return themeConfig.operation.cols.value
  }

  function setOperationCols(value: number) {
    themeConfig.operation.cols.value = value
  }

  function getI18nConfig(): I18nConfig {
    return themeConfig.i18n
  }

  function setI18nConfig(config: Partial<I18nConfig>) {
    if (config.locale) {
      themeConfig.i18n.locale.value = config.locale
    }

    if (config.fallbackLocale) {
      themeConfig.i18n.fallbackLocale.value = config.fallbackLocale
    }

    if (config.messages) {
      themeConfig.i18n.messages = config.messages
    }
  }

  function getSpecConfig() {
    return themeConfig.spec
  }

  function setSpecConfig(config: Partial<typeof specConfig>) {
    if (config.groupByTags !== undefined) {
      themeConfig.spec.groupByTags.value = config.groupByTags
    }

    if (config.collapsePaths !== undefined) {
      themeConfig.spec.collapsePaths.value = config.collapsePaths
    }

    if (config.showPathsSummary !== undefined) {
      themeConfig.spec.showPathsSummary.value = config.showPathsSummary
    }

    if (config.avoidCirculars !== undefined) {
      themeConfig.spec.avoidCirculars.value = config.avoidCirculars
    }

    if (config.lazyRendering !== undefined) {
      themeConfig.spec.lazyRendering.value = config.lazyRendering
    }
  }

  return {
    schemaConfig: themeConfig.requestBody,
    reset,
    getState,
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
    getSecurityDefaultScheme,
    setSecurityDefaultScheme,
    getSecuritySelectedScheme,
    setSecuritySelectedScheme,
    getOperationBadges,
    setOperationBadges,
    getOperationSlots,
    setOperationSlots,
    getOperationHiddenSlots,
    setOperationHiddenSlots,
    getOperationCols,
    setOperationCols,
    getI18nConfig,
    setI18nConfig,
    getSpecConfig,
    setSpecConfig,
  }
}
