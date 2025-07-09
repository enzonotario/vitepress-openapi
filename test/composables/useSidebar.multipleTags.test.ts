import { describe, expect, it } from 'vitest'
import { useSidebar } from '../../src/composables/useSidebar'

const spec = {
  openapi: '3.0.4',
  info: {
    title: 'Animals API',
    version: '0.1.0',
  },
  paths: {
    '/api/cats': {
      get: {
        tags: ['mammal', 'cat', 'fluffy'],
        summary: 'Find a cat',
        operationId: 'findCat',
        responses: { 200: { description: 'OK' } },
      },
    },
    '/api/sphynxs': {
      get: {
        tags: ['mammal', 'cat', 'bald'],
        summary: 'Find a sphynx cat',
        operationId: 'findSphynx',
        responses: { 200: { description: 'OK' } },
      },
    },
    '/api/fancyrats': {
      get: {
        tags: ['mammal', 'fluffy', 'small', 'rat'],
        summary: 'Find a fancy rat',
        operationId: 'findFancyRat',
        responses: { 200: { description: 'OK' } },
      },
    },
    '/api/lizards': {
      get: {
        tags: ['small', 'reptile', 'lizard'],
        summary: 'Find a lizard',
        operationId: 'findLizard',
        responses: { 200: { description: 'OK' } },
      },
    },
    '/account/stats': {
      get: {
        summary: 'Get user stats',
        operationId: 'accountStats',
        responses: { 200: { description: 'OK' } },
      },
    },
    '/status': {
      get: {
        summary: 'Check status',
        operationId: 'checkStatus',
        responses: { 200: { description: 'OK' } },
      },
    },
  },
}

describe('generateSidebarGroups with operations having multiple tags', () => {
  const sidebar = useSidebar({ spec })

  it('omits empty groups when grouping by tags', () => {
    const result = sidebar.generateSidebarGroups()
    expect(result).toEqual([
      {
        text: 'mammal',
        items: [
          {
            link: '/operations/findCat',
            text: sidebar.sidebarItemTemplate({
              method: 'get',
              path: '/findCat',
              title: 'Find a cat',
            }),
          },
          {
            link: '/operations/findSphynx',
            text: sidebar.sidebarItemTemplate({
              method: 'get',
              path: '/findSphynx',
              title: 'Find a sphynx cat',
            }),
          },
          {
            link: '/operations/findFancyRat',
            text: sidebar.sidebarItemTemplate({
              method: 'get',
              path: '/findFancyRat',
              title: 'Find a fancy rat',
            }),
          },
        ],
      },
      {
        text: 'cat',
        items: [
          {
            link: '/operations/findCat',
            text: sidebar.sidebarItemTemplate({
              method: 'get',
              path: '/findCat',
              title: 'Find a cat',
            }),
          },
          {
            link: '/operations/findSphynx',
            text: sidebar.sidebarItemTemplate({
              method: 'get',
              path: '/findSphynx',
              title: 'Find a sphynx cat',
            }),
          },
        ],
      },
      {
        text: 'fluffy',
        items: [
          {
            link: '/operations/findCat',
            text: sidebar.sidebarItemTemplate({
              method: 'get',
              path: '/findCat',
              title: 'Find a cat',
            }),
          },
          {
            link: '/operations/findFancyRat',
            text: sidebar.sidebarItemTemplate({
              method: 'get',
              path: '/findFancyRat',
              title: 'Find a fancy rat',
            }),
          },
        ],
      },
      {
        text: 'bald',
        items: [
          {
            link: '/operations/findSphynx',
            text: sidebar.sidebarItemTemplate({
              method: 'get',
              path: '/findSphynx',
              title: 'Find a sphynx cat',
            }),
          },
        ],
      },
      {
        text: 'small',
        items: [
          {
            link: '/operations/findFancyRat',
            text: sidebar.sidebarItemTemplate({
              method: 'get',
              path: '/findFancyRat',
              title: 'Find a fancy rat',
            }),
          },
          {
            link: '/operations/findLizard',
            text: sidebar.sidebarItemTemplate({
              method: 'get',
              path: '/findLizard',
              title: 'Find a lizard',
            }),
          },
        ],
      },
      {
        text: 'rat',
        items: [
          {
            link: '/operations/findFancyRat',
            text: sidebar.sidebarItemTemplate({
              method: 'get',
              path: '/findFancyRat',
              title: 'Find a fancy rat',
            }),
          },
        ],
      },
      {
        text: 'reptile',
        items: [
          {
            link: '/operations/findLizard',
            text: sidebar.sidebarItemTemplate({
              method: 'get',
              path: '/findLizard',
              title: 'Find a lizard',
            }),
          },
        ],
      },
      {
        text: 'lizard',
        items: [
          {
            link: '/operations/findLizard',
            text: sidebar.sidebarItemTemplate({
              method: 'get',
              path: '/findLizard',
              title: 'Find a lizard',
            }),
          },
        ],
      },
      {
        text: 'Default',
        items: [
          {
            link: '/operations/accountStats',
            text: sidebar.sidebarItemTemplate({
              method: 'get',
              path: '/accountStats',
              title: 'Get user stats',
            }),
          },
          {
            link: '/operations/checkStatus',
            text: sidebar.sidebarItemTemplate({
              method: 'get',
              path: '/checkStatus',
              title: 'Check status',
            }),
          },
        ],
      },
    ])
  })
})
