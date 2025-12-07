import { describe, expect, it } from 'vitest'
import {
  useOpenapi,
} from '../../src/composables/useOpenapi'
import { spec, specWithSchemaAndContentTypes } from '../testsConstants'

describe('useOpenapi', () => {
  it('returns an instance with all required methods', () => {
    const openapi = useOpenapi({ spec })

    expect(openapi.getSpec).toBeDefined()
    expect(openapi.getOperation).toBeDefined()
    expect(openapi.getOperationPath).toBeDefined()
    expect(openapi.getOperationMethod).toBeDefined()
    expect(openapi.getOperationParameters).toBeDefined()
    expect(openapi.getPaths).toBeDefined()
    expect(openapi.getPathsByVerbs).toBeDefined()
    expect(openapi.getInfo).toBeDefined()
    expect(openapi.getExternalDocs).toBeDefined()
    expect(openapi.getServers).toBeDefined()
    expect(openapi.getOperationServers).toBeDefined()
    expect(openapi.getOperationsTags).toBeDefined()
    expect(openapi.getPathsByTags).toBeDefined()
    expect(openapi.getPathsWithoutTags).toBeDefined()
    expect(openapi.getTags).toBeDefined()
    expect(openapi.getFilteredTags).toBeDefined()
    expect(openapi.async).toBeDefined()
  })

  it('creates an instance with spec', () => {
    const openapi = useOpenapi({ spec })
    expect(openapi.getSpec()).toBeDefined()
    expect(openapi.getInfo().title).toBe('Test API')
  })

  it('getOperationsTags returns all unique tags', () => {
    const api = useOpenapi({
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
    const api = useOpenapi({ spec: { openapi: '3.0.0' } })
    const tags = api.getOperationsTags()
    expect(tags).toEqual([])
  })

  it('getPathsByTags returns paths with specified tags', () => {
    const api = useOpenapi({
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
    const api = useOpenapi({ spec })
    const paths = api.getPathsByTags('nonexistent')
    expect(paths).toMatchObject({})
  })

  it('sets defaultTag for operations without tags', () => {
    const api = useOpenapi({
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
    const api = useOpenapi({ spec: { openapi: '3.0.0', paths: {} } })
    const paths = api.getPathsWithoutTags()
    expect(paths).toMatchObject({})
  })

  it('getTags returns tags object', () => {
    const api = useOpenapi({ spec })
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
    const api = useOpenapi({ spec: { openapi: '3.0.0', paths: {} } })
    const tags = api.getTags()
    expect(tags).toEqual([])
  })

  it('getFilteredTags handles tags not defined in spec.tags', () => {
    const customSpec = {
      openapi: '3.0.0',
      paths: {
        '/test': {
          get: {
            operationId: 'test',
            tags: ['customTag'],
          },
        },
      },
    }
    const api = useOpenapi({ spec: customSpec })
    const filteredTags = api.getFilteredTags()

    expect(filteredTags).toEqual([
      {
        name: 'customTag',
        description: null,
      },
    ])
  })
})

describe('useOpenapi with custom config', () => {
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

describe('useOpenapi.async', async () => {
  const openapi = await useOpenapi().async({
    spec: specWithSchemaAndContentTypes,
  })

  it('parses schema with content types', () => {
    const getPetsOperation = openapi.getOperation('getPets')
    const schemaUi = getPetsOperation.responses['400'].content['application/json'].ui
    expect(schemaUi).toBeDefined()
  })
})

describe('useOpenapi.async -> securityUi', async () => {
  const openapi = await useOpenapi().async({
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
