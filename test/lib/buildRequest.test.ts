import { describe, expect, it } from 'vitest'
import { buildRequest } from '../../src/lib/codeSamples/buildRequest'

describe('buildRequest', () => {
  it('builds request with path, query, and header parameters', () => {
    const request = buildRequest({
      path: '/users/{userId}',
      method: 'GET',
      baseUrl: 'https://api.example.com',
      parameters: [
        { name: 'userId', in: 'path' },
        { name: 'search', in: 'query' },
        { name: 'Authorization', in: 'header' },
      ],
      authorizations: null,
      body: null,
      variables: {
        userId: '123',
        search: 'test',
        Authorization: 'Bearer token',
      },
    })
    expect(request.url).toBe('https://api.example.com/users/123')
    expect(request.query.search).toBe('test')
    expect(request.headers.authorization).toBe('Bearer token')
  })

  it('builds request with auth scheme', () => {
    const request = buildRequest({
      path: '/users',
      method: 'GET',
      baseUrl: 'https://api.example.com',
      parameters: [],
      authorizations: { type: 'http', scheme: 'bearer', playgroundValue: 'token' },
      body: null,
      variables: {},
    })
    expect(request.headers.authorization).toBe('Bearer token')
  })

  it('builds request with body', () => {
    const request = buildRequest({
      path: '/users',
      method: 'POST',
      baseUrl: 'https://api.example.com',
      parameters: [],
      authorizations: null,
      body: { name: 'John Doe' },
      variables: {},
    })
    expect(request.body).toEqual({ name: 'John Doe' })
  })

  it('handles empty variables', () => {
    const request = buildRequest({
      path: '/users',
      method: 'GET',
      baseUrl: 'https://api.example.com',
      parameters: [],
      authorizations: null,
      body: null,
      variables: {},
    })
    expect(request.url).toBe('https://api.example.com/users')
  })

  it('handles undefined variables', () => {
    const request = buildRequest({
      path: '/users/{userId}',
      method: 'GET',
      baseUrl: 'https://api.example.com',
      parameters: [{ name: 'userId', in: 'path' }],
      authorizations: null,
      body: null,
      variables: { userId: undefined },
    })
    expect(request.url).toBe('https://api.example.com/users/{userId}')
  })

  it('handles missing path parameters in variables', () => {
    const request = buildRequest({
      path: '/users/{userId}',
      method: 'GET',
      baseUrl: 'https://api.example.com',
      parameters: [{ name: 'userId', in: 'path' }],
      authorizations: null,
      body: null,
      variables: {},
    })
    expect(request.url).toBe('https://api.example.com/users/{userId}')
  })

  it('builds request with path, query, headers with examples', () => {
    const request = buildRequest({
      path: '/users/{userId}',
      method: 'GET',
      baseUrl: 'https://api.example.com',
      parameters: [
        { name: 'userId', in: 'path', example: '123' },
        { name: 'search', in: 'query', example: 'test' },
        { name: 'Authorization', in: 'header', example: 'Bearer YOUR_TOKEN' },
      ],
      authorizations: null,
      body: null,
      variables: {},
    })
    expect(request.url).toBe('https://api.example.com/users/123')
    expect(request.query.search).toBe('test')
    expect(request.headers.authorization).toBe('Bearer YOUR_TOKEN')
  })

  it('builds request with basic auth scheme', () => {
    const request = buildRequest({
      path: '/users',
      method: 'GET',
      baseUrl: 'https://api.example.com',
      parameters: [],
      authorizations: { type: 'http', scheme: 'basic', playgroundValue: 'username:password' },
      body: null,
      variables: {},
    })
    expect(request.headers.authorization).toBe('Basic username:password')
  })

  it('builds request with apiKey auth scheme', () => {
    const request = buildRequest({
      path: '/users',
      method: 'GET',
      baseUrl: 'https://api.example.com',
      parameters: [],
      authorizations: { type: 'apiKey', name: 'x-api-key', in: 'header', playgroundValue: 'key123' },
      body: null,
      variables: {},
    })
    expect(request.headers['x-api-key']).toBe('key123')
  })

  it('builds request with basic and apiKey auth schemes', () => {
    const request = buildRequest({
      path: '/users',
      method: 'GET',
      baseUrl: 'https://api.example.com',
      parameters: [],
      authorizations: [
        { type: 'http', scheme: 'basic', playgroundValue: 'username:password' },
        { type: 'apiKey', name: 'x-api-key', in: 'header', playgroundValue: 'key123' },
      ],
      body: null,
      variables: {},
    })
    expect(request.headers.authorization).toBe('Basic username:password')
    expect(request.headers['x-api-key']).toBe('key123')
  })

  it('variables take precedence over examples', () => {
    const request = buildRequest({
      path: '/users/{userId}',
      method: 'GET',
      baseUrl: 'https://api.example.com',
      parameters: [
        { name: 'userId', in: 'path', example: '123' },
        { name: 'search', in: 'query', example: 'test' },
      ],
      authorizations: null,
      body: null,
      variables: {
        userId: '456',
        search: 'production',
      },
    })
    expect(request.url).toBe('https://api.example.com/users/456')
    expect(request.query.search).toBe('production')
  })

  it('handles URL-unsafe characters in parameters', () => {
    const request = buildRequest({
      path: '/users/{userId}',
      method: 'GET',
      baseUrl: 'https://api.example.com',
      parameters: [
        { name: 'userId', in: 'path' },
        { name: 'q', in: 'query' },
      ],
      authorizations: null,
      body: null,
      variables: {
        userId: 'user/123',
        q: 'test&special=true',
      },
    })
    expect(request.url).toBe('https://api.example.com/users/user/123')
    expect(request.query.q).toBe('test&special=true')
  })

  it('handles duplicate query parameters', () => {
    const request = buildRequest({
      path: '/users',
      method: 'GET',
      baseUrl: 'https://api.example.com',
      parameters: [
        { name: 'tag', in: 'query' },
      ],
      authorizations: null,
      body: null,
      variables: {
        tag: ['urgent', 'important'],
      },
    })
    expect(request.query.tag).toEqual(['urgent', 'important'])
  })
})
