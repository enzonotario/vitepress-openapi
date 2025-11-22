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
    expect(request.url.toString()).toBe('https://api.example.com/users/123')
    expect(request.query.search).toBe('test')
    expect(request.headers.authorization).toBe('Bearer token')
  })

  it('builds request with auth scheme', () => {
    const request = buildRequest({
      path: '/users',
      method: 'GET',
      baseUrl: 'https://api.example.com',
      parameters: [],
      authorizations: { type: 'http', scheme: 'bearer', value: 'Bearer token' },
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
    expect(request.url.toString()).toBe('https://api.example.com/users')
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
    expect(request.url.toString()).toBe('https://api.example.com/users/%7BuserId%7D')
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
    expect(request.url.toString()).toBe('https://api.example.com/users/%7BuserId%7D')
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
    expect(request.url.toString()).toBe('https://api.example.com/users/123')
    expect(request.query.search).toBe('test')
    expect(request.headers.authorization).toBe('Bearer YOUR_TOKEN')
  })

  it('builds request with basic auth scheme', () => {
    const request = buildRequest({
      path: '/users',
      method: 'GET',
      baseUrl: 'https://api.example.com',
      parameters: [],
      authorizations: { type: 'http', scheme: 'basic', value: 'Basic username:password' },
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
      authorizations: { type: 'apiKey', name: 'x-api-key', in: 'header', value: 'key123' },
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
        { type: 'http', scheme: 'basic', value: 'Basic username:password' },
        { type: 'apiKey', name: 'x-api-key', in: 'header', value: 'key123' },
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
    expect(request.url.toString()).toBe('https://api.example.com/users/456')
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
    expect(request.url.toString()).toBe('https://api.example.com/users/user/123')
    expect(request.query.q).toBe('test&special=true')
  })

  it('handles duplicate query parameters (explode: true by default)', () => {
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
    // Arrays should be returned as arrays for repeated parameters
    expect(request.query.tag).toEqual(['urgent', 'important'])
  })

  it('does not include body for GET requests', () => {
    const request = buildRequest({
      path: '/users',
      method: 'GET',
      baseUrl: 'https://api.example.com',
      parameters: [],
      authorizations: null,
      body: { name: 'John Doe' },
      variables: {},
    })
    expect(request.body).toBeUndefined()
  })
})

describe('cookies', () => {
  it('builds request with cookies', () => {
    const request = buildRequest({
      path: '/users',
      method: 'GET',
      baseUrl: 'https://api.example.com',
      parameters: [],
      cookies: { session: 'abc123' },
    })
    expect(request.cookies.session).toBe('abc123')
  })

  it('builds request with multiple cookies', () => {
    const request = buildRequest({
      path: '/users',
      method: 'GET',
      baseUrl: 'https://api.example.com',
      parameters: [],
      cookies: { session: 'abc123', user: 'john' },
    })
    expect(request.cookies.session).toBe('abc123')
    expect(request.cookies.user).toBe('john')
  })
})

describe('contentType', () => {
  it('uses specified contentType when provided', () => {
    const request = buildRequest({
      path: '/users',
      method: 'POST',
      baseUrl: 'https://api.example.com',
      body: { name: 'Charly Garcia' },
      contentType: 'application/x-www-form-urlencoded',
    })
    expect(request.contentType).toBe('application/x-www-form-urlencoded')
    expect(request.headers['content-type']).toBe('application/x-www-form-urlencoded')
  })

  it('falls back to content-type header when contentType is not provided', () => {
    const request = buildRequest({
      path: '/users',
      method: 'POST',
      baseUrl: 'https://api.example.com',
      body: { name: 'Charly Garcia' },
      headers: { 'content-type': 'application/xml' },
    })
    expect(request.contentType).toBe('application/xml')
    expect(request.headers['content-type']).toBe('application/xml')
  })

  it('falls back to application/json when neither contentType nor content-type header is provided', () => {
    const request = buildRequest({
      path: '/users',
      method: 'POST',
      baseUrl: 'https://api.example.com',
      body: { name: 'Charly Garcia' },
    })
    expect(request.contentType).toBe('application/json')
    expect(request.headers['content-type']).toBe('application/json')
  })

  it('processes body as JSON when content type is application/json', () => {
    const body = { name: 'Charly Garcia', age: 30 }
    const request = buildRequest({
      path: '/users',
      method: 'POST',
      baseUrl: 'https://api.example.com',
      body,
      contentType: 'application/json',
    })
    expect(request.body).toEqual(body)
    expect(typeof request.body).toBe('object')
  })

  it('processes body as URL-encoded when content type is application/x-www-form-urlencoded', () => {
    const body = { name: 'Charly Garcia', age: 30 }
    const request = buildRequest({
      path: '/users',
      method: 'POST',
      baseUrl: 'https://api.example.com',
      body,
      contentType: 'application/x-www-form-urlencoded',
    })
    expect(typeof request.body).toBe('object')
    expect(request.body).toEqual({
      name: 'Charly Garcia',
      age: 30,
    })
  })

  it('processes body as FormData when content type is multipart/form-data', () => {
    const body = new FormData()
    body.append('name', 'Charly Garcia')
    body.append('age', '30')
    const request = buildRequest({
      path: '/users',
      method: 'POST',
      baseUrl: 'https://api.example.com',
      body,
      contentType: 'multipart/form-data',
    })
    expect(request.body instanceof FormData).toBe(true)

    // Check that the FormData contains the expected values
    const formData = request.body as FormData
    expect(formData.get('name')).toBe('Charly Garcia')
    expect(formData.get('age')).toBe('30')
  })
})

describe('update request', () => {
  it('updates request with new headers', () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
      method: 'GET',
      headers: { Authorization: 'Bearer old-token' },
      parameters: [],
      variables: {},
    })

    const fixedRequest = buildRequest({
      ...request,
      headers: { Authorization: 'Bearer new-token' },
    })

    expect(fixedRequest.headers.authorization).toBe('Bearer new-token')
  })

  it('updates request with new body', () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { key: 'old-value' },
      parameters: [],
      variables: {},
    })

    const fixedRequest = buildRequest({
      ...request,
      body: { key: 'new-value' },
    })

    expect(fixedRequest.body).toEqual({ key: 'new-value' })
  })

  it('updates request with new path', () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/old-resource',
      method: 'GET',
      headers: {},
      parameters: [],
      variables: {},
    })

    const fixedRequest = buildRequest({
      ...request,
      path: '/new-resource',
    })

    expect(fixedRequest.path).toBe('/new-resource')
  })

  it('updates request with new query parameters', () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
      method: 'GET',
      parameters: [
        { name: 'search', in: 'query' },
      ],
      variables: {
        search: 'old-query',
      },
    })

    const fixedRequest = buildRequest({
      ...request,
      variables: {
        search: 'new-query',
      },
    })

    expect(fixedRequest.query.search).toBe('new-query')
  })

  it('adds new query parameters to request', () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
      method: 'GET',
      parameters: [],
      variables: {},
    })

    const fixedRequest = buildRequest({
      ...request,
      parameters: [
        { name: 'search', in: 'query' },
      ],
      variables: {
        search: 'new-query',
      },
    })

    expect(fixedRequest.query.search).toBe('new-query')
  })

  it('removes query parameters from request', () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
      method: 'GET',
      parameters: [
        { name: 'search', in: 'query' },
      ],
      variables: {
        search: 'old-query',
      },
    })

    const fixedRequest = buildRequest({
      ...request,
      parameters: [],
      variables: {},
    })

    expect(fixedRequest.query.search).toBeUndefined()
  })

  it('updates request with new cookies', () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
      method: 'GET',
      cookies: { session: 'old-session' },
    })

    const fixedRequest = buildRequest({
      ...request,
      cookies: { session: 'new-session', user: 'john' },
    })

    expect(fixedRequest.cookies.session).toBe('new-session')
    expect(fixedRequest.cookies.user).toBe('john')
  })
})

