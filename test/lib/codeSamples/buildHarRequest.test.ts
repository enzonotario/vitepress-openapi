import { describe, expect, it } from 'vitest'
import { buildHarRequest } from '../../../src/lib/codeSamples/buildHarRequest'
import { buildRequest } from '../../../src/lib/codeSamples/buildRequest'

describe('buildHarRequest', () => {
  it('generates HAR request for basic GET request', () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
      method: 'GET',
    })
    const result = buildHarRequest(request)

    expect(result).toEqual({
      method: 'GET',
      url: 'https://api.example.com/resource',
      httpVersion: 'HTTP/1.1',
      headers: [],
      queryString: [],
      cookies: [],
      headersSize: -1,
      bodySize: -1,
    })
  })

  it('generates HAR request with headers', () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
      method: 'GET',
      headers: { 'Authorization': 'Bearer token', 'Content-Type': 'application/json' },
    })
    const result = buildHarRequest(request)

    expect(result).toEqual({
      method: 'GET',
      url: 'https://api.example.com/resource',
      httpVersion: 'HTTP/1.1',
      headers: [
        { name: 'Authorization', value: 'Bearer token' },
        { name: 'Content-Type', value: 'application/json' },
      ],
      queryString: [],
      cookies: [],
      headersSize: -1,
      bodySize: -1,
    })
  })

  it('generates HAR request with query parameters', () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
      method: 'GET',
      parameters: [
        { name: 'search', in: 'query' },
        { name: 'page', in: 'query' },
      ],
      variables: {
        search: 'query',
        page: '2',
      },
    })
    const result = buildHarRequest(request)

    expect(result).toEqual({
      method: 'GET',
      url: 'https://api.example.com/resource',
      httpVersion: 'HTTP/1.1',
      headers: [],
      queryString: [
        { name: 'search', value: 'query' },
        { name: 'page', value: '2' },
      ],
      cookies: [],
      headersSize: -1,
      bodySize: -1,
    })
  })

  it('generates HAR request with cookies', () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
      method: 'GET',
      cookies: { session: 'abc123', user: 'john' },
    })

    const result = buildHarRequest(request)

    expect(result).toEqual({
      method: 'GET',
      url: 'https://api.example.com/resource',
      httpVersion: 'HTTP/1.1',
      headers: [],
      queryString: [],
      cookies: [
        { name: 'session', value: 'abc123' },
        { name: 'user', value: 'john' },
      ],
      headersSize: -1,
      bodySize: -1,
    })
  })

  it('generates HAR request with string body', () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
      method: 'POST',
      body: 'plain text body',
      headers: { 'Content-Type': 'text/plain' },
    })
    const result = buildHarRequest(request)

    expect(result).toEqual({
      method: 'POST',
      url: 'https://api.example.com/resource',
      httpVersion: 'HTTP/1.1',
      headers: [
        { name: 'Content-Type', value: 'text/plain' },
      ],
      queryString: [],
      cookies: [],
      headersSize: -1,
      bodySize: -1,
      postData: {
        mimeType: 'text/plain',
        text: 'plain text body',
      },
    })
  })

  it('generates HAR request with JSON object body', () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
      method: 'POST',
      body: { key: 'value', nested: { prop: 'nestedValue' } },
    })
    const result = buildHarRequest(request)

    expect(result).toEqual({
      method: 'POST',
      url: 'https://api.example.com/resource',
      httpVersion: 'HTTP/1.1',
      headers: [
        { name: 'Content-Type', value: 'application/json' },
      ],
      queryString: [],
      cookies: [],
      headersSize: -1,
      bodySize: -1,
      postData: {
        mimeType: 'application/json',
        text: JSON.stringify({ key: 'value', nested: { prop: 'nestedValue' } }),
      },
    })
  })

  it('generates HAR request with FormData body', () => {
    const formData = new FormData()
    formData.append('text', 'text value')
    formData.append('number', '123')

    const file = new File(['file content'], 'test.txt', { type: 'text/plain' })
    formData.append('file', file)

    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/upload',
      method: 'POST',
      body: formData,
      parameters: [
        { name: 'Content-Type', in: 'header' },
      ],
      variables: {
        'Content-Type': 'multipart/form-data',
      },
    })

    const result = buildHarRequest(request)

    expect(result).toEqual({
      method: 'POST',
      url: 'https://api.example.com/upload',
      httpVersion: 'HTTP/1.1',
      headers: [
        { name: 'Content-Type', value: 'multipart/form-data' },
      ],
      queryString: [],
      cookies: [],
      headersSize: -1,
      bodySize: -1,
      postData: {
        mimeType: 'multipart/form-data',
        params: [
          { name: 'text', value: 'text value' },
          { name: 'number', value: '123' },
          {
            name: 'file',
            value: 'BINARY',
            fileName: 'test.txt',
            contentType: 'text/plain',
          },
        ],
      },
    })
  })

  it('generates HAR request with multiple values for the same FormData key', () => {
    const formData = new FormData()
    formData.append('tags', 'tag1')
    formData.append('tags', 'tag2')
    formData.append('tags', 'tag3')
    formData.append('single', 'value')

    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/upload',
      method: 'POST',
      body: formData,
      parameters: [
        { name: 'Content-Type', in: 'header' },
      ],
      variables: {
        'Content-Type': 'multipart/form-data',
      },
    })

    const result = buildHarRequest(request)

    expect(result).toEqual({
      method: 'POST',
      url: 'https://api.example.com/upload',
      httpVersion: 'HTTP/1.1',
      headers: [
        { name: 'Content-Type', value: 'multipart/form-data' },
      ],
      queryString: [],
      cookies: [],
      headersSize: -1,
      bodySize: -1,
      postData: {
        mimeType: 'multipart/form-data',
        params: [
          { name: 'tags', value: 'tag1,tag2,tag3' },
          { name: 'single', value: 'value' },
        ],
      },
    })
  })

  it('generates HAR request with all parameters combined', () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
      method: 'PUT',
      headers: { 'Authorization': 'Bearer token', 'Content-Type': 'application/json' },
      parameters: [
        { name: 'search', in: 'query' },
        { name: 'page', in: 'query' },
      ],
      variables: {
        search: 'query',
        page: '2',
      },
      body: { key: 'value', nested: { prop: 'nestedValue' } },
      cookies: { session: 'abc123' },
    })

    const result = buildHarRequest(request)

    expect(result).toEqual({
      method: 'PUT',
      url: 'https://api.example.com/resource',
      httpVersion: 'HTTP/1.1',
      headers: [
        { name: 'Authorization', value: 'Bearer token' },
        { name: 'Content-Type', value: 'application/json' },
      ],
      queryString: [
        { name: 'search', value: 'query' },
        { name: 'page', value: '2' },
      ],
      cookies: [
        { name: 'session', value: 'abc123' },
      ],
      headersSize: -1,
      bodySize: -1,
      postData: {
        mimeType: 'application/json',
        text: JSON.stringify({ key: 'value', nested: { prop: 'nestedValue' } }),
      },
    })
  })

  it('decodes URL encoded strings', () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/users/{id}',
      method: 'GET',
    })

    const result = buildHarRequest(request)

    expect(result).toEqual({
      method: 'GET',
      url: 'https://api.example.com/users/{id}',
      httpVersion: 'HTTP/1.1',
      headers: [],
      queryString: [],
      cookies: [],
      headersSize: -1,
      bodySize: -1,
    })
  })

  it('decodes percent-encoded spaces and Unicode chars', () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/files/Space%20Name%20%C3%87har',
      method: 'GET',
    })
    const result = buildHarRequest(request)
    expect(result).toEqual({
      method: 'GET',
      url: 'https://api.example.com/files/Space Name Çhar',
      httpVersion: 'HTTP/1.1',
      headers: [],
      queryString: [],
      cookies: [],
      headersSize: -1,
      bodySize: -1,
    })
  })

  it('generates HAR request with application/x-www-form-urlencoded content type', () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/form',
      method: 'POST',
      body: {
        username: 'user123',
        password: 'securepassword',
        remember: true,
      },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    const result = buildHarRequest(request)

    expect(result).toEqual({
      method: 'POST',
      url: 'https://api.example.com/form',
      httpVersion: 'HTTP/1.1',
      headers: [
        { name: 'Content-Type', value: 'application/x-www-form-urlencoded' },
      ],
      queryString: [],
      cookies: [],
      headersSize: -1,
      bodySize: -1,
      postData: {
        mimeType: 'application/x-www-form-urlencoded',
        params: [
          { name: 'username', value: 'user123' },
          { name: 'password', value: 'securepassword' },
          { name: 'remember', value: 'true' },
        ],
      },
    })
  })

  it('generates HAR request with deepObject style query parameters', () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
      method: 'GET',
      parameters: [
        { name: 'metadata', in: 'query', style: 'deepObject', explode: true, schema: { type: 'object' } } as any,
      ],
      variables: {
        metadata: { key1: 'value1', key2: 'value2' },
      },
    })
    const result = buildHarRequest(request)

    expect(result).toEqual({
      method: 'GET',
      url: 'https://api.example.com/resource',
      httpVersion: 'HTTP/1.1',
      headers: [],
      queryString: [
        { name: 'metadata[key1]', value: 'value1' },
        { name: 'metadata[key2]', value: 'value2' },
      ],
      cookies: [],
      headersSize: -1,
      bodySize: -1,
    })
  })

  it('generates HAR request with deepObject style and multiple parameters', () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
      method: 'GET',
      parameters: [
        { name: 'metadata', in: 'query', style: 'deepObject', explode: true, schema: { type: 'object' } } as any,
        { name: 'filter', in: 'query', style: 'deepObject', schema: { type: 'object' } } as any,
        { name: 'search', in: 'query' },
      ],
      variables: {
        metadata: { key1: 'value1', key2: 'value2' },
        filter: { status: 'active', role: 'admin' },
        search: 'test',
      },
    })
    const result = buildHarRequest(request)

    expect(result.queryString).toEqual(
      expect.arrayContaining([
        { name: 'metadata[key1]', value: 'value1' },
        { name: 'metadata[key2]', value: 'value2' },
        { name: 'filter[status]', value: 'active' },
        { name: 'filter[role]', value: 'admin' },
        { name: 'search', value: 'test' },
      ]),
    )
    expect(result.queryString.length).toBe(5)
  })

  it('generates HAR request with deepObject style and nested object values', () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
      method: 'GET',
      parameters: [
        { name: 'user', in: 'query', style: 'deepObject', explode: true, schema: { type: 'object' } } as any,
      ],
      variables: {
        user: {
          name: 'John Doe',
          age: 30,
          metadata: { hobby: 'photography' },
        },
      },
    })
    const result = buildHarRequest(request)

    expect(result.queryString).toEqual(
      expect.arrayContaining([
        { name: 'user[name]', value: 'John Doe' },
        { name: 'user[age]', value: '30' },
        { name: 'user[metadata][hobby]', value: 'photography' },
      ]),
    )
    expect(result.queryString.length).toBe(3)
  })

  it('generates HAR request with deepObject style and simple object with mixed types', () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
      method: 'GET',
      parameters: [
        { name: 'simpleObject', in: 'query', style: 'deepObject', explode: true, schema: { type: 'object' } } as any,
      ],
      variables: {
        simpleObject: {
          name: 'John Doe',
          age: 30,
          active: true,
        },
      },
    })
    const result = buildHarRequest(request)

    expect(result.queryString).toEqual(
      expect.arrayContaining([
        { name: 'simpleObject[name]', value: 'John Doe' },
        { name: 'simpleObject[age]', value: '30' },
        { name: 'simpleObject[active]', value: 'true' },
      ]),
    )
    expect(result.queryString.length).toBe(3)
  })

  it('generates HAR request with deepObject style and nested object with multiple levels', () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
      method: 'GET',
      parameters: [
        { name: 'nestedObject', in: 'query', style: 'deepObject', explode: true, schema: { type: 'object' } } as any,
      ],
      variables: {
        nestedObject: {
          user: {
            name: 'John',
            email: 'john@example.com',
          },
          settings: {
            theme: 'dark',
            notifications: true,
          },
        },
      },
    })
    const result = buildHarRequest(request)

    expect(result.queryString).toEqual(
      expect.arrayContaining([
        { name: 'nestedObject[user][name]', value: 'John' },
        { name: 'nestedObject[user][email]', value: 'john@example.com' },
        { name: 'nestedObject[settings][theme]', value: 'dark' },
        { name: 'nestedObject[settings][notifications]', value: 'true' },
      ]),
    )
    expect(result.queryString.length).toBe(4)
  })

  it('generates HAR request with deepObject style and object containing arrays', () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
      method: 'GET',
      parameters: [
        { name: 'objectWithArrays', in: 'query', style: 'deepObject', explode: true, schema: { type: 'object' } } as any,
      ],
      variables: {
        objectWithArrays: {
          tags: ['important', 'urgent'],
          categories: ['work', 'personal'],
          ids: [1, 2, 3],
        },
      },
    })
    const result = buildHarRequest(request)

    expect(result.queryString).toEqual(
      expect.arrayContaining([
        { name: 'objectWithArrays[tags]', value: 'important,urgent' },
        { name: 'objectWithArrays[categories]', value: 'work,personal' },
        { name: 'objectWithArrays[ids]', value: '1,2,3' },
      ]),
    )
    expect(result.queryString.length).toBe(3)
  })

  it('generates HAR request with deepObject style and complex nested object with arrays', () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
      method: 'GET',
      parameters: [
        { name: 'complexNestedObject', in: 'query', style: 'deepObject', explode: true, schema: { type: 'object' } } as any,
      ],
      variables: {
        complexNestedObject: {
          metadata: {
            author: {
              name: 'Jane Doe',
              id: 123,
            },
            created: '2023-01-01',
            tags: ['draft', 'review'],
          },
          config: {
            enabled: true,
            priority: 5,
          },
        },
      },
    })
    const result = buildHarRequest(request)

    expect(result.queryString).toEqual(
      expect.arrayContaining([
        { name: 'complexNestedObject[metadata][author][name]', value: 'Jane Doe' },
        { name: 'complexNestedObject[metadata][author][id]', value: '123' },
        { name: 'complexNestedObject[metadata][created]', value: '2023-01-01' },
        { name: 'complexNestedObject[metadata][tags]', value: 'draft,review' },
        { name: 'complexNestedObject[config][enabled]', value: 'true' },
        { name: 'complexNestedObject[config][priority]', value: '5' },
      ]),
    )
    expect(result.queryString.length).toBe(6)
  })

  it('generates HAR request with deepObject style and explode false', () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
      method: 'GET',
      parameters: [
        { name: 'simpleObjectNoExplode', in: 'query', style: 'deepObject', explode: false, schema: { type: 'object' } } as any,
      ],
      variables: {
        simpleObjectNoExplode: {
          author: 'Jane Doe',
          category: 'report',
        },
      },
    })
    const result = buildHarRequest(request)

    expect(result.queryString).toEqual(
      expect.arrayContaining([
        { name: 'simpleObjectNoExplode', value: 'author,Jane Doe,category,report' },
      ]),
    )
    expect(result.queryString.length).toBe(1)
  })

  it('serializes object query parameter values to JSON strings', () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/users',
      method: 'GET',
      parameters: [
        { name: 'filter', in: 'query', example: { status: 'active', type: 'user' } },
        { name: 'sort', in: 'query', example: 'name' },
      ],
      authorizations: null,
      body: null,
      variables: {},
    })

    const result = buildHarRequest(request)

    expect(result).toEqual({
      method: 'GET',
      url: 'https://api.example.com/users',
      httpVersion: 'HTTP/1.1',
      headers: [],
      queryString: [
        { name: 'filter', value: '{"status":"active","type":"user"}' },
        { name: 'sort', value: 'name' },
      ],
      cookies: [],
      headersSize: -1,
      bodySize: -1,
    })
  })

  it('serializes array query parameter values to JSON strings', () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/users',
      method: 'GET',
      parameters: [
        { name: 'tags', in: 'query', example: ['admin', 'user'] },
        { name: 'ids', in: 'query' },
      ],
      authorizations: null,
      body: null,
      variables: {
        ids: [1, 2, 3],
      },
    })

    const result = buildHarRequest(request)

    expect(result).toEqual({
      method: 'GET',
      url: 'https://api.example.com/users',
      httpVersion: 'HTTP/1.1',
      headers: [],
      queryString: [
        { name: 'tags', value: '["admin","user"]' },
        { name: 'ids', value: '1' },
        { name: 'ids', value: '2' },
        { name: 'ids', value: '3' },
      ],
      cookies: [],
      headersSize: -1,
      bodySize: -1,
    })
  })

  it('keeps string query parameters as strings', () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/users',
      method: 'GET',
      parameters: [
        { name: 'search', in: 'query', example: 'test query' },
        { name: 'page', in: 'query' },
      ],
      authorizations: null,
      body: null,
      variables: {
        page: '2',
      },
    })

    const result = buildHarRequest(request)

    expect(result).toEqual({
      method: 'GET',
      url: 'https://api.example.com/users',
      httpVersion: 'HTTP/1.1',
      headers: [],
      queryString: [
        { name: 'search', value: 'test query' },
        { name: 'page', value: '2' },
      ],
      cookies: [],
      headersSize: -1,
      bodySize: -1,
    })
  })
})
