import { describe, expect, it } from 'vitest'
import { useTheme } from './src/composables/useTheme'

describe('useTheme', () => {
  const theme = useTheme()

  it('returns the default locale', () => {
    const result = theme.getLocale()
    expect(result).toBe('en')
  })

  it('sets and gets the locale', () => {
    theme.setLocale('es')
    const result = theme.getLocale()
    expect(result).toBe('es')
  })

  it('returns the highlighter theme', () => {
    const result = theme.getHighlighterTheme()
    expect(result).toEqual({
      light: expect.any(Object),
      dark: expect.any(Object),
    })
  })

  it('returns the default schema view', () => {
    const result = theme.getSchemaDefaultView()
    expect(result).toBe('contentType')
  })

  it('sets and gets the schema default view', () => {
    theme.setSchemaDefaultView('schema')
    const result = theme.getSchemaDefaultView()
    expect(result).toBe('schema')
  })

  it('returns the default showBaseURL value', () => {
    const result = theme.getShowBaseURL()
    expect(result).toBe(false)
  })

  it('sets and gets the showBaseURL value', () => {
    theme.setShowBaseURL(true)
    const result = theme.getShowBaseURL()
    expect(result).toBe(true)
  })

  it('returns the default jsonViewer deep value', () => {
    const result = theme.getJsonViewerDeep()
    expect(result).toBe(Infinity)
  })

  it('sets and gets the jsonViewer deep value', () => {
    theme.setJsonViewerDeep(5)
    const result = theme.getJsonViewerDeep()
    expect(result).toBe(5)
  })

  it('returns the default schemaViewer deep value', () => {
    const result = theme.getSchemaViewerDeep()
    expect(result).toBe(Infinity)
  })

  it('sets and gets the schemaViewer deep value', () => {
    theme.setSchemaViewerDeep(3)
    const result = theme.getSchemaViewerDeep()
    expect(result).toBe(3)
  })

  it('returns the heading levels', () => {
    const result = theme.getHeadingLevels()
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
    const result = theme.getHeadingLevel('h3')
    expect(result).toBe('h3')
  })

  it('sets and gets the heading levels', () => {
    theme.setHeadingLevels({ h1: 2, h2: 3 })
    const result = theme.getHeadingLevels()
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
    const result = theme.getResponseCodeSelector()
    expect(result).toBe('tabs')
  })

  it('sets and gets the response code selector', () => {
    theme.setResponseCodeSelector('select')
    const result = theme.getResponseCodeSelector()
    expect(result).toBe('select')
  })

  it('returns the default response code max tabs', () => {
    const result = theme.getResponseCodeMaxTabs()
    expect(result).toBe(5)
  })

  it('sets and gets the response code max tabs', () => {
    theme.setResponseCodeMaxTabs(10)
    const result = theme.getResponseCodeMaxTabs()
    expect(result).toBe(10)
  })
})
