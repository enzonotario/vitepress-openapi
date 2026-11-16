import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createLlmsDevMiddleware, generateLlmsFiles, getPageRoutes, getRawFileRequestUrl } from '../../src/node/llms'

const spec = {
  openapi: '3.0.0',
  info: { title: 'Pets API', version: '1.0.0' },
  paths: {
    '/pets': { get: { operationId: 'listPets', summary: 'List pets', tags: ['Pets'], responses: { 200: { description: 'OK' } } } },
    '/hidden': { get: { operationId: 'hidden', summary: 'Hidden', tags: ['Pets'], responses: { 200: { description: 'OK' } } } },
  },
}

let dir: string

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'vitepress-openapi-llms-'))
})

afterEach(() => {
  rmSync(dir, { recursive: true, force: true })
})

describe('getPageRoutes', () => {
  it('applies rewrites and strips extensions', () => {
    const routes = getPageRoutes({
      outDir: dir,
      pages: ['index.md', 'operations/[operationId].md', 'src/guide.md'],
      rewrites: { map: { 'src/guide.md': 'guide.md' } },
    })
    expect([...routes!]).toEqual(['index', 'operations/[operationId]', 'guide'])
  })

  it('returns undefined without pages', () => {
    expect(getPageRoutes({ outDir: dir })).toBeUndefined()
  })
})

describe('generateLlmsFiles', () => {
  it('writes files next to the pages listed in the site config', async () => {
    const written = await generateLlmsFiles(
      { outDir: dir, pages: ['ops/listPets.md', 'one-page.md'], site: { base: '/docs/' } },
      { spec, operationRoute: 'ops/{operationId}', specRoutes: ['one-page'], codeSamples: false },
    )

    expect(written.map(path => path.slice(dir.length + 1))).toEqual(['ops/listPets.md', 'one-page.md', 'llms.txt', 'llms-full.txt'])
    expect(readFileSync(join(dir, 'ops/listPets.md'), 'utf-8').startsWith('# List pets')).toBe(true)
    expect(existsSync(join(dir, 'ops/hidden.md'))).toBe(false)
    expect(readFileSync(join(dir, 'llms.txt'), 'utf-8')).toContain('- [List pets](/docs/ops/listPets.md)')
  })

  it('falls back to built HTML files without a page list, and loads specPath', async () => {
    mkdirSync(join(dir, 'ops'))
    writeFileSync(join(dir, 'ops/hidden.html'), '<html></html>')
    const specPath = join(dir, 'openapi.json')
    writeFileSync(specPath, JSON.stringify(spec))

    await generateLlmsFiles({ outDir: dir }, { specPath, operationRoute: 'ops/{operationId}', extension: 'txt', llmsTxt: false, codeSamples: false })

    expect(readFileSync(join(dir, 'ops/hidden.txt'), 'utf-8').startsWith('# Hidden')).toBe(true)
    expect(existsSync(join(dir, 'ops/listPets.txt'))).toBe(false)
    expect(existsSync(join(dir, 'llms.txt'))).toBe(false)
  })

  it('does not write through symlinks', async () => {
    const outside = join(dir, 'outside')
    const outDir = join(dir, 'dist')
    mkdirSync(outside)
    mkdirSync(outDir)
    symlinkSync(outside, join(outDir, 'ops'))

    await expect(generateLlmsFiles(
      { outDir, pages: ['ops/listPets.md'] },
      { spec, operationRoute: 'ops/{operationId}', codeSamples: false },
    )).rejects.toThrow('Refusing to write through a symlink')
    expect(existsSync(join(outside, 'listPets.md'))).toBe(false)

    const target = join(dir, 'secret.txt')
    writeFileSync(target, 'secret')
    rmSync(join(outDir, 'ops'))
    symlinkSync(target, join(outDir, 'llms.txt'))
    await expect(generateLlmsFiles({ outDir, pages: [] }, { spec, operationRoute: 'ops/{operationId}', codeSamples: false }))
      .rejects
      .toThrow('Refusing to overwrite a symlink')
    expect(readFileSync(target, 'utf-8')).toBe('secret')
  })
})

