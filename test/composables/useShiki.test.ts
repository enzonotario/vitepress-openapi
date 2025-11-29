import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useShiki } from '../../src/composables/useShiki'

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
  })

  it('initializes loading as true', () => {
    const shiki = useShiki()
    expect(shiki.loading.value).toBe(true)
  })

  it('isReady returns false before initialization', () => {
    const shiki = useShiki()
    expect(shiki.isReady()).toBe(false)
  })

  it('init initializes shiki', async () => {
    const shiki = useShiki()
    expect(shiki.isReady()).toBe(false)

    await shiki.init()

    expect(shiki.isReady()).toBe(true)
    expect(shiki.loading.value).toBe(false)
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

  it('renderShiki returns highlighted html after initialization', async () => {
    const shiki = useShiki()
    await shiki.init()

    const code = 'const x = 1'
    const result = shiki.renderShiki(code, { lang: 'javascript', theme: 'vitesse-dark' })

    expect(result).toContain('<pre')
    expect(result).toContain('shiki')
    expect(result).toContain('const')
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

  it('concurrent init calls only initialize once', async () => {
    const shiki = useShiki()

    const results = await Promise.all([
      shiki.init(),
      shiki.init(),
      shiki.init(),
    ])

    expect(results.length).toBe(3)
    expect(shiki.isReady()).toBe(true)
  })

  it('supports different themes', async () => {
    const shiki = useShiki()
    await shiki.init()

    const code = 'const x = 1'

    const darkResult = shiki.renderShiki(code, { lang: 'javascript', theme: 'vitesse-dark' })
    const lightResult = shiki.renderShiki(code, { lang: 'javascript', theme: 'vitesse-light' })

    expect(darkResult).toContain('shiki')
    expect(lightResult).toContain('shiki')
  })

  it('supports json language', async () => {
    const shiki = useShiki()
    await shiki.init()

    const code = '{"key": "value"}'
    const result = shiki.renderShiki(code, { lang: 'json', theme: 'vitesse-dark' })

    expect(result).toContain('shiki')
  })

  it('supports typescript language', async () => {
    const shiki = useShiki()
    await shiki.init()

    const code = 'const x: number = 1'
    const result = shiki.renderShiki(code, { lang: 'typescript', theme: 'vitesse-dark' })

    expect(result).toContain('shiki')
  })

  it('supports bash language', async () => {
    const shiki = useShiki()
    await shiki.init()

    const code = 'echo "hello"'
    const result = shiki.renderShiki(code, { lang: 'bash', theme: 'vitesse-dark' })

    expect(result).toContain('shiki')
  })

  it('supports python language', async () => {
    const shiki = useShiki()
    await shiki.init()

    const code = 'print("hello")'
    const result = shiki.renderShiki(code, { lang: 'python', theme: 'vitesse-dark' })

    expect(result).toContain('shiki')
  })

  it('supports php language', async () => {
    const shiki = useShiki()
    await shiki.init()

    const code = '<?php echo "hello"; ?>'
    const result = shiki.renderShiki(code, { lang: 'php', theme: 'vitesse-dark' })

    expect(result).toContain('shiki')
  })

  it('supports xml language', async () => {
    const shiki = useShiki()
    await shiki.init()

    const code = '<root><child>value</child></root>'
    const result = shiki.renderShiki(code, { lang: 'xml', theme: 'vitesse-dark' })

    expect(result).toContain('shiki')
  })

  it('supports markdown language', async () => {
    const shiki = useShiki()
    await shiki.init()

    const code = '# Title\n\nParagraph'
    const result = shiki.renderShiki(code, { lang: 'markdown', theme: 'vitesse-dark' })

    expect(result).toContain('shiki')
  })
})

describe('useShiki error handling', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    const shiki = useShiki()
    shiki.reset()
  })

  it('allows retry after initialization failure', async () => {
    const { createHighlighterCore } = await import('shiki/core')
    const mockedCreate = vi.mocked(createHighlighterCore)

    mockedCreate.mockRejectedValueOnce(new Error('Network error'))

    const shiki = useShiki()

    await expect(shiki.init()).rejects.toThrow('Network error')
    expect(shiki.isReady()).toBe(false)

    mockedCreate.mockRestore()

    await shiki.init()
    expect(shiki.isReady()).toBe(true)
  })

  it('clears initPromise on failure to allow retry', async () => {
    const { createHighlighterCore } = await import('shiki/core')
    const mockedCreate = vi.mocked(createHighlighterCore)

    mockedCreate.mockRejectedValueOnce(new Error('First failure'))
    mockedCreate.mockRejectedValueOnce(new Error('Second failure'))

    const shiki = useShiki()

    await expect(shiki.init()).rejects.toThrow('First failure')
    await expect(shiki.init()).rejects.toThrow('Second failure')

    expect(mockedCreate).toHaveBeenCalledTimes(2)
  })
})

