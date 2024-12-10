import { describe, expect, it } from 'vitest'
import { setItemCollapsedState } from '../../../src/lib/sidebar/setItemCollapsedState'

describe('setCollapsedGroups', () => {
  it('collapses groups with no items', () => {
    const groups = [
      {
        text: 'Group 1',
        items: [],
      },
    ]
    const result = setItemCollapsedState(groups)
    expect(result).toEqual([
      {
        text: 'Group 1',
        items: [],
        collapsed: true,
      },
    ])
  })

  it('does not collapse groups with items', () => {
    const groups = [
      {
        text: 'Group 1',
        items: [
          {
            text: 'Child 1',
            items: [],
          },
        ],
      },
    ]
    const result = setItemCollapsedState(groups)
    expect(result).toEqual([
      {
        text: 'Group 1',
        items: [
          {
            text: 'Child 1',
            items: [],
            collapsed: true,
          },
        ],
        collapsed: false,
      },
    ])
  })

  it('collapses nested groups with no items', () => {
    const groups = [
      {
        text: 'Group 1',
        items: [
          {
            text: 'Child 1',
            items: [
              {
                text: 'Grandchild 1',
                items: [],
              },
            ],
          },
        ],
      },
    ]
    const result = setItemCollapsedState(groups)
    expect(result).toEqual([
      {
        text: 'Group 1',
        items: [
          {
            text: 'Child 1',
            items: [
              {
                text: 'Grandchild 1',
                items: [],
                collapsed: true,
              },
            ],
            collapsed: false,
          },
        ],
        collapsed: false,
      },
    ])
  })

  it('handles groups with mixed items and nested groups', () => {
    const groups = [
      {
        text: 'Group 1',
        items: [
          {
            text: 'Child 1',
            items: [
              {
                text: 'Grandchild 1',
                items: [],
              },
            ],
          },
          {
            text: 'Child 2',
            items: [],
          },
        ],
      },
    ]
    const result = setItemCollapsedState(groups)
    expect(result).toEqual([
      {
        text: 'Group 1',
        items: [
          {
            text: 'Child 1',
            items: [
              {
                text: 'Grandchild 1',
                items: [],
                collapsed: true,
              },
            ],
            collapsed: false,
          },
          {
            text: 'Child 2',
            items: [],
            collapsed: true,
          },
        ],
        collapsed: false,
      },
    ])
  })

  it('handles empty groups array', () => {
    const groups = []
    const result = setItemCollapsedState(groups)
    expect(result).toEqual([])
  })
})
