import { describe, expect, it } from 'vitest'
import { generateMissingSummary } from '../../../src/lib/parser/generateMissingSummary'

describe('generateMissingSummary', () => {
  it('returns the original value if paths are not present', () => {
    const value = { info: 'test' }
    const result = generateMissingSummary(value)
    expect(result).toEqual(value)
  })

  it('adds summary to paths without summary', () => {
    const value = {
      paths: {
        '/test': {
          get: {},
          post: { summary: 'Existing summary' },
        },
      },
    }
    const result = generateMissingSummary(value)
    expect(result.paths['/test'].get.summary).toBe('GET /test')
    expect(result.paths['/test'].post.summary).toBe('Existing summary')
  })

  it('does not modify paths that already have a summary', () => {
    const value = {
      paths: {
        '/test': {
          get: { summary: 'Existing summary' },
        },
      },
    }
    const result = generateMissingSummary(value)
    expect(result.paths['/test'].get.summary).toBe('Existing summary')
  })

  it('handles multiple HTTP verbs', () => {
    const value = {
      paths: {
        '/test': {
          get: {},
          post: {},
        },
      },
    }
    const result = generateMissingSummary(value)
    expect(result.paths['/test'].get.summary).toBe('GET /test')
    expect(result.paths['/test'].post.summary).toBe('POST /test')
  })

  it('returns an empty object if paths is an empty object', () => {
    const value = { paths: {} }
    const result = generateMissingSummary(value)
    expect(result.paths).toEqual({})
  })

  it('ignores non-verb fields in path objects', () => {
    const value = {
      paths: {
        '/item': {
          summary: 'Item summary',
          description: 'desc',
          get: {},
        },
      },
    }

    const result = generateMissingSummary(value)

    expect(result.paths['/item'].summary).toBe('Item summary')
    expect(result.paths['/item'].description).toBe('desc')
    expect(result.paths['/item'].get.summary).toBe('GET /item')
  })
})
