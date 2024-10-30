import { resolve } from 'node:path'
import { useSidebar } from 'vitepress-openapi'
import spec from '../public/openapi.json' assert { type: 'json' }
import { defineConfigWithTheme } from 'vitepress'

const sidebar = useSidebar({ spec })

const gaId = 'G-ELG8ZW19X4'

export default defineConfigWithTheme({
  title: 'VitePress OpenAPI',
  description: 'Generate VitePress API Documentation from OpenAPI specs.',
  themeConfig: {
    nav: [],

    sidebar: [
      {
        text: 'Getting Started',
        link: '/guide/getting-started',
      },
      {
        text: 'Layouts',
        items: [
          {
            items: [
              {
                text: 'One Operation',
                link: '/layouts/one-operation',
              },
              {
                text: 'All Operations',
                link: '/layouts/all-operations',
              },
              {
                text: 'Sidebar Items',
                link: '/layouts/sidebar',
              },
              {
                text: 'Custom Slots',
                link: '/layouts/custom-slots',
              },
              {
                text: 'Multiple Specs',
                link: '/layouts/multiple-specs',
              },
              {
                text: 'Info and Servers',
                link: '/layouts/info-servers',
              },
            ],
          },
        ],
      },
      {
        text: 'Composables',
        items: [
          {
            items: [
              {
                text: 'useTheme',
                link: '/composables/useTheme',
              },
              {
                text: 'usePlayground',
                link: '/composables/usePlayground',
              },
            ],
          },
        ],
      },
      {
        text: 'Customizations',
        items: [
          {
            items: [
              {
                text: 'Operation Badges',
                link: '/customizations/operation-badges',
              },
            ],
          },
        ],
      },
      {
        text: 'Example',
        collapsed: true,
        items: [
          {
            text: 'Introduction',
            link: '/example/introduction',
          },
          {
            text: 'By Tags',
            items: [
              ...sidebar.itemsByTags({
                linkPrefix: '/example/tags/',
              }),
            ],
          },
          {
            text: 'By Operations',
            items: [
              ...sidebar.generateSidebarGroups({
                linkPrefix: '/example/operations/',
              }),
            ],
          },

          {
            text: 'Additional',
            items: [
              {
                text: 'One Page',
                link: '/example/one-page',
              },
              {
                text: 'Multiple Response Types',
                link: '/example/response-types',
              },
              {
                text: 'Response Statuses',
                link: '/example/response-statuses',
              },
              {
                text: 'Schemas',
                link: '/example/schemas',
              },
              {
                text: 'Parameters',
                link: '/example/parameters',
              },
            ],
          },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/enzonotario/vitepress-openapi' },
    ],

    outline: {
      level: [1, 3],
    },

    footer: {
      message: 'Released under the <a href="https://github.com/enzonotario/vitepress-openapi/blob/main/LICENSE">MIT License</a>.',
      copyright: 'Copyright © 2023-present <a href="https://enzonotario.me">Enzo Notario</a>',
    },

    search: {
      provider: 'algolia',
      options: {
        appId: 'U57RORD73L',
        apiKey: '0f569871e30000cc3a091f2ebeb76dc5',
        indexName: 'vitepress-openapi',
      },
    },
  },
  head: [
    [
      'script',
      { async: '', src: `https://www.googletagmanager.com/gtag/js?id=${gaId}` },
    ],
    [
      'script',
      {},
      `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${gaId}');`,
    ],
  ],
  vite: {
    resolve: {
      alias: {
        'vitepress-openapi': resolve(__dirname, '../../'),
        '@dev': resolve(__dirname, '../../dev'),
      },
    },
  },
})
