import { describe, expect, it } from 'vitest'
import { generateMissingTags } from '../../../src/lib/parser/generateMissingTags'

describe('generateMissingTags', () => {
  it('adds default tag to operations without tags', () => {
    const spec = {
      paths: {
        '/example': {
          get: {},
        },
      },
    }
    const result = generateMissingTags({ spec })
    expect(result.paths['/example'].get.tags).toEqual(['Default'])
  })

  it('keeps existing tags on operations', () => {
    const spec = {
      paths: {
        '/example': {
          get: {
            tags: ['existingTag'],
          },
        },
      },
    }
    const result = generateMissingTags({ spec })
    expect(result.paths['/example'].get.tags).toEqual(['existingTag'])
  })

  it('adds default tag to spec tags if used in operations', () => {
    const spec = {
      paths: {
        '/example': {
          get: {},
        },
      },
      tags: [],
    }
    const result = generateMissingTags({ spec })
    expect(result.tags).toEqual([
      {
        name: 'Default',
        description: '',
      },
    ])
  })

  it('does not add default tag to spec tags if not used in operations', () => {
    const spec = {
      paths: {
        '/example': {
          get: {
            tags: ['existingTag'],
          },
        },
      },
      tags: [],
    }
    const result = generateMissingTags({ spec })
    expect(result.tags).not.toContainEqual({
      name: 'Default',
      description: undefined,
    })
    expect(result.tags).toEqual([])
  })

  it('handles empty paths object', () => {
    const spec = {
      paths: {},
    }
    const result = generateMissingTags({ spec })
    expect(result.paths).toEqual({})
  })

  it('uses custom default tag when provided', () => {
    const spec = {
      paths: {
        '/example': {
          get: {},
        },
      },
    }
    const result = generateMissingTags({
      spec,
      defaultTag: 'Custom',
      defaultTagDescription: 'Custom Description',
    })
    expect(result.paths['/example'].get.tags).toEqual(['Custom'])
    expect(result.tags).toEqual([{
      name: 'Custom',
      description: 'Custom Description',
    }])
  })
  it('ignores non-verb fields in path objects', () => {
    const spec = {
      paths: {
        '/example': {
          summary: 'Some summary',
          get: {},
        },
      },
    }
    const result = generateMissingTags({ spec })
    expect(result.paths['/example'].summary).toBe('Some summary')
    expect(result.paths['/example'].get.tags).toEqual(['Default'])
  })
})
