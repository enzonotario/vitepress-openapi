import { describe, expect, it } from 'vitest'
import { operationToMarkdown, rewriteOperationLinks } from '../../../src/lib/markdown/operationToMarkdown'
import { parseOpenapi } from '../../../src/lib/parser/parseOpenapi'
import { createOpenApiSpec } from '../../../src/lib/spec/createOpenApiSpec'

function createSpec(spec: any) {
  return createOpenApiSpec({ spec: parseOpenapi().parseSync({ spec: structuredClone(spec) }) })
}

const petSpec = {
  openapi: '3.1.0',
  info: { title: 'Pets', version: '1.0.0' },
  servers: [{ url: 'https://api.example.com/v1', description: 'Production' }],
  security: [{ bearerAuth: [] }],
  paths: {
    '/pets/{petId}': {
      put: {
        operationId: 'updatePet',
        summary: 'Update a pet',
        description: 'Updates a pet.\n\nUse with care.',
        tags: ['Pets'],
        parameters: [
          { name: 'petId', in: 'path', required: true, description: 'Pet id', schema: { type: 'string', format: 'uuid' } },
          { name: 'filter', in: 'query', description: 'Use a | b\nor c', schema: { type: 'string', enum: ['a', 'b'], default: 'a' } },
          { name: 'X-Trace', in: 'header', schema: { type: 'string' }, example: 'abc' },
        ],
        requestBody: {
          required: true,
          description: 'Pet to update',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Pet' },
            },
          },
        },
        responses: {
          200: {
            description: 'Updated pet',
            headers: {
              'X-Rate-Limit': { description: 'Requests left', schema: { type: 'integer' } },
            },
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Pet' },
                examples: {
                  rex: { summary: 'A dog', value: { name: 'Rex' } },
                },
              },
            },
          },
          404: { description: 'Not found' },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      apiKey: { type: 'apiKey', in: 'header', name: 'X-API-Key' },
    },
    schemas: {
      Pet: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', description: 'Pet name', example: 'Fido', minLength: 1 },
          status: { type: 'string', enum: ['available', 'sold'] },
          owner: {
            type: 'object',
            properties: {
              email: { type: 'string', format: 'email' },
            },
          },
          tags: { type: 'array', items: { type: 'string' } },
        },
      },
    },
  },
}

