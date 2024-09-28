import { describe, expect, it } from 'vitest'
import { usePlayground } from './src/composables/usePlayground'

describe('securityScheme default values', () => {
  const playground = usePlayground()

  it('returns "Basic Auth" for http-basic scheme', () => {
    const scheme = { type: 'http', scheme: 'basic' }
    expect(playground.getSecuritySchemeDefaultValue(scheme)).toBe('Basic Auth')
  })

  it('returns "Bearer Token" for http-bearer scheme', () => {
    const scheme = { type: 'http', scheme: 'bearer' }
    expect(playground.getSecuritySchemeDefaultValue(scheme)).toBe('Bearer Token')
  })

  it('returns "OpenID Connect" for openIdConnect scheme', () => {
    const scheme = { type: 'openIdConnect' }
    expect(playground.getSecuritySchemeDefaultValue(scheme)).toBe('OpenID Connect')
  })

  it('returns "OAuth2 Token" for oauth2 scheme', () => {
    const scheme = { type: 'oauth2' }
    expect(playground.getSecuritySchemeDefaultValue(scheme)).toBe('OAuth2 Token')
  })

  it('returns scheme name for apiKey scheme', () => {
    const scheme = { type: 'apiKey', name: 'Custom API Key' }
    expect(playground.getSecuritySchemeDefaultValue(scheme)).toBe('Custom API Key')
  })

  it('returns scheme name if type is not in securitySchemeDefaultValues', () => {
    const scheme = { type: 'customType', name: 'Custom Scheme' }
    expect(playground.getSecuritySchemeDefaultValue(scheme)).toBe('Custom Scheme')
  })

  it('returns empty string if type is not in securitySchemeDefaultValues and name is not provided', () => {
    const scheme = { type: 'unknownType' }
    expect(playground.getSecuritySchemeDefaultValue(scheme)).toBe('')
  })
})

describe('securityScheme default values with custom values', () => {
  const playground = usePlayground()

  it('returns custom value for http-basic scheme', () => {
    const scheme = { type: 'http', scheme: 'basic' }
    playground.setSecuritySchemeDefaultValues({ 'http-basic': 'Custom Basic Auth' })
    expect(playground.getSecuritySchemeDefaultValue(scheme)).toBe('Custom Basic Auth')
  })

  it('returns custom value for http-bearer scheme', () => {
    const scheme = { type: 'http', scheme: 'bearer' }
    playground.setSecuritySchemeDefaultValues({ 'http-bearer': 'Custom Bearer Token' })
    expect(playground.getSecuritySchemeDefaultValue(scheme)).toBe('Custom Bearer Token')
  })

  it('returns custom value for openIdConnect scheme', () => {
    const scheme = { type: 'openIdConnect' }
    playground.setSecuritySchemeDefaultValues({ openIdConnect: 'Custom OpenID Connect' })
    expect(playground.getSecuritySchemeDefaultValue(scheme)).toBe('Custom OpenID Connect')
  })

  it('returns custom value for oauth2 scheme', () => {
    const scheme = { type: 'oauth2' }
    playground.setSecuritySchemeDefaultValues({ oauth2: 'Custom OAuth2 Token' })
    expect(playground.getSecuritySchemeDefaultValue(scheme)).toBe('Custom OAuth2 Token')
  })

  it('returns custom value for apiKey scheme', () => {
    const scheme = { type: 'apiKey', name: 'Custom API Key' }
    playground.setSecuritySchemeDefaultValues({ apiKey: 'MyAPIKey' })
    expect(playground.getSecuritySchemeDefaultValue(scheme)).toBe('MyAPIKey')
  })

  it('returns custom value for unknown scheme type', () => {
    const scheme = { type: 'customType', name: 'Custom Scheme' }
    playground.setSecuritySchemeDefaultValues({ customType: 'Custom Scheme' })
    expect(playground.getSecuritySchemeDefaultValue(scheme)).toBe('Custom Scheme')
  })

  it('returns custom value for unknown scheme type without name', () => {
    const scheme = { type: 'unknownType' }
    playground.setSecuritySchemeDefaultValues({ unknownType: 'Custom Scheme' })
    expect(playground.getSecuritySchemeDefaultValue(scheme)).toBe('Custom Scheme')
  })

  it('does not overwrite existing custom values when called with an empty object', () => {
    const scheme = { type: 'http', scheme: 'basic' }
    playground.setSecuritySchemeDefaultValues({ 'http-basic': 'Custom Basic Auth' })
    playground.setSecuritySchemeDefaultValues({})
    expect(playground.getSecuritySchemeDefaultValue(scheme)).toBe('Custom Basic Auth')
  })
})
