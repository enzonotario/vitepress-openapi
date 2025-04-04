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

      const { submitRequest } = usePlayground()

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

      await submitRequest({
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
  })
})
