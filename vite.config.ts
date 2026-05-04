import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
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
    rolldownOptions: {
      external: ['vue', 'vitepress', 'vitepress/client'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
