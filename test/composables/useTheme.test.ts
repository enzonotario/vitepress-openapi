import { beforeEach, describe, expect, it } from 'vitest'
import { DEFAULT_BASE_URL, DEFAULT_OPERATION_SLOTS, useTheme } from '../../src/composables/useTheme'

describe('initialization and reset', () => {
  it('initializes with custom configuration', () => {
    const theme = useTheme({
      highlighterTheme: {
        light: {},
        dark: {},
      },
      path: {
        showBaseURL: true,
      },
      requestBody: {
        defaultView: 'schema',
      },
      jsonViewer: {
        deep: 5,
        renderer: 'shiki',
      },
      schemaViewer: {
        deep: 3,
      },
      playground: {
        jsonEditor: {
          mode: 'text',
          mainMenuBar: true,
          navigationBar: true,
          statusBar: true,
        },
      },
      headingLevels: {
        h1: 2,
        h2: 3,
      },
      operation: {
        badges: ['operationId'],
        defaultBaseUrl: 'https://app.local',
        getServers: ({ method, path, operation }) => `https://app.local/${method}${path}`,
        slots: ['header', 'path', 'description'],
        hiddenSlots: ['branding'],
        cols: 1,
      },
      server: {
        allowCustomServer: true,
        getServers: ({ method, path, operation }) => [`https://app.local/${method}${path}`],
      },
      response: {
        maxTabs: 10,
        responseCodeSelector: 'select',
        body: {
          defaultView: 'schema',
        },
      },
      security: {
        defaultScheme: 'bearer',
      },
      theme: {
        highlighterTheme: {
          light: {},
          dark: {},
        },
      },
      i18n: {
        locale: 'es',
      },
      spec: {
        groupByTags: false,
        collapsePaths: true,
        showPathsSummary: false,
      },
      markdown: {
        operationLink: {
          linkPrefix: '/custom-operations/',
          transformHref: href => `/transformed${href}`,
        },
      },
    })

    // Theme and highlighter
    expect(theme.getHighlighterTheme()).toEqual({
      light: {},
      dark: {},
    })

    // Request body and schema
    expect(theme.getSchemaDefaultView()).toBe('schema')
    expect(theme.getRequestBodyDefaultView()).toBe('schema')

    // Path
    expect(theme.getShowBaseURL()).toBe(true)

    // JSON and Schema viewers
    expect(theme.getJsonViewerDeep()).toBe(5)
    expect(theme.getJsonViewerRenderer()).toBe('shiki')
    expect(theme.getSchemaViewerDeep()).toBe(3)

    // Playground
    expect(theme.getPlaygroundJsonEditorMode()).toBe('text')
    expect(theme.getPlaygroundJsonEditorMainMenuBar()).toBe(true)
    expect(theme.getPlaygroundJsonEditorNavigationBar()).toBe(true)
    expect(theme.getPlaygroundJsonEditorStatusBar()).toBe(true)

    // Headings
    expect(theme.getHeadingLevels()).toEqual({
      h1: 2,
      h2: 3,
      h3: 3,
      h4: 4,
      h5: 5,
      h6: 6,
    })

    // Operation
    expect(theme.getOperationBadges()).toEqual(['operationId'])
    expect(theme.getOperationDefaultBaseUrl()).toBe('https://app.local')
    expect(theme.getOperationServers()).toBeTypeOf('function')
    expect(theme.getOperationSlots()).toEqual(['header', 'path', 'description'])
    expect(theme.getOperationHiddenSlots()).toEqual(['branding'])
    expect(theme.getOperationCols()).toBe(1)

    // Server
    expect(theme.getServerAllowCustomServer()).toBe(true)
    expect(theme.getServerConfig().getServers).toBeTypeOf('function')

    // Response
    expect(theme.getResponseCodeMaxTabs()).toBe(10)
    expect(theme.getResponseCodeSelector()).toBe('select')
    expect(theme.getResponseBodyDefaultView()).toBe('schema')

    // Security
    expect(theme.getSecurityDefaultScheme()).toBe('bearer')

    // i18n
    expect(theme.getI18nConfig().locale.value).toBe('es')

    // Spec
    expect(theme.getSpecConfig().groupByTags.value).toBe(false)
    expect(theme.getSpecConfig().collapsePaths.value).toBe(true)
    expect(theme.getSpecConfig().showPathsSummary.value).toBe(false)
    expect(theme.getSpecConfig().avoidCirculars.value).toBe(false)
    expect(theme.getSpecConfig().lazyRendering.value).toBe(false)
    expect(theme.getSpecConfig().defaultTag).toBe('Default')
    expect(theme.getSpecConfig().defaultTagDescription).toBe('')
    expect(theme.getSpecConfig().wrapExamples).toBe(true)
    expect(theme.getSpecConfig().disableDownload.value).toBe(false)
    expect(theme.getWrapExamples()).toBe(true)
    expect(theme.getSpecDisableDownload()).toBe(false)

    // Markdown
    expect(theme.getMarkdownConfig().operationLink?.linkPrefix).toBe('/custom-operations/')
    expect(theme.getOperationLinkConfig()?.transformHref).toBeTypeOf('function')
  })

  it('can reset to default configuration', () => {
    const theme = useTheme({
      jsonViewer: {
        deep: 7,
        renderer: 'shiki',
      },
      schemaViewer: {
        deep: 5,
      },
      headingLevels: {
        h1: 3,
        h2: 4,
      },
      operation: {
        badges: ['operationId'],
        defaultBaseUrl: 'https://app.local',
        getServers: ({ method, path, operation }) => `https://app.local/${method}${path}`,
        slots: ['header', 'path'],
        hiddenSlots: ['branding'],
        cols: 1,
      },
      server: {
        allowCustomServer: true,
        getServers: ({ method, path, operation }) => [`https://app.local/${method}${path}`],
      },
      i18n: {
        locale: 'es',
      },
      response: {
        body: {
          defaultView: 'schema',
        },
      },
    })

    expect(theme.getJsonViewerDeep()).toBe(7)
    expect(theme.getJsonViewerRenderer()).toBe('shiki')
    expect(theme.getSchemaViewerDeep()).toBe(5)
    expect(theme.getHeadingLevels()).toEqual({
      h1: 3,
      h2: 4,
      h3: 3,
      h4: 4,
      h5: 5,
      h6: 6,
    })
    expect(theme.getOperationBadges()).toEqual(['operationId'])
    expect(theme.getOperationDefaultBaseUrl()).toBe('https://app.local')
    expect(theme.getOperationServers()).toBeTypeOf('function')
    expect(theme.getOperationSlots()).toEqual(['header', 'path'])
    expect(theme.getOperationHiddenSlots()).toEqual(['branding'])
    expect(theme.getOperationCols()).toBe(1)
    expect(theme.getServerAllowCustomServer()).toBe(true)
    expect(theme.getI18nConfig().locale.value).toBe('es')
    expect(theme.getResponseBodyDefaultView()).toBe('schema')

    theme.reset()

    expect(theme.getJsonViewerDeep()).toBe(Number.POSITIVE_INFINITY)
    expect(theme.getJsonViewerRenderer()).toBe('vue-json-pretty')
    expect(theme.getSchemaViewerDeep()).toBe(Number.POSITIVE_INFINITY)
    expect(theme.getHeadingLevels()).toEqual({
      h1: 1,
      h2: 2,
      h3: 3,
      h4: 4,
      h5: 5,
      h6: 6,
    })
    expect(theme.getOperationBadges()).toEqual(['deprecated'])
    expect(theme.getOperationDefaultBaseUrl()).toBe(DEFAULT_BASE_URL)
    expect(theme.getOperationServers()).toBe(null)
    expect(theme.getOperationSlots()).toEqual(DEFAULT_OPERATION_SLOTS)
    expect(theme.getOperationHiddenSlots()).toEqual([])
    expect(theme.getOperationCols()).toBe(2)
    expect(theme.getServerAllowCustomServer()).toBe(false)
    expect(theme.getI18nConfig().locale.value).toBe('en')
    expect(theme.getResponseBodyDefaultView()).toBe('contentType')
  })

  it('returns the current state', () => {
    const theme = useTheme()
    const state = theme.getState()
    expect(state).toBeDefined()
    expect(state.theme).toBeDefined()
    expect(state.path).toBeDefined()
    expect(state.requestBody).toBeDefined()
    expect(state.jsonViewer).toBeDefined()
    expect(state.schemaViewer).toBeDefined()
    expect(state.headingLevels).toBeDefined()
    expect(state.response).toBeDefined()
    expect(state.playground).toBeDefined()
    expect(state.security).toBeDefined()
    expect(state.operation).toBeDefined()
    expect(state.i18n).toBeDefined()
    expect(state.spec).toBeDefined()
    expect(state.codeSamples).toBeDefined()
    expect(state.linksPrefixes).toBeDefined()
    expect(state.server).toBeDefined()
    expect(state.markdown).toBeDefined()
  })
})

