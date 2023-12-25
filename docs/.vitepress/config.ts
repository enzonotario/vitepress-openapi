import { resolve } from 'path'
import { useSidebar, useOpenapi } from 'vitepress-theme-openapi'
import { defineConfigWithTheme } from 'vitepress'
import spec from '../public/openapi.json' assert { type: 'json' }

const openapi = useOpenapi()
openapi.setSpec(spec)
const sidebar = useSidebar()

export default defineConfigWithTheme({
  title: 'vitepress-theme-openapi',
  description: 'OpenAPI theme for VitePress',
  themeConfig: {
    repo: 'https://github.com/es-js/esjs',
    outline: [1, 3],
    sidebar: [
      ...sidebar.generateSidebarGroups(),
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
