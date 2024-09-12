import { describe, expect, it } from 'vitest'
import { fetchToCurl } from '../../src/lib/fetchToCurl'

describe('fetchToCurl', () => {
  it('converts a simple GET request to curl', () => {
    const url = 'https://api.example.com/path/testOperation'
    const method = 'GET'
    const result = fetchToCurl({ url, method })
    expect(result).toBe(`curl -X GET \\\n'${url}'`)
  })

  it('converts a POST request with body to curl', () => {
    const url = 'https://api.example.com/path/testOperation'
    const method = 'POST'
    const body = { key: 'value', nested: { key: 'value' } }
    const result = fetchToCurl({ url, method, body })
    expect(result).toBe(`curl -X POST \\\n'${url}' \\
 --data '{"key":"value","nested":{"key":"value"}}'`)
  })

  it('handles headers correctly', () => {
    const url = 'https://api.example.com/path/testOperation'
    const method = 'GET'
    const headers = { 'Content-Type': 'application/json' }
    const result = fetchToCurl({ url, method, headers })
    expect(result).toBe(`curl -X GET \\\n'${url}' \\
 -H "Content-Type: application/json"`)
  })

  it('handles empty URL gracefully', () => {
    const url = ''
    const method = 'GET'
    const result = fetchToCurl({ url, method })
    expect(result).toBe(`curl -X GET \\\n''`)
  })

  it('handles undefined method gracefully', () => {
    const url = 'https://api.example.com/path/testOperation'
    const result = fetchToCurl({ url })
    expect(result).toBe(`curl '${url}'`)
  })

  it('handles undefined headers gracefully', () => {
    const url = 'https://api.example.com/path/testOperation'
    const method = 'GET'
    const result = fetchToCurl({ url, method })
    expect(result).toBe(`curl -X GET \\\n'${url}'`)
  })

  it('handles undefined body gracefully', () => {
    const url = 'https://api.example.com/path/testOperation'
    const method = 'POST'
    const result = fetchToCurl({ url, method })
    expect(result).toBe(`curl -X POST \\\n'${url}'`)
  })

  it('handles URL object correctly', () => {
    const url = new URL('https://api.example.com/path/testOperation')
    const method = 'GET'
    const result = fetchToCurl({ url, method })
    expect(result).toBe(`curl -X GET \\\n'https://api.example.com/path/testOperation'`)
  })
})