describe('createLlmsDevMiddleware', () => {
  function call(middleware: ReturnType<typeof createLlmsDevMiddleware>, url: string, method = 'GET') {
    const res = { statusCode: 0, headers: {} as Record<string, string>, body: undefined as string | undefined, setHeader(name: string, value: string) {
      this.headers[name] = value
    }, end(body?: string) {
      this.body = body
    } }
    const next = vi.fn()
    return middleware({ url, method }, res, next).then(() => ({ res, next }))
  }

  const siteConfig = { outDir: dir, pages: ['ops/listPets.md'], site: { base: '/docs/' } }
  const middleware = createLlmsDevMiddleware({ spec, operationRoute: 'ops/{operationId}', codeSamples: false }, () => siteConfig)

  it('serves operation files and llms.txt', async () => {
    const operation = await call(middleware, '/docs/ops/listPets.md')
    expect(operation.res.statusCode).toBe(200)
    expect(operation.res.headers['Content-Type']).toBe('text/markdown; charset=utf-8')
    expect(operation.res.body!.startsWith('# List pets')).toBe(true)

    const llms = await call(middleware, '/docs/llms.txt')
    expect(llms.res.headers['Content-Type']).toBe('text/plain; charset=utf-8')
    expect(llms.res.body).toContain('(/docs/ops/listPets.md)')
  })

  it('serves the introduction and tag routes', async () => {
    const siteMiddleware = createLlmsDevMiddleware({
      spec: { ...spec, tags: [{ name: 'Pet Owners' }], paths: { '/pets': { get: { ...spec.paths['/pets'].get, tags: ['Pet Owners'] } } } },
      operationRoute: 'ops/{operationId}',
      introductionRoute: 'intro',
      tagRoute: 'tags/{tag}',
      codeSamples: false,
    }, () => ({ outDir: dir, pages: ['ops/listPets.md', 'intro.md', 'tags/Pet Owners.md'], site: { base: '/docs/' } }))

    const intro = await call(siteMiddleware, '/docs/intro.md')
    expect(intro.res.headers['Content-Type']).toBe('text/markdown; charset=utf-8')
    expect(intro.res.body).toContain('- [Pet Owners](/docs/tags/Pet%20Owners.md)')

    const tag = await call(siteMiddleware, '/docs/tags/Pet%20Owners.md')
    expect(tag.res.statusCode).toBe(200)
    expect(tag.res.body!.startsWith('# Pet Owners\n\n## List pets')).toBe(true)
  })

  it('passes other requests through', async () => {
    expect((await call(middleware, '/docs/ops/hidden.md')).next).toHaveBeenCalled()
    expect((await call(middleware, '/docs/ops/listPets.html')).next).toHaveBeenCalled()
    expect((await call(middleware, '/docs/ops/listPets.md', 'POST')).next).toHaveBeenCalled()
  })
})