describe('operationToMarkdown', () => {
  it('renders title, endpoint, description and servers', async () => {
    const markdown = await operationToMarkdown(createSpec(petSpec), 'updatePet', { codeSamples: false })

    expect(markdown.startsWith('# Update a pet\n\n`PUT /pets/{petId}`')).toBe(true)
    expect(markdown).toContain('Updates a pet.\n\nUse with care.')
    expect(markdown).toContain('## Servers\n\n- `https://api.example.com/v1`: Production')
  })

  it('renders parameters as escaped tables grouped by location', async () => {
    const markdown = await operationToMarkdown(createSpec(petSpec), 'updatePet', { codeSamples: false })

    expect(markdown).toContain('### Path parameters\n\n| Name | Type | Required | Description |\n| --- | --- | --- | --- |')
    expect(markdown).toContain('| `petId` | `string<uuid>` | Yes | Pet id |')
    expect(markdown).toContain('| `filter` | `string` | No | Use a \\| b<br>or c<br><br>Possible values: `a`, `b`. Default: `a`. |')
    expect(markdown).toContain('### Header parameters')
    expect(markdown).toContain('| `X-Trace` | `string` | No | Example: `abc`. |')
    expect(markdown).not.toContain('### Cookie parameters')
  })

  it('renders the request body schema and an example', async () => {
    const markdown = await operationToMarkdown(createSpec(petSpec), 'updatePet', { codeSamples: false })

    expect(markdown).toContain('## Request body\n\nRequired. Pet to update\n\nContent type: `application/json`')
    expect(markdown).toContain('Type: `object`.')
    expect(markdown).toContain('- `name` (`string`, required): Pet name. Constraints: minLength: 1. Example: `Fido`.')
    expect(markdown).toContain('- `status` (`string`): Possible values: `available`, `sold`.')
    expect(markdown).toContain('- `owner` (`object`)\n  - `email` (`string<email>`)')
    expect(markdown).toContain('- `tags` (`array<string>`)')
    expect(markdown).toContain('Example:\n\n```json\n{\n  "name": "Fido",')
  })

  it('renders responses with headers and named examples', async () => {
    const markdown = await operationToMarkdown(createSpec(petSpec), 'updatePet', { codeSamples: false })

    expect(markdown).toContain('### 200\n\nUpdated pet\n\nHeaders:\n\n| Name | Type | Description |')
    expect(markdown).toContain('| `X-Rate-Limit` | `integer` | Requests left |')
    expect(markdown).toContain('Example (A dog):\n\n```json\n{\n  "name": "Rex"\n}\n```')
    expect(markdown).toContain('### 404\n\nNot found')
  })

  it('renders resolved security schemes', async () => {
    const markdown = await operationToMarkdown(createSpec(petSpec), 'updatePet', { codeSamples: false })

    expect(markdown).toContain('## Authorization\n\n- `bearerAuth`: HTTP bearer (JWT). Send `Authorization: Bearer <token>`.')
  })

  it('renders alternative security options', async () => {
    const spec = structuredClone(petSpec) as any
    spec.paths['/pets/{petId}'].put.security = [{ apiKey: [] }, {}]
    const markdown = await operationToMarkdown(createSpec(spec), 'updatePet', { codeSamples: false })

    expect(markdown).toContain('Use one of the following options:\n\n- Option 1:\n  - `apiKey`: API key in header `X-API-Key`.\n- Option 2: no authentication')
  })

  it('renders schemes required together', async () => {
    const spec = structuredClone(petSpec) as any
    spec.paths['/pets/{petId}'].put.security = [{ apiKey: [], bearerAuth: [] }]
    const markdown = await operationToMarkdown(createSpec(spec), 'updatePet', { codeSamples: false })

    expect(markdown).toContain('## Authorization\n\nAll of the following are required:\n\n- `apiKey`: API key in header `X-API-Key`.\n- `bearerAuth`:')
  })

  it('renders a curl code sample by default', async () => {
    const markdown = await operationToMarkdown(createSpec(petSpec), 'updatePet')

    expect(markdown).toContain('## Code samples\n\n**cURL**\n\n```bash\ncurl')
    expect(markdown).toContain('https://api.example.com/v1/pets/')
    expect(markdown).toContain('Authorization: Bearer <token>')
  })

  it('renders the requested code sample languages', async () => {
    const markdown = await operationToMarkdown(createSpec(petSpec), 'updatePet', {
      codeSamples: ['python'],
      baseUrl: 'https://sandbox.example.com',
    })

    expect(markdown).toContain('**Python**\n\n```python')
    expect(markdown).toContain('https://sandbox.example.com/pets/')
    expect(markdown).not.toContain('**cURL**')
  })

  it('supports heading level offset and openapi url', async () => {
    const markdown = await operationToMarkdown(createSpec(petSpec), 'updatePet', {
      codeSamples: false,
      headingLevel: 2,
      openapiUrl: 'https://example.com/openapi.json',
    })

    expect(markdown.startsWith('## Update a pet')).toBe(true)
    expect(markdown).toContain('### Parameters')
    expect(markdown).toContain('#### Path parameters')
    expect(markdown).toContain('### OpenAPI\n\nMachine-readable specification: [https://example.com/openapi.json](https://example.com/openapi.json)')
  })

  it('renders deprecated operations and falls back to METHOD path as title', async () => {
    const spec = {
      openapi: '3.0.0',
      info: { title: 'Test', version: '1.0.0' },
      paths: {
        '/legacy': {
          get: { operationId: 'legacy', deprecated: true, responses: { 204: { description: 'No content' } } },
        },
      },
    }
    const markdown = await operationToMarkdown(createOpenApiSpec({ spec }), 'legacy', { codeSamples: false })

    expect(markdown).toContain('# GET /legacy')
    expect(markdown).toContain('> **Deprecated:**')
  })

  it('handles circular schemas', async () => {
    const spec = {
      openapi: '3.0.0',
      info: { title: 'Tree', version: '1.0.0' },
      paths: {
        '/nodes': {
          post: {
            operationId: 'createNode',
            requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Node' } } } },
            responses: { 201: { description: 'Created' } },
          },
        },
      },
      components: {
        schemas: {
          Node: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              children: { type: 'array', items: { $ref: '#/components/schemas/Node' } },
              parent: { $ref: '#/components/schemas/Node' },
            },
          },
        },
      },
    }
    const markdown = await operationToMarkdown(createSpec(spec), 'createNode', { codeSamples: false })

    expect(markdown).toContain('- `name` (`string`)')
    expect(markdown).toContain('Circular reference')
    expect(markdown.length).toBeLessThan(5000)
  })

  it('limits schema depth', async () => {
    const spec = {
      openapi: '3.0.0',
      info: { title: 'Deep', version: '1.0.0' },
      paths: {
        '/deep': {
          post: {
            operationId: 'deep',
            requestBody: {
              content: {
                'application/json': {
                  schema: { type: 'object', properties: { a: { type: 'object', properties: { b: { type: 'object', properties: { c: { type: 'string' } } } } } } },
                },
              },
            },
            responses: { 200: { description: 'OK' } },
          },
        },
      },
    }
    const markdown = await operationToMarkdown(createSpec(spec), 'deep', { codeSamples: false, schemaDepth: 2 })

    expect(markdown).toContain('- `a` (`object`)\n  - `b` (`object`)\n    - …')
    expect(markdown).not.toContain('`c`')
  })

  it('renders oneOf schemas as options', async () => {
    const spec = {
      openapi: '3.1.0',
      info: { title: 'Union', version: '1.0.0' },
      paths: {
        '/shapes': {
          post: {
            operationId: 'createShape',
            requestBody: {
              content: {
                'application/json': {
                  schema: {
                    oneOf: [
                      { title: 'Circle', type: 'object', properties: { radius: { type: 'number' } } },
                      { title: 'Square', type: 'object', properties: { side: { type: 'number' } } },
                    ],
                  },
                },
              },
            },
            responses: { 200: { description: 'OK' } },
          },
        },
      },
    }
    const markdown = await operationToMarkdown(createSpec(spec), 'createShape', { codeSamples: false })

    expect(markdown).toContain('Type: `object`. One of:')
    expect(markdown).toContain('- Option 1 (Circle) (`object`)\n  - `radius` (`number`)')
    expect(markdown).toContain('- Option 2 (Square) (`object`)\n  - `side` (`number`)')
  })

  it('returns an empty string for unknown operations', async () => {
    const openapi = createSpec(petSpec)
    expect(await operationToMarkdown(openapi, '')).toBe('')
    expect(await operationToMarkdown(openapi, 'missing')).toBe('')
  })

  it('merges path item parameters, operation parameters win', async () => {
    const spec = {
      openapi: '3.0.0',
      info: { title: 'Params', version: '1.0.0' },
      servers: [{ url: 'https://api.example.com' }],
      paths: {
        '/items/{id}': {
          parameters: [
            { name: 'id', in: 'path', required: true, description: 'Path item id', schema: { type: 'string' }, example: 'abc' },
            { name: 'verbose', in: 'query', description: 'Path item verbose', schema: { type: 'boolean' } },
          ],
          get: {
            operationId: 'getItem',
            parameters: [
              { name: 'verbose', in: 'query', description: 'Operation verbose', schema: { type: 'boolean' } },
              { name: 'verbose', in: 'header', description: 'Header verbose', schema: { type: 'string' } },
            ],
            responses: { 200: { description: 'OK' } },
          },
        },
      },
    }
    const markdown = await operationToMarkdown(createSpec(spec), 'getItem')

    expect(markdown).toContain('| `id` | `string` | Yes | Path item id. Example: `abc`. |')
    expect(markdown).toContain('| `verbose` | `boolean` | No | Operation verbose |')
    expect(markdown).not.toContain('Path item verbose')
    expect(markdown).toContain('| `verbose` | `string` | No | Header verbose |')
    expect(markdown).toContain('https://api.example.com/items/abc')
  })

  it('keeps examples of same-named parameters in different locations apart in code samples', async () => {
    const spec = {
      openapi: '3.0.0',
      info: { title: 'Ids', version: '1.0.0' },
      servers: [{ url: 'https://api.example.com' }],
      paths: {
        '/items/{id}': {
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, example: 'abc' }],
          get: {
            operationId: 'getItemById',
            parameters: [{ name: 'id', in: 'header', schema: { type: 'string' }, example: 'trace123' }],
            responses: { 200: { description: 'OK' } },
          },
        },
      },
    }
    const markdown = await operationToMarkdown(createSpec(spec), 'getItemById')

    expect(markdown).toContain('https://api.example.com/items/abc')
    expect(markdown).toContain(`--header 'Id: trace123'`)
    expect(markdown).not.toContain('Id: abc')
  })

  it('renders primitive array item constraints apart from array constraints', async () => {
    const spec = {
      openapi: '3.0.0',
      info: { title: 'Arrays', version: '1.0.0' },
      paths: {
        '/tags': {
          post: {
            operationId: 'setTags',
            requestBody: {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      tags: { type: 'array', minItems: 1, items: { type: 'string', minLength: 3, pattern: '^[a-z]+$' } },
                    },
                  },
                },
              },
            },
            responses: { 200: { description: 'OK' } },
          },
        },
      },
    }
    const markdown = await operationToMarkdown(createSpec(spec), 'setTags', { codeSamples: false })

    expect(markdown).toContain('- `tags` (`array<string>`): Constraints: minItems: 1. Items: minLength: 3, pattern: ^[a-z]+$.')
  })
})

