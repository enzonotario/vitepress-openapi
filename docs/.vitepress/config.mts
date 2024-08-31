import { defineConfigWithTheme } from 'vitepress'
import { useSidebar } from 'vitepress-theme-openapi'
import spec from '../public/openapi.json' assert { type: 'json' }
import { resolve } from "node:path";

const sidebar = useSidebar({ spec })

export default defineConfigWithTheme({
  title: 'VitePress Theme OpenAPI',
  description: 'A VitePress theme for OpenAPI',
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
            ]
          }
        ],
      },
      {
        text: 'Example',
        items: [
          ...sidebar.generateSidebarGroups().map((group) => ({
            ...group,
            items: group.items.map((item) => ({
              ...item,
              link: `/example${item.link}`,
            })),
          })),
          {
            text: 'Additional',
            items: [
              {
                text: 'One Page',
                link: '/example/one-page',
              },
            ],
          },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/enzonotario/vitepress-theme-openapi' },
    ],

    outline: {
      level: [1, 3],
    },

    footer: {
      message: 'Released under the <a href="https://github.com/enzonotario/vitepress-theme-openapi/blob/main/LICENSE">MIT License</a>.',
      copyright: 'Copyright © 2023-present <a href="https://enzonotario.me">Enzo Notario</a>',
    },
  },
  vite: {
    resolve: {
      alias: {
        'vitepress-theme-openapi': resolve(__dirname, '../../'),
      },
    },
  },
})
