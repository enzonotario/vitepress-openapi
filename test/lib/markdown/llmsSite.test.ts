import { describe, expect, it } from 'vitest'
import { generateLlmsSiteFiles, normalizeRoute, resolveLlmsRequest } from '../../../src/lib/markdown/llmsSite'

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
