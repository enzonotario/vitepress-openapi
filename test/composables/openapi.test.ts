import { describe, expect, it } from 'vitest'
import { createOpenApiInstance } from '../../src/lib/createOpenApiInstance'
import { useOpenapi } from '../../src/composables/useOpenapi'
import { spec, specWithSchemaAndContentTypes } from '../testsConstants'
import { OpenApi } from '../../src'

describe('openapi with spec', () => {
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

  it('returns the correct tags for getTags', () => {
    const result = openapi.getOperationsTags()
    expect(result).toEqual(['users', 'pets'])
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

  it('sets defaultTag for operations without tags', () => {
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

    expect(api.getPathsWithoutTags()).toMatchObject({})

    expect(api.getOperationsTags()).toEqual(['users', 'Default'])
  })

  it('getPathsWithoutTags returns empty array if no paths without tags', () => {
    const api = createOpenApiInstance({ spec: { openapi: '3.0.0', paths: {} } })
    const paths = api.getPathsWithoutTags()
    expect(paths).toMatchObject({})
  })

  it('getTags returns tags object', () => {
    const api = createOpenApiInstance({ spec })
    const tags = api.getTags()
    expect(tags).toEqual([
      {
        name: 'users',
        description: 'Operations about users',
      },
      {
        name: 'pets',
        description: 'Operations about pets',
      },
      {
        name: 'Default',
        description: '',
      },
    ])
  })

  it('getTags returns empty array if no tags in spec', () => {
    const api = createOpenApiInstance({ spec: { openapi: '3.0.0', paths: {} } })
    const tags = api.getTags()
    expect(tags).toEqual([])
  })

  it('returns the correct operation servers for getOperationServers', () => {
    const result = openapi.getOperationServers('getUsers')
    expect(result).toEqual([
      ...spec.paths['/users'].get.servers,
      ...spec.servers,
    ])
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
      '/use-path-server': {
        get: {
          operationId: 'usePathServer',
        },
        servers: [
          {
            url: 'https://api.path.com',
          },
        ],
      },
      '/use-local-server': {
        get: {
          operationId: 'useLocalServer',
          servers: [
            {
              url: 'https://api.local.com',
            },
          ],
        },
      },
    },
  }

  const openapi = createOpenApiInstance({ spec })

  it('returns correct servers for getOperationServers', () => {
    const useGlobalServer = openapi.getOperationServers('useGlobalServer')
    expect(useGlobalServer).toEqual([
      {
        url: 'https://api.example.com',
      },
    ])

    const usePathServer = openapi.getOperationServers('usePathServer')
    expect(usePathServer).toEqual([
      {
        url: 'https://api.path.com',
      },
      {
        url: 'https://api.example.com',
      },
    ])

    const useLocalServer = openapi.getOperationServers('useLocalServer')
    expect(useLocalServer).toEqual([
      {
        url: 'https://api.local.com',
      },
      {
        url: 'https://api.example.com',
      },
    ])
  })
})

describe('custom specs', () => {
  it('supports custom default tag name and description', () => {
    const customTag = 'Custom'
    const customDescription = 'Custom default description'
    const openapi = useOpenapi({
      spec: {
        openapi: '3.0.0',
        paths: {
          '/no-tags': {
            get: {
              operationId: 'getNoTags',
            },
          },
        },
      },
      config: {
        spec: {
          defaultTag: customTag,
          defaultTagDescription: customDescription,
        },
      },
    })

    expect(openapi.getOperationsTags()).toEqual([customTag])

    const tags = openapi.getTags()

    expect(tags).toEqual([
      {
        name: customTag,
        description: customDescription,
      },
    ])
  })
})

describe('schemaParser', () => {
  const openapi = useOpenapi({
    spec: specWithSchemaAndContentTypes,
  })

  it('parses schema with content types', () => {
    const getPetsOperation = openapi.getOperation('getPets')

    const schemaUi = getPetsOperation.responses['400'].content['application/json'].ui

    expect(schemaUi).toMatchSnapshot()
  })
})

describe('operationParsed -> securityUi', () => {
  const openapi = useOpenapi({
    spec: {
      openapi: '3.0.0',
      paths: {
        '/onlyApiKey': {
          get: {
            operationId: 'onlyApiKey',
            security: [
              {
                apiKey: [],
              },
            ],
          },
        },
        '/onlyBearerAuth': {
          get: {
            operationId: 'onlyBearerAuth',
            security: [
              {
                bearerAuth: [],
              },
            ],
          },
        },
        '/apiKeyAndBearerAuth': {
          get: {
            operationId: 'apiKeyAndBearerAuth',
            security: [
              {
                apiKey: [],
                bearerAuth: [],
              },
            ],
          },
        },
        '/apiKeyOrBearerAuth': {
          get: {
            operationId: 'apiKeyOrBearerAuth',
            security: [
              {
                apiKey: [],
              },
              {
                bearerAuth: [],
              },
            ],
          },
        },
        '/noSecurity': {
          get: {
            operationId: 'noSecurity',
            security: [],
          },
        },
      },
      components: {
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
    },
  })

  it('returns correct securityUi for operations', () => {
    const onlyApiKey = openapi.getOperation('onlyApiKey').securityUi
    expect(onlyApiKey).toEqual([
      {
        id: 'apiKey',
        schemes: {
          apiKey: {
            type: 'apiKey',
            name: 'api_key',
            in: 'header',
          },
        },
      },
    ])

    const onlyBearerAuth = openapi.getOperation('onlyBearerAuth').securityUi
    expect(onlyBearerAuth).toEqual([
      {
        id: 'bearerAuth',
        schemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
          },
        },
      },
    ])

    const apiKeyAndBearerAuth = openapi.getOperation('apiKeyAndBearerAuth').securityUi
    expect(apiKeyAndBearerAuth).toEqual([
      {
        id: 'apiKey|bearerAuth',
        schemes: {
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
    ])

    const apiKeyOrBearerAuth = openapi.getOperation('apiKeyOrBearerAuth').securityUi
    expect(apiKeyOrBearerAuth).toEqual([
      {
        id: 'apiKey',
        schemes: {
          apiKey: {
            type: 'apiKey',
            name: 'api_key',
            in: 'header',
          },
        },
      },
      {
        id: 'bearerAuth',
        schemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
          },
        },
      },
    ])
  })
})
