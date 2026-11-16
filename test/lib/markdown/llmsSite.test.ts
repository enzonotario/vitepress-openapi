import { afterEach, describe, expect, it, vi } from 'vitest'
import { generateLlmsSiteFiles, normalizeRoute, renderLlmsPage, resolveLlmsRequest, utf8Length } from '../../../src/lib/markdown/llmsSite'

const spec = {
  openapi: '3.0.0',
  info: { title: 'Pets API', version: '1.0.0' },
  tags: [{ name: 'Pets', description: 'See [](/operations/getPet).' }],
  paths: {
    '/pets': {
      get: {
        operationId: 'listPets',
        summary: 'List pets',
        description: 'Then call [](/operations/getPet) or [](/operations/hidden).',
        tags: ['Pets'],
        responses: { 200: { description: 'OK' } },
      },
    },
    '/pets/{id}': {
      get: { operationId: 'getPet', summary: 'Get a pet', tags: ['Pets'], responses: { 200: { description: 'OK' } } },
    },
    '/hidden': {
      get: { operationId: 'hidden', summary: 'Hidden', tags: ['Internal'], responses: { 200: { description: 'OK' } } },
    },
  },
  components: {
    securitySchemes: { apiKey: { type: 'apiKey', in: 'header', name: 'X-API-Key' } },
  },
}

const pages = new Set(['api/listPets', 'api/getPet', 'reference'])
const hasPage = (route: string) => pages.has(route)

function getFile(files: Array<{ path: string, content: string }>, path: string): string {
  const file = files.find(file => file.path === path)
  if (!file) {
    throw new Error(`Missing ${path} in ${files.map(file => file.path).join(', ')}`)
  }
  return file.content
}

describe('generateLlmsSiteFiles', () => {
  it('writes one file per operation page and skips operations without a page', async () => {
    const files = await generateLlmsSiteFiles(spec, { operationRoute: '/api/{operationId}', hasPage, codeSamples: false })

    expect(files.map(file => file.path)).toEqual(['api/listPets.md', 'api/getPet.md', 'llms.txt', 'llms-full.txt'])
    expect(getFile(files, 'api/listPets.md').startsWith('# List pets\n\n`GET /pets`')).toBe(true)
    expect(getFile(files, 'api/listPets.md')).not.toContain('::: v-pre')
  })

  it('uses the txt extension and the base path in links', async () => {
    const files = await generateLlmsSiteFiles(spec, {
      operationRoute: 'api/{operationId}',
      extension: 'txt',
      base: '/docs/',
      hasPage,
      codeSamples: false,
      openapiUrl: '/docs/openapi.json',
    })

    expect(getFile(files, 'api/listPets.txt')).toContain('Then call [Get a pet](/docs/api/getPet.txt) or [Hidden](/operations/hidden).')

    const llms = getFile(files, 'llms.txt')
    expect(llms).toContain('- [List pets](/docs/api/listPets.txt): GET /pets')
    expect(llms).toContain('- [Get a pet](/docs/api/getPet.txt): GET /pets/{id}')
    expect(llms).not.toContain('Internal')
    expect(llms).toContain('- [Full documentation](/docs/llms-full.txt)')
    expect(llms).toContain('- [OpenAPI specification](/docs/openapi.json)')
  })

  it('writes the whole spec for spec routes with a page', async () => {
    const files = await generateLlmsSiteFiles(spec, {
      operationRoute: 'api/{operationId}',
      specRoutes: ['/reference.html', 'missing'],
      hasPage,
      codeSamples: false,
    })

    const reference = getFile(files, 'reference.md')
    expect(reference).toBe(getFile(files, 'llms-full.txt'))
    expect(reference.startsWith('# Pets API')).toBe(true)
    expect(reference).toContain('# Hidden')
    expect(files.some(file => file.path.startsWith('missing'))).toBe(false)
  })

  it('skips llms files when disabled', async () => {
    const files = await generateLlmsSiteFiles(spec, { operationRoute: 'api/{operationId}', llmsTxt: false, hasPage, codeSamples: false })

    expect(files.map(file => file.path)).toEqual(['api/listPets.md', 'api/getPet.md'])
  })

  it('requires the operationId placeholder', async () => {
    await expect(generateLlmsSiteFiles(spec, { operationRoute: 'api/' })).rejects.toThrow('{operationId}')
  })
})

