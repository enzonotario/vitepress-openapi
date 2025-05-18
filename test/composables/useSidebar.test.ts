import { describe, expect, it } from 'vitest'
import { useSidebar } from '../../src/composables/useSidebar'
import { spec } from '../testsConstants'

describe('useSidebar', () => {
  const sidebar = useSidebar({ spec })

  it('creates a sidebar item template', () => {
    const result = useSidebar().sidebarItemTemplate('get', 'GET /users With a Long Title')
    expect(result).toBe(`<span class="OASidebarItem group/oaOperationLink">
        <span class="OASidebarItem-badge OAMethodBadge--get">GET</span>
        <span class="OASidebarItem-text text">GET /users With a Long Title</span>
      </span>`)
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
        ],
        text: 'users',
      },
      {
        items: [
          {
            link: '/operations/getUserPets',
            text: sidebar.sidebarItemTemplate('get', 'Get a list of pets for a user'),
          },
        ],
        text: 'pets',
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
          text: sidebar.sidebarItemTemplate('get', 'Get a list of pets for a user'),
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
        ],
        text: 'users',
      },
      {
        items: [
          {
            link: '/foo/getUserPets',
            text: sidebar.sidebarItemTemplate('get', 'Get a list of pets for a user'),
          },
        ],
        text: 'pets',
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
        ],
        text: 'users',
      },
      {
        items: [
          {
            link: '/foo/getUserPets',
            text: sidebar.sidebarItemTemplate('get', 'Get a list of pets for a user'),
          },
        ],
        text: 'pets',
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
        ],
        text: 'users',
      },
      {
        items: [
          {
            link: '/bar/getUserPets',
            text: sidebar.sidebarItemTemplate('get', 'Get a list of pets for a user'),
          },
        ],
        text: 'pets',
      },
    ])
  })
})

describe('useSidebar with sidebarItemTemplate', () => {
  const sidebar = useSidebar({
    spec,
    sidebarItemTemplate: (method, title) => `<div class="test">${method} ${title}</div>`,
  })

  it('can configure sidebarItemTemplate globally', () => {
    const result = sidebar.generateSidebarGroups()
    expect(result).toEqual([
      {
        items: [
          {
            link: '/operations/getUsers',
            text: '<div class="test">get GET /users</div>',
          },
          {
            link: '/operations/getUser',
            text: '<div class="test">get GET /users/{id}</div>',
          },
        ],
        text: 'users',
      },
      {
        items: [
          {
            link: '/operations/getUserPets',
            text: '<div class="test">get Get a list of pets for a user</div>',
          },
        ],
        text: 'pets',
      },
    ])
  })

  it('can configure sidebarItemTemplate per group', () => {
    const result = sidebar.generateSidebarGroups()
    expect(result).toEqual([
      {
        items: [
          {
            link: '/operations/getUsers',
            text: '<div class="test">get GET /users</div>',
          },
          {
            link: '/operations/getUser',
            text: '<div class="test">get GET /users/{id}</div>',
          },
        ],
        text: 'users',
      },
      {
        items: [
          {
            link: '/operations/getUserPets',
            text: '<div class="test">get Get a list of pets for a user</div>',
          },
        ],
        text: 'pets',
      },
    ])

    const result2 = sidebar.generateSidebarGroups({
      sidebarItemTemplate: (method, title) => `<div class="test2">${method} ${title}</div>`,
    })
    expect(result2).toEqual([
      {
        items: [
          {
            link: '/operations/getUsers',
            text: '<div class="test2">get GET /users</div>',
          },
          {
            link: '/operations/getUser',
            text: '<div class="test2">get GET /users/{id}</div>',
          },
        ],
        text: 'users',
      },
      {
        items: [
          {
            link: '/operations/getUserPets',
            text: '<div class="test2">get Get a list of pets for a user</div>',
          },
        ],
        text: 'pets',
      },
    ])
  })
})

describe('useSidebar with sidebarGroupTemplate', () => {
  const sidebar = useSidebar({
    spec,
    sidebarGroupTemplate: tag => `<div class="test">${tag}</div>`,
  })

  it('can configure sidebarGroupTemplate globally', () => {
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
        ],
        text: '<div class="test">users</div>',
      },
      {
        items: [
          {
            link: '/operations/getUserPets',
            text: sidebar.sidebarItemTemplate('get', 'Get a list of pets for a user'),
          },
        ],
        text: '<div class="test">pets</div>',
      },
    ])
  })

  it('can configure sidebarGroupTemplate per group', () => {
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
        ],
        text: '<div class="test">users</div>',
      },
      {
        items: [
          {
            link: '/operations/getUserPets',
            text: sidebar.sidebarItemTemplate('get', 'Get a list of pets for a user'),
          },
        ],
        text: '<div class="test">pets</div>',
      },
    ])

    const result2 = sidebar.generateSidebarGroups({
      sidebarGroupTemplate: tag => `<div class="test2">${tag}</div>`,
    })
    expect(result2).toEqual([
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
        ],
        text: '<div class="test2">users</div>',
      },
      {
        items: [
          {
            link: '/operations/getUserPets',
            text: sidebar.sidebarItemTemplate('get', 'Get a list of pets for a user'),
          },
        ],
        text: '<div class="test2">pets</div>',
      },
    ])
  })
})