describe('resolvePage', () => {
  const pageSpec = (title: string) => ({
    openapi: '3.0.0',
    info: { title, version: '1.0.0' },
    tags: [{ name: 'Things' }],
    paths: {
      '/things': {
        get: {
          operationId: 'listThings',
          summary: 'List things',
          description: 'See [](/operations/getThing).',
          tags: ['Things'],
          responses: { 200: { description: 'OK' } },
        },
      },
      '/things/{id}': { get: { operationId: 'getThing', summary: 'Get a thing', tags: ['Things'], responses: {} } },
    },
  })

  const siteConfig = (pages: Record<string, Record<string, any> | undefined>) => ({
    outDir: dir,
    pages: Object.keys(pages),
    dynamicRoutes: { routes: Object.entries(pages).filter(([, params]) => params).map(([path, params]) => ({ path, params })) },
    site: { base: '/docs/' },
  })

  const testsEntry = {
    title: 'Tests',
    codeSamples: false as const,
    resolvePage: ({ route, params }: { route: string, params?: Record<string, any> }) => route.startsWith('tests/') ? { spec: params?.spec } : undefined,
  }

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('writes the spec from route params with plain operation links', async () => {
    await generateLlmsFiles(siteConfig({
      'tests/a.md': { spec: pageSpec('Spec A') },
      'guide.md': undefined,
    }), testsEntry)

    const content = readFileSync(join(dir, 'tests/a.md'), 'utf-8')
    expect(content.startsWith('# Spec A\n\n> API reference for Spec A (version 1.0.0).\n\n---\n\n# List things')).toBe(true)
    expect(content).toContain('See Get a thing.')
    expect(existsSync(join(dir, 'guide.md'))).toBe(false)
    expect(readFileSync(join(dir, 'llms.txt'), 'utf-8')).toBe('# Documentation\n\n## Tests\n\n- [Spec A](/docs/tests/a.md)\n')
  })

  it('renders operation, introduction and tag modes', async () => {
    const spec = pageSpec('Modes')
    await generateLlmsFiles(siteConfig({ 'op.md': {}, 'intro.md': {}, 'tag.md': {}, 'missing.md': {} }), {
      spec,
      codeSamples: false,
      llmsTxt: false,
      resolvePage: ({ route }) => ({
        op: { mode: 'operation' as const, operationId: 'getThing' },
        intro: { mode: 'introduction' as const },
        tag: { mode: 'tag' as const, tag: 'Things' },
        missing: { mode: 'operation' as const, operationId: 'nope' },
      })[route],
    })

    expect(readFileSync(join(dir, 'op.md'), 'utf-8').startsWith('# Get a thing')).toBe(true)
    expect(readFileSync(join(dir, 'intro.md'), 'utf-8')).toContain('- List things `GET /things`')
    expect(readFileSync(join(dir, 'tag.md'), 'utf-8').startsWith('# Things\n\n## List things')).toBe(true)
    expect(existsSync(join(dir, 'missing.md'))).toBe(false)
  })

  it('fetches each specUrl once and skips pages whose spec fails to load', async () => {
    const fetchMock = vi.fn(async (url: string) => url.includes('broken')
      ? new Response('nope', { status: 500, statusText: 'Server Error' })
      : new Response(JSON.stringify(pageSpec('Remote'))))
    vi.stubGlobal('fetch', fetchMock)
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    await generateLlmsFiles(siteConfig({ 'ex/one.md': { url: 'https://x/spec.json' }, 'ex/two.md': { url: 'https://x/spec.json' }, 'ex/bad.md': { url: 'https://x/broken.json' } }), {
      codeSamples: false,
      resolvePage: ({ params }) => params?.url ? { specUrl: params.url } : undefined,
    })

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(readFileSync(join(dir, 'ex/one.md'), 'utf-8').startsWith('# Remote')).toBe(true)
    expect(existsSync(join(dir, 'ex/two.md'))).toBe(true)
    expect(existsSync(join(dir, 'ex/bad.md'))).toBe(false)
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('"ex/bad"'), expect.stringContaining('500'))
  })

  it('lets resolvePage override maxSize per page, and links specUrl in the summary note', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify(pageSpec('Remote')))))

    await generateLlmsFiles(siteConfig({ 'big.md': {}, 'small.md': {} }), {
      codeSamples: false,
      llmsTxt: false,
      maxSize: 50,
      resolvePage: ({ route }) => ({ specUrl: 'https://x/spec.json', maxSize: route === 'big' ? false : undefined }),
    })

    expect(readFileSync(join(dir, 'big.md'), 'utf-8')).toContain('# List things')
    const small = readFileSync(join(dir, 'small.md'), 'utf-8')
    expect(small).toContain('See the [OpenAPI specification](https://x/spec.json) for every detail.')
    expect(small).toContain('- `GET /things` – List things')
  })

  it('merges every entry into one llms.txt, with llms-full.txt from operationRoute entries only', async () => {
    await generateLlmsFiles(siteConfig({ 'ops/listPets.md': {}, 'tests/a.md': { spec: pageSpec('Spec A') } }), [
      { spec, operationRoute: 'ops/{operationId}', codeSamples: false },
      testsEntry,
    ])

    const llms = readFileSync(join(dir, 'llms.txt'), 'utf-8')
    expect(llms.startsWith('# Pets API')).toBe(true)
    expect(llms).toContain('- [List pets](/docs/ops/listPets.md)')
    expect(llms).toContain('## Tests\n\n- [Spec A](/docs/tests/a.md)\n\n## Optional')
    const full = readFileSync(join(dir, 'llms-full.txt'), 'utf-8')
    expect(full).toContain('# List pets')
    expect(full).not.toContain('Spec A')
  })

  it('resolves page params in the dev middleware', async () => {
    const middleware = createLlmsDevMiddleware(testsEntry, () => siteConfig({ 'tests/a.md': { spec: pageSpec('Spec A') } }))
    const res = { statusCode: 0, headers: {} as Record<string, string>, body: undefined as string | undefined, setHeader(name: string, value: string) {
      this.headers[name] = value
    }, end(body?: string) {
      this.body = body
    } }
    const next = vi.fn()

    await middleware({ url: '/docs/tests/a.md', method: 'GET' }, res, next)
    expect(next).not.toHaveBeenCalled()
    expect(res.headers['Content-Type']).toBe('text/markdown; charset=utf-8')
    expect(res.body!.startsWith('# Spec A')).toBe(true)

    await middleware({ url: '/docs/llms.txt', method: 'GET' }, res, next)
    expect(res.body).toContain('- [Spec A](/docs/tests/a.md)')

    await middleware({ url: '/docs/tests/b.md', method: 'GET' }, res, next)
    expect(next).toHaveBeenCalledTimes(1)
  })
})

