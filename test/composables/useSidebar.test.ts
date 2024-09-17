import { describe, expect, it } from 'vitest'
import { spec } from '../testsConstants'
import { useSidebar } from './src/composables/useSidebar'

describe('useSidebar', () => {
  const sidebar = useSidebar({ spec })

  it('creates a sidebar item template', () => {
    const result = useSidebar().sidebarItemTemplate('get', 'GET /users With a Long Title')
    expect(result).toBe(`<span class="OASidebarItem">
        <span class="OASidebarItem-badge OAMethodBadge--get">GET</span>
        <span class="OASidebarItem-text">GET /users With a Long Title</span>
      </span>`)
  })

  it('returns the correct tags for getTags', () => {
    const result = sidebar.getTags()
    expect(result).toEqual([])
  })

  it('returns the correct sidebar items for getSidebarItems', () => {
    const result = sidebar.generateSidebarGroups()
    expect(result).toEqual([
      {
        items: [
          {
            link: '/operations/getUsers',
            text: sidebar.sidebarItemTemplate('get', 'GET /users'),
          },
          {
            link: '/operations/getUser',
            text: sidebar.sidebarItemTemplate('get', 'GET /users/{id}'),
          },
          {
            link: '/operations/getUserPets',
            text: sidebar.sidebarItemTemplate('get', 'GET /users/{id}/pets'),
          },
        ],
        text: '',
      },
    ])
  })
})