it('puts apiKey security scheme with in:"query" into query params', () => {
  const request = buildRequest({
    path: '/endpoint',
    method: 'GET',
    baseUrl: 'https://api.example.com',
    parameters: [],
    authorizations: {
      type: 'apiKey',
      name: 'api_key',
      in: 'query',
      value: 'example_key',
      label: 'APIKey',
    },
    body: null,
    variables: {},
  })

  expect(request.url.toString()).toBe('https://api.example.com/endpoint')
  expect(request.query.api_key).toBe('example_key')
  expect(request.headers.api_key).toBeUndefined()
})

it('keeps apiKey security scheme in header when in:"header"', () => {
  const request = buildRequest({
    path: '/endpoint',
    method: 'GET',
    baseUrl: 'https://api.example.com',
    parameters: [],
    authorizations: {
      type: 'apiKey',
      name: 'X-API-Key',
      in: 'header',
      value: 'k',
      label: 'APIKey',
    },
    body: null,
    variables: {},
  })

  expect(request.query['X-API-Key']).toBeUndefined()
  expect(request.headers['x-api-key']).toBe('k')
})

it('puts apiKey security scheme with in:"cookie" into cookies', () => {
  const request = buildRequest({
    path: '/endpoint',
    method: 'GET',
    baseUrl: 'https://api.example.com',
    parameters: [],
    authorizations: {
      type: 'apiKey',
      name: 'api_key',
      in: 'cookie',
      value: 'example_key',
      label: 'APIKey',
    } as any,
    body: null,
    variables: {},
  })

  expect(request.url.toString()).toBe('https://api.example.com/endpoint')
  expect(request.cookies.api_key).toBe('example_key')
  expect(request.headers.cookie).toBeUndefined()
  expect(request.query.api_key).toBeUndefined()
  expect(request.headers.api_key).toBeUndefined()
})

