import { describe, expect, it } from 'vitest'
import { useTheme } from '../../src/composables/useTheme'

describe('useTheme', () => {
  const themeConfig = useTheme()

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
    expect(result).toBe(Infinity)
  })

  it('sets and gets the jsonViewer deep value', () => {
    themeConfig.setJsonViewerDeep(5)
    const result = themeConfig.getJsonViewerDeep()
    expect(result).toBe(5)
  })

  it('returns the default schemaViewer deep value', () => {
    const result = themeConfig.getSchemaViewerDeep()
    expect(result).toBe(Infinity)
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
    })
  })

  it('sets and gets the i18n config', () => {
    themeConfig.setI18nConfig({ locale: 'es' })
    const result = themeConfig.getI18nConfig()
    expect(result.locale.value).toBe('es')
  })

  it('returns the spec config', () => {
    const result = themeConfig.getSpecConfig()
    expect(result).toEqual({
      groupByTags: expect.any(Object),
      collapsePaths: expect.any(Object),
      showPathsSummary: expect.any(Object),
    })
  })

  it('sets spec config', () => {
    themeConfig.setSpecConfig({ groupByTags: false, collapsePaths: true, showPathsSummary: false })
    const result = themeConfig.getSpecConfig()
    result.groupByTags.value = false
    result.collapsePaths.value = true
    result.showPathsSummary.value = false
  })
})
