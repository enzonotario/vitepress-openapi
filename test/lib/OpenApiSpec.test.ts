import { describe, expect, it } from 'vitest'
import { createOpenApiSpec } from '../../src/lib/createOpenApiSpec'
import { spec } from '../testsConstants'

describe('createOpenApiSpec', () => {
  it('creates an instance with default empty spec', () => {
    const instance = createOpenApiSpec()
    expect(instance.getSpec()).toEqual({})
  })

  it('creates an instance with provided spec', () => {
    const instance = createOpenApiSpec({ spec })
    expect(instance.getSpec()).toEqual(spec)
  })

  it('stores and retrieves originalSpec correctly', () => {
    const originalSpec = { openapi: '3.0.0', info: { title: 'Original API', version: '1.0.0' } }
    const parsedSpec = { openapi: '3.0.0', info: { title: 'Parsed API', version: '1.0.0' } }

    const instance = createOpenApiSpec({
      spec: parsedSpec,
      originalSpec,
    })

    expect(instance.getSpec()).toEqual(parsedSpec)
    expect(instance.getOriginalSpec()).toEqual(originalSpec)
  })

  it('setSpec and getSpec work correctly', () => {
    const instance = createOpenApiSpec()

    expect(instance.getSpec()).toEqual({})

    instance.setSpec(spec)
    expect(instance.getSpec()).toEqual(spec)

    const newSpec = { openapi: '3.0.0', info: { title: 'Custom API', version: '2.0.0' } }
    instance.setSpec(newSpec)
    expect(instance.getSpec()).toEqual(newSpec)
  })

  it('setOriginalSpec updates the original spec', () => {
    const instance = createOpenApiSpec({ spec })

    expect(instance.getOriginalSpec()).toBeNull()

    const originalSpec = { openapi: '3.0.0', info: { title: 'Original', version: '1.0.0' } }
    instance.setOriginalSpec(originalSpec)
    expect(instance.getOriginalSpec()).toEqual(originalSpec)
  })

  it('returns the correct operation for getOperation', () => {
    const instance = createOpenApiSpec({ spec })
    const result = instance.getOperation('getUsers')
    expect(result).toEqual(spec.paths['/users'].get)
  })

  it('returns null for getOperation when operation not found', () => {
    const instance = createOpenApiSpec({ spec })
    const result = instance.getOperation('nonexistent')
    expect(result).toBeNull()
  })

  it('returns the correct path for getOperationPath', () => {
    const instance = createOpenApiSpec({ spec })
    const result = instance.getOperationPath('getUsers')
    expect(result).toBe('/users')
  })

  it('returns null for getOperationPath when operation not found', () => {
    const instance = createOpenApiSpec({ spec })
    const result = instance.getOperationPath('nonexistent')
    expect(result).toBeNull()
  })

  it('returns the correct method for getOperationMethod', () => {
    const instance = createOpenApiSpec({ spec })
    const result = instance.getOperationMethod('getUsers')
    expect(result).toBe('get')
  })

  it('returns null for getOperationMethod when operation not found', () => {
    const instance = createOpenApiSpec({ spec })
    const result = instance.getOperationMethod('nonexistent')
    expect(result).toBeNull()
  })

  it('returns the correct parameters for getOperationParameters', () => {
    const instance = createOpenApiSpec({ spec })
    const result = instance.getOperationParameters('getUsers')
    expect(result).toEqual(spec.paths['/users'].get.parameters)
  })

  it('returns empty array for getOperationParameters when operation not found', () => {
    const instance = createOpenApiSpec({ spec })
    const result = instance.getOperationParameters('nonexistent')
    expect(result).toEqual([])
  })

  it('returns the correct tags for getOperationsTags', () => {
    const instance = createOpenApiSpec({ spec })
    const result = instance.getOperationsTags()
    expect(result).toEqual(['users', 'pets'])
  })

  it('returns empty array for getOperationsTags when no paths', () => {
    const instance = createOpenApiSpec({ spec: { openapi: '3.0.0' } })
    const result = instance.getOperationsTags()
    expect(result).toEqual([])
  })

  it('returns the correct info for getInfo', () => {
    const instance = createOpenApiSpec({ spec })
    const result = instance.getInfo()
    expect(result).toEqual(spec.info)
  })

  it('returns the correct external docs for getExternalDocs', () => {
    const instance = createOpenApiSpec({ spec })
    const result = instance.getExternalDocs()
    expect(result).toEqual(spec.externalDocs)
  })

  it('returns the correct servers for getServers', () => {
    const instance = createOpenApiSpec({ spec })
    const result = instance.getServers()
    expect(result).toEqual(spec.servers)
  })

  it('returns empty array for getServers when servers not defined', () => {
    const instance = createOpenApiSpec({ spec: { openapi: '3.0.0' } })
    const result = instance.getServers()
    expect(result).toEqual([])
  })

  it('returns the correct operation servers for getOperationServers', () => {
    const instance = createOpenApiSpec({ spec })
    const result = instance.getOperationServers('getUsers')
    expect(result).toEqual(spec.paths['/users'].get.servers)
  })

  it('returns empty array for getOperationServers when operation not found', () => {
    const instance = createOpenApiSpec({ spec })
    const result = instance.getOperationServers('nonexistent')
    expect(result).toEqual([])
  })

  it('getPathsByTags returns paths with specified tags', () => {
    const instance = createOpenApiSpec({ spec })
    const paths = instance.getPathsByTags('users')
    expect(paths).toHaveProperty('/users')
    expect(paths).toHaveProperty('/users/{id}')
  })

  it('getPathsByTags returns empty object for non-matching tags', () => {
    const instance = createOpenApiSpec({ spec })
    const paths = instance.getPathsByTags('nonexistent')
    expect(paths).toEqual({})
  })

  it('getPathsWithoutTags returns empty when all operations have tags', () => {
    const instance = createOpenApiSpec({ spec })
    const paths = instance.getPathsWithoutTags()
    expect(paths).toEqual({})
  })

  it('getTags returns tags object', () => {
    const instance = createOpenApiSpec({ spec })
    const tags = instance.getTags()
    expect(tags).toEqual([
      {
        name: 'users',
        description: 'Operations about users',
      },
      {
        name: 'pets',
        description: 'Operations about pets',
      },
    ])
  })

  it('getTags returns empty array if no tags in spec', () => {
    const instance = createOpenApiSpec({ spec: { openapi: '3.0.0' } })
    const tags = instance.getTags()
    expect(tags).toEqual([])
  })

  it('getFilteredTags returns tags filtered by operations', () => {
    const instance = createOpenApiSpec({ spec })
    const filteredTags = instance.getFilteredTags()
    expect(filteredTags).toEqual([
      {
        name: 'users',
        description: 'Operations about users',
      },
      {
        name: 'pets',
        description: 'Operations about pets',
      },
    ])
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
    const instance = createOpenApiSpec({ spec: customSpec })
    const filteredTags = instance.getFilteredTags()
    expect(filteredTags).toEqual([
      {
        name: 'customTag',
        description: null,
      },
    ])
  })

  it('getPaths returns all paths', () => {
    const instance = createOpenApiSpec({ spec })
    const paths = instance.getPaths()
    expect(Object.keys(paths)).toEqual(['/users', '/users/{id}', '/users/{id}/pets'])
  })

  it('getPathsByVerbs returns operations with path and verb info', () => {
    const instance = createOpenApiSpec({ spec })
    const pathsByVerbs = instance.getPathsByVerbs()
    expect(pathsByVerbs).toContainEqual({
      path: '/users',
      verb: 'get',
      operationId: 'getUsers',
      summary: undefined,
      tags: ['users'],
    })
  })
})