it('fills cookies from cookie parameters and variables', () => {
  const request = buildRequest({
    path: '/endpoint',
    method: 'GET',
    baseUrl: 'https://api.example.com',
    parameters: [
      { name: 'acceptsCookies', in: 'cookie' } as any,
    ],
    variables: {
      acceptsCookies: 'true',
    },
  })

  expect(request.cookies.acceptsCookies).toBe('true')
  expect(request.headers.cookie).toBeUndefined()
})

it('does not override existing Cookie header', () => {
  const request = buildRequest({
    path: '/endpoint',
    method: 'GET',
    baseUrl: 'https://api.example.com',
    parameters: [
      { name: 'token', in: 'cookie' } as any,
    ],
    variables: {
      token: 'abc',
    },
    headers: {
      cookie: 'session=xyz',
    },
  })

  expect(request.headers.cookie).toBe('session=xyz')
  // cookies object still includes param-derived value
  expect(request.cookies.token).toBe('abc')
})

it('auth query value overrides variable-derived query', () => {
  const request = buildRequest({
    path: '/endpoint',
    method: 'GET',
    baseUrl: 'https://api.example.com',
    parameters: [{ name: 'api_key', in: 'query', schema: { type: 'string' } } as any],
    variables: { api_key: 'from-vars' } as any,
    authorizations: { type: 'apiKey', name: 'api_key', in: 'query', value: 'from-auth', label: 'APIKey' } as any,
  })
  expect(request.query.api_key).toBe('from-auth')
})