describe('dev middleware special characters', () => {
  it('serves a tag route with # percent-encoded', async () => {
    const middleware = createLlmsDevMiddleware({
      spec: { ...spec, tags: [{ name: 'C#' }], paths: { '/pets': { get: { ...spec.paths['/pets'].get, tags: ['C#'] } } } },
      operationRoute: 'ops/{operationId}',
      tagRoute: 'tags/{tag}',
      codeSamples: false,
    }, () => ({ outDir: dir, pages: ['ops/listPets.md', 'tags/C#.md'], site: { base: '/' } }))
    const res = { statusCode: 0, body: undefined as string | undefined, setHeader: () => {}, end(body?: string) {
      this.body = body
    } }

    await middleware({ url: '/tags/C%23.md', method: 'GET' }, res, vi.fn())
    expect(res.body!.startsWith('# C#')).toBe(true)

    await middleware({ url: '/llms.txt', method: 'GET' }, res, vi.fn())
    expect(res.body).toContain('(/tags/C%23.md)')
  })
})

describe('getRawFileRequestUrl', () => {
  it('accepts raw requests from curl, navigations and fetch()', () => {
    expect(getRawFileRequestUrl({ method: 'GET', url: '/tests/a.md', headers: { accept: '*/*' } })).toBe('/tests/a.md')
    expect(getRawFileRequestUrl({ method: 'GET', url: '/tests/a.md', headers: { 'sec-fetch-dest': 'document', 'accept': 'text/html,application/xhtml+xml' } })).toBe('/tests/a.md')
    expect(getRawFileRequestUrl({ method: 'GET', url: '/llms.txt', headers: { 'sec-fetch-dest': 'empty', 'accept': 'text/plain' } })).toBe('/llms.txt')
    expect(getRawFileRequestUrl({ method: 'HEAD', url: '/tests/a.md' })).toBe('/tests/a.md')
  })

  it('leaves page module requests to Vite', () => {
    // VitePress `pathToFile` in dev: `${path}.md?t=${Date.now()}`, imported as a script.
    expect(getRawFileRequestUrl({ method: 'GET', url: '/tests/a.md?t=1700000000000', headers: { 'sec-fetch-dest': 'script', 'accept': '*/*' } })).toBeUndefined()
    expect(getRawFileRequestUrl({ method: 'GET', url: '/tests/a.md?import' })).toBeUndefined()
    expect(getRawFileRequestUrl({ method: 'GET', url: '/tests/a.md?v=123' })).toBeUndefined()
    expect(getRawFileRequestUrl({ method: 'GET', url: '/tests/a.md', headers: { 'sec-fetch-dest': 'script' } })).toBeUndefined()
    expect(getRawFileRequestUrl({ method: 'GET', url: '/tests/a.md', headers: { accept: 'application/javascript' } })).toBeUndefined()
    expect(getRawFileRequestUrl({ method: 'POST', url: '/tests/a.md' })).toBeUndefined()
    expect(getRawFileRequestUrl({ method: 'GET', url: '/tests/a.html' })).toBeUndefined()
  })

  it('uses the URL as sent, before rewrites', () => {
    expect(getRawFileRequestUrl({ method: 'GET', url: '/src/guide.md', originalUrl: '/guide.md' })).toBe('/guide.md')
  })
})

describe('dev middleware with rewrites', () => {
  const rewriteSpec = {
    openapi: '3.0.0',
    info: { title: 'Rewritten', version: '1.0.0' },
    paths: { '/x': { get: { operationId: 'x', summary: 'X', responses: {} } } },
  }
  const siteConfig = () => ({
    outDir: dir,
    pages: ['src/api.md'],
    rewrites: { map: { 'src/api.md': 'api.md' } },
    site: { base: '/' },
  })
  const middleware = createLlmsDevMiddleware({
    spec: rewriteSpec,
    codeSamples: false,
    resolvePage: ({ route }) => route === 'api' ? {} : undefined,
  }, siteConfig)

  function call(req: Parameters<typeof middleware>[0]) {
    const res = { statusCode: 0, body: undefined as string | undefined, setHeader: () => {}, end(body?: string) {
      this.body = body
    } }
    const next = vi.fn()
    return middleware(req, res, next).then(() => ({ res, next }))
  }

  it('serves the rewritten route even after the rewrites middleware changed url', async () => {
    const { res, next } = await call({ method: 'GET', url: '/src/api.md', originalUrl: '/api.md' })
    expect(next).not.toHaveBeenCalled()
    expect(res.body!.startsWith('# Rewritten')).toBe(true)
  })

  it('does not serve the rewritten page for its source route', async () => {
    const { next } = await call({ method: 'GET', url: '/src/api.md', originalUrl: '/src/api.md' })
    expect(next).toHaveBeenCalled()
  })

  it('passes page module requests through', async () => {
    const { next } = await call({ method: 'GET', url: '/src/api.md?t=1', originalUrl: '/api.md?t=1', headers: { 'sec-fetch-dest': 'script' } })
    expect(next).toHaveBeenCalled()
  })
})
