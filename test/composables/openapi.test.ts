import { describe, expect, it } from 'vitest'
import { OpenApi } from 'vitepress-theme-openapi'
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
        security: [
          {
            apiKey: [],
          },
          {
            bearerAuth: [],
          }
        ],
      },
    },
    '/users/{id}': {
      get: {
        operationId: 'getUser',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'integer',
            },
          },
        ],
        security: [
          {
            bearerAuth: [],
          }
        ],
      },
    },
    '/users/{id}/pets': {
      get: {
        operationId: 'getUserPets',
        parameters: [
          {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
              type: 'integer',
              },
          },
        ],
      },
    }
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
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
      },
    },
  },
}

describe('OpenApi with spec', () => {
  const openapi = OpenApi({ spec })

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

  it('returns the correct security schemes for getSecuritySchemes', () => {
    const getUsersSecuritySchemes = openapi.getSecuritySchemes('getUsers')
    expect(getUsersSecuritySchemes).toEqual({
      apiKey: {
        type: 'apiKey',
        name: 'api_key',
        in: 'header',
      },
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
      },
    })

    const getUserSecuritySchemes = openapi.getSecuritySchemes('getUser')
    expect(getUserSecuritySchemes).toEqual({
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
      },
    })

    const getUserPetsSecuritySchemes = openapi.getSecuritySchemes('getUserPets')
    expect(getUserPetsSecuritySchemes).toEqual({})
  })
})