describe('generateLlmsSiteFiles introduction and tags', () => {
  const sitePages = new Set(['api/listPets', 'api/getPet', 'intro', 'tags/Pets', 'tags/pet-owners'])
  const options = {
    operationRoute: 'api/{operationId}',
    introductionRoute: '/intro',
    tagRoute: 'tags/{tag}',
    hasPage: (route: string) => sitePages.has(route),
    codeSamples: false as const,
  }

  it('writes the introduction with authentication and linked operations', async () => {
    const files = await generateLlmsSiteFiles(spec, { ...options, base: '/docs/' })
    const intro = getFile(files, 'intro.md')

    expect(intro.startsWith('# Pets API\n\nVersion: `1.0.0`')).toBe(true)
    expect(intro).toContain('## Security schemes\n\n- `apiKey`: API key in header `X-API-Key`.')
    expect(intro).toContain('## Pets\n\nSee [Get a pet](/docs/api/getPet.md).\n\n- [Pets](/docs/tags/Pets.md)\n  - [List pets](/docs/api/listPets.md) `GET /pets`')
    // No tag page and no operation page: listed without links.
    expect(intro).toContain('## Internal\n\n- Hidden `GET /hidden`')
  })

  it('writes one file per tag page with its operations', async () => {
    const files = await generateLlmsSiteFiles(spec, options)

    expect(getFile(files, 'tags/Pets.md').startsWith('# Pets\n\nSee [Get a pet](/api/getPet.md).\n\n## List pets\n\n`GET /pets`')).toBe(true)
    expect(getFile(files, 'tags/Pets.md')).toContain('## Get a pet')
    expect(files.some(file => file.path === 'tags/Internal.md')).toBe(false)
  })

  it('builds the tag route with tagParam', async () => {
    const files = await generateLlmsSiteFiles({
      ...spec,
      tags: [{ name: 'Pet Owners' }],
      paths: { '/owners': { get: { operationId: 'listOwners', summary: 'List owners', tags: ['Pet Owners'], responses: {} } } },
    }, { ...options, tagParam: tag => tag.toLowerCase().replaceAll(' ', '-') })

    expect(files.map(file => file.path)).toContain('tags/pet-owners.md')
  })

  it('links the overview and tag pages from llms.txt', async () => {
    const llms = getFile(await generateLlmsSiteFiles(spec, options), 'llms.txt')

    expect(llms).toContain('- [Overview](/intro.md): API description, servers, authentication and all operations\n- Version: 1.0.0')
    expect(llms).toContain('## Pets\n\n- [Pets](/tags/Pets.md): all Pets operations in a single file\n- [List pets](/api/listPets.md)')
  })

  it('skips the introduction and tags without a page', async () => {
    const files = await generateLlmsSiteFiles(spec, { ...options, hasPage: route => pages.has(route) && route !== 'reference' })

    expect(files.map(file => file.path)).toEqual(['api/listPets.md', 'api/getPet.md', 'llms.txt', 'llms-full.txt'])
    expect(getFile(files, 'llms.txt')).not.toContain('Overview')
  })

  it('requires the tag placeholder', async () => {
    await expect(generateLlmsSiteFiles(spec, { ...options, tagRoute: 'tags/' })).rejects.toThrow('{tag}')
  })
})

describe('link labels and URLs', () => {
  const special = {
    openapi: '3.0.0',
    info: { title: 'Special', version: '1.0.0' },
    tags: [{ name: 'C#' }],
    paths: { '/pets': { get: { operationId: 'getPet', summary: 'Get pet ]', tags: ['C#'], responses: {} } } },
  }
  const options = {
    operationRoute: 'api/{operationId}',
    tagRoute: 'tags/{tag}',
    introductionRoute: 'intro',
    hasPage: (route: string) => ['api/getPet', 'tags/C#', 'intro'].includes(route),
    codeSamples: false as const,
  }

  it('escapes brackets in link labels', async () => {
    const files = await generateLlmsSiteFiles(special, options)

    expect(getFile(files, 'llms.txt')).toContain('- [Get pet \\]](/api/getPet.md): GET /pets')
    expect(getFile(files, 'intro.md')).toContain('  - [Get pet \\]](/api/getPet.md) `GET /pets`')
  })

  it('percent-encodes ? and # in route segments', async () => {
    const files = await generateLlmsSiteFiles(special, { ...options, base: '/docs/' })

    expect(files.map(file => file.path)).toContain('tags/C#.md')
    expect(getFile(files, 'llms.txt')).toContain('- [C#](/docs/tags/C%23.md): all C# operations in a single file')
    expect(getFile(files, 'intro.md')).toContain('- [C#](/docs/tags/C%23.md)')
    expect(resolveLlmsRequest('/docs/tags/C%23.md', '/docs/', files)?.body.startsWith('# C#')).toBe(true)
  })
})

