import { describe, expect, it } from 'vitest'
import { useSidebar } from '../../src/composables/useSidebar'
import { spec } from '../testsConstants'

describe('itemsByTags', () => {
  const sidebar = useSidebar({ spec })

  it('returns the correct items for given tags', () => {
    const result = sidebar.itemsByTags({ tags: ['users', 'pets'] })
    expect(result).toEqual([
      { text: 'users', link: '/tags/users' },
      { text: 'pets', link: '/tags/pets' },
    ])
  })

  it('returns the correct items with a custom linkPrefix', () => {
    const result = sidebar.itemsByTags({ tags: ['users', 'pets'], linkPrefix: '/custom/' })
    expect(result).toEqual([
      { text: 'users', link: '/custom/users' },
      { text: 'pets', link: '/custom/pets' },
    ])
  })

  it('returns the correct items when no tags are provided', () => {
    const result = sidebar.itemsByTags()
    expect(result).toEqual([
      { text: 'users', link: '/tags/users' },
      { text: 'pets', link: '/tags/pets' },
    ])
  })
})