describe('i18n configuration', () => {
  const themeConfig = useTheme()

  beforeEach(() => {
    themeConfig.reset()
  })

  it('returns the default locale', () => {
    const result = themeConfig.getLocale()
    expect(result).toBe('en')
  })

  it('sets and gets the locale (deprecated method)', () => {
    themeConfig.setLocale('es')
    const result = themeConfig.getLocale()
    expect(result).toBe('es')
  })

  it('returns the i18n config', () => {
    const result = themeConfig.getI18nConfig()
    expect(result).toEqual({
      locale: expect.any(Object),
      fallbackLocale: expect.any(Object),
      messages: expect.any(Object),
      availableLocales: expect.arrayContaining([
        {
          code: 'en',
          label: 'English',
        },
        {
          code: 'es',
          label: 'Español',
        },
      ]),
    })
  })

  it('sets and gets the i18n config', () => {
    themeConfig.setI18nConfig({ locale: 'es' })
    const result = themeConfig.getI18nConfig()
    expect(result.locale.value).toBe('es')
  })
})

describe('theme and highlighter', () => {
  const themeConfig = useTheme()

  beforeEach(() => {
    themeConfig.reset()
  })

  it('returns the highlighter themeConfig', () => {
    const result = themeConfig.getHighlighterTheme()
    expect(result).toEqual({
      light: expect.any(Object),
      dark: expect.any(Object),
    })
  })
})

