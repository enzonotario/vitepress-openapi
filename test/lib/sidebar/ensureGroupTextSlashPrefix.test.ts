import { describe, expect, it } from 'vitest'
import { ensureGroupTextSlashPrefix } from '../../../src/lib/sidebar/ensureGroupTextSlashPrefix'

describe('addSlashToGroups', () => {
  it('adds a slash to the beginning of group paths', () => {
    const groups = [
      {
        text: 'group1',
        items: [],
      },
    ]
    const result = ensureGroupTextSlashPrefix(groups)
    expect(result).toEqual([
      {
        text: '/group1',
        items: [],
      },
    ])
  })

  it('does not add a slash if the group path already starts with a slash', () => {
    const groups = [
      {
        text: '/group1',
        items: [],
      },
    ]
    const result = ensureGroupTextSlashPrefix(groups)
    expect(result).toEqual(groups)
  })

  it('adds a slash to nested group paths', () => {
    const groups = [
      {
        text: 'group1',
        items: [
          {
            text: 'child1',
            items: [],
          },
        ],
      },
    ]
    const result = ensureGroupTextSlashPrefix(groups)
    expect(result).toEqual([
      {
        text: '/group1',
        items: [
          {
            text: '/child1',
            items: [],
          },
        ],
      },
    ])
  })

  it('handles groups with mixed slashes and no slashes', () => {
    const groups = [
      {
        text: 'group1',
        items: [
          {
            text: '/child1',
            items: [],
          },
          {
            text: 'child2',
            items: [],
          },
        ],
      },
    ]
    const result = ensureGroupTextSlashPrefix(groups)
    expect(result).toEqual([
      {
        text: '/group1',
        items: [
          {
            text: '/child1',
            items: [],
          },
          {
            text: '/child2',
            items: [],
          },
        ],
      },
    ])
  })

  it('handles empty groups array', () => {
    const groups = []
    const result = ensureGroupTextSlashPrefix(groups)
    expect(result).toEqual([])
  })
})
