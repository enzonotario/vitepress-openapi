import { describe, expect, it } from 'vitest'
import { generateMissingTags } from '../../../src/lib/prepareOpenAPI/generateMissingTags'

describe('generateMissingTags', () => {
  it('adds default tag to operations without tags', () => {
    const spec = {
      paths: {
        '/example': {
          get: {},
        },
      },
    }
    const result = generateMissingTags(spec)
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
    const result = generateMissingTags(spec)
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
    const result = generateMissingTags(spec)
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
    const result = generateMissingTags(spec)
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
    const result = generateMissingTags(spec)
    expect(result.paths).toEqual({})
  })
})
