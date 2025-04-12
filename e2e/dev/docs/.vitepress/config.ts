import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitepress'
import { useSidebar } from 'vitepress-openapi'
import { examplesPages, testsPages } from '../../../../docs/pages'
import spec from '../../../../docs/public/openapi.json'

const sidebar = useSidebar({
  spec,
  // Optionally, you can specify a link prefix for all generated sidebar items.
  linkPrefix: '/operations/',
})

// refer https://vitepress.dev/reference/site-config for details
export default defineConfig({
  lang: 'en-US',
  title: 'VitePress OpenAPI',
  description: 'Generate VitePress API Docs from OpenAPI specifications',

  themeConfig: {
    nav: [{ text: 'API Reference', link: '/introduction' }],

    sidebar: [
      {
        text: 'Argentine Rock Legends',
        collapsed: true,
        items: [
          {
            text: 'By Tags',
            items: [
              {
                text: 'Introduction',
                link: '/introduction',
              },
              ...sidebar.itemsByTags(),
            ],
          },
          {
            text: 'By Operations',
            items: [
              ...sidebar.generateSidebarGroups(),
            ],
          },
          {
            text: 'By Paths',
            items: [
              ...sidebar.itemsByPaths(),
            ],
          },
          {
            text: 'One Page',
            items: [
              { text: 'One Page', link: '/one-page' },
              { text: 'Without Sidebar', link: '/without-sidebar' },
            ],
          },
        ],
      },
      {
        text: 'Tests',
        collapsed: true,
        items: [
          ...testsPages.map(page => ({
            text: page.label,
            link: `/tests/${page.slug}`,
          })),
        ],
      },
    ],
  },

  vite: {
    resolve: {
      alias: {
        ...(process.env.NODE_ENV === 'production'
          ? {}
          : {
              'vitepress-openapi/client': fileURLToPath(new URL('../../../../src/client', import.meta.url)),
              'vitepress-openapi/dist/style.css': fileURLToPath(new URL('../../../../dist/vitepress-openapi.css', import.meta.url)),
              'vitepress-openapi': fileURLToPath(new URL('../../../../src/index', import.meta.url)),
              '@public': fileURLToPath(new URL('../../../../docs/public', import.meta.url)),
            }),
      },
    },
  },
})
