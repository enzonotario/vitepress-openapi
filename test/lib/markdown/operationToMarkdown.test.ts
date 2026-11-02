import { describe, expect, it } from 'vitest'
import { operationToMarkdown } from '../../../src/lib/markdown/operationToMarkdown'
import { createOpenApiSpec } from '../../../src/lib/spec/createOpenApiSpec'

const spec = {
  openapi: '3.0.0',
  info: { title: 'Test', version: '1.0.0' },
  servers: [{ url: 'https://example.com', description: 'Production' }],
  paths: {
    '/v1/items/{id}': {
      get: {
        operationId: 'get-item',
        summary: 'Get item',
        description: 'Returns a single item by id.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Item id',
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: { description: 'OK' },
          404: { description: 'Not found' },
        },
      },
    },
  },
}

describe('operationToMarkdown', () => {
  it('renders method, path, params, responses and openapi url', () => {
    const openapi = createOpenApiSpec({ spec })
    const markdown = operationToMarkdown(openapi, 'get-item', {
      openapiUrl: 'https://example.com/openapi.json',
    })

    expect(markdown).toContain('## GET /v1/items/{id}')
    expect(markdown).toContain('Get item')
    expect(markdown).toContain('Returns a single item by id.')
    expect(markdown).toContain('- https://example.com — Production')
    expect(markdown).toContain('- `id` (path, string, required) — Item id')
    expect(markdown).toContain('- `200` — OK')
    expect(markdown).toContain('- `404` — Not found')
    expect(markdown).toContain('https://example.com/openapi.json')
  })

  it('returns empty string for missing operationId', () => {
    const openapi = createOpenApiSpec({ spec })
    expect(operationToMarkdown(openapi, '')).toBe('')
  })
})
