import { resolve } from 'node:path'
import { useSidebar } from 'vitepress-openapi'
import spec from '../public/openapi.json' assert { type: 'json' }
import { defineConfigWithTheme } from 'vitepress'

const sidebar = useSidebar({
  spec,
})

const gaId = 'G-ELG8ZW19X4'

export default defineConfigWithTheme({
  title: 'VitePress OpenAPI',
  description: 'Generate VitePress API Documentation from OpenAPI specs.',
  themeConfig: {
    nav: [
      {
        text: 'Sandbox',
        link: '/sandbox',
      },
      {
        component: 'OALocaleSelect',
      },
    ],

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
              {
                text: 'Pages by Tags',
                link: '/layouts/pages-by-tags',
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
              {
                text: 'Code Samples',
                link: '/customizations/code-samples',
              },
              {
                text: 'Operation tags slot',
                link: '/customizations/operation-tags-slot',
              },
              {
                text: 'i18n',
                link: '/customizations/i18n',
              },
            ],
          },
        ],
      },
      {
        text: 'Sandbox',
        link: '/sandbox',
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
            collapsed: true,
            items: [
              ...sidebar.itemsByTags({
                linkPrefix: '/example/tags/',
              }),
            ],
          },
          {
            text: 'By Operations',
            collapsed: true,
            items: [
              ...sidebar.generateSidebarGroups({
                linkPrefix: '/example/operations/',
              }),
            ],
          },
          {
            text: 'By Paths',
            collapsed: true,
            items: [
              ...sidebar.itemsByPaths({
                linkPrefix: '/example/operations/',
              }),
            ],
          },
          {
            text: 'By Paths Flatten',
            collapsed: true,
            items: [
              ...sidebar.itemsByPaths({
                depth: 2,
                linkPrefix: '/example/operations/',
              }),
            ],
          },
          {
            text: 'One Page',
            link: '/example/one-page',
          },
        ],
      },
      {
        text: 'Tests',
        collapsed: true,
        items: [
          {
            text: 'Response Types',
            link: '/tests/response-types',
          },
          {
            text: 'Response Statuses',
            link: '/tests/response-statuses',
          },
          {
            text: 'Schemas',
            link: '/tests/schemas',
          },
          {
            text: 'Parameters',
            link: '/tests/parameters',
          },
          {
            text: 'Security',
            link: '/tests/security',
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
