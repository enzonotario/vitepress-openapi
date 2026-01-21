import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    lib: {
      entry: {
        client: resolve(__dirname, 'src/client.ts'),
        theme: resolve(__dirname, 'src/theme.ts'),
        node: resolve(__dirname, 'src/index.ts'),
      },
      name: 'vitepress-openapi',
      fileName: (format: string, entryName: string) => `vitepress-openapi.${entryName}.${format}.js`,
    },
    rollupOptions: {
      external: ['vue', 'vitepress', 'vitepress/client'],
      output: {
        globals: {
          vue: 'Vue',
        },
         manualChunks(id) {
          // ---------- JSON EDITOR (BIGGEST WIN)
          // if (id.includes('json-editor-vue')) {
          //   return 'json-editor'
          // }

          // ---------- OPENAPI CORE
          // if (
          //   id.includes('@scalar') ||
          //   id.includes('openapi') ||
          //   id.includes('useOpenapi')
          // ) {
          //   return 'openapi-core'
          // }

          // ---------- MARKDOWN + HIGHLIGHTING
          // if (
          //   id.includes('shiki') ||
          //   id.includes('markdown-it') ||
          //   id.includes('OAMarkdown')
          // ) {
          //   return 'markdown'
          // }

          // ---------- SYNTAX GRAMMARS
          // if (
          //   id.match(/(typescript|javascript|python|php|bash)/)
          // ) {
          //   return 'syntax-langs'
          // }

          // ---------- UI / COMPONENTS
          if (id.includes('reka-ui') || id.includes('lucide')) {
            return 'ui'
          }

          // ---------- VUE CORE
          if (id.includes('node_modules/vue')) {
            return 'vue-core'
          }

          // ---------- DEFAULT
        },
      },
    },
  },
})