describe('parameter serialization', () => {
  describe('deepObject style', () => {
    it('serializes object parameters with deepObject style', () => {
      const request = buildRequest({
        path: '/endpoint',
        method: 'GET',
        baseUrl: 'https://api.example.com',
        parameters: [
          { name: 'metadata', in: 'query', style: 'deepObject', explode: true, schema: { type: 'object' } } as any,
        ],
        variables: {
          metadata: { key1: 'value1', key2: 'value2' },
        },
      })

      expect(request.query['metadata[key1]']).toBe('value1')
      expect(request.query['metadata[key2]']).toBe('value2')
    })

    it('handles deepObject style with default explode (true)', () => {
      const request = buildRequest({
        path: '/endpoint',
        method: 'GET',
        baseUrl: 'https://api.example.com',
        parameters: [
          { name: 'filter', in: 'query', style: 'deepObject', schema: { type: 'object' } } as any,
        ],
        variables: {
          filter: { status: 'active', role: 'admin' },
        },
      })

      expect(request.query['filter[status]']).toBe('active')
      expect(request.query['filter[role]']).toBe('admin')
    })

    it('handles deepObject style with explode: false', () => {
      const request = buildRequest({
        path: '/endpoint',
        method: 'GET',
        baseUrl: 'https://api.example.com',
        parameters: [
          { name: 'filter', in: 'query', style: 'deepObject', explode: false, schema: { type: 'object' } } as any,
        ],
        variables: {
          filter: { status: 'active', role: 'admin' },
        },
      })

      expect(request.query.filter).toBe('status,active,role,admin')
    })
  })

  describe('form style with objects', () => {
    it('flattens object when explode is true', () => {
      const request = buildRequest({
        path: '/endpoint',
        method: 'GET',
        baseUrl: 'https://api.example.com',
        parameters: [
          { name: 'metadata', in: 'query', style: 'form', explode: true, schema: { type: 'object' } } as any,
        ],
        variables: {
          metadata: { key1: 'value1', key2: 'value2' },
        },
      })

      expect(request.query.key1).toBe('value1')
      expect(request.query.key2).toBe('value2')
    })

    it('serializes object as comma-separated when explode is false', () => {
      const request = buildRequest({
        path: '/endpoint',
        method: 'GET',
        baseUrl: 'https://api.example.com',
        parameters: [
          { name: 'metadata', in: 'query', style: 'form', explode: false, schema: { type: 'object' } } as any,
        ],
        variables: {
          metadata: { key1: 'value1', key2: 'value2' },
        },
      })

      expect(request.query.metadata).toBe('key1,value1,key2,value2')
    })
  })

  describe('array parameters', () => {
    it('serializes array with form style and explode true (repeated parameters)', () => {
      const request = buildRequest({
        path: '/endpoint',
        method: 'GET',
        baseUrl: 'https://api.example.com',
        parameters: [
          { name: 'tags', in: 'query', style: 'form', explode: true, schema: { type: 'array' } } as any,
        ],
        variables: {
          tags: ['tag1', 'tag2', 'tag3'],
        },
      })

      // Should return array for repeated parameters
      expect(request.query.tags).toEqual(['tag1', 'tag2', 'tag3'])
    })

    it('serializes array with form style and explode false (comma-separated)', () => {
      const request = buildRequest({
        path: '/endpoint',
        method: 'GET',
        baseUrl: 'https://api.example.com',
        parameters: [
          { name: 'tags', in: 'query', style: 'form', explode: false, schema: { type: 'array' } } as any,
        ],
        variables: {
          tags: ['tag1', 'tag2', 'tag3'],
        },
      })

      // Should return comma-separated string
      expect(request.query.tags).toBe('tag1,tag2,tag3')
    })

    it('serializes array with spaceDelimited style and explode: false', () => {
      const request = buildRequest({
        path: '/endpoint',
        method: 'GET',
        baseUrl: 'https://api.example.com',
        parameters: [
          { name: 'tags', in: 'query', style: 'spaceDelimited', explode: false, schema: { type: 'array' } } as any,
        ],
        variables: {
          tags: ['tag1', 'tag2', 'tag3'],
        },
      })

      expect(request.query.tags).toBe('tag1 tag2 tag3')
    })

    it('serializes array with spaceDelimited style and explode: true (repeated parameters)', () => {
      const request = buildRequest({
        path: '/endpoint',
        method: 'GET',
        baseUrl: 'https://api.example.com',
        parameters: [
          { name: 'tags', in: 'query', style: 'spaceDelimited', explode: true, schema: { type: 'array' } } as any,
        ],
        variables: {
          tags: ['tag1', 'tag2', 'tag3'],
        },
      })

      // Should return array for repeated parameters
      expect(request.query.tags).toEqual(['tag1', 'tag2', 'tag3'])
    })

    it('serializes array with pipeDelimited style and explode: false', () => {
      const request = buildRequest({
        path: '/endpoint',
        method: 'GET',
        baseUrl: 'https://api.example.com',
        parameters: [
          { name: 'tags', in: 'query', style: 'pipeDelimited', explode: false, schema: { type: 'array' } } as any,
        ],
        variables: {
          tags: ['tag1', 'tag2', 'tag3'],
        },
      })

      expect(request.query.tags).toBe('tag1|tag2|tag3')
    })

    it('serializes array with pipeDelimited style and explode: true (repeated parameters)', () => {
      const request = buildRequest({
        path: '/endpoint',
        method: 'GET',
        baseUrl: 'https://api.example.com',
        parameters: [
          { name: 'tags', in: 'query', style: 'pipeDelimited', explode: true, schema: { type: 'array' } } as any,
        ],
        variables: {
          tags: ['tag1', 'tag2', 'tag3'],
        },
      })

      // Should return array for repeated parameters
      expect(request.query.tags).toEqual(['tag1', 'tag2', 'tag3'])
    })
  })

  describe('default styles', () => {
    it('defaults to form style with explode true for query parameters', () => {
      const request = buildRequest({
        path: '/endpoint',
        method: 'GET',
        baseUrl: 'https://api.example.com',
        parameters: [
          { name: 'filter', in: 'query', schema: { type: 'object' } } as any,
        ],
        variables: {
          filter: { key1: 'value1' },
        },
      })

      // Default form + explode should flatten
      expect(request.query.key1).toBe('value1')
    })
  })

  describe('complex values serialization', () => {
    it('serializes arrays of objects in deepObject style', () => {
      const request = buildRequest({
        path: '/endpoint',
        method: 'GET',
        baseUrl: 'https://api.example.com',
        parameters: [
          { name: 'users', in: 'query', style: 'deepObject', explode: true, schema: { type: 'object' } } as any,
        ],
        variables: {
          users: { items: [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }] },
        },
      })

      // Should JSON stringify arrays instead of converting to "[object Object],[object Object]"
      expect(request.query['users[items]']).toBe('[{"id":1,"name":"John"},{"id":2,"name":"Jane"}]')
    })

    it('serializes nested objects in deepObject style', () => {
      const request = buildRequest({
        path: '/endpoint',
        method: 'GET',
        baseUrl: 'https://api.example.com',
        parameters: [
          { name: 'filter', in: 'query', style: 'deepObject', explode: true, schema: { type: 'object' } } as any,
        ],
        variables: {
          filter: { user: { name: 'John', age: 30 } },
        },
      })

      // Should recursively handle nested objects
      expect(request.query['filter[user][name]']).toBe('John')
      expect(request.query['filter[user][age]']).toBe('30')
    })

    it('serializes object values that are arrays of primitives in form style with explode true', () => {
      const request = buildRequest({
        path: '/endpoint',
        method: 'GET',
        baseUrl: 'https://api.example.com',
        parameters: [
          { name: 'data', in: 'query', style: 'form', explode: true, schema: { type: 'object' } } as any,
        ],
        variables: {
          data: { tags: ['tag1', 'tag2'], ids: [1, 2, 3] },
        },
      })

      // Arrays of primitives should use comma-separated
      expect(request.query.tags).toBe('tag1,tag2')
      expect(request.query.ids).toBe('1,2,3')
    })

    it('serializes object values that are arrays of objects in form style with explode true', () => {
      const request = buildRequest({
        path: '/endpoint',
        method: 'GET',
        baseUrl: 'https://api.example.com',
        parameters: [
          { name: 'data', in: 'query', style: 'form', explode: true, schema: { type: 'object' } } as any,
        ],
        variables: {
          data: { users: [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }] },
        },
      })

      // Arrays of objects should JSON stringify
      expect(request.query.users).toBe('[{"id":1,"name":"John"},{"id":2,"name":"Jane"}]')
    })

    it('serializes object values that are objects in form style with explode true', () => {
      const request = buildRequest({
        path: '/endpoint',
        method: 'GET',
        baseUrl: 'https://api.example.com',
        parameters: [
          { name: 'metadata', in: 'query', style: 'form', explode: true, schema: { type: 'object' } } as any,
        ],
        variables: {
          metadata: { user: { name: 'John', age: 30 } },
        },
      })

      // Should JSON stringify object values instead of "[object Object]"
      expect(request.query.user).toBe('{"name":"John","age":30}')
    })

    it('serializes arrays of objects in form style with explode: false', () => {
      const request = buildRequest({
        path: '/endpoint',
        method: 'GET',
        baseUrl: 'https://api.example.com',
        parameters: [
          { name: 'users', in: 'query', style: 'form', explode: false, schema: { type: 'array' } } as any,
        ],
        variables: {
          users: [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }],
        },
      })

      // Should JSON stringify object elements instead of "[object Object],[object Object]"
      expect(request.query.users).toBe('{"id":1,"name":"John"},{"id":2,"name":"Jane"}')
    })

    it('serializes arrays of objects in form style with explode: true', () => {
      const request = buildRequest({
        path: '/endpoint',
        method: 'GET',
        baseUrl: 'https://api.example.com',
        parameters: [
          { name: 'users', in: 'query', style: 'form', explode: true, schema: { type: 'array' } } as any,
        ],
        variables: {
          users: [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }],
        },
      })

      // Should return array of JSON stringified objects for repeated parameters
      expect(request.query.users).toEqual(['{"id":1,"name":"John"}', '{"id":2,"name":"Jane"}'])
    })

    it('serializes nested arrays in form style with explode: false', () => {
      const request = buildRequest({
        path: '/endpoint',
        method: 'GET',
        baseUrl: 'https://api.example.com',
        parameters: [
          { name: 'matrix', in: 'query', style: 'form', explode: false, schema: { type: 'array' } } as any,
        ],
        variables: {
          matrix: [[1, 2], [3, 4]],
        },
      })

      // Should JSON stringify nested array elements
      expect(request.query.matrix).toBe('[1,2],[3,4]')
    })

    it('serializes nested arrays in form style with explode: true', () => {
      const request = buildRequest({
        path: '/endpoint',
        method: 'GET',
        baseUrl: 'https://api.example.com',
        parameters: [
          { name: 'matrix', in: 'query', style: 'form', explode: true, schema: { type: 'array' } } as any,
        ],
        variables: {
          matrix: [[1, 2], [3, 4]],
        },
      })

      // Should return array of JSON stringified arrays for repeated parameters
      expect(request.query.matrix).toEqual(['[1,2]', '[3,4]'])
    })

    it('handles mixed primitive and object values in arrays with explode: false', () => {
      const request = buildRequest({
        path: '/endpoint',
        method: 'GET',
        baseUrl: 'https://api.example.com',
        parameters: [
          { name: 'mixed', in: 'query', style: 'form', explode: false, schema: { type: 'array' } } as any,
        ],
        variables: {
          mixed: ['string', 123, { key: 'value' }, [1, 2]],
        },
      })

      // Should properly handle mixed types
      expect(request.query.mixed).toBe('string,123,{"key":"value"},[1,2]')
    })

    it('handles mixed primitive and object values in arrays with explode: true', () => {
      const request = buildRequest({
        path: '/endpoint',
        method: 'GET',
        baseUrl: 'https://api.example.com',
        parameters: [
          { name: 'mixed', in: 'query', style: 'form', explode: true, schema: { type: 'array' } } as any,
        ],
        variables: {
          mixed: ['string', 123, { key: 'value' }, [1, 2]],
        },
      })

      // Should return array for repeated parameters
      expect(request.query.mixed).toEqual(['string', '123', '{"key":"value"}', '[1,2]'])
    })
  })
})
