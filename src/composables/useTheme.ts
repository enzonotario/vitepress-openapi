import { ref } from 'vue'
import vitesseLight from 'shiki/themes/vitesse-light.mjs'
import vitesseDark from 'shiki/themes/vitesse-dark.mjs'
import type { Ref } from 'vue'
import type { IOARequest } from '../lib/codeSamples/request'
import { generateCodeSample } from '../lib/codeSamples/generateCodeSample'
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

export type Languages = 'es' | 'en' | 'pt-BR' | string

export type Messages = Record<Languages, Record<string, string>>

export interface I18nConfig {
  locale: Ref<Languages>
  fallbackLocale: Ref<Languages>
  messages: Messages
}

export interface SpecConfig {
  groupByTags?: Ref<boolean>
  collapsePaths?: Ref<boolean>
  showPathsSummary?: Ref<boolean>
  avoidCirculars?: Ref<boolean>
  lazyRendering?: Ref<boolean>
  defaultTag?: string
  defaultTagDescription?: string
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
  codeSamples?: Partial<CodeSamplesConfig>
  linksPrefixes?: Partial<LinksPrefixesConfig>
}

export interface UseThemeConfigUnref {
  theme?: Partial<ThemeConfig>
  path?: Partial<{
    showBaseURL: boolean
  }>
  requestBody?: Partial<{
    defaultView: 'schema' | 'contentType'
  }>
  jsonViewer?: Partial<{
    deep: number
  }>
  schemaViewer?: Partial<{
    deep: number
  }>
  headingLevels?: Partial<HeadingLevels>
  response?: Partial<{
    responseCodeSelector: 'tabs' | 'select'
    maxTabs: number
  }>
  playground?: Partial<{
    jsonEditor: {
      mode: PlaygroundJsonEditorMode
      mainMenuBar: boolean
      navigationBar: boolean
    }
  }>
  security?: Partial<{
    defaultScheme: string | null
    selectedScheme: string | null
  }>
  operation?: Partial<{
    badges: OperationBadges[]
    slots: OperationSlot[]
    hiddenSlots: OperationSlot[]
    cols: 1 | 2
  }>
  i18n?: Partial<I18nConfig>
  spec?: Partial<SpecConfig>
  codeSamples?: Partial<CodeSamplesConfig>
  linksPrefixes?: Partial<LinksPrefixesConfig>
}

export interface CodeSamplesConfig {
  langs: string[]
  defaultLang: string
  availableLanguages: LanguageConfig[]
  generator: GeneratorFunction
  defaultHeaders: Record<string, string>
}

export interface LinksPrefixesConfig {
  tags: string
  operations: string
}

interface LanguageConfig {
  lang: string
  label: string
  highlighter: string
}

type GeneratorFunction = (lang: string, request: IOARequest) => string

export const DEFAULT_OPERATION_SLOTS: OperationSlot[] = [
  'header',
  'path',
  'description',
  'security',
  'parameters',
  'request-body',
  'responses',
  'try-it',
  'code-samples',
  'branding',
  'footer',
]

const availableLanguages: LanguageConfig[] = [
  {
    lang: 'curl',
    label: 'cURL',
    highlighter: 'bash',
  },
  {
    lang: 'javascript',
    label: 'JavaScript',
    highlighter: 'javascript',
  },
  {
    lang: 'php',
    label: 'PHP',
    highlighter: 'php',
  },
  {
    lang: 'python',
    label: 'Python',
    highlighter: 'python',
  },
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
    locale: ref<Languages>('en'),
    fallbackLocale: ref<Languages>('en'),
    messages: locales,
  },
  spec: {
    groupByTags: ref(true),
    collapsePaths: ref(false),
    showPathsSummary: ref(true),
    avoidCirculars: ref(false),
    lazyRendering: ref(false),
    defaultTag: 'Default',
    defaultTagDescription: '',
  },
  codeSamples: {
    langs: [
      'curl',
      'javascript',
      'php',
      'python',
    ],
    defaultLang: 'curl',
    availableLanguages,
    generator: (lang: string, request: IOARequest) => generateCodeSample(lang, request),
    defaultHeaders: {
      'Content-Type': 'application/json',
    },
  },
  linksPrefixes: {
    tags: '/tags/',
    operations: '/operations/',
  },
}

