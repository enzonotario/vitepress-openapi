import { describe, expect, it } from 'vitest'
import { OpenApi } from 'vitepress-theme-openapi'
import { spec } from '../testsConstants'
import { useSidebar } from './src/composables/useSidebar'

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

  const openapi = OpenApi({ spec })

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
