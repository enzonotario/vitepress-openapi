import { describe, expect, it } from 'vitest'
import {
  extractAuthToken,
  findAuthOperations,
  getAuthorizationStorageKey,
  hasHttpOrOauth2Schemes,
  isAuthPlaygroundEnabled,
  isAuthValueEmpty,
  resolveAuthPlaygroundDescription,
  resolveAuthPlaygroundMode,
  resolveAuthPlaygroundScheme,
} from '../../../src/lib/playground/authPlayground'

describe('getAuthorizationStorageKey', () => {
  it('builds the storage key from prefix and scheme', () => {
    expect(getAuthorizationStorageKey('vp-openapi', 'bearerAuth')).toBe('vp-openapi-authorization-bearerAuth')
  })
})

describe('extractAuthToken', () => {
  it('extracts access_token from JSON body', () => {
    expect(extractAuthToken({ access_token: 'abc123', token_type: 'bearer' })).toBe('abc123')
  })

  it('falls back to token and accessToken fields', () => {
    expect(extractAuthToken({ token: 'tok' })).toBe('tok')
    expect(extractAuthToken({ accessToken: 'at' })).toBe('at')
  })

  it('uses custom field list', () => {
    expect(extractAuthToken({ jwt: 'custom' }, ['jwt'])).toBe('custom')
  })

  it('parses JSON strings', () => {
    expect(extractAuthToken('{"access_token":"from-json"}')).toBe('from-json')
  })

  it('returns null when missing', () => {
    expect(extractAuthToken({ foo: 'bar' })).toBeNull()
    expect(extractAuthToken(null)).toBeNull()
    expect(extractAuthToken([])).toBeNull()
  })
})

describe('findAuthOperations', () => {
  const spec = {
    openapi: '3.0.0',
    info: { title: 'Test', version: '1.0.0' },
    paths: {
      '/token': {
        post: {
          operationId: 'Token_Token',
          security: [],
          responses: { 200: { description: 'OK' } },
        },
      },
      '/login': {
        post: {
          operationId: 'doLogin',
          responses: { 200: { description: 'OK' } },
        },
      },
      '/users': {
        post: {
          operationId: 'createUser',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'OK' } },
        },
      },
      '/users/{id}': {
        get: {
          operationId: 'getUser',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'OK' } },
        },
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
        },
      },
    },
  } as const

  it('auto-detects POST auth/token/login operations without security', () => {
    expect(findAuthOperations(spec as any)).toEqual(['Token_Token', 'doLogin'])
  })

  it('respects explicit operationIds when present in the spec', () => {
    expect(findAuthOperations(spec as any, { operationIds: ['Token_Token', 'missing'] })).toEqual(['Token_Token'])
  })

  it('returns empty when no matches', () => {
    expect(findAuthOperations({ openapi: '3.0.0', info: { title: 'x', version: '1' }, paths: {} } as any)).toEqual([])
  })
})

describe('resolveAuthPlaygroundScheme', () => {
  const spec = {
    components: {
      securitySchemes: {
        apiKey: { type: 'apiKey', in: 'header', name: 'X-API-Key' },
        bearerAuth: { type: 'http', scheme: 'bearer' },
      },
    },
  } as any

  it('prefers explicit scheme config', () => {
    expect(resolveAuthPlaygroundScheme(spec, { scheme: 'apiKey' })).toBe('apiKey')
  })

  it('uses defaultScheme when provided', () => {
    expect(resolveAuthPlaygroundScheme(spec, {}, 'apiKey')).toBe('apiKey')
  })

  it('falls back to first http bearer scheme', () => {
    expect(resolveAuthPlaygroundScheme(spec)).toBe('bearerAuth')
  })
})

describe('isAuthPlaygroundEnabled', () => {
  const spec = {
    paths: {
      '/token': {
        post: {
          operationId: 'getToken',
          security: [],
          responses: { 200: { description: 'OK' } },
        },
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer' },
      },
    },
  } as any

  it('is disabled when enabled is false', () => {
    expect(isAuthPlaygroundEnabled(spec, { enabled: false })).toBe(false)
  })

  it('auto-enables when http/oauth2 schemes and auth ops exist', () => {
    expect(isAuthPlaygroundEnabled(spec)).toBe(true)
  })

  it('enables when operationIds are configured', () => {
    expect(isAuthPlaygroundEnabled(spec, { enabled: undefined, operationIds: ['getToken'] })).toBe(true)
  })
})

describe('hasHttpOrOauth2Schemes', () => {
  it('detects bearer http schemes', () => {
    expect(hasHttpOrOauth2Schemes({
      components: {
        securitySchemes: {
          bearerAuth: { type: 'http', scheme: 'bearer' },
        },
      },
    } as any)).toBe(true)
  })

  it('returns false without matching schemes', () => {
    expect(hasHttpOrOauth2Schemes({
      components: {
        securitySchemes: {
          apiKey: { type: 'apiKey', in: 'header', name: 'X-Key' },
        },
      },
    } as any)).toBe(false)
  })
})

describe('isAuthValueEmpty', () => {
  it('treats empty and default placeholder as empty', () => {
    expect(isAuthValueEmpty('')).toBe(true)
    expect(isAuthValueEmpty('   ')).toBe(true)
    expect(isAuthValueEmpty('Token', 'Token')).toBe(true)
    expect(isAuthValueEmpty('real-token', 'Token')).toBe(false)
  })
})

describe('resolveAuthPlaygroundMode', () => {
  it('defaults to tryIt', () => {
    expect(resolveAuthPlaygroundMode()).toBe('tryIt')
    expect(resolveAuthPlaygroundMode(null)).toBe('tryIt')
    expect(resolveAuthPlaygroundMode(undefined)).toBe('tryIt')
    expect(resolveAuthPlaygroundMode('tryIt')).toBe('tryIt')
  })

  it('accepts samples', () => {
    expect(resolveAuthPlaygroundMode('samples')).toBe('samples')
  })
})

describe('resolveAuthPlaygroundDescription', () => {
  it('prefers x-auth-playground-description over operation.description and theme', () => {
    expect(resolveAuthPlaygroundDescription({
      'x-auth-playground-description': 'From extension',
      description: 'From operation',
    }, 'From theme')).toBe('From extension')
  })

  it('falls back to operation.description', () => {
    expect(resolveAuthPlaygroundDescription({
      description: 'From operation',
    }, 'From theme')).toBe('From operation')
  })

  it('falls back to theme description', () => {
    expect(resolveAuthPlaygroundDescription({}, 'From theme')).toBe('From theme')
    expect(resolveAuthPlaygroundDescription(null, 'From theme')).toBe('From theme')
  })

  it('returns null when nothing is set (i18n fallback)', () => {
    expect(resolveAuthPlaygroundDescription(undefined, undefined)).toBeNull()
    expect(resolveAuthPlaygroundDescription({ description: '  ' }, '   ')).toBeNull()
  })
})
