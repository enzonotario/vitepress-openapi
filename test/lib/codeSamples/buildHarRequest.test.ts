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
        text: 'username=user123&password=securepassword&remember=true',
      },
    })
  })
})