describe('createOpenApiSpec with no spec', () => {
  const instance = createOpenApiSpec()

  it('returns null for getOperation when paths are not defined', () => {
    const result = instance.getOperation('someOperationId')
    expect(result).toBeNull()
  })

  it('returns null for getOperationPath when paths are not defined', () => {
    const result = instance.getOperationPath('someOperationId')
    expect(result).toBeNull()
  })

  it('returns empty array for getOperationParameters when operation is not found', () => {
    const result = instance.getOperationParameters('someOperationId')
    expect(result).toEqual([])
  })

  it('returns empty array for getOperationServers when servers are not defined', () => {
    const result = instance.getOperationServers('someOperationId')
    expect(result).toEqual([])
  })

  it('returns empty array for getServers when servers are not defined', () => {
    const result = instance.getServers()
    expect(result).toEqual([])
  })

  it('returns empty array for getTags when paths are not defined', () => {
    const result = instance.getTags()
    expect(result).toEqual([])
  })
})

describe('createOpenApiSpec with different servers for specific path', () => {
  const specWithServers = {
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

  const instance = createOpenApiSpec({ spec: specWithServers })

  it('returns global servers for operation without specific servers', () => {
    const useGlobalServer = instance.getOperationServers('useGlobalServer')
    expect(useGlobalServer).toEqual([
      {
        url: 'https://api.example.com',
      },
    ])
  })

  it('returns path servers for operation with path-level servers', () => {
    const usePathServer = instance.getOperationServers('usePathServer')
    expect(usePathServer).toEqual([
      {
        url: 'https://api.path.com',
      },
    ])
  })

  it('returns operation servers for operation with operation-level servers', () => {
    const useLocalServer = instance.getOperationServers('useLocalServer')
    expect(useLocalServer).toEqual([
      {
        url: 'https://api.local.com',
      },
    ])
  })
})

