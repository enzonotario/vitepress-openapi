import type { MarkdownFile } from '../lib/markdown/generateMarkdown'
import type { LlmsSiteOptions } from '../lib/markdown/llmsSite'
import type { SpecSource } from './generate'
import { generateLlmsSiteFiles, normalizeRoute, resolveLlmsRequest } from '../lib/markdown/llmsSite'
import { loadNodeModules, loadSpec, writeFilesSafely } from './generate'

export interface LlmsFilesOptions extends LlmsSiteOptions, SpecSource {}

/**
 * The parts of VitePress' `SiteConfig` used here (`buildEnd` receives the full one).
 */
export interface LlmsSiteConfig {
  outDir: string
  /** Source pages, e.g. `operations/getPet.md` (dynamic routes included). */
  pages?: string[]
  rewrites?: { map?: Record<string, string | undefined> }
  site?: { base?: string }
}

interface MiddlewareRequest { url?: string, method?: string }
interface MiddlewareResponse {
  statusCode: number
  setHeader: (name: string, value: string) => unknown
  end: (body?: string) => unknown
}

const RE_LLMS_FILE = /\.(?:md|txt)(?:[?#]|$)/

/**
 * Routes of the built pages (rewrites applied), or `undefined` when the config lists no pages.
 */
export function getPageRoutes(siteConfig: LlmsSiteConfig | undefined): Set<string> | undefined {
  if (!siteConfig?.pages?.length) {
    return undefined
  }
  const rewrites = siteConfig.rewrites?.map ?? {}
  return new Set(siteConfig.pages.map(page => normalizeRoute(rewrites[page] ?? page)))
}

/**
 * Writes `{route}.{extension}` next to each built operation page (and whole-spec page),
 * plus `llms.txt`/`llms-full.txt`, into `siteConfig.outDir`. Meant for VitePress `buildEnd`.
 * Returns the absolute paths of the written files.
 */
export async function generateLlmsFiles(siteConfig: LlmsSiteConfig, options: LlmsFilesOptions): Promise<string[]> {
  if (!siteConfig?.outDir) {
    throw new Error('[vitepress-openapi] `siteConfig.outDir` is required.')
  }

  const { spec, specPath, specUrl, ...siteOptions } = options
  const modules = await loadNodeModules()
  const { fs, path } = modules
  const outDir = path.resolve(siteConfig.outDir)
  const routes = getPageRoutes(siteConfig)

  // Without a page list, a route has a page when its HTML was built.
  const hasPage = routes
    ? (route: string) => routes.has(route)
    : (route: string) => fs.stat(path.join(outDir, `${route}.html`)).then(stats => stats.isFile(), () => false)

  const files = await generateLlmsSiteFiles(await loadSpec({ spec, specPath, specUrl }, modules), {
    ...siteOptions,
    base: siteConfig.site?.base ?? '/',
    hasPage,
  })

  return writeFilesSafely(outDir, files, modules)
}

/**
 * Connect middleware serving the same files on the fly (dev server). Files are generated
 * on the first matching request and cached: restart the server after changing the spec.
 */
export function createLlmsDevMiddleware(
  options: LlmsFilesOptions,
  getSiteConfig: () => LlmsSiteConfig | undefined = () => undefined,
  fallbackBase = '/',
) {
  let files: Promise<MarkdownFile[]> | undefined

  const load = async () => {
    const { spec, specPath, specUrl, ...siteOptions } = options
    const routes = getPageRoutes(getSiteConfig())
    const document = await loadSpec({ spec, specPath, specUrl }, await loadNodeModules())
    return generateLlmsSiteFiles(document, {
      ...siteOptions,
      base: getSiteConfig()?.site?.base ?? fallbackBase,
      hasPage: route => routes ? routes.has(route) : true,
    })
  }

  return async (req: MiddlewareRequest, res: MiddlewareResponse, next: (error?: unknown) => void) => {
    if ((req.method !== 'GET' && req.method !== 'HEAD') || !req.url || !RE_LLMS_FILE.test(req.url)) {
      return next()
    }

    try {
      files ??= load()
      const match = resolveLlmsRequest(req.url, getSiteConfig()?.site?.base ?? fallbackBase, await files)
      if (!match) {
        return next()
      }
      res.statusCode = 200
      res.setHeader('Content-Type', match.contentType)
      res.end(req.method === 'HEAD' ? undefined : match.body)
    }
    catch (error) {
      files = undefined
      next(error)
    }
  }
}