describe('request body and schema', () => {
  const themeConfig = useTheme()

  beforeEach(() => {
    themeConfig.reset()
  })

  it('returns the default schema view', () => {
    const result = themeConfig.getSchemaDefaultView()
    expect(result).toBe('contentType')
    expect(themeConfig.getRequestBodyDefaultView()).toBe('contentType')
  })

  it('sets and gets the schema default view', () => {
    themeConfig.setRequestBodyDefaultView('schema')
    const result = themeConfig.getSchemaDefaultView()
    expect(result).toBe('schema')
    expect(themeConfig.getRequestBodyDefaultView()).toBe('schema')
  })
})

describe('path configuration', () => {
  const themeConfig = useTheme()

  beforeEach(() => {
    themeConfig.reset()
  })

  it('returns the default showBaseURL value', () => {
    const result = themeConfig.getShowBaseURL()
    expect(result).toBe(false)
  })

  it('sets and gets the showBaseURL value', () => {
    themeConfig.setShowBaseURL(true)
    const result = themeConfig.getShowBaseURL()
    expect(result).toBe(true)
  })
})

describe('jSON and Schema viewers', () => {
  const themeConfig = useTheme()

  beforeEach(() => {
    themeConfig.reset()
  })

  it('returns the default jsonViewer deep value', () => {
    const result = themeConfig.getJsonViewerDeep()
    expect(result).toBe(Number.POSITIVE_INFINITY)
  })

  it('sets and gets the jsonViewer deep value', () => {
    themeConfig.setJsonViewerDeep(5)
    const result = themeConfig.getJsonViewerDeep()
    expect(result).toBe(5)
  })

  it('returns the default jsonViewer renderer', () => {
    const result = themeConfig.getJsonViewerRenderer()
    expect(result).toBe('vue-json-pretty')
  })

  it('sets and gets the jsonViewer renderer', () => {
    themeConfig.setJsonViewerRenderer('shiki')
    const result = themeConfig.getJsonViewerRenderer()
    expect(result).toBe('shiki')
  })

  it('returns the default schemaViewer deep value', () => {
    const result = themeConfig.getSchemaViewerDeep()
    expect(result).toBe(Number.POSITIVE_INFINITY)
  })

  it('sets and gets the schemaViewer deep value', () => {
    themeConfig.setSchemaViewerDeep(3)
    const result = themeConfig.getSchemaViewerDeep()
    expect(result).toBe(3)
  })
})

