import { describe, expect, it } from 'vitest'
import { useTheme } from '../../src/composables/useTheme'

describe('composition API', () => {
  it('can config', () => {
    const theme = useTheme({
      highlighterTheme: {
        light: {},
        dark: {},
      },
      request: {
        defaultView: 'schema',
        showBaseURL: true,
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
      },
      response: {
        maxTabs: 10,
        responseCodeSelector: 'select',
      },
      security: {
        defaultScheme: 'bearer',
        selectedScheme: 'bearer',
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
    expect(theme.getResponseCodeMaxTabs()).toBe(10)
    expect(theme.getResponseCodeSelector()).toBe('select')
    expect(theme.getSecurityDefaultScheme()).toBe('bearer')
    expect(theme.getSecuritySelectedScheme()).toBe('bearer')
    expect(theme.getI18nConfig().locale.value).toBe('es')
    expect(theme.getSpecConfig()).toEqual({
      groupByTags: expect.any(Object),
      collapsePaths: expect.any(Object),
      showPathsSummary: expect.any(Object),
    })
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
    expect(theme.getI18nConfig().locale.value).toBe('es')

    theme.reset()

    expect(theme.getJsonViewerDeep()).toBe(Infinity)
    expect(theme.getSchemaViewerDeep()).toBe(Infinity)
    expect(theme.getHeadingLevels()).toEqual({
      h1: 1,
      h2: 2,
      h3: 3,
      h4: 4,
      h5: 5,
      h6: 6,
    })
    expect(theme.getOperationBadges()).toEqual(['deprecated'])
    expect(theme.getI18nConfig().locale.value).toBe('en')
  })
})
