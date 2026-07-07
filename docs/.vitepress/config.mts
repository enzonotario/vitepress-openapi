import { fileURLToPath } from 'node:url'
import { resolve, dirname } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import { defineConfigWithTheme } from 'vitepress'
import { createDocsSidebar } from '../docs-sidebar-config'
import { sidebarExamplesConfigs } from '../sidebar-examples-configs'

const gaId = process.env.GA_ID || 'G-TEST'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = resolve(__dirname, '../..')

export default defineConfigWithTheme({
  title: 'VitePress OpenAPI',
  description: 'Generate VitePress API Documentation from OpenAPI specs.',
  themeConfig: {
    nav: [
      {
        text: 'Showcase',
        link: '/showcase',
      },
      {
        text: 'Sandbox',
        link: '/sandbox',
      },
      {
        component: 'OALocaleSelect',
      },
    ],

    sidebar: {
      ...sidebarExamplesConfigs,
      '/': createDocsSidebar(),
    },

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
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': resolve(rootDir, 'src'),
        '@docs': resolve(rootDir, 'docs'),
        '@public': resolve(rootDir, 'docs/public'),
        ...(process.env.NODE_ENV !== 'production'
          ? {
              'vitepress-openapi/client': fileURLToPath(new URL('../../src/client', import.meta.url)),
              'vitepress-openapi/dist/style.css': fileURLToPath(new URL('../../src/theme', import.meta.url)),
              'vitepress-openapi': fileURLToPath(new URL('../../src/index', import.meta.url)),
            }
          : {}),
      },
    },
  },
})
