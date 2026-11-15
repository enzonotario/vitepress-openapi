import { describe, expect, it } from 'vitest'
import { generateMarkdownFiles } from '../../../src/lib/markdown/generateMarkdown'

const spec = {
  openapi: '3.0.0',
  info: { title: 'Pet Store', version: '2.0.0', description: 'A **sample** pet store API.' },
  servers: [{ url: 'https://api.example.com', description: 'Production' }],
  tags: [{ name: 'Pet Owners', description: 'People with pets' }, { name: 'Pets' }],
  paths: {
    '/pets': {
      get: {
        operationId: 'listPets',
        summary: 'List pets',
        description: 'Returns all pets. See [](/operations/index).',
        tags: ['Pets'],
        responses: { 200: { description: 'OK' } },
      },
    },
    '/pets/{id}': {
      get: {
        operationId: 'pets/get one',
        summary: 'Get a pet',
        tags: ['Pets', 'Pet Owners'],
        responses: { 200: { description: 'OK' } },
      },
    },
    '/owners/{ownerId}/pets': {
      post: {
        summary: 'Add a pet to an owner',
        tags: ['Pet Owners'],
        responses: { 201: { description: 'Created' } },
      },
    },
    '/index': {
      get: {
        operationId: 'index',
        responses: { 200: { description: 'OK' } },
      },
    },
  },
}

function getFile(files: Array<{ path: string, content: string }>, path: string): string {
  const file = files.find(file => file.path === path)
  if (!file) {
    throw new Error(`Missing ${path} in ${files.map(file => file.path).join(', ')}`)
  }
  return file.content
}

