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
      authScheme: null,
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
      authScheme: { type: 'http', scheme: 'bearer', value: 'token' },
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
      authScheme: null,
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
      authScheme: null,
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
      authScheme: null,
      body: null,
      variables: { userId: undefined },
    })
    expect(request.url).toBe('https://api.example.com/users/{userId}')
  })

  it('handles missing path parameters', () => {
    const request = buildRequest({
      path: '/users/{userId}',
      method: 'GET',
      baseUrl: 'https://api.example.com',
      parameters: [{ name: 'userId', in: 'path' }],
      authScheme: null,
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
      authScheme: null,
      body: null,
      variables: {},
    })
    expect(request.url).toBe('https://api.example.com/users/123')
    expect(request.query.search).toBe('test')
    expect(request.headers.authorization).toBe('Bearer YOUR_TOKEN')
  })
})
