import { describe, expect, it, vi } from 'vitest'
import { generateCodeSamples } from './src/utils/generateCodeSamples'

// Mock the useOpenapi hook
vi.mock('vitepress-theme-openapi', () => ({
  useOpenapi: vi.fn(() => ({
    getBaseUrl: () => 'https://api.example.com',
    getOperationPath: operationId => `/path/${operationId}`,
  })),
}))

describe('generateCodeSamples', () => {
  it('should generate code samples for a given operationId', () => {
    const operationId = 'testOperation'
    const samples = generateCodeSamples(operationId)
    expect(samples).toHaveProperty('curl')
    expect(samples).toHaveProperty('javascript')
    expect(samples).toHaveProperty('php')
    expect(samples).toHaveProperty('python')
    expect(samples.curl.source).toContain('https://api.example.com/path/testOperation')
    expect(samples.javascript.source).toContain('https://api.example.com/path/testOperation')
    expect(samples.php.source).toContain('https://api.example.com/path/testOperation')
    expect(samples.python.source).toContain('https://api.example.com/path/testOperation')
  })

  it('should handle empty operationId gracefully', () => {
    const operationId = ''
    const samples = generateCodeSamples(operationId)
    expect(samples.curl.source).toContain('https://api.example.com/path/')
    expect(samples.javascript.source).toContain('https://api.example.com/path/')
    expect(samples.php.source).toContain('https://api.example.com/path/')
    expect(samples.python.source).toContain('https://api.example.com/path/')
  })

  it('should correctly handle special characters in operationId', () => {
    const operationId = 'special/chars?&'
    const samples = generateCodeSamples(operationId)
    expect(samples.curl.source).toContain('https://api.example.com/path/special/chars?&')
    expect(samples.javascript.source).toContain('https://api.example.com/path/special/chars?&')
    expect(samples.php.source).toContain('https://api.example.com/path/special/chars?&')
    expect(samples.python.source).toContain('https://api.example.com/path/special/chars?&')
  })
})