const defaultThemeConfig: UseThemeConfigUnref = { ...deepUnref(themeConfig) } as UseThemeConfigUnref

export function useTheme(initialConfig: Partial<UseThemeConfigUnref> = {}) {
  setConfig(initialConfig)

  function setConfig(config: Partial<UseThemeConfigUnref>) {
    if (config?.theme?.highlighterTheme) {
      // @ts-expect-error: This is a valid expression.
      themeConfig.theme.highlighterTheme = {
        ...themeConfig?.theme?.highlighterTheme,
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

    if (config?.codeSamples !== undefined) {
      setCodeSamplesConfig(config.codeSamples)
    }

    if (config?.linksPrefixes !== undefined) {
      setLinksPrefixesConfig(config.linksPrefixes)
    }
  }

  function reset() {
    setConfig(defaultThemeConfig)
  }

  function getState() {
    return deepUnref(themeConfig)
  }

  function getLocale(): Languages {
    return themeConfig?.i18n?.locale?.value || 'en'
  }

  /**
   * @deprecated Use `setI18nConfig({ locale: value })` instead.
   */
  function setLocale(value: Languages) {
    console.warn('`setLocale` is deprecated. Use `setI18nConfig({ locale: value })` instead.')
    // @ts-expect-error: This is a valid expression.
    themeConfig.i18n.locale.value = value
  }

  function getHighlighterTheme() {
    return themeConfig?.theme?.highlighterTheme
  }

  function getSchemaDefaultView(): 'schema' | 'contentType' | undefined {
    return themeConfig?.requestBody?.defaultView?.value
  }

  function setSchemaDefaultView(value: 'schema' | 'contentType') {
    // @ts-expect-error: This is a valid expression.
    themeConfig.requestBody.defaultView.value = value
  }

  function getShowBaseURL(): boolean | undefined {
    return themeConfig?.path?.showBaseURL?.value
  }

  function setShowBaseURL(value: boolean) {
    // @ts-expect-error: This is a valid expression.
    themeConfig.path.showBaseURL.value = value
  }

  function getJsonViewerDeep(): number | undefined {
    return themeConfig?.jsonViewer?.deep?.value
  }

  function setJsonViewerDeep(value: number) {
    // @ts-expect-error: This is a valid expression.
    themeConfig.jsonViewer.deep.value = value
  }

  function getSchemaViewerDeep(): number | undefined {
    return themeConfig?.schemaViewer?.deep?.value
  }

  function setSchemaViewerDeep(value: number) {
    // @ts-expect-error: This is a valid expression.
    themeConfig.schemaViewer.deep.value = value
  }

  function getHeadingLevels() {
    return themeConfig.headingLevels
  }

  function getHeadingLevel(level: keyof HeadingLevels): `h${1 | 2 | 3 | 4 | 5 | 6}` {
    if (!themeConfig.headingLevels) {
      return `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
    }

    const headingLevel = themeConfig.headingLevels[level] as number

    if (headingLevel < 1 || headingLevel > 6) {
      throw new Error(`Heading level for ${level} must be between 1 and 6.`)
    }

    return `h${headingLevel}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  }

  function setHeadingLevels(levels: Partial<HeadingLevels>) {
    if (!themeConfig.headingLevels) {
      themeConfig.headingLevels = { }
    }

    for (const key of Object.keys(levels)) {
      const value = levels[key as keyof HeadingLevels] as number

      if (value < 1 || value > 6) {
        throw new Error(`Heading level for ${key} must be between 1 and 6.`)
      }
    }

    Object.assign(themeConfig.headingLevels, levels)
  }

  function getResponseCodeSelector(): 'tabs' | 'select' | undefined {
    return themeConfig?.response?.responseCodeSelector?.value
  }

  function setResponseCodeSelector(value: 'tabs' | 'select') {
    // @ts-expect-error: This is a valid expression.
    themeConfig.response.responseCodeSelector.value = value
  }

  function getResponseCodeMaxTabs(): number | undefined {
    return themeConfig?.response?.maxTabs?.value
  }

  function setResponseCodeMaxTabs(value: number) {
    // @ts-expect-error: This is a valid expression.
    themeConfig.response.maxTabs.value = value
  }

  function getPlaygroundJsonEditorMode(): PlaygroundJsonEditorMode | undefined {
    return themeConfig?.playground?.jsonEditor?.mode.value
  }

  function setPlaygroundJsonEditorMode(value: PlaygroundJsonEditorMode) {
    // @ts-expect-error: This is a valid expression.
    themeConfig.playground.jsonEditor.mode.value = value
  }

  function getPlaygroundJsonEditorMainMenuBar(): boolean | undefined {
    return themeConfig?.playground?.jsonEditor?.mainMenuBar?.value
  }

  function setPlaygroundJsonEditorMainMenuBar(value: boolean) {
    // @ts-expect-error: This is a valid expression.
    themeConfig.playground.jsonEditor.mainMenuBar.value = value
  }

  function getPlaygroundJsonEditorNavigationBar(): boolean | undefined {
    return themeConfig?.playground?.jsonEditor?.navigationBar.value
  }

  function setPlaygroundJsonEditorNavigationBar(value: boolean) {
    // @ts-expect-error: This is a valid expression.
    themeConfig.playground.jsonEditor.navigationBar.value = value
  }

  function getSecurityDefaultScheme(): string | null | undefined {
    return themeConfig?.security?.defaultScheme?.value
  }

  function setSecurityDefaultScheme(value: string | null) {
    // @ts-expect-error: This is a valid expression.
    themeConfig.security.defaultScheme.value = value
  }

  function getSecuritySelectedScheme(): string | null | undefined {
    return themeConfig?.security?.selectedScheme?.value
  }

  function setSecuritySelectedScheme(value: string | null | undefined) {
    // @ts-expect-error: This is a valid expression.
    themeConfig.security.selectedScheme.value = value
  }

  function getOperationBadges(): OperationBadges[] {
    return [...(themeConfig?.operation?.badges?.value || [])]
  }

  function setOperationBadges(value: OperationBadges[]) {
    // @ts-expect-error: This is a valid expression.
    themeConfig.operation.badges.value = value
  }

  function getOperationSlots(): OperationSlot[] | undefined {
    return themeConfig?.operation?.slots?.value
  }

  function setOperationSlots(value: OperationSlot[]) {
    // @ts-expect-error: This is a valid expression.
    themeConfig.operation.slots.value = value
  }

  function getOperationHiddenSlots(): OperationSlot[] | undefined {
    return themeConfig?.operation?.hiddenSlots?.value
  }

  function setOperationHiddenSlots(value: OperationSlot[]) {
    // @ts-expect-error: This is a valid expression.
    themeConfig.operation.hiddenSlots.value = value
  }

  function getOperationCols(): 1 | 2 | undefined {
    return themeConfig?.operation?.cols?.value
  }

  function setOperationCols(value: number) {
    // @ts-expect-error: This is a valid expression.
    themeConfig.operation.cols.value = value
  }

  function getI18nConfig(): I18nConfig {
    return themeConfig.i18n as I18nConfig
  }

  function setI18nConfig(config: Partial<I18nConfig>) {
    if (config.locale) {
      // @ts-expect-error: This is a valid expression.
      themeConfig.i18n.locale.value = config.locale
    }

    if (config.fallbackLocale) {
      // @ts-expect-error: This is a valid expression.
      themeConfig.i18n.fallbackLocale.value = config.fallbackLocale
    }

    if (config.messages) {
      // @ts-expect-error: This is a valid expression.
      themeConfig.i18n.messages = config.messages
    }
  }

  function getSpecConfig() {
    return themeConfig.spec
  }

  function setSpecConfig(config: Partial<SpecConfig>) {
    if (!themeConfig.spec) {
      themeConfig.spec = {}
    }

    if (config.groupByTags !== undefined) {
      // @ts-expect-error: This is a valid expression.
      themeConfig.spec.groupByTags.value = config.groupByTags
    }

    if (config.collapsePaths !== undefined) {
      // @ts-expect-error: This is a valid expression.
      themeConfig.spec.collapsePaths.value = config.collapsePaths
    }

    if (config.showPathsSummary !== undefined) {
      // @ts-expect-error: This is a valid expression.
      themeConfig.spec.showPathsSummary.value = config.showPathsSummary
    }

    if (config.avoidCirculars !== undefined) {
      // @ts-expect-error: This is a valid expression.
      themeConfig.spec.avoidCirculars.value = config.avoidCirculars
    }

    if (config.lazyRendering !== undefined) {
      // @ts-expect-error: This is a valid expression.
      themeConfig.spec.lazyRendering.value = config.lazyRendering
    }

    if (config.defaultTag !== undefined) {
      themeConfig.spec.defaultTag = config.defaultTag
    }

    if (config.defaultTagDescription !== undefined) {
      themeConfig.spec.defaultTagDescription = config.defaultTagDescription
    }
  }

  function getCodeSamplesLangs() {
    return themeConfig?.codeSamples?.langs
  }

  function getCodeSamplesDefaultLang() {
    return themeConfig?.codeSamples?.defaultLang
  }

  function getCodeSamplesAvailableLanguages() {
    return themeConfig?.codeSamples?.availableLanguages
  }

  function getCodeSamplesGenerator() {
    return themeConfig?.codeSamples?.generator
  }

  function getCodeSamplesDefaultHeaders() {
    return themeConfig?.codeSamples?.defaultHeaders
  }

  function setCodeSamplesConfig(config: Partial<CodeSamplesConfig>) {
    if (config.langs) {
      // @ts-expect-error: This is a valid expression.
      themeConfig.codeSamples.langs = config.langs
    }

    if (config.defaultLang) {
      // @ts-expect-error: This is a valid expression.
      themeConfig.codeSamples.defaultLang = config.defaultLang
    }

    if (config.availableLanguages) {
      // @ts-expect-error: This is a valid expression.
      themeConfig.codeSamples.availableLanguages = config.availableLanguages
    }

    if (config.generator) {
      // @ts-expect-error: This is a valid expression.
      themeConfig.codeSamples.generator = config.generator
    }

    if (config.defaultHeaders) {
      // @ts-expect-error: This is a valid expression.
      themeConfig.codeSamples.defaultHeaders = config.defaultHeaders
    }
  }

  function getLinksPrefixesConfig() {
    return themeConfig.linksPrefixes
  }

  function setLinksPrefixesConfig(config: Partial<LinksPrefixesConfig>) {
    if (config.tags) {
      // @ts-expect-error: This is a valid expression.
      themeConfig.linksPrefixes.tags = config.tags
    }

    if (config.operations) {
      // @ts-expect-error: This is a valid expression.
      themeConfig.linksPrefixes.operations = config.operations
    }
  }

  function getTagsLinkPrefix() {
    return themeConfig?.linksPrefixes?.tags
  }

  function getOperationsLinkPrefix() {
    return themeConfig?.linksPrefixes?.operations
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
    getCodeSamplesLangs,
    getCodeSamplesDefaultLang,
    getCodeSamplesAvailableLanguages,
    getCodeSamplesGenerator,
    getCodeSamplesDefaultHeaders,
    setCodeSamplesConfig,
    getLinksPrefixesConfig,
    setLinksPrefixesConfig,
    getTagsLinkPrefix,
    getOperationsLinkPrefix,
  }
}