describe('heading levels', () => {
  const themeConfig = useTheme()

  beforeEach(() => {
    themeConfig.reset()
  })

  it('returns the heading levels', () => {
    const result = themeConfig.getHeadingLevels()
    expect(result).toEqual({
      h1: 1,
      h2: 2,
      h3: 3,
      h4: 4,
      h5: 5,
      h6: 6,
    })
  })

  it('returns the correct heading level', () => {
    const result = themeConfig.getHeadingLevel('h3')
    expect(result).toBe('h3')
  })

  it('sets and gets the heading levels', () => {
    themeConfig.setHeadingLevels({ h1: 2, h2: 3 })
    const result = themeConfig.getHeadingLevels()
    expect(result).toEqual({
      h1: 2,
      h2: 3,
      h3: 3,
      h4: 4,
      h5: 5,
      h6: 6,
    })
  })

  it('throws an error when setting invalid heading level', () => {
    expect(() => {
      themeConfig.setHeadingLevels({ h1: 7 })
    }).toThrow('Heading level for h1 must be between 1 and 6.')
  })
})

describe('response configuration', () => {
  const themeConfig = useTheme()

  beforeEach(() => {
    themeConfig.reset()
  })

  it('returns the default response code selector', () => {
    const result = themeConfig.getResponseCodeSelector()
    expect(result).toBe('tabs')
  })

  it('sets and gets the response code selector', () => {
    themeConfig.setResponseCodeSelector('select')
    const result = themeConfig.getResponseCodeSelector()
    expect(result).toBe('select')
  })

  it('returns the default response code max tabs', () => {
    const result = themeConfig.getResponseCodeMaxTabs()
    expect(result).toBe(5)
  })

  it('sets and gets the response code max tabs', () => {
    themeConfig.setResponseCodeMaxTabs(10)
    const result = themeConfig.getResponseCodeMaxTabs()
    expect(result).toBe(10)
  })

  it('returns the default response body default view', () => {
    const result = themeConfig.getResponseBodyDefaultView()
    expect(result).toBe('contentType')
  })

  it('sets and gets the response body default view', () => {
    themeConfig.setResponseBodyDefaultView('schema')
    const result = themeConfig.getResponseBodyDefaultView()
    expect(result).toBe('schema')
  })
})

describe('playground configuration', () => {
  const themeConfig = useTheme()

  beforeEach(() => {
    themeConfig.reset()
  })

  it('returns the default playground json editor mode', () => {
    const result = themeConfig.getPlaygroundJsonEditorMode()
    expect(result).toBe('tree')
  })

  it('sets and gets the playground json editor mode', () => {
    themeConfig.setPlaygroundJsonEditorMode('text')
    const result = themeConfig.getPlaygroundJsonEditorMode()
    expect(result).toBe('text')
  })

  it('returns the default playground json editor main menu bar value', () => {
    const result = themeConfig.getPlaygroundJsonEditorMainMenuBar()
    expect(result).toBe(false)
  })

  it('sets and gets the playground json editor main menu bar value', () => {
    themeConfig.setPlaygroundJsonEditorMainMenuBar(true)
    const result = themeConfig.getPlaygroundJsonEditorMainMenuBar()
    expect(result).toBe(true)
  })

  it('returns the default playground json editor navigation bar value', () => {
    const result = themeConfig.getPlaygroundJsonEditorNavigationBar()
    expect(result).toBe(false)
  })

  it('sets and gets the playground json editor navigation bar value', () => {
    themeConfig.setPlaygroundJsonEditorNavigationBar(true)
    const result = themeConfig.getPlaygroundJsonEditorNavigationBar()
    expect(result).toBe(true)
  })

  it('returns the default playground json editor status bar value', () => {
    const result = themeConfig.getPlaygroundJsonEditorStatusBar()
    expect(result).toBe(false)
  })

  it('sets and gets the playground json editor status bar value', () => {
    themeConfig.setPlaygroundJsonEditorStatusBar(true)
    const result = themeConfig.getPlaygroundJsonEditorStatusBar()
    expect(result).toBe(true)
  })
})

