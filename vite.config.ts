import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue(),
  ],
  build: {
    lib: {
      entry: {
        client: resolve(__dirname, 'src/client.ts'),
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
      },
    },
  },
})
