import type { DefaultTheme } from 'vitepress'
import { describe, expect, it } from 'vitest'
import realSpec from '../../docs/public/openapi.json'
import { useSidebar } from '../../src/composables/useSidebar'

function cleanResult(result: (DefaultTheme.SidebarItem | DefaultTheme.SidebarItem[])): any {
  if (Array.isArray(result)) {
    return result.map(cleanResult)
  }

  if (result.text && result.text.includes('<span')) {
    delete result.text
  }

  if (result.items) {
    result.items = cleanResult(result.items)
  }

  return result
}

describe('useSidebar itemsByPaths', () => {
  const sidebar = useSidebar({
    spec: {
      openapi: '3.0.0',
      paths: {
        '/api/v1/1': {
          get: {
            operationId: 'get1',
            responses: {
              200: {
                description: 'OK',
              },
            },
          },
          post: {
            operationId: 'create1',
            responses: {
              201: {
                description: 'Created',
              },
            },
          },
        },
        '/api/v1/1/2': {
          get: {
            operationId: 'get12',
            responses: {
              200: {
                description: 'OK',
              },
            },
          },
          put: {
            operationId: 'update12',
            responses: {
              200: {
                description: 'OK',
              },
            },
          },
          delete: {
            operationId: 'delete12',
            responses: {
              200: {
                description: 'OK',
              },
            },
          },
        },
        '/api/v1/1/2/{x}': {
          get: {
            operationId: 'get12x',
            responses: {
              200: {
                description: 'OK',
              },
            },
          },
          put: {
            operationId: 'update12x',
            responses: {
              200: {
                description: 'OK',
              },
            },
          },
          delete: {
            operationId: 'delete12x',
            responses: {
              200: {
                description: 'OK',
              },
            },
          },
        },
        '/api/v1/987': {
          get: {
            operationId: 'get121',
            responses: {
              200: {
                description: 'OK',
              },
            },
          },
          put: {
            operationId: 'update987',
            responses: {
              200: {
                description: 'OK',
              },
            },
          },
          delete: {
            operationId: 'delete121',
            responses: {
              200: {
                description: 'OK',
              },
            },
          },
        },
      },
    },
  })

  it('generate items by path without options', () => {
    const result = sidebar.itemsByPaths()

    expect(
      cleanResult(result),
    ).toEqual([
      {
        collapsed: false,
        items: [
          {
            collapsed: false,
            items: [
              {
                link: '/operations/get1',
              },
              {
                link: '/operations/create1',
              },
              {
                collapsed: false,
                items: [
                  {
                    link: '/operations/get12',
                  },
                  {
                    link: '/operations/update12',
                  },
                  {
                    link: '/operations/delete12',
                  },
                  {
                    collapsed: false,
                    items: [
                      {
                        link: '/operations/get12x',
                      },
                      {
                        link: '/operations/update12x',
                      },
                      {
                        link: '/operations/delete12x',
                      },
                    ],
                    text: '/{x}',
                  },
                ],
                text: '/2',
              },
            ],
            text: '/1',
          },
          {
            collapsed: false,
            items: [
              {
                link: '/operations/get121',
              },
              {
                link: '/operations/update987',
              },
              {
                link: '/operations/delete121',
              },
            ],
            text: '/987',
          },
        ],
        text: '/api/v1',
      },
    ])
  })

  it('generate items by path with startsWith option', () => {
    const result = sidebar.itemsByPaths({
      startsWith: '/api/v1',
    })

    expect(
      cleanResult(result),
    ).toEqual([
      {
        collapsed: false,
        items: [
          {
            collapsed: false,
            items: [
              {
                link: '/operations/get1',
              },
              {
                link: '/operations/create1',
              },
              {
                collapsed: false,
                items: [
                  {
                    link: '/operations/get12',
                  },
                  {
                    link: '/operations/update12',
                  },
                  {
                    link: '/operations/delete12',
                  },
                  {
                    collapsed: false,
                    items: [
                      {
                        link: '/operations/get12x',
                      },
                      {
                        link: '/operations/update12x',
                      },
                      {
                        link: '/operations/delete12x',
                      },
                    ],
                    text: '/{x}',
                  },
                ],
                text: '/2',
              },
            ],
            text: '/1',
          },
          {
            collapsed: false,
            items: [
              {
                link: '/operations/get121',
              },
              {
                link: '/operations/update987',
              },
              {
                link: '/operations/delete121',
              },
            ],
            text: '/987',
          },
        ],
        text: '/api/v1',
      },
    ])
  })

  it('generate items by path without collapsed option', () => {
    const result = sidebar.itemsByPaths({
      collapsible: false,
    })

    expect(
      cleanResult(result),
    ).toEqual([
      {
        text: '/api/v1',
        items: [
          {
            text: '/1',
            items: [
              {
                link: '/operations/get1',
              },
              {
                link: '/operations/create1',
              },
              {
                text: '/2',
                items: [
                  {
                    link: '/operations/get12',
                  },
                  {
                    link: '/operations/update12',
                  },
                  {
                    link: '/operations/delete12',
                  },
                  {
                    text: '/{x}',
                    items: [
                      {
                        link: '/operations/get12x',
                      },
                      {
                        link: '/operations/update12x',
                      },
                      {
                        link: '/operations/delete12x',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            text: '/987',
            items: [
              {
                link: '/operations/get121',
              },
              {
                link: '/operations/update987',
              },
              {
                link: '/operations/delete121',
              },
            ],
          },
        ],
      },
    ])
  })

  it('generate items witn linkPrefix option', () => {
    const result = sidebar.itemsByPaths({
      linkPrefix: '/custom-prefix/',
      collapsible: false,
    })

    expect(
      cleanResult(result),
    ).toEqual([
      {
        text: '/api/v1',
        items: [
          {
            text: '/1',
            items: [
              {
                link: '/custom-prefix/get1',
              },
              {
                link: '/custom-prefix/create1',
              },
              {
                text: '/2',
                items: [
                  {
                    link: '/custom-prefix/get12',
                  },
                  {
                    link: '/custom-prefix/update12',
                  },
                  {
                    link: '/custom-prefix/delete12',
                  },
                  {
                    text: '/{x}',
                    items: [
                      {
                        link: '/custom-prefix/get12x',
                      },
                      {
                        link: '/custom-prefix/update12x',
                      },
                      {
                        link: '/custom-prefix/delete12x',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            text: '/987',
            items: [
              {
                link: '/custom-prefix/get121',
              },
              {
                link: '/custom-prefix/update987',
              },
              {
                link: '/custom-prefix/delete121',
              },
            ],
          },
        ],
      },
    ])
  })

  it('generate items by path with depth 4', () => {
    const result = sidebar.itemsByPaths({
      depth: 4,
    })

    expect(
      cleanResult(result),
    ).toEqual([
      {
        collapsed: false,
        items: [
          {
            collapsed: false,
            items: [
              {
                link: '/operations/get1',
              },
              {
                link: '/operations/create1',
              },
              {
                collapsed: false,
                items: [
                  {
                    link: '/operations/get12',
                  },
                  {
                    link: '/operations/update12',
                  },
                  {
                    link: '/operations/delete12',
                  },
                  {
                    collapsed: false,
                    items: [
                      {
                        link: '/operations/get12x',
                      },
                      {
                        link: '/operations/update12x',
                      },
                      {
                        link: '/operations/delete12x',
                      },
                    ],
                    text: '/{x}',
                  },
                ],
                text: '/2',
              },
            ],
            text: '/1',
          },
          {
            collapsed: false,
            items: [
              {
                link: '/operations/get121',
              },
              {
                link: '/operations/update987',
              },
              {
                link: '/operations/delete121',
              },
            ],
            text: '/987',
          },
        ],
        text: '/api/v1',
      },
    ])
  })

  it('generate items by path with depth 3', () => {
    const result = sidebar.itemsByPaths({
      depth: 3,
    })

    expect(
      cleanResult(result),
    ).toEqual([
      {
        collapsed: false,
        items: [
          {
            collapsed: false,
            items: [
              {
                link: '/operations/get1',
              },
              {
                link: '/operations/create1',
              },
              {
                collapsed: false,
                items: [
                  {
                    link: '/operations/get12',
                  },
                  {
                    link: '/operations/update12',
                  },
                  {
                    link: '/operations/delete12',
                  },
                ],
                text: '/2',
              },
              {
                collapsed: false,
                items: [
                  {
                    link: '/operations/get12x',
                  },
                  {
                    link: '/operations/update12x',
                  },
                  {
                    link: '/operations/delete12x',
                  },
                ],
                text: '/2/{x}',
              },
            ],
            text: '/1',
          },
          {
            collapsed: false,
            items: [
              {
                link: '/operations/get121',
              },
              {
                link: '/operations/update987',
              },
              {
                link: '/operations/delete121',
              },
            ],
            text: '/987',
          },
        ],
        text: '/api/v1',
      },
    ])
  })

  it('generate items by path with depth 2', () => {
    const result = sidebar.itemsByPaths({
      depth: 2,
    })

    expect(
      cleanResult(result),
    ).toEqual([
      {
        collapsed: false,
        text: '/api/v1',
        items: [
          {
            collapsed: false,
            text: '/1',
            items: [
              {
                link: '/operations/get1',
              },
              {
                link: '/operations/create1',
              },
            ],
          },
          {
            collapsed: false,
            text: '/1/2',
            items: [
              {
                link: '/operations/get12',
              },
              {
                link: '/operations/update12',
              },
              {
                link: '/operations/delete12',
              },

            ],
          },
          {
            collapsed: false,
            text: '/1/2/{x}',
            items: [
              {
                link: '/operations/get12x',
              },
              {
                link: '/operations/update12x',
              },
              {
                link: '/operations/delete12x',
              },
            ],
          },
          {
            collapsed: false,
            text: '/987',
            items: [
              {
                link: '/operations/get121',
              },
              {
                link: '/operations/update987',
              },
              {
                link: '/operations/delete121',
              },
            ],
          },
        ],
      },
    ])
  })

  it('generate items by path with depth 1', () => {
    const result = sidebar.itemsByPaths({
      depth: 1,
    })

    expect(
      cleanResult(result),
    ).toEqual([
      {
        collapsed: false,
        text: '/api/v1/1',
        items: [
          {
            link: '/operations/get1',
          },
          {
            link: '/operations/create1',
          },
        ],
      },
      {
        collapsed: false,
        text: '/api/v1/1/2',
        items: [
          {
            link: '/operations/get12',
          },
          {
            link: '/operations/update12',
          },
          {
            link: '/operations/delete12',
          },

        ],
      },
      {
        collapsed: false,
        text: '/api/v1/1/2/{x}',
        items: [
          {
            link: '/operations/get12x',
          },
          {
            link: '/operations/update12x',
          },
          {
            link: '/operations/delete12x',
          },
        ],
      },
      {
        collapsed: false,
        text: '/api/v1/987',
        items: [
          {
            link: '/operations/get121',
          },
          {
            link: '/operations/update987',
          },
          {
            link: '/operations/delete121',
          },
        ],
      },
    ])
  })

  it('generate items witn sidebarGroupTemplate', () => {
    const result = sidebar.itemsByPaths({
      sidebarGroupTemplate: (path: string, depth: number) => `${depth} - ${path}`,
      collapsible: false,
    })

    expect(
      cleanResult(result),
    ).toEqual([
      {
        text: '1 - /api/v1',
        items: [
          {
            text: '2 - /api/v1/1',
            items: [
              {
                link: '/operations/get1',
              },
              {
                link: '/operations/create1',
              },
              {
                text: '3 - /api/v1/1/2',
                items: [
                  {
                    link: '/operations/get12',
                  },
                  {
                    link: '/operations/update12',
                  },
                  {
                    link: '/operations/delete12',
                  },
                  {
                    text: '4 - /api/v1/1/2/{x}',
                    items: [
                      {
                        link: '/operations/get12x',
                      },
                      {
                        link: '/operations/update12x',
                      },
                      {
                        link: '/operations/delete12x',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            text: '2 - /api/v1/987',
            items: [
              {
                link: '/operations/get121',
              },
              {
                link: '/operations/update987',
              },
              {
                link: '/operations/delete121',
              },
            ],
          },
        ],
      },
    ])
  })
})

describe('itemsByPaths with real spec', () => {
  const sidebar = useSidebar({
    spec: realSpec,
  })

  it('test no options', () => {
    const result = sidebar.itemsByPaths()

    expect(
      cleanResult(result),
    ).toEqual([
      {
        collapsed: false,
        items: [
          {
            collapsed: false,
            items: [
              {
                link: '/operations/getAllArtists',
              },
              {
                link: '/operations/createArtist',
              },
              {
                collapsed: false,
                items: [
                  {
                    link: '/operations/getArtist',
                  },
                  {
                    link: '/operations/updateArtist',
                  },
                  {
                    link: '/operations/deleteArtist',
                  },
                  {
                    collapsed: false,
                    items: [
                      {
                        link: '/operations/getAllAlbums',
                      },
                      {
                        link: '/operations/createAlbum',
                      },
                    ],
                    text: '/albums',
                  },
                ],
                text: '/{artistId}',
              },
            ],
            text: '/artists',
          },
          {
            collapsed: false,
            items: [
              {
                link: '/operations/createUser',
              },
            ],
            text: '/user/signup',
          },
        ],
        text: '/api/v1',
      },
    ])
  })

  it('test depth 3', () => {
    const result = sidebar.itemsByPaths({
      depth: 3,
    })

    expect(
      cleanResult(result),
    ).toEqual([
      {
        collapsed: false,
        items: [
          {
            collapsed: false,
            items: [
              {
                link: '/operations/getAllArtists',
              },
              {
                link: '/operations/createArtist',
              },
              {
                collapsed: false,
                items: [
                  {
                    link: '/operations/getArtist',
                  },
                  {
                    link: '/operations/updateArtist',
                  },
                  {
                    link: '/operations/deleteArtist',
                  },
                ],
                text: '/{artistId}',
              },
              {
                collapsed: false,
                items: [
                  {
                    link: '/operations/getAllAlbums',
                  },
                  {
                    link: '/operations/createAlbum',
                  },
                ],
                text: '/{artistId}/albums',
              },
            ],
            text: '/artists',
          },
          {
            collapsed: false,
            items: [
              {
                link: '/operations/createUser',
              },
            ],
            text: '/user/signup',
          },
        ],
        text: '/api/v1',
      },
    ])
  })

  it('test depth 2', () => {
    const result = sidebar.itemsByPaths({
      depth: 2,
    })

    expect(
      cleanResult(result),
    ).toEqual([
      {
        collapsed: false,
        items: [
          {
            collapsed: false,
            items: [
              {
                link: '/operations/getAllArtists',
              },
              {
                link: '/operations/createArtist',
              },
            ],
            text: '/artists',
          },
          {
            collapsed: false,
            items: [
              {
                link: '/operations/getArtist',
              },
              {
                link: '/operations/updateArtist',
              },
              {
                link: '/operations/deleteArtist',
              },
            ],
            text: '/artists/{artistId}',
          },
          {
            collapsed: false,
            items: [
              {
                link: '/operations/getAllAlbums',
              },
              {
                link: '/operations/createAlbum',
              },
            ],
            text: '/artists/{artistId}/albums',
          },
          {
            collapsed: false,
            items: [
              {
                link: '/operations/createUser',
              },
            ],
            text: '/user/signup',
          },
        ],
        text: '/api/v1',
      },
    ])
  })

  it('test depth 1', () => {
    const result = sidebar.itemsByPaths({
      depth: 1,
    })

    expect(
      cleanResult(result),
    ).toEqual([
      {
        collapsed: false,
        items: [
          {
            link: '/operations/getAllArtists',
          },
          {
            link: '/operations/createArtist',
          },
        ],
        text: '/api/v1/artists',
      },
      {
        collapsed: false,
        items: [
          {
            link: '/operations/getArtist',
          },
          {
            link: '/operations/updateArtist',
          },
          {
            link: '/operations/deleteArtist',
          },
        ],
        text: '/api/v1/artists/{artistId}',
      },
      {
        collapsed: false,
        items: [
          {
            link: '/operations/getAllAlbums',
          },
          {
            link: '/operations/createAlbum',
          },
        ],
        text: '/api/v1/artists/{artistId}/albums',
      },
      {
        collapsed: false,
        items: [
          {
            link: '/operations/createUser',
          },
        ],
        text: '/api/v1/user/signup',
      },
    ])
  })
})
