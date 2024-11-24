import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue(),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'vitepress-openapi',
      fileName: (format: string) => `vitepress-openapi.${format}.js`,
    },
    rollupOptions: {
      external: ['vue', 'vitepress'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