describe('operation configuration', () => {
  const themeConfig = useTheme()

  beforeEach(() => {
    themeConfig.reset()
  })

  it('returns the operation badges', () => {
    const result = themeConfig.getOperationBadges()
    expect(result).toEqual(['deprecated'])
  })

  it('sets and gets the operation badges', () => {
    themeConfig.setOperationBadges(['operationId'])
    const result = themeConfig.getOperationBadges()
    expect(result).toEqual(['operationId'])
  })

  it('returns the default operation slots', () => {
    const result = themeConfig.getOperationSlots()
    expect(result).toEqual(DEFAULT_OPERATION_SLOTS)
  })

  it('sets and gets the operation slots', () => {
    themeConfig.setOperationSlots(['header', 'path', 'description'])
    const result = themeConfig.getOperationSlots()
    expect(result).toEqual(['header', 'path', 'description'])
  })

  it('returns the default operation hidden slots', () => {
    const result = themeConfig.getOperationHiddenSlots()
    expect(result).toEqual([])
  })

  it('sets and gets the operation hidden slots', () => {
    themeConfig.setOperationHiddenSlots(['branding'])
    const result = themeConfig.getOperationHiddenSlots()
    expect(result).toEqual(['branding'])
  })

  it('returns the default operation columns', () => {
    const result = themeConfig.getOperationCols()
    expect(result).toBe(2)
  })

  it('sets and gets the operation columns', () => {
    themeConfig.setOperationCols(1)
    const result = themeConfig.getOperationCols()
    expect(result).toBe(1)
  })

  it('returns the default operation base URL', () => {
    const result = themeConfig.getOperationDefaultBaseUrl()
    expect(result).toBe(DEFAULT_BASE_URL)
  })

  it('returns the default operation servers', () => {
    const result = themeConfig.getOperationServers()
    expect(result).toBe(null)
  })
})

describe('security configuration', () => {
  const themeConfig = useTheme()

  beforeEach(() => {
    themeConfig.reset()
  })

  it('returns the default security scheme', () => {
    const result = themeConfig.getSecurityDefaultScheme()
    expect(result).toBe(null)
  })

  it('sets and gets the security scheme', () => {
    themeConfig.setSecurityDefaultScheme('bearer')
    const result = themeConfig.getSecurityDefaultScheme()
    expect(result).toBe('bearer')
  })
})

describe('spec configuration', () => {
  const themeConfig = useTheme()

  beforeEach(() => {
    themeConfig.reset()
  })

  it('returns the spec config', () => {
    const result = themeConfig.getSpecConfig()
    expect(result.groupByTags.value).toBe(true)
    expect(result.collapsePaths.value).toBe(false)
    expect(result.showPathsSummary.value).toBe(true)
    expect(result.avoidCirculars.value).toBe(false)
    expect(result.lazyRendering.value).toBe(false)
    expect(result.defaultTag).toBe('Default')
    expect(result.defaultTagDescription).toBe('')
    expect(result.wrapExamples).toBe(true)
    expect(result.disableDownload.value).toBe(false)
  })

  it('sets spec config', () => {
    themeConfig.setSpecConfig({
      groupByTags: false,
      collapsePaths: true,
      showPathsSummary: false,
      avoidCirculars: true,
      lazyRendering: true,
      wrapExamples: false,
      disableDownload: true,
    })
    const result = themeConfig.getSpecConfig()
    result.groupByTags.value = false
    result.collapsePaths.value = true
    result.showPathsSummary.value = false
    result.avoidCirculars.value = true
    result.lazyRendering.value = true
    result.wrapExamples = false
    result.disableDownload.value = true
    expect(themeConfig.getWrapExamples()).toBe(false)
    expect(themeConfig.getSpecDisableDownload()).toBe(true)
  })
})