describe('generateMarkdownFiles', () => {
  it('generates one sanitized file per operation, index and llms files', async () => {
    const files = await generateMarkdownFiles(spec, { codeSamples: false })

    expect(files.map(file => file.path)).toEqual([
      'listPets.md',
      'pets-get-one.md',
      'post-owners-ownerId-pets.md',
      'index-2.md',
      'index.md',
      'llms.txt',
      'llms-full.txt',
    ])
  })

  it('uses the library fallback for missing operationIds', async () => {
    const files = await generateMarkdownFiles(spec, { codeSamples: false })

    // `generateMissingOperationIds` yields `post-owners-{ownerId}-pets`.
    expect(getFile(files, 'post-owners-ownerId-pets.md')).toContain('# Add a pet to an owner')
  })

  it('adds VitePress frontmatter and escapes Vue interpolation', async () => {
    const files = await generateMarkdownFiles(spec, { codeSamples: false })
    const content = getFile(files, 'listPets.md')

    expect(content.startsWith('---\ntitle: "List pets"\ndescription: "Returns all pets. See GET /index."\noutline: [2,3]\n---\n\n::: v-pre\n\n# List pets')).toBe(true)
    expect(content.endsWith('\n:::\n')).toBe(true)
  })

  it('rewrites operation links to the generated files', async () => {
    const files = await generateMarkdownFiles(spec, { codeSamples: false })

    expect(getFile(files, 'listPets.md')).toContain('See [GET /index](./index-2.md).')
  })

  it('omits frontmatter when disabled', async () => {
    const files = await generateMarkdownFiles(spec, { codeSamples: false, frontmatter: false })
    const content = getFile(files, 'listPets.md')

    expect(content.startsWith('# List pets\n\n`GET /pets`')).toBe(true)
    expect(content).not.toContain('::: v-pre')
  })

  it('renders the index with API info and links grouped by tag', async () => {
    const files = await generateMarkdownFiles(spec, { codeSamples: false, frontmatter: false })
    const index = getFile(files, 'index.md')

    expect(index).toContain('# Pet Store\n\nVersion: `2.0.0`\n\nA **sample** pet store API.')
    expect(index).toContain('## Servers\n\n- `https://api.example.com`: Production')
    expect(index).toContain('## Pet Owners\n\nPeople with pets\n\n- [Get a pet](./pets-get-one.md) `GET /pets/{id}`\n- [Add a pet to an owner](./post-owners-ownerId-pets.md) `POST /owners/{ownerId}/pets`')
    expect(index).toContain('## Pets\n\n- [List pets](./listPets.md) `GET /pets`')
    expect(index).toContain('## Default\n\n- [GET /index](./index-2.md) `GET /index`')
  })

  it('renders llms.txt following llmstxt.org', async () => {
    const files = await generateMarkdownFiles(spec, {
      codeSamples: false,
      linkPrefix: 'https://example.com/api',
      openapiUrl: 'https://example.com/openapi.json',
    })
    const llms = getFile(files, 'llms.txt')

    expect(llms.startsWith('# Pet Store\n\n> A sample pet store API.\n\n- Version: 2.0.0\n- Base URL: https://api.example.com\n\n## Pet Owners\n\n')).toBe(true)
    expect(llms).toContain('- [Get a pet](https://example.com/api/pets-get-one.md): GET /pets/{id}')
    expect(llms).toContain('## Pets\n\n- [List pets](https://example.com/api/listPets.md): GET /pets - Returns all pets. See GET /index.\n')
    expect(llms).toContain('## Optional\n\n- [Full documentation](https://example.com/api/llms-full.txt): all operations in a single file\n- [OpenAPI specification](https://example.com/openapi.json): machine-readable source of truth')
  })

  it('renders llms-full.txt with all operations and no frontmatter', async () => {
    const files = await generateMarkdownFiles(spec, { codeSamples: false })
    const full = getFile(files, 'llms-full.txt')

    expect(full.startsWith('# Pet Store\n\n> A sample pet store API.\n\n---\n\n# List pets')).toBe(true)
    expect(full).toContain('---\n\n# Get a pet')
    expect(full).not.toContain('outline:')
    expect(full).not.toContain('::: v-pre')
  })

  it('skips llms files when disabled', async () => {
    const files = await generateMarkdownFiles(spec, { codeSamples: false, llms: false })

    expect(files.some(file => file.path.startsWith('llms'))).toBe(false)
  })

  it('groups operations by tag', async () => {
    const files = await generateMarkdownFiles(spec, { codeSamples: false, groupBy: 'tag', linkPrefix: '/api/' })

    expect(files.map(file => file.path)).toEqual(['pet-owners.md', 'pets.md', 'default.md', 'index.md', 'llms.txt', 'llms-full.txt'])

    const owners = getFile(files, 'pet-owners.md')
    expect(owners).toContain('title: "Pet Owners"')
    expect(owners).toContain('# Pet Owners\n\nPeople with pets\n\n## Get a pet\n\n`GET /pets/{id}`')
    expect(owners).toContain('## Add a pet to an owner')
    expect(getFile(files, 'pets.md')).toContain('See [GET /index](./default.md).')
    expect(getFile(files, 'llms.txt')).toContain('- [Get a pet](/api/pet-owners.md): GET /pets/{id}')
    expect(getFile(files, 'index.md')).toContain('- [Pets](./pets.md)\n  - List pets `GET /pets`')
  })

  it('accepts YAML strings and does not mutate the input spec', async () => {
    const input = structuredClone(spec)
    await generateMarkdownFiles(input, { codeSamples: false })
    expect(input).toEqual(spec)

    const files = await generateMarkdownFiles(`
openapi: 3.0.0
info:
  title: YAML API
  version: 1.0.0
paths:
  /ping:
    get:
      operationId: ping
      responses:
        '200':
          description: pong
`, { codeSamples: false, frontmatter: false })
    expect(getFile(files, 'ping.md')).toContain('# GET /ping')
  })

  it('rewrites operation links in tag and API descriptions', async () => {
    const files = await generateMarkdownFiles({
      openapi: '3.0.0',
      info: { title: 'Links', version: '1.0.0', description: 'Start with [](/operations/listPets).' },
      tags: [{ name: 'Pets', description: 'Log in first: [](/operations/listPets).' }],
      paths: { '/pets': { get: { operationId: 'listPets', summary: 'List pets', tags: ['Pets'], responses: {} } } },
    }, { codeSamples: false, groupBy: 'tag', frontmatter: false })

    expect(getFile(files, 'index.md')).toContain('Start with [List pets](./pets.md).')
    expect(getFile(files, 'index.md')).toContain('Log in first: [List pets](./pets.md).')
    expect(getFile(files, 'pets.md')).toContain('Log in first: [List pets](./pets.md).')
    expect(getFile(files, 'llms.txt')).toContain('> Start with List pets.')
  })

  it('throws on unsupported documents', async () => {
    await expect(generateMarkdownFiles({ swagger: '2.0' } as any)).rejects.toThrow('only OpenAPI 3.x')
  })
})