describe('maxSize', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('writes a summary for a spec page over maxSize, with a one-line warning', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const page = await renderLlmsPage(spec, { codeSamples: false, maxSize: 100, label: 'reference.md', specUrl: 'https://x/spec.json' })

    expect(page!.content).toBe([
      '# Pets API',
      '> **Note:** the full content is larger than 1 KB, so only a summary of each operation is included. See the [OpenAPI specification](https://x/spec.json) for every detail.',
      'Version: `1.0.0`',
      '## Security schemes\n\n- `apiKey`: API key in header `X-API-Key`.',
      '## Pets\n\nSee Get a pet.',
      '- `GET /pets` – List pets\n- `GET /pets/{id}` – Get a pet',
      '## Internal\n\n- `GET /hidden` – Hidden',
    ].join('\n\n').replace('## Pets\n\nSee Get a pet.\n\n', '## Pets\n\n').concat('\n'))
    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn.mock.calls[0][0]).toMatch(/^\[vitepress-openapi\] reference\.md: over \d+ bytes, more than maxSize \(100 bytes\): wrote a summary instead\.$/)
  })

  it('keeps pages under maxSize, and disables the limit with false or Infinity', async () => {
    const unlimited = await renderLlmsPage(spec, { codeSamples: false, maxSize: false })
    expect(unlimited!.content).toContain('# List pets')
    expect((await renderLlmsPage(spec, { codeSamples: false }))!.content).toBe(unlimited!.content)
    expect((await renderLlmsPage(spec, { codeSamples: false, maxSize: Number.POSITIVE_INFINITY }))!.content).toBe(unlimited!.content)
    expect((await renderLlmsPage(spec, { codeSamples: false, maxSize: utf8Length(unlimited!.content) }))!.content).toBe(unlimited!.content)
  })

  it('summarizes a tag page over maxSize', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    const page = await renderLlmsPage(spec, { codeSamples: false, mode: 'tag', tag: 'Pets', maxSize: 100 })

    expect(page!.content.startsWith('# Pets\n\n> **Note:** the full content is larger than 1 KB')).toBe(true)
    expect(page!.content).toContain('- `GET /pets/{id}` – Get a pet')
  })

  it('guards spec routes, tag files and llms-full.txt of a site, linking operations with a page', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const files = await generateLlmsSiteFiles(spec, {
      operationRoute: 'api/{operationId}',
      specRoutes: ['reference'],
      tagRoute: 'tags/{tag}',
      hasPage: route => pages.has(route) || route === 'tags/Pets',
      codeSamples: false,
      openapiUrl: '/openapi.json',
      maxSize: 100,
    })

    const full = getFile(files, 'llms-full.txt')
    expect(full).toBe(getFile(files, 'reference.md'))
    expect(full).toContain('See the [OpenAPI specification](/openapi.json) for every detail.')
    expect(full).toContain('- `GET /pets` – [List pets](/api/listPets.md)')
    expect(full).toContain('- `GET /hidden` – Hidden')
    expect(getFile(files, 'tags/Pets.md')).toContain('- `GET /pets/{id}` – [Get a pet](/api/getPet.md)')
    // Operation pages are not affected.
    expect(getFile(files, 'api/listPets.md').startsWith('# List pets')).toBe(true)
    expect(warn.mock.calls.map(call => String(call[0]).split(':')[0])).toEqual([
      '[vitepress-openapi] tags/Pets.md',
      '[vitepress-openapi] reference.md',
      '[vitepress-openapi] llms-full.txt',
    ])
  })
})

describe('utf8Length', () => {
  it('counts UTF-8 bytes', () => {
    for (const text of ['abc', 'García', '–', '😀', 'a😀b']) {
      expect(utf8Length(text)).toBe(new TextEncoder().encode(text).length)
    }
  })
})

describe('normalizeRoute', () => {
  it('strips slashes and page extensions', () => {
    expect(normalizeRoute('/api/getPet.html')).toBe('api/getPet')
    expect(normalizeRoute('api/getPet.md/')).toBe('api/getPet')
  })
})

describe('resolveLlmsRequest', () => {
  const files = [
    { path: 'api/getPet.md', content: '# Get a pet\n' },
    { path: 'api/getPet.txt', content: 'text\n' },
    { path: 'llms.txt', content: '# Pets API\n' },
  ]

  it('serves markdown and text files under the base', () => {
    expect(resolveLlmsRequest('/docs/api/getPet.md?x=1', '/docs/', files))
      .toEqual({ body: '# Get a pet\n', contentType: 'text/markdown; charset=utf-8' })
    expect(resolveLlmsRequest('/docs/api/getPet.txt', '/docs', files)?.contentType).toBe('text/plain; charset=utf-8')
    expect(resolveLlmsRequest('/llms.txt', '/', files)?.body).toBe('# Pets API\n')
  })

  it('ignores other URLs', () => {
    expect(resolveLlmsRequest('/api/getPet.md', '/docs/', files)).toBeUndefined()
    expect(resolveLlmsRequest('/api/other.md', '/', files)).toBeUndefined()
    expect(resolveLlmsRequest('/%E0%A4%A.md', '/', files)).toBeUndefined()
    expect(resolveLlmsRequest(undefined, '/', files)).toBeUndefined()
  })
})
