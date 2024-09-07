import { resolve } from 'node:path'
import { useSidebar } from 'vitepress-theme-openapi'
import { defineConfigWithTheme } from 'vitepress'
import spec from '../../docs/public/openapi.json' assert { type: 'json' }

const sidebar = useSidebar({ spec })

export default defineConfigWithTheme({
  title: 'vitepress-theme-openapi',
  description: 'OpenAPI theme for VitePress',
  themeConfig: {
    repo: 'https://github.com/enzonotario/vitepress-theme-openapi',
    outline: [1, 3],
    sidebar: [
      ...sidebar.generateSidebarGroups(),
      {
        text: 'One Page',
        link: '/one-page',
      },
      {
        text: 'Custom Slots',
        link: '/custom-slots',
      },
      {
        text: 'Multiple Specs',
        items: [
          {
            text: 'Buy Tickets',
            link: '/operations-specs/buyMuseumTickets',
          },
        ],
      },
    ],
  },
  vite: {
    resolve: {
      alias: {
        'vitepress-theme-openapi': resolve(__dirname, '../../src'),
      },
      dedupe: ['vue'], // avoid error when using dependencies that also use Vue
    },
  },
})
