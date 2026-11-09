import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import libraryConfig from '../../../vite.config'

const src = (path: string) => fileURLToPath(new URL(`../../../src/${path}`, import.meta.url))

export default defineConfig(({ mode }) => {
  // `pnpm dev:standalone` (mode "source"): use the library sources with HMR instead of the built dist.
  if (mode === 'source') {
    return {
      plugins: libraryConfig.plugins,
      resolve: {
        alias: {
          'vitepress-openapi/vue': src('vue.ts'),
          'vitepress-openapi/dist/style.css': src('theme.ts'),
          'vitepress-openapi/dist/standalone.css': src('standalone.css'),
          '@': src(''),
        },
      },
    }
  }

  return {
    plugins: [vue()],
  }
})
