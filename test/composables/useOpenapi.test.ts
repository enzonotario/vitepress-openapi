import { describe, expect, it } from 'vitest'
import { useOpenapi } from './src/composables/useOpenapi'
import { useSidebar } from './src/composables/useSidebar'

const spec = {
  openapi: '3.1.0',
  paths: {
    '/users': {
      get: {
        operationId: 'getUsers',
        parameters: [
          {
            name: 'limit',
            in: 'query',
            required: false,
            schema: {
              type: 'integer',
            },
          },
        ],
        'x-codeSamples': [
          {
            lang: 'JavaScript',
            source: 'fetch("/users")',
          },
        ],
      },
    },
  },
  servers: [
    {
      url: 'https://api.example.com',
    },
  ],
  components: {
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
          },
          name: {
            type: 'string',
          },
        },
      },
    },
    securitySchemes: {
      apiKey: {
        type: 'apiKey',
        name: 'api_key',
        in: 'header',
      },
    },
  },
}

describe('useOpenapi with spec', () => {
  const openapi = useOpenapi({ spec })

  it('returns the correct operation for getOperation', () => {
    const result = openapi.getOperation('getUsers')
    expect(result).toEqual(spec.paths['/users'].get)
  })

  it('returns the correct path for getOperationPath', () => {
    const result = openapi.getOperationPath('getUsers')
    expect(result).toBe('/users')
  })

  it('returns the correct parameters for getOperationParameters', () => {
    const result = openapi.getOperationParameters('getUsers')
    expect(result).toEqual(spec.paths['/users'].get.parameters)
  })

  it('returns the correct base URL for getBaseUrl', () => {
    const result = openapi.getBaseUrl()
    expect(result).toBe('https://api.example.com')
  })

  it('returns the correct tags for getTags', () => {
    const result = useSidebar().getTags()
    expect(result).toEqual([])
  })
})
