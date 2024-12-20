import { resolve } from 'node:path'
import { useSidebar } from 'vitepress-openapi'
import { defineConfigWithTheme } from 'vitepress'
import spec from '../../docs/public/openapi.json' assert { type: 'json' }

const sidebar = useSidebar({
  spec,
  prefix: '/operations/',
})

export default defineConfigWithTheme({
  title: 'vitepress-openapi',
  description: 'Generate VitePress API Documentation from OpenAPI specs.',
  themeConfig: {
    repo: 'https://github.com/enzonotario/vitepress-openapi',
    outline: [1, 3],
    sidebar: [
      {
        text: 'By Tags',
        items: [
          {
            text: 'Introduction',
            link: '/',
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
        collapsed: true,
        items: [
          ...sidebar.itemsByPaths(),
        ],
      },
      {
        text: 'By Paths Flatten to depth 2',
        collapsed: true,
        items: [
          ...sidebar.itemsByPaths({
            depth: 2,
            sidebarItemTemplate: (method, path) => `<span class="OASidebarItem group/oaSidebarItem"><span class="OASidebarItem-badge OAMethodBadge--${method}">${method.toUpperCase()}</span></span>`,
          }),
        ],
      },
      {
        text: 'Customizations',
        items: [
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
            link: '/multiple-specs',
          },
        ],
      },
      {
        text: 'Other',
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
            text: 'Security',
            link: '/tests/security',
          },
          {
            text: 'ArgentinaDatos',
            link: '/examples/argentinadatos',
          },
          {
            text: 'CriptoYA Argentina',
            link: '/examples/criptoya-argentina',
          },
          {
            text: 'Scalar Galaxy',
            link: '/examples/scalar-galaxy',
          },
          {
            text: 'Plant Store',
            link: '/examples/plant-store',
          },
          {
            text: 'Museum',
            link: '/examples/museum',
          },
        ],
      },
    ],
    nav: [
      {
        text: 'Sandbox',
        link: '/sandbox',
      },
      {
        component: 'OALocaleSelect',
      },
    ],
  },
  vite: {
    resolve: {
      alias: {
        'vitepress-openapi': resolve(__dirname, '../../src'),
      },
      dedupe: ['vue'], // avoid error when using dependencies that also use Vue
    },
  },
})
