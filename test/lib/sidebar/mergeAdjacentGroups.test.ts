import { describe, expect, it } from 'vitest'
import { mergeAdjacentGroups } from '../../../src/lib/sidebar/mergeAdjacentGroups'

describe('mergeAdjacentGroups', () => {
  it('merges groups with a single child group and no operations', () => {
    const groups = [
      {
        text: '/group1',
        path: '/group1',
        items: [
          {
            text: '/child1',
            path: '/group1/child1',
            items: [],
          },
        ],
      },
    ]
    const result = mergeAdjacentGroups(groups)
    expect(result).toEqual([
      {
        text: '/group1/child1',
        path: '/group1/child1',
        items: [],
      },
    ])
  })

  it('does not merge groups with multiple child groups', () => {
    const groups = [
      {
        text: '/group1',
        path: '/group1',
        items: [
          {
            text: '/child1',
            path: '/group1/child1',
            items: [],
          },
          {
            text: 'Child 2',
            path: '/group1/child2',
            items: [],
          },
        ],
      },
    ]
    const result = mergeAdjacentGroups(groups)
    expect(result).toEqual(groups)
  })

  it('does not merge groups with operations', () => {
    const groups = [
      {
        text: '/group1',
        path: '/group1',
        items: [
          {
            text: '/child1',
            path: '/child1',
            items: [
              {
                link: '/operation1',
                text: '/operation1',
              },
            ],
          },
          {
            link: '/operation2',
            text: '/operation2',
          },
        ],
      },
    ]
    const result = mergeAdjacentGroups(groups)
    expect(result).toEqual(groups)
  })

  it('merges nested groups recursively', () => {
    const groups = [
      {
        text: '/group1',
        path: '/group1',
        items: [
          {
            text: '/child1',
            path: '/child1',
            items: [
              {
                text: '/grandchild1',
                path: '/keep-this-path',
                items: [],
              },
            ],
          },
        ],
      },
    ]
    const result = mergeAdjacentGroups(groups)
    expect(result).toEqual([
      {
        text: '/group1/child1/grandchild1',
        path: '/keep-this-path',
        items: [],
      },
    ])
  })

  it('handles empty groups array', () => {
    const groups = []
    const result = mergeAdjacentGroups(groups)
    expect(result).toEqual([])
  })
})
