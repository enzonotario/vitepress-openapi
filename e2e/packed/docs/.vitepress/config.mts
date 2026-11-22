import { defineConfig } from 'vitepress'

// No `ssr.noExternal`: vitepress-openapi must build as an external dependency of the SSR bundle.
export default defineConfig({
  title: 'vitepress-openapi packed',
})