describe('rewriteOperationLinks', () => {
  const openapi = createOpenApiSpec({
    spec: {
      openapi: '3.0.0',
      info: { title: 'Links', version: '1.0.0' },
      paths: { '/pets': { get: { operationId: 'listPets', summary: 'List pets', responses: {} } } },
    } as any,
  })
  const rewrite = (markdown: string) => rewriteOperationLinks(markdown, openapi, { href: id => `./${id}.md` })

  it('rewrites links outside code', () => {
    expect(rewrite('See [](/operations/listPets).')).toBe('See [List pets](./listPets.md).')
  })

  it('skips links in inline code spans', () => {
    expect(rewrite('Use `[](/operations/listPets)` or [](/operations/listPets).'))
      .toBe('Use `[](/operations/listPets)` or [List pets](./listPets.md).')
    expect(rewrite('``a ` [](/operations/listPets)`` [](/operations/listPets)'))
      .toBe('``a ` [](/operations/listPets)`` [List pets](./listPets.md)')
  })

  it('treats unmatched backticks as literal text', () => {
    expect(rewrite('a ` b [](/operations/listPets)')).toBe('a ` b [List pets](./listPets.md)')
  })

  it('only closes fences with the same character and enough length', () => {
    const markdown = [
      '````md',
      '```',
      '~~~~',
      '[](/operations/listPets)',
      '```` trailing',
      '[](/operations/listPets)',
      '`````  ',
      '[](/operations/listPets)',
    ].join('\n')

    expect(rewrite(markdown).split('\n')).toEqual([
      '````md',
      '```',
      '~~~~',
      '[](/operations/listPets)',
      '```` trailing',
      '[](/operations/listPets)',
      '`````  ',
      '[List pets](./listPets.md)',
    ])
  })

  it('does not treat a backtick line with backticks in the info string as a fence', () => {
    expect(rewrite('``` `x` ```\n[](/operations/listPets)')).toBe('``` `x` ```\n[List pets](./listPets.md)')
  })

  it('keeps malformed URI escapes untouched', () => {
    expect(rewrite('[](/operations/%E0%A4%A)')).toBe('[](/operations/%E0%A4%A)')
  })
})
