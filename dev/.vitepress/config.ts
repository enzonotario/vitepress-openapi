import { resolve } from 'node:path'
import { useOpenapi, useSidebar } from 'vitepress-theme-openapi'
import { defineConfigWithTheme } from 'vitepress'
import spec from '../public/openapi.json' assert { type: 'json' }

const openapi = useOpenapi()
openapi.setSpec(spec)
const sidebar = useSidebar()

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
        text: 'With Footer',
        link: '/with-footer',
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
