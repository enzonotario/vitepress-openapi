import { describe, expect, it } from 'vitest'
import { createOpenApiInstance } from 'vitepress-openapi'
import { spec } from '../testsConstants'

describe('openapi with spec', () => {
  const openapi = createOpenApiInstance({ spec })

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
    const result = openapi.getOperationsTags()
    expect(result).toEqual(['users'])
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

  it('returns the correct info for getInfo', () => {
    const result = openapi.getInfo()
    expect(result).toEqual(spec.info)
  })

  it('returns the correct external docs for getExternalDocs', () => {
    const result = openapi.getExternalDocs()
    expect(result).toEqual(spec.externalDocs)
  })

  it('returns the correct servers for getServers', () => {
    const result = openapi.getServers()
    expect(result).toEqual(spec.servers)
  })

  it('getOperationsTags returns all unique tags', () => {
    const api = createOpenApiInstance({
      spec: {
        ...spec,
        paths: {
          '/users': {
            get: {
              operationId: 'getUsers',
              tags: ['users'],
            },
          },
          '/profile': {
            get: {
              operationId: 'getProfile',
              tags: ['profile'],
            },
          },
        },
      },
    })
    const tags = api.getOperationsTags()
    expect(tags).toEqual(['users', 'profile'])
  })

  it('getOperationsTags returns empty array if no paths', () => {
    const api = createOpenApiInstance({ spec: { openapi: '3.0.0' } })
    const tags = api.getOperationsTags()
    expect(tags).toEqual([])
  })

  it('getPathsByTags returns paths with specified tags', () => {
    const api = createOpenApiInstance({
      spec: {
        ...spec,
        paths: {
          '/users': {
            get: {
              operationId: 'getUsers',
              tags: ['users'],
            },
          },
          '/profile': {
            get: {
              operationId: 'getProfile',
              tags: ['profile'],
            },
          },
        },
      },
    })
    const paths = api.getPathsByTags('users')
    expect(paths).toMatchObject({
      '/users': {
        get: {
          operationId: 'getUsers',
          summary: 'GET /users',
          tags: ['users'],
        },
      },
    })
  })

  it('getPathsByTags returns empty object if no matching tags', () => {
    const api = createOpenApiInstance({ spec })
    const paths = api.getPathsByTags('nonexistent')
    expect(paths).toMatchObject({})
  })

  it('getPathsWithoutTags returns paths without tags', () => {
    const api = createOpenApiInstance({
      spec: {
        ...spec,
        paths: {
          '/users': {
            get: {
              operationId: 'getUsers',
              tags: ['users'],
            },
          },
          '/no-tags': {
            get: {
              operationId: 'getNoTags',
            },
          },
        },
      },
    })

    const paths = api.getPathsWithoutTags()

    expect(paths).toMatchObject({
      '/no-tags': {
        get: {
          operationId: 'getNoTags',
          summary: 'GET /no-tags',
        },
      },
    })
  })

  it('getPathsWithoutTags returns empty array if no paths without tags', () => {
    const api = createOpenApiInstance({ spec: { openapi: '3.0.0', paths: {} } })
    const paths = api.getPathsWithoutTags()
    expect(paths).toMatchObject({})
  })

  it('getTags returns tags object', () => {
    const api = createOpenApiInstance({ spec })
    const tags = api.getTags()
    expect(tags).toEqual([{
      name: 'users',
      description: 'Operations about users',
    }])
  })

  it('getTags returns empty array if no tags in spec', () => {
    const api = createOpenApiInstance({ spec: { openapi: '3.0.0', paths: {} } })
    const tags = api.getTags()
    expect(tags).toEqual([])
  })
})

describe('spec with different servers for specific path', () => {
  const spec = {
    openapi: '3.0.0',
    servers: [
      {
        url: 'https://api.example.com',
      },
    ],
    paths: {
      '/use-global-server': {
        get: {
          operationId: 'useGlobalServer',
        },
      },
      '/use-local-server': {
        get: {
          operationId: 'useLocalServer',
        },
        servers: [
          {
            url: 'https://api.local.com',
          },
        ],
      },
    },
  }

  const openapi = createOpenApiInstance({ spec })

  it('returns global server for getBaseUrl', () => {
    const result = openapi.getBaseUrl()
    expect(result).toBe('https://api.example.com')
  })

  it('returns global server for useGlobalServer', () => {
    const result = openapi.getBaseUrl('useGlobalServer')
    expect(result).toBe('https://api.example.com')
  })

  it('returns local server for useLocalServer', () => {
    const result = openapi.getBaseUrl('useLocalServer')
    expect(result).toBe('https://api.local.com')
  })
})
