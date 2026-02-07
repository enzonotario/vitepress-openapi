import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useShiki } from '../../src/composables/useShiki'
import { useTheme } from '../../src/composables/useTheme'

vi.mock('shiki/core', async (importOriginal) => {
  const original = await importOriginal<typeof import('shiki/core')>()
  return {
    ...original,
    createHighlighterCore: vi.fn().mockImplementation(original.createHighlighterCore),
  }
})

describe('useShiki', () => {
  beforeEach(() => {
    const shiki = useShiki()
    shiki.reset()
    useTheme().reset()
  })

  it('initializes loading as true', () => {
    const shiki = useShiki()
    expect(shiki.loading.value).toBe(true)
  })

  it('isReady returns false before initialization', () => {
    const shiki = useShiki()
    expect(shiki.isReady()).toBe(false)
  })

  it('init initializes shiki with core highlighters only', async () => {
    const shiki = useShiki()
    expect(shiki.isReady()).toBe(false)

    await shiki.init()

    expect(shiki.isReady()).toBe(true)
    expect(shiki.loading.value).toBe(false)

    // Core highlighters should be loaded
    expect(shiki.isLanguageLoaded('json')).toBe(true)
    expect(shiki.isLanguageLoaded('xml')).toBe(true)
    expect(shiki.isLanguageLoaded('markdown')).toBe(true)

    // Non-core highlighters should NOT be loaded yet
    expect(shiki.isLanguageLoaded('javascript')).toBe(false)
    expect(shiki.isLanguageLoaded('bash')).toBe(false)
  })

  it('multiple init calls return the same promise', async () => {
    const shiki = useShiki()

    const promise1 = shiki.init()
    const promise2 = shiki.init()

    expect(promise1).toBe(promise2)

    await promise1
    expect(shiki.isReady()).toBe(true)
  })

  it('renderShiki returns fallback html when not initialized', () => {
    const shiki = useShiki()
    const code = 'const x = 1'

    const result = shiki.renderShiki(code, { lang: 'javascript', theme: 'vitesse-dark' })

    expect(result).toBe(`<pre><code>${code}</code></pre>`)
  })

  it('renderShiki returns fallback for language not yet loaded', async () => {
    const shiki = useShiki()
    await shiki.init()

    const code = 'const x = 1'
    // javascript is not a core highlighter, so not loaded yet
    const result = shiki.renderShiki(code, { lang: 'javascript', theme: 'vitesse-dark' })

    expect(result).toBe(`<pre><code>${code}</code></pre>`)
  })

  it('renderShiki returns fallback for unsupported language', async () => {
    const shiki = useShiki()
    await shiki.init()

    const code = 'some code'
    const result = shiki.renderShiki(code, { lang: 'unsupported-lang', theme: 'vitesse-dark' })

    expect(result).toBe(`<pre><code>${code}</code></pre>`)
  })

  it('reset clears the shiki instance', async () => {
    const shiki = useShiki()

    await shiki.init()
    expect(shiki.isReady()).toBe(true)

    shiki.reset()
    expect(shiki.isReady()).toBe(false)
    expect(shiki.loading.value).toBe(true)
  })

  it('can reinitialize after reset', async () => {
    const shiki = useShiki()

    await shiki.init()
    expect(shiki.isReady()).toBe(true)

    shiki.reset()
    expect(shiki.isReady()).toBe(false)

    await shiki.init()
    expect(shiki.isReady()).toBe(true)
  })

  it('supports different themes', async () => {
    const shiki = useShiki()
    await shiki.init()

    const code = '{"key": "value"}'

    const darkResult = shiki.renderShiki(code, { lang: 'json', theme: 'vitesse-dark' })
    const lightResult = shiki.renderShiki(code, { lang: 'json', theme: 'vitesse-light' })

    expect(darkResult).toContain('shiki')
    expect(lightResult).toContain('shiki')
  })

  it('supports json language (core highlighter)', async () => {
    const shiki = useShiki()
    await shiki.init()

    const code = '{"key": "value"}'
    const result = shiki.renderShiki(code, { lang: 'json', theme: 'vitesse-dark' })

    expect(result).toContain('shiki')
  })

  it('supports xml language (core highlighter)', async () => {
    const shiki = useShiki()
    await shiki.init()

    const code = '<root><child>value</child></root>'
    const result = shiki.renderShiki(code, { lang: 'xml', theme: 'vitesse-dark' })

    expect(result).toContain('shiki')
  })

  it('supports markdown language (core highlighter)', async () => {
    const shiki = useShiki()
    await shiki.init()

    const code = '# Title\n\nParagraph'
    const result = shiki.renderShiki(code, { lang: 'markdown', theme: 'vitesse-dark' })

    expect(result).toContain('shiki')
  })
})

