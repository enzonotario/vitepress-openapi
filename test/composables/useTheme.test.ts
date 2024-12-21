import { beforeEach, describe, expect, it } from 'vitest'
import { DEFAULT_BASE_URL, useTheme } from '../../src/composables/useTheme'

describe('composition API', () => {
  it('can config', () => {
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
      },
      schemaViewer: {
        deep: 3,
      },
      playground: {
        jsonEditor: {
          mode: 'text',
          mainMenuBar: true,
          navigationBar: true,
        },
      },
      headingLevels: {
        h1: 2,
        h2: 3,
      },
      operation: {
        badges: ['operationId'],
        defaultBaseUrl: 'https://app.local',
        getServers: ({ method, path, operation }) => (`https://app.local/${method}${path}`),
      },
      response: {
        maxTabs: 10,
        responseCodeSelector: 'select',
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
    })

    expect(theme.getHighlighterTheme()).toEqual({
      light: {},
      dark: {},
    })
    expect(theme.getSchemaDefaultView()).toBe('schema')
    expect(theme.getShowBaseURL()).toBe(true)
    expect(theme.getJsonViewerDeep()).toBe(5)
    expect(theme.getSchemaViewerDeep()).toBe(3)
    expect(theme.getPlaygroundJsonEditorMode()).toBe('text')
    expect(theme.getPlaygroundJsonEditorMainMenuBar()).toBe(true)
    expect(theme.getPlaygroundJsonEditorNavigationBar()).toBe(true)
    expect(theme.getHeadingLevels()).toEqual({
      h1: 2,
      h2: 3,
      h3: 3,
      h4: 4,
      h5: 5,
      h6: 6,
    })
    expect(theme.getOperationBadges()).toEqual(['operationId'])
    expect(theme.getOperationDefaultBaseUrl()).toBe('https://app.local')
    expect(theme.getOperationServers()).toBeTypeOf('function')
    expect(theme.getResponseCodeMaxTabs()).toBe(10)
    expect(theme.getResponseCodeSelector()).toBe('select')
    expect(theme.getSecurityDefaultScheme()).toBe('bearer')
    expect(theme.getI18nConfig().locale.value).toBe('es')
    expect(theme.getSpecConfig().groupByTags.value).toBe(false)
    expect(theme.getSpecConfig().collapsePaths.value).toBe(true)
    expect(theme.getSpecConfig().showPathsSummary.value).toBe(false)
    expect(theme.getSpecConfig().avoidCirculars.value).toBe(false)
    expect(theme.getSpecConfig().lazyRendering.value).toBe(false)
    expect(theme.getSpecConfig().defaultTag).toBe('Default')
    expect(theme.getSpecConfig().defaultTagDescription).toBe('')
    expect(theme.getSpecConfig().wrapExamples).toBe(true)
    expect(theme.getWrapExamples()).toBe(true)
  })

  it('can reset', () => {
    const theme = useTheme({
      jsonViewer: {
        deep: 7,
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
        getServers: ({ method, path, operation }) => (`https://app.local/${method}${path}`),
      },
      i18n: {
        locale: 'es',
      },
    })

    expect(theme.getJsonViewerDeep()).toBe(7)
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
    expect(theme.getI18nConfig().locale.value).toBe('es')

    theme.reset()

    expect(theme.getJsonViewerDeep()).toBe(Number.POSITIVE_INFINITY)
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
    expect(theme.getI18nConfig().locale.value).toBe('en')
  })
})

describe('useTheme', () => {
  const themeConfig = useTheme()

  beforeEach(() => {
    themeConfig.reset()
  })

  it('returns the default locale', () => {
    const result = themeConfig.getLocale()
    expect(result).toBe('en')
  })

  it('sets and gets the locale', () => {
    themeConfig.setLocale('es')
    const result = themeConfig.getLocale()
    expect(result).toBe('es')
  })

  it('returns the highlighter themeConfig', () => {
    const result = themeConfig.getHighlighterTheme()
    expect(result).toEqual({
      light: expect.any(Object),
      dark: expect.any(Object),
    })
  })

  it('returns the default schema view', () => {
    const result = themeConfig.getSchemaDefaultView()
    expect(result).toBe('contentType')
  })

  it('sets and gets the schema default view', () => {
    themeConfig.setSchemaDefaultView('schema')
    const result = themeConfig.getSchemaDefaultView()
    expect(result).toBe('schema')
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

  it('returns the default jsonViewer deep value', () => {
    const result = themeConfig.getJsonViewerDeep()
    expect(result).toBe(Number.POSITIVE_INFINITY)
  })

  it('sets and gets the jsonViewer deep value', () => {
    themeConfig.setJsonViewerDeep(5)
    const result = themeConfig.getJsonViewerDeep()
    expect(result).toBe(5)
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

  it('returns the operation badges', () => {
    const result = themeConfig.getOperationBadges()
    expect(result).toEqual(['deprecated'])
  })

  it('sets and gets the operation badges', () => {
    themeConfig.setOperationBadges(['operationId'])
    const result = themeConfig.getOperationBadges()
    expect(result).toEqual(['operationId'])
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
  })

  it('sets spec config', () => {
    themeConfig.setSpecConfig({
      groupByTags: false,
      collapsePaths: true,
      showPathsSummary: false,
      avoidCirculars: true,
      lazyRendering: true,
      wrapExamples: false,
    })
    const result = themeConfig.getSpecConfig()
    result.groupByTags.value = false
    result.collapsePaths.value = true
    result.showPathsSummary.value = false
    result.avoidCirculars.value = true
    result.lazyRendering.value = true
    result.wrapExamples = false
    expect(themeConfig.getWrapExamples()).toBe(false)
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
