import { describe, expect, it } from 'vitest'
import { spec } from '../testsConstants'
import { useSidebar } from './src/composables/useSidebar'

describe('useSidebar', () => {
  const sidebar = useSidebar({ spec })

  it('creates a sidebar item template', () => {
    const result = useSidebar().sidebarItemTemplate('get', 'GET /users With a Long Title')
    expect(result).toBe(`<span class="OASidebarItem group/oaSidebarItem">
        <span class="OASidebarItem-badge OAMethodBadge--get">GET</span>
        <p class="OASidebarItem-text text">GET /users With a Long Title</p>
      </span>`)
  })

  it('returns the correct tags for getTags', () => {
    const result = sidebar.getTags()
    expect(result).toEqual([])
  })

  it('returns the correct sidebar items for generateSidebarGroups', () => {
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

  it('returns the correct sidebar items for generateSidebarGroup', () => {
    const result = sidebar.generateSidebarGroup({
      tag: [],
      text: 'users',
      linkPrefix: '/ref/',
    })
    expect(result).toEqual({
      items: [
        {
          link: '/ref/getUsers',
          text: sidebar.sidebarItemTemplate('get', 'GET /users'),
        },
        {
          link: '/ref/getUser',
          text: sidebar.sidebarItemTemplate('get', 'GET /users/{id}'),
        },
        {
          link: '/ref/getUserPets',
          text: sidebar.sidebarItemTemplate('get', 'GET /users/{id}/pets'),
        },
      ],
      text: 'users',
    })
  })
})

describe('useSidebar with linkPrefix', () => {
  const sidebar = useSidebar({ spec, linkPrefix: '/foo/' })

  it('can configure the link prefix globally', () => {
    const result = sidebar.generateSidebarGroups()
    expect(result).toEqual([
      {
        items: [
          {
            link: '/foo/getUsers',
            text: sidebar.sidebarItemTemplate('get', 'GET /users'),
          },
          {
            link: '/foo/getUser',
            text: sidebar.sidebarItemTemplate('get', 'GET /users/{id}'),
          },
          {
            link: '/foo/getUserPets',
            text: sidebar.sidebarItemTemplate('get', 'GET /users/{id}/pets'),
          },
        ],
        text: '',
      },
    ])
  })

  it('can configure the link prefix per group', () => {
    const result = sidebar.generateSidebarGroups()
    expect(result).toEqual([
      {
        items: [
          {
            link: '/foo/getUsers',
            text: sidebar.sidebarItemTemplate('get', 'GET /users'),
          },
          {
            link: '/foo/getUser',
            text: sidebar.sidebarItemTemplate('get', 'GET /users/{id}'),
          },
          {
            link: '/foo/getUserPets',
            text: sidebar.sidebarItemTemplate('get', 'GET /users/{id}/pets'),
          },
        ],
        text: '',
      },
    ])

    const result2 = sidebar.generateSidebarGroups({ linkPrefix: '/bar/' })
    expect(result2).toEqual([
      {
        items: [
          {
            link: '/bar/getUsers',
            text: sidebar.sidebarItemTemplate('get', 'GET /users'),
          },
          {
            link: '/bar/getUser',
            text: sidebar.sidebarItemTemplate('get', 'GET /users/{id}'),
          },
          {
            link: '/bar/getUserPets',
            text: sidebar.sidebarItemTemplate('get', 'GET /users/{id}/pets'),
          },
        ],
        text: '',
      },
    ])
  })
})
