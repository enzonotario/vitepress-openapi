import type { Plugin } from 'vite'
import type { LlmsFilesInput, LlmsSiteConfig } from './llms'

/**
 * Vite plugin for the VitePress dev server: answers `{base}{route}.{extension}`,
 * `{base}llms.txt` and `{base}llms-full.txt` with the generated Markdown. For builds,
 * call `generateLlmsFiles` from VitePress `buildEnd` with the same options.
 *
 * Register it before `vitepress-plugin-llms` so operation routes are served from here.
 */
export function llmsDevServer(options: LlmsFilesInput): Plugin {
  let siteConfig: LlmsSiteConfig | undefined
  let base = '/'

  return {
    name: 'vitepress-openapi:llms-dev-server',
    apply: 'serve',
    configResolved(config) {
      // VitePress exposes its site config to Vite plugins as `config.vitepress`.
      siteConfig = (config as { vitepress?: LlmsSiteConfig }).vitepress
      base = config.base
    },
    async configureServer(server) {
      // Loaded lazily: the package root entry can end up in browser bundles.
      const { createLlmsDevMiddleware } = await import('./llms')
      server.middlewares.use(createLlmsDevMiddleware(options, () => siteConfig, base))
    },
  }
}
