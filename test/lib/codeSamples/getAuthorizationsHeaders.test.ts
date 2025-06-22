import { describe, expect, it, vi } from 'vitest'
import { getAuthorizationsHeaders } from '../../../src/lib/codeSamples/buildRequest'

describe('getAuthorizationsHeaders', () => {
  it('returns empty headers for null authorizations', () => {
    const headers = getAuthorizationsHeaders(null as any)
    expect(Object.fromEntries(headers.entries())).toEqual({})
  })

  it('returns empty headers for empty array authorizations', () => {
    const headers = getAuthorizationsHeaders([])
    expect(Object.fromEntries(headers.entries())).toEqual({})
  })

  it('skips authorization with empty value', () => {
    const headers = getAuthorizationsHeaders({ type: 'http', scheme: 'bearer', value: '' })
    expect(Object.fromEntries(headers.entries())).toEqual({})
  })

  it('skips authorization with no type', () => {
    const headers = getAuthorizationsHeaders({ value: 'token' } as any)
    expect(Object.fromEntries(headers.entries())).toEqual({})
  })

  it('handles http basic authorization', () => {
    const headers = getAuthorizationsHeaders({ type: 'http', scheme: 'basic', value: 'Basic username:password' })
    expect(Object.fromEntries(headers.entries())).toEqual({
      authorization: 'Basic username:password',
    })
  })

  it('handles http bearer authorization', () => {
    const headers = getAuthorizationsHeaders({ type: 'http', scheme: 'bearer', value: 'Bearer token123' })
    expect(Object.fromEntries(headers.entries())).toEqual({
      authorization: 'Bearer token123',
    })
  })

  it('handles http digest authorization', () => {
    const headers = getAuthorizationsHeaders({ type: 'http', scheme: 'digest', value: 'Digest digest-value' })
    expect(Object.fromEntries(headers.entries())).toEqual({
      authorization: 'Digest digest-value',
    })
  })

  it('handles custom http scheme authorization', () => {
    const headers = getAuthorizationsHeaders({ type: 'http', scheme: 'custom', value: 'custom-token' })
    expect(Object.fromEntries(headers.entries())).toEqual({
      authorization: 'custom-token',
    })
  })

  it('defaults to Bearer for http authorization with no scheme', () => {
    const headers = getAuthorizationsHeaders({ type: 'http', value: 'Bearer token123' })
    expect(Object.fromEntries(headers.entries())).toEqual({
      authorization: 'Bearer token123',
    })
  })

  it('handles apiKey authorization in header', () => {
    const headers = getAuthorizationsHeaders({ type: 'apiKey', in: 'header', name: 'x-api-key', value: 'key123' })
    const entries = Object.fromEntries(headers.entries())
    expect(entries['x-api-key']).toBe('key123')
  })

  it('ignores apiKey authorization not in header', () => {
    const headers = getAuthorizationsHeaders({ type: 'apiKey', in: 'query', name: 'api_key', value: 'key123' })
    expect(Object.fromEntries(headers.entries())).toEqual({})
  })

  it('handles oauth2 authorization', () => {
    const headers = getAuthorizationsHeaders({ type: 'oauth2', value: 'oauth-token' })
    expect(Object.fromEntries(headers.entries())).toEqual({
      authorization: 'Bearer oauth-token',
    })
  })

  it('handles openIdConnect authorization', () => {
    const headers = getAuthorizationsHeaders({ type: 'openIdConnect', value: 'openid-token' })
    expect(Object.fromEntries(headers.entries())).toEqual({
      authorization: 'Bearer openid-token',
    })
  })

  it('handles multiple authorization schemes', () => {
    const headers = getAuthorizationsHeaders([
      { type: 'http', scheme: 'basic', value: 'Basic username:password' },
      { type: 'apiKey', in: 'header', name: 'x-api-key', value: 'key123' },
    ])
    const entries = Object.fromEntries(headers.entries())
    expect(entries.authorization).toBe('Basic username:password')
    expect(entries['x-api-key']).toBe('key123')
  })

  it('uses name as fallback value if value is not provided', () => {
    const headers = getAuthorizationsHeaders({ type: 'apiKey', in: 'header', name: 'x-api-key' })
    const entries = Object.fromEntries(headers.entries())
    expect(entries['x-api-key']).toBe('x-api-key')
  })

  it('warns about unknown authorization type', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    getAuthorizationsHeaders({ type: 'unknown' as any, value: 'value' })
    expect(consoleSpy).toHaveBeenCalledWith('Unknown authorization type:', 'unknown')
    consoleSpy.mockRestore()
  })

  it('warns about empty value for authorization scheme', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    getAuthorizationsHeaders({ type: 'http', scheme: 'bearer', value: '' })
    expect(consoleSpy).toHaveBeenCalledWith('Empty value for authorization scheme:', 'http')
    consoleSpy.mockRestore()
  })
})
