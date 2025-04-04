import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { usePlayground } from '../../src/composables/usePlayground'
import { buildRequest } from '../../src/lib/codeSamples/buildRequest'

describe('usePlayground', () => {
  const mockFetch = vi.fn()

  beforeEach(() => {
    globalThis.fetch = mockFetch
    vi.spyOn(performance, 'now').mockReturnValueOnce(0).mockReturnValueOnce(100)
    globalThis.URL.createObjectURL = vi.fn().mockReturnValue('blob:url')
    globalThis.URL.revokeObjectURL = vi.fn()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('submitRequest', () => {
    it('should handle request body correctly', async () => {
      const mockResponse = {
        status: 200,
        headers: {
          get: vi.fn().mockReturnValue('application/json'),
        },
        json: vi.fn().mockResolvedValue({ success: true }),
        text: vi.fn(),
      }
      mockFetch.mockResolvedValue(mockResponse)

      const requestBody = {
        name: 'Test User',
        email: 'test@example.com',
        age: 30,
      }

      const request = buildRequest({
        baseUrl: 'https://api.example.com',
        path: '/users',
        method: 'POST',
        body: requestBody,
        parameters: [],
        variables: {},
      })

      await usePlayground().submitRequest({
        request,
        method: request.method,
        baseUrl: 'https://api.example.com',
        path: request.path,
        operationId: 'createUserOperation',
      })

      expect(mockFetch.mock.calls[0][0].toString()).toBe('https://api.example.com/users')
      expect(mockFetch.mock.calls[0][1]).toEqual({
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: expect.any(AbortSignal),
      })
      expect(mockResponse.json).toHaveBeenCalled()
    })

    it('should handle GET requests with query parameters', async () => {
      const mockResponse = {
        status: 200,
        headers: {
          get: vi.fn().mockReturnValue('application/json'),
        },
        json: vi.fn().mockResolvedValue({ data: [{ id: 1, name: 'Test' }] }),
        text: vi.fn(),
      }
      mockFetch.mockResolvedValue(mockResponse)

      const request = buildRequest({
        baseUrl: 'https://api.example.com',
        path: '/users',
        method: 'GET',
        body: null,
        parameters: [],
        variables: {},
      })

      request.query = { page: 1, limit: 10, search: 'test' }

      await usePlayground().submitRequest({
        request,
        method: request.method,
        baseUrl: 'https://api.example.com',
        path: request.path,
        operationId: 'getUsersOperation',
      })

      expect(mockFetch.mock.calls[0][0].toString()).toBe('https://api.example.com/users?page=1&limit=10&search=test')
      expect(mockFetch.mock.calls[0][1]).toEqual({
        method: 'GET',
        headers: {},
        body: null,
        signal: expect.any(AbortSignal),
      })
      expect(mockResponse.json).toHaveBeenCalled()
    })

    it('should handle XML response content type', async () => {
      const xmlContent = '<response><status>success</status><message>Data retrieved</message></response>'
      const mockResponse = {
        status: 200,
        headers: {
          get: vi.fn().mockReturnValue('application/xml'),
        },
        json: vi.fn(),
        text: vi.fn().mockResolvedValue(xmlContent),
      }
      mockFetch.mockResolvedValue(mockResponse)

      const playground = usePlayground()

      const request = buildRequest({
        baseUrl: 'https://api.example.com',
        path: '/data',
        method: 'GET',
        body: null,
        parameters: [],
        variables: {},
      })

      const result = await playground.submitRequest({
        request,
        method: request.method,
        baseUrl: 'https://api.example.com',
        path: request.path,
        operationId: 'getXmlDataOperation',
      })

      expect(mockFetch).toHaveBeenCalled()
      expect(mockResponse.text).toHaveBeenCalled()
      expect(mockResponse.json).not.toHaveBeenCalled()
      expect(result?.body).toBe(xmlContent)
      expect(result?.type).toBe('application/xml')
      expect(playground.response.value?.body).toBe(xmlContent)
    })

    it('should handle image response content type', async () => {
      const mockBlob = new Blob(['image data'], { type: 'image/png' })
      const mockResponse = {
        status: 200,
        headers: {
          get: vi.fn().mockReturnValue('image/png'),
        },
        json: vi.fn(),
        text: vi.fn(),
        blob: vi.fn().mockResolvedValue(mockBlob),
      }
      mockFetch.mockResolvedValue(mockResponse)

      const playground = usePlayground()

      const request = buildRequest({
        baseUrl: 'https://api.example.com',
        path: '/image',
        method: 'GET',
        body: null,
        parameters: [],
        variables: {},
      })

      const result = await playground.submitRequest({
        request,
        method: request.method,
        baseUrl: 'https://api.example.com',
        path: request.path,
        operationId: 'getImageOperation',
      })

      expect(mockFetch).toHaveBeenCalled()
      expect(mockResponse.blob).toHaveBeenCalled()
      expect(globalThis.URL.createObjectURL).toHaveBeenCalledWith(mockBlob)
      expect(result?.body).toBe('blob:url')
      expect(result?.type).toBe('image/png')
      expect(playground.imageUrls.value).toContain('blob:url')
    })

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'))

      const request = buildRequest({
        baseUrl: 'https://api.example.com',
        path: '/users',
        method: 'GET',
        body: null,
        parameters: [],
        variables: {},
      })

      const result = await usePlayground().submitRequest({
        request,
        method: request.method,
        baseUrl: 'https://api.example.com',
        path: request.path,
        operationId: 'failedOperation',
      })

      expect(mockFetch).toHaveBeenCalled()
      expect(result?.status).toBe(500)
      expect(result?.body).toBe('Network error')
      expect(result?.type).toBe('text/plain')
    })

    it('should handle custom headers in request', async () => {
      const mockResponse = {
        status: 200,
        headers: {
          get: vi.fn().mockReturnValue('application/json'),
        },
        json: vi.fn().mockResolvedValue({ success: true }),
        text: vi.fn(),
      }
      mockFetch.mockResolvedValue(mockResponse)

      const request = buildRequest({
        baseUrl: 'https://api.example.com',
        path: '/users',
        method: 'GET',
        body: null,
        parameters: [],
        variables: {},
      })

      // Add custom headers
      request.headers = {
        'Authorization': 'Bearer token123',
        'X-API-Key': 'abc123',
        'Accept-Language': 'en-US',
      }

      await usePlayground().submitRequest({
        request,
        method: request.method,
        baseUrl: 'https://api.example.com',
        path: request.path,
        operationId: 'getUsersWithHeadersOperation',
      })

      expect(mockFetch.mock.calls[0][0].toString()).toBe('https://api.example.com/users')
      expect(mockFetch.mock.calls[0][1].headers).toEqual({
        'Authorization': 'Bearer token123',
        'X-API-Key': 'abc123',
        'Accept-Language': 'en-US',
      })
      expect(mockResponse.json).toHaveBeenCalled()
    })

    it('should handle 404 error responses', async () => {
      const mockResponse = {
        status: 404,
        headers: {
          get: vi.fn().mockReturnValue('application/json'),
        },
        json: vi.fn().mockResolvedValue({ error: 'Resource not found' }),
        text: vi.fn(),
      }
      mockFetch.mockResolvedValue(mockResponse)

      const playground = usePlayground()

      const request = buildRequest({
        baseUrl: 'https://api.example.com',
        path: '/nonexistent',
        method: 'GET',
        body: null,
        parameters: [],
        variables: {},
      })

      const result = await playground.submitRequest({
        request,
        method: request.method,
        baseUrl: 'https://api.example.com',
        path: request.path,
        operationId: 'notFoundOperation',
      })

      expect(mockFetch).toHaveBeenCalled()
      expect(mockResponse.json).toHaveBeenCalled()
      expect(result?.status).toBe(404)
      expect(result?.body).toEqual({ error: 'Resource not found' })
      expect(playground.response.value?.status).toBe(404)
    })

    it('should handle PUT requests with body', async () => {
      const mockResponse = {
        status: 200,
        headers: {
          get: vi.fn().mockReturnValue('application/json'),
        },
        json: vi.fn().mockResolvedValue({ id: 1, name: 'Updated User', email: 'updated@example.com' }),
        text: vi.fn(),
      }
      mockFetch.mockResolvedValue(mockResponse)

      const requestBody = {
        name: 'Updated User',
        email: 'updated@example.com',
      }

      const request = buildRequest({
        baseUrl: 'https://api.example.com',
        path: '/users/1',
        method: 'PUT',
        body: requestBody,
        parameters: [],
        variables: {},
      })

      await usePlayground().submitRequest({
        request,
        method: request.method,
        baseUrl: 'https://api.example.com',
        path: request.path,
        operationId: 'updateUserOperation',
      })

      expect(mockFetch.mock.calls[0][0].toString()).toBe('https://api.example.com/users/1')
      expect(mockFetch.mock.calls[0][1]).toEqual({
        method: 'PUT',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: expect.any(AbortSignal),
      })
      expect(mockResponse.json).toHaveBeenCalled()
    })

    it('should handle DELETE requests', async () => {
      const mockResponse = {
        status: 204,
        headers: {
          get: vi.fn().mockReturnValue(null),
        },
        json: vi.fn(),
        text: vi.fn().mockResolvedValue(''),
      }
      mockFetch.mockResolvedValue(mockResponse)

      const request = buildRequest({
        baseUrl: 'https://api.example.com',
        path: '/users/1',
        method: 'DELETE',
        body: null,
        parameters: [],
        variables: {},
      })

      const result = await usePlayground().submitRequest({
        request,
        method: request.method,
        baseUrl: 'https://api.example.com',
        path: request.path,
        operationId: 'deleteUserOperation',
      })

      expect(mockFetch.mock.calls[0][0].toString()).toBe('https://api.example.com/users/1')
      expect(mockFetch.mock.calls[0][1]).toEqual({
        method: 'DELETE',
        headers: {},
        body: null,
        signal: expect.any(AbortSignal),
      })
      expect(result?.status).toBe(204)
      expect(result?.body).toBe('')
    })

    it('should handle path parameters correctly', async () => {
      const mockResponse = {
        status: 200,
        headers: {
          get: vi.fn().mockReturnValue('application/json'),
        },
        json: vi.fn().mockResolvedValue({ id: 123, name: 'Test User' }),
        text: vi.fn(),
      }
      mockFetch.mockResolvedValue(mockResponse)

      const request = buildRequest({
        baseUrl: 'https://api.example.com',
        path: '/users/{userId}/profile',
        method: 'GET',
        body: null,
        parameters: [
          { name: 'userId', in: 'path', value: '123' },
        ],
        variables: {},
      })

      await usePlayground().submitRequest({
        request,
        method: request.method,
        baseUrl: 'https://api.example.com',
        path: request.path,
        operationId: 'getUserProfileOperation',
      })

      expect(mockFetch.mock.calls[0][0].toString()).toBe('https://api.example.com/users/%7BuserId%7D/profile')
      expect(mockResponse.json).toHaveBeenCalled()
    })
  })
})
