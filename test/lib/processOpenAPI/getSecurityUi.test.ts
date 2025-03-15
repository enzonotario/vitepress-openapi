import type { OpenAPIV3 } from '@scalar/openapi-types'
import { describe, expect, it } from 'vitest'
import { getSecurityUi } from '../../../src/lib/processOpenAPI/getSecurityUi'

describe('getSecurityUi', () => {
  it('returns an empty array when security is undefined', () => {
    const result = getSecurityUi(undefined, {})
    expect(result).toEqual([])
  })

  it('returns an empty array when security is an empty array', () => {
    const result = getSecurityUi([], {})
    expect(result).toEqual([])
  })

  it('returns a SecurityUi with one item when security has one scheme', () => {
    const security: OpenAPIV3.SecuritySchemeObject[] = [{ apiKey: [] }]
    const securitySchemes: Record<string, OpenAPIV3.SecuritySchemeObject> = {
      apiKey: { type: 'apiKey', name: 'apiKey', in: 'header' },
    }
    const result = getSecurityUi(security, securitySchemes)
    expect(result).toEqual([
      {
        id: 'apiKey',
        schemes: {
          apiKey: { type: 'apiKey', name: 'apiKey', in: 'header' },
        },
      },
    ])
  })

  it('returns a SecurityUi with multiple items when security has multiple schemes', () => {
    const security: OpenAPIV3.SecuritySchemeObject[] = [{ apiKey: [], oauth2: [] }]
    const securitySchemes: Record<string, OpenAPIV3.SecuritySchemeObject> = {
      apiKey: { type: 'apiKey', name: 'apiKey', in: 'header' },
      oauth2: { type: 'oauth2', flows: {} },
    }
    const result = getSecurityUi(security, securitySchemes)
    expect(result).toEqual([
      {
        id: 'apiKey|oauth2',
        schemes: {
          apiKey: { type: 'apiKey', name: 'apiKey', in: 'header' },
          oauth2: { type: 'oauth2', flows: {} },
        },
      },
    ])
  })

  it('ignores security schemes not present in securitySchemes', () => {
    const security: OpenAPIV3.SecuritySchemeObject[] = [{ apiKey: [], unknownScheme: [] }]
    const securitySchemes: Record<string, OpenAPIV3.SecuritySchemeObject> = {
      apiKey: { type: 'apiKey', name: 'apiKey', in: 'header' },
    }
    const result = getSecurityUi(security, securitySchemes)
    expect(result).toEqual([
      {
        id: 'apiKey|unknownScheme',
        schemes: {
          apiKey: { type: 'apiKey', name: 'apiKey', in: 'header' },
        },
      },
    ])
  })

  it('handles OR security requirements correctly', () => {
    const security: OpenAPIV3.SecuritySchemeObject[] = [
      { apiKey: [] },
      { oauth2: ['read'] },
    ]
    const securitySchemes: Record<string, OpenAPIV3.SecuritySchemeObject> = {
      apiKey: { type: 'apiKey', name: 'apiKey', in: 'header' },
      oauth2: { type: 'oauth2', flows: {} },
    }
    const result = getSecurityUi(security, securitySchemes)
    expect(result).toHaveLength(2)
    expect(result[0].id).toBe('apiKey')
    expect(result[1].id).toBe('oauth2')
  })

  it('correctly handles ApiKey authentication with custom header name', () => {
    const security: OpenAPIV3.SecurityRequirementObject[] = [{ ApiKeyAuth: [] }]
    const securitySchemes: Record<string, OpenAPIV3.SecuritySchemeObject> = {
      ApiKeyAuth: { type: 'apiKey', in: 'header', name: 'X-Api-Key' },
    }
    const result = getSecurityUi(security, securitySchemes)
    expect(result).toEqual([
      {
        id: 'ApiKeyAuth',
        schemes: {
          ApiKeyAuth: { type: 'apiKey', in: 'header', name: 'X-Api-Key' },
        },
      },
    ])
  })
})
