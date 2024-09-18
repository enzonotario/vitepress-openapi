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
})
