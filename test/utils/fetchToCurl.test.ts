import { describe, expect, it } from 'vitest'
import { fetchToCurl, generateMethod, generateHeader, generateBody, generateCompress, escapeBody, isInstanceOfHeaders } from '../../src/utils/fetchToCurl'

describe('fetchToCurl', () => {
  it('converts a simple GET request to curl', () => {
    const url = 'https://api.example.com/path/testOperation'
    const method = 'GET'
    const result = fetchToCurl(url, { method })
    expect(result).toBe(`curl -X GET '${url}'`)
  })

  it('converts a POST request with body to curl', () => {
    const url = 'https://api.example.com/path/testOperation'
    const method = 'POST'
    const body = { key: 'value' }
    const result = fetchToCurl(url, { method, body })
    expect(result).toBe(`curl -X POST '${url}' \\
 --data '{"key":"value"}'`)
  })

  it('handles headers correctly', () => {
    const url = 'https://api.example.com/path/testOperation'
    const method = 'GET'
    const headers = { 'Content-Type': 'application/json' }
    const result = fetchToCurl(url, { method, headers })
    expect(result).toBe(`curl -X GET '${url}' \\
 -H "Content-Type: application/json"`)
  })

  it('handles empty URL gracefully', () => {
    const url = ''
    const method = 'GET'
    const result = fetchToCurl(url, { method })
    expect(result).toBe(`curl -X GET ''`)
  })

  it('handles undefined method gracefully', () => {
    const url = 'https://api.example.com/path/testOperation'
    const result = fetchToCurl(url, {})
    expect(result).toBe(`curl '${url}'`)
  })

  it('handles undefined headers gracefully', () => {
    const url = 'https://api.example.com/path/testOperation'
    const method = 'GET'
    const result = fetchToCurl(url, { method })
    expect(result).toBe(`curl -X GET '${url}'`)
  })

  it('handles undefined body gracefully', () => {
    const url = 'https://api.example.com/path/testOperation'
    const method = 'POST'
    const result = fetchToCurl(url, { method })
    expect(result).toBe(`curl -X POST '${url}'`)
  })

  it('handles URL object correctly', () => {
    const url = new URL('https://api.example.com/path/testOperation')
    const method = 'GET'
    const result = fetchToCurl(url, { method })
    expect(result).toBe(`curl -X GET 'https://api.example.com/path/testOperation'`)
  })
})
