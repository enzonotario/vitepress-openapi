import { existsSync, readFileSync, realpathSync } from 'node:fs'
import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    vue({
      script: {
        fs: {
          fileExists: existsSync,
          readFile: (file) => {
            try {
              return readFileSync(file, 'utf-8')
            }
            catch (error) {
              if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
                return undefined
              }
              throw error
            }
          },
          realpath: realpathSync,
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, 'src'),
    },
  },
  build: {
    target: 'es2019',
    lib: {
      entry: {
        client: resolve(import.meta.dirname, 'src/client.ts'),
        vue: resolve(import.meta.dirname, 'src/vue.ts'),
        theme: resolve(import.meta.dirname, 'src/theme.ts'),
        node: resolve(import.meta.dirname, 'src/index.ts'),
        cli: resolve(import.meta.dirname, 'src/cli.ts'),
      },
      name: 'vitepress-openapi',
      fileName: (format: string, entryName: string) => `vitepress-openapi.${entryName}.${format}.js`,
    },
    rolldownOptions: {
      external: ['vue', 'vitepress', 'vitepress/client', /^node:/],
      output: {
        globals: {
          vue: 'Vue',
        },
        banner: chunk => chunk.name === 'cli' && chunk.isEntry ? '#!/usr/bin/env node' : '',
      },
    },
  },
})