describe('links prefixes configuration', () => {
  const themeConfig = useTheme()

  beforeEach(() => {
    themeConfig.reset()
  })

  it('returns the default links prefixes config', () => {
    const result = themeConfig.getLinksPrefixesConfig()
    expect(result).toEqual({
      tags: '/tags/',
      operations: '/operations/',
    })
  })

  it('sets and gets the links prefixes config', () => {
    themeConfig.setLinksPrefixesConfig({
      tags: '/new-tags/',
      operations: '/new-operations/',
    })
    const result = themeConfig.getLinksPrefixesConfig()
    expect(result).toEqual({
      tags: '/new-tags/',
      operations: '/new-operations/',
    })
  })

  it('returns the default tags link prefix', () => {
    const result = themeConfig.getTagsLinkPrefix()
    expect(result).toBe('/tags/')
  })

  it('returns the default operations link prefix', () => {
    const result = themeConfig.getOperationsLinkPrefix()
    expect(result).toBe('/operations/')
  })

  it('sets and gets the tags link prefix', () => {
    themeConfig.setLinksPrefixesConfig({ tags: '/new-tags/' })
    const result = themeConfig.getTagsLinkPrefix()
    expect(result).toBe('/new-tags/')
  })

  it('sets and gets the operations link prefix', () => {
    themeConfig.setLinksPrefixesConfig({ operations: '/new-operations/' })
    const result = themeConfig.getOperationsLinkPrefix()
    expect(result).toBe('/new-operations/')
  })
})

describe('server configuration', () => {
  const themeConfig = useTheme()

  beforeEach(() => {
    themeConfig.reset()
  })

  it('returns the default server config', () => {
    const result = themeConfig.getServerConfig()
    expect(result.allowCustomServer).toBe(false)
    expect(result.getServers).toBe(null)
  })

  it('sets and gets the server config', () => {
    themeConfig.setServerConfig({
      allowCustomServer: true,
      getServers: () => ['https://example.com'],
    })
    expect(themeConfig.getServerAllowCustomServer()).toBe(true)
    expect(themeConfig.getServerConfig().getServers).toBeTypeOf('function')
  })
})

describe('markdown configuration', () => {
  const themeConfig = useTheme()

  beforeEach(() => {
    themeConfig.reset()
  })

  it('returns the default markdown config', () => {
    const result = themeConfig.getMarkdownConfig()
    expect(result.operationLink).toBeDefined()
    expect(result.operationLink?.linkPrefix).toBe('/operations/')
    expect(result.externalLinksNewTab).toBe(false)
  })

  it('sets and gets the markdown config', () => {
    themeConfig.setMarkdownConfig({
      operationLink: {
        linkPrefix: '/custom-operations/',
        transformHref: href => `/transformed${href}`,
      },
      externalLinksNewTab: true,
    })
    const result = themeConfig.getMarkdownConfig()
    expect(result.operationLink?.linkPrefix).toBe('/custom-operations/')
    expect(result.operationLink?.transformHref).toBeTypeOf('function')
    expect(result.externalLinksNewTab).toBe(true)
  })

  it('returns the operation link config', () => {
    const result = themeConfig.getOperationLinkConfig()
    expect(result?.linkPrefix).toBe('/operations/')
  })

  it('returns the externalLinksNewTab value', () => {
    themeConfig.setMarkdownConfig({ externalLinksNewTab: true })
    const result = themeConfig.getExternalLinksNewTab()
    expect(result).toBe(true)
  })

  it('allows disabling operation link processing', () => {
    themeConfig.setMarkdownConfig({ operationLink: false })
    const result = themeConfig.getOperationLinkConfig()
    expect(result).toBe(false)
  })

  it('stores the markdown config callback', () => {
    const configFn = () => {}
    themeConfig.setMarkdownConfig({ config: configFn })
    const result = themeConfig.getMarkdownConfig()
    expect(result.config).toBe(configFn)
  })
})