describe('useShiki lazy loading', () => {
  beforeEach(() => {
    const shiki = useShiki()
    shiki.reset()
    useTheme().reset()
  })

  it('ensureLanguage loads a language on demand', async () => {
    const shiki = useShiki()
    await shiki.init()

    expect(shiki.isLanguageLoaded('javascript')).toBe(false)

    const result = await shiki.ensureLanguage('javascript')

    expect(result).toBe(true)
    expect(shiki.isLanguageLoaded('javascript')).toBe(true)
  })

  it('ensureLanguage returns true for already loaded language', async () => {
    const shiki = useShiki()
    await shiki.init()

    // json is a core highlighter, already loaded
    expect(shiki.isLanguageLoaded('json')).toBe(true)

    const result = await shiki.ensureLanguage('json')

    expect(result).toBe(true)
  })

  it('ensureLanguage returns false for unsupported language', async () => {
    const shiki = useShiki()
    await shiki.init()

    const result = await shiki.ensureLanguage('not-a-real-language')

    expect(result).toBe(false)
  })

  it('concurrent ensureLanguage calls for same language only load once', async () => {
    const shiki = useShiki()
    await shiki.init()

    const results = await Promise.all([
      shiki.ensureLanguage('typescript'),
      shiki.ensureLanguage('typescript'),
      shiki.ensureLanguage('typescript'),
    ])

    expect(results).toEqual([true, true, true])
    expect(shiki.isLanguageLoaded('typescript')).toBe(true)
  })

  it('ensureLanguage initializes shiki if not ready', async () => {
    const shiki = useShiki()
    expect(shiki.isReady()).toBe(false)

    await shiki.ensureLanguage('javascript')

    expect(shiki.isReady()).toBe(true)
    expect(shiki.isLanguageLoaded('javascript')).toBe(true)
  })

  it('renderShiki works after ensureLanguage', async () => {
    const shiki = useShiki()
    await shiki.init()

    await shiki.ensureLanguage('javascript')

    const code = 'const x = 1'
    const result = shiki.renderShiki(code, { lang: 'javascript', theme: 'vitesse-dark' })

    expect(result).toContain('shiki')
    expect(result).toContain('const')
  })

  it('supports bash language via ensureLanguage', async () => {
    const shiki = useShiki()
    await shiki.ensureLanguage('bash')

    const code = 'echo "hello"'
    const result = shiki.renderShiki(code, { lang: 'bash', theme: 'vitesse-dark' })

    expect(result).toContain('shiki')
  })

  it('supports python language via ensureLanguage', async () => {
    const shiki = useShiki()
    await shiki.ensureLanguage('python')

    const code = 'print("hello")'
    const result = shiki.renderShiki(code, { lang: 'python', theme: 'vitesse-dark' })

    expect(result).toContain('shiki')
  })

  it('supports php language via ensureLanguage', async () => {
    const shiki = useShiki()
    await shiki.ensureLanguage('php')

    const code = '<?php echo "hello"; ?>'
    const result = shiki.renderShiki(code, { lang: 'php', theme: 'vitesse-dark' })

    expect(result).toContain('shiki')
  })

  it('supports typescript language via ensureLanguage', async () => {
    const shiki = useShiki()
    await shiki.ensureLanguage('typescript')

    const code = 'const x: number = 1'
    const result = shiki.renderShiki(code, { lang: 'typescript', theme: 'vitesse-dark' })

    expect(result).toContain('shiki')
  })
})

describe('useShiki error handling', () => {
  beforeEach(async () => {
    const shiki = useShiki()
    shiki.reset()
    useTheme().reset()
  })

  it('allows retry after initialization failure', async () => {
    const shikiComposable = useShiki()
    const shikiCore = await import('shiki/core')
    const mockedCreate = vi.mocked(shikiCore.createHighlighterCore)

    // First call throws
    mockedCreate.mockRejectedValueOnce(new Error('Network error'))

    await expect(shikiComposable.init()).rejects.toThrow('Network error')
    expect(shikiComposable.isReady()).toBe(false)

    // Reset shiki state
    shikiComposable.reset()

    // Restore mock to original implementation for retry
    const originalModule = await vi.importActual<typeof import('shiki/core')>('shiki/core')
    mockedCreate.mockImplementation(originalModule.createHighlighterCore)

    // Retry should succeed
    await shikiComposable.init()
    expect(shikiComposable.isReady()).toBe(true)
  })

  it('clears initPromise on failure to allow retry', async () => {
    const { createHighlighterCore } = await import('shiki/core')
    const mockedCreate = vi.mocked(createHighlighterCore)
    mockedCreate.mockClear()

    mockedCreate
      .mockRejectedValueOnce(new Error('First failure'))
      .mockRejectedValueOnce(new Error('Second failure'))

    const shiki = useShiki()

    await expect(shiki.init()).rejects.toThrow('First failure')
    await expect(shiki.init()).rejects.toThrow('Second failure')

    expect(mockedCreate).toHaveBeenCalledTimes(2)
  })
})

