import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'VitePress Theme OpenAPI',
  description: 'A VitePress theme for OpenAPI',
  themeConfig: {
    nav: [],

    sidebar: [],

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
})