describe('codeSamples configuration', () => {
  const themeConfig = useTheme()

  beforeEach(() => {
    themeConfig.reset()
  })

  it('returns the default code samples languages', () => {
    const result = themeConfig.getCodeSamplesLangs()
    expect(result).toEqual(['curl', 'javascript', 'php', 'python'])
  })

  it('returns the default code samples default language', () => {
    const result = themeConfig.getCodeSamplesDefaultLang()
    expect(result).toBe('curl')
  })

  it('returns the default code samples available languages', () => {
    const result = themeConfig.getCodeSamplesAvailableLanguages()
    expect(result).toEqual([
      {
        lang: 'curl',
        label: 'cURL',
        highlighter: 'bash',
        icon: 'curl',
      },
      {
        lang: 'javascript',
        label: 'JavaScript',
        highlighter: 'javascript',
        icon: '.js',
      },
      {
        lang: 'php',
        label: 'PHP',
        highlighter: 'php',
        icon: '.php',
      },
      {
        lang: 'python',
        label: 'Python',
        highlighter: 'python',
        icon: '.py',
      },
    ])
  })

  it('returns the default code samples generator', () => {
    const result = themeConfig.getCodeSamplesGenerator()
    expect(result).toBeTypeOf('function')
  })

  it('returns the default code samples default headers', () => {
    const result = themeConfig.getCodeSamplesDefaultHeaders()
    expect(result).toEqual({})
  })

  it('sets and gets the code samples config', () => {
    const customGenerator = (lang: string, _request: any) => Promise.resolve(`Custom code for ${lang}`)
    const customHeaders = { 'X-Custom-Header': 'value' }

    themeConfig.setCodeSamplesConfig({
      langs: ['javascript', 'python', 'go'],
      defaultLang: 'python',
      availableLanguages: [
        {
          lang: 'go',
          label: 'Go',
          highlighter: 'go',
          icon: '.go',
        },
      ],
      generator: customGenerator,
      defaultHeaders: customHeaders,
    })

    expect(themeConfig.getCodeSamplesLangs()).toEqual(['javascript', 'python', 'go'])
    expect(themeConfig.getCodeSamplesDefaultLang()).toBe('python')

    const availableLanguages = themeConfig.getCodeSamplesAvailableLanguages()
    expect(availableLanguages).toEqual([
      {
        lang: 'go',
        label: 'Go',
        highlighter: 'go',
        icon: '.go',
      },
    ])

    expect(themeConfig.getCodeSamplesGenerator()).toBe(customGenerator)
    expect(themeConfig.getCodeSamplesDefaultHeaders()).toEqual(customHeaders)
  })

  it('handles duplicate languages in langs array', () => {
    themeConfig.setCodeSamplesConfig({
      langs: ['javascript', 'javascript', 'python'],
    })

    expect(themeConfig.getCodeSamplesLangs()).toEqual(['javascript', 'python'])
  })

  it('falls back to first available language when default language is not in available languages', () => {
    themeConfig.setCodeSamplesConfig({
      langs: ['javascript', 'python'],
      defaultLang: 'ruby', // Not in the available languages
    })

    expect(themeConfig.getCodeSamplesDefaultLang()).toBe('javascript')
  })

  it('can setup icons', () => {
    themeConfig.reset()

    const defaultLanguages = themeConfig.getCodeSamplesAvailableLanguages()

    themeConfig.setCodeSamplesConfig({
      availableLanguages: defaultLanguages.map((lang) => {
        if (lang.lang === 'javascript') {
          return { ...lang, icon: 'custom-js-icon' }
        }
        return lang
      }),
    })

    const result = themeConfig.getCodeSamplesAvailableLanguages()

    expect(result).toEqual([
      {
        lang: 'curl',
        label: 'cURL',
        highlighter: 'bash',
        icon: 'curl',
      },
      {
        lang: 'javascript',
        label: 'JavaScript',
        highlighter: 'javascript',
        icon: 'custom-js-icon',
      },
      {
        lang: 'php',
        label: 'PHP',
        highlighter: 'php',
        icon: '.php',
      },
      {
        lang: 'python',
        label: 'Python',
        highlighter: 'python',
        icon: '.py',
      },
    ])
  })
})
