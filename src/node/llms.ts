import type { MarkdownFile } from '../lib/markdown/generateMarkdown'
import type { LlmsPageMode, LlmsSiteEntry, LlmsSiteOptions } from '../lib/markdown/llmsSite'
import type { OpenAPIDocument } from '../types'
import type { SpecSource } from './generate'
import { buildLlmsSiteEntry, getLlmsContentType, getLlmsRequestPath, joinUrl, normalizeRoute, renderLlmsPage } from '../lib/markdown/llmsSite'
import { escapeLinkLabel } from '../lib/markdown/markdownUtils'
import { parseSpec } from '../lib/utils/parseSpec'
import { loadNodeModules, loadSpec, writeFilesSafely } from './generate'

/** A built page, as passed to `resolvePage`. */
export interface LlmsPage {
  /** Route relative to the site root, without extension, e.g. `tests/schemas`. */
  route: string
  /** Params of a dynamic route (`[param].paths.js`). */
  params?: Record<string, any>
}

/** What a page renders: its spec (or the entry's spec) and which part of it. */
export interface LlmsResolvedPage extends SpecSource {
  /**
   * `'spec'`: every operation; `'operation'`: `operationId`; `'introduction'`: the overview; `'tag'`: `tag`.
   * @default 'spec'
   */
  mode?: LlmsPageMode
  operationId?: string
  tag?: string
}

export interface LlmsFilesOptions extends Omit<LlmsSiteOptions, 'operationRoute'>, SpecSource {
  /** Route of the operation pages of `spec`, with an `{operationId}` placeholder. */
  operationRoute?: string
  /**
   * Called for every built page. Return what the page renders to write `{route}.{extension}`,
   * or `undefined` to skip it. For pages that render their own spec (e.g. from route params).
   */
  resolvePage?: (page: LlmsPage) => LlmsResolvedPage | undefined | Promise<LlmsResolvedPage | undefined>
  /**
   * Heading of the `llms.txt` section listing the pages of `resolvePage`.
   * @default 'Pages'
   */
  title?: string
}

/** One options object, or several (each with its own spec), merged into one `llms.txt`. */
export type LlmsFilesInput = LlmsFilesOptions | LlmsFilesOptions[]

/**
 * The parts of VitePress' `SiteConfig` used here (`buildEnd` receives the full one).
 */
export interface LlmsSiteConfig {
  outDir: string
  /** Source pages, e.g. `operations/getPet.md` (dynamic routes included). */
  pages?: string[]
  /** Resolved dynamic routes: `path` is the page (e.g. `tests/schemas.md`). */
  dynamicRoutes?: { routes?: Array<{ path: string, params?: Record<string, any> }> }
  rewrites?: { map?: Record<string, string | undefined> }
  site?: { base?: string }
}

interface MiddlewareRequest { url?: string, method?: string }
interface MiddlewareResponse {
  statusCode: number
  setHeader: (name: string, value: string) => unknown
  end: (body?: string) => unknown
}

interface ResolvedPageFile extends MarkdownFile {
  title: string
  url: string
  entry: number
}

interface BuildContext {
  siteConfig: LlmsSiteConfig | undefined
  base: string
  extension: 'md' | 'txt'
  hasPage: (route: string) => boolean | Promise<boolean>
  loadSpec: (source: SpecSource) => Promise<OpenAPIDocument>
}

const RE_LLMS_FILE = /\.(?:md|txt)(?:[?#]|$)/
const LLMS_FILES = new Set(['llms.txt', 'llms-full.txt'])

function toEntries(input: LlmsFilesInput): LlmsFilesOptions[] {
  const entries = Array.isArray(input) ? input : [input]
  if (!entries.length) {
    throw new Error('[vitepress-openapi] At least one llms options object is required.')
  }
  for (const entry of entries) {
    if (!entry.operationRoute && !entry.resolvePage) {
      throw new Error('[vitepress-openapi] Each llms options object needs `operationRoute` or `resolvePage`.')
    }
  }
  return entries
}

function hasSpecSource(source: SpecSource): boolean {
  return !!(source.spec || source.specPath || source.specUrl)
}

/**
 * Built pages with their dynamic route params (rewrites applied), or `undefined` when the config lists no pages.
 */
export function getSitePages(siteConfig: LlmsSiteConfig | undefined): LlmsPage[] | undefined {
  if (!siteConfig?.pages?.length) {
    return undefined
  }
  const rewrites = siteConfig.rewrites?.map ?? {}
  const params = new Map((siteConfig.dynamicRoutes?.routes ?? []).map(route => [route.path, route.params]))
  return siteConfig.pages.map(page => ({ route: normalizeRoute(rewrites[page] ?? page), params: params.get(page) }))
}

/**
 * Routes of the built pages (rewrites applied), or `undefined` when the config lists no pages.
 */
export function getPageRoutes(siteConfig: LlmsSiteConfig | undefined): Set<string> | undefined {
  const pages = getSitePages(siteConfig)
  return pages ? new Set(pages.map(page => page.route)) : undefined
}

/**
 * Loads specs once per URL or path. A failed load stays cached, so it is not retried.
 */
function createSpecLoader(modules: Awaited<ReturnType<typeof loadNodeModules>>) {
  const cache = new Map<string, Promise<OpenAPIDocument>>()
  return (source: SpecSource): Promise<OpenAPIDocument> => {
    if (source.spec) {
      return Promise.resolve(parseSpec(source.spec))
    }
    const key = source.specUrl ? `url:${source.specUrl}` : `path:${modules.path.resolve(source.specPath ?? '')}`
    if (!cache.has(key)) {
      cache.set(key, loadSpec(source, modules))
    }
    return cache.get(key)!
  }
}

/** Options of an entry that apply to rendering (no routes, spec sources or `llms.txt` settings). */
function getRenderOptions(entry: LlmsFilesOptions) {
  const {
    spec: _spec,
    specPath: _specPath,
    specUrl: _specUrl,
    operationRoute: _operationRoute,
    specRoutes: _specRoutes,
    introductionRoute: _introductionRoute,
    tagRoute: _tagRoute,
    tagParam: _tagParam,
    extension: _extension,
    llmsTxt: _llmsTxt,
    resolvePage: _resolvePage,
    title: _title,
    ...renderOptions
  } = entry
  return renderOptions
}

async function renderResolvedPage(entry: LlmsFilesOptions, index: number, page: LlmsPage, ctx: BuildContext): Promise<ResolvedPageFile | undefined> {
  try {
    const resolved = await entry.resolvePage?.(page)
    if (!resolved) {
      return undefined
    }
    const source = hasSpecSource(resolved) ? resolved : entry
    if (!hasSpecSource(source)) {
      console.warn(`[vitepress-openapi] No spec for page "${page.route}": skipped.`)
      return undefined
    }
    const rendered = await renderLlmsPage(await ctx.loadSpec(source), {
      ...getRenderOptions(entry),
      mode: resolved.mode,
      operationId: resolved.operationId,
      tag: resolved.tag,
    })
    if (!rendered) {
      return undefined
    }
    const path = `${page.route}.${ctx.extension}`
    return { path, content: rendered.content, title: rendered.title, url: joinUrl(ctx.base, path), entry: index }
  }
  catch (error) {
    console.warn(`[vitepress-openapi] Could not generate Markdown for page "${page.route}": skipped.`, (error as Error)?.message ?? error)
    return undefined
  }
}

async function buildSiteEntries(entries: LlmsFilesOptions[], ctx: BuildContext): Promise<LlmsSiteEntry[]> {
  const results: LlmsSiteEntry[] = []
  for (const entry of entries) {
    if (!entry.operationRoute) {
      continue
    }
    if (!hasSpecSource(entry)) {
      throw new Error('[vitepress-openapi] `operationRoute` needs `spec`, `specPath` or `specUrl`.')
    }
    results.push(await buildLlmsSiteEntry(await ctx.loadSpec(entry), {
      ...entry,
      operationRoute: entry.operationRoute,
      extension: ctx.extension,
      base: ctx.base,
      hasPage: ctx.hasPage,
    }))
  }
  return results
}

/**
 * Every file: page files of each entry, then `llms.txt` and `llms-full.txt` merging all entries.
 * `extension` and `llmsTxt` are read from the first entry. `llms-full.txt` only includes the
 * specs of entries with `operationRoute`; pages of `resolvePage` are only linked from `llms.txt`.
 */
async function buildLlmsFiles(entries: LlmsFilesOptions[], ctx: BuildContext): Promise<MarkdownFile[]> {
  const siteEntries = await buildSiteEntries(entries, ctx)

  const pageFiles: ResolvedPageFile[] = []
  const pages = getSitePages(ctx.siteConfig) ?? []
  for (const [index, entry] of entries.entries()) {
    if (!entry.resolvePage) {
      continue
    }
    for (const page of pages) {
      const file = await renderResolvedPage(entry, index, page, ctx)
      if (file) {
        pageFiles.push(file)
      }
    }
  }

  // First file for a path wins: entry order.
  const files = new Map<string, MarkdownFile>()
  for (const file of [...siteEntries.flatMap(entry => entry.files), ...pageFiles]) {
    if (!files.has(file.path)) {
      files.set(file.path, { path: file.path, content: file.content })
    }
  }

  if (entries[0].llmsTxt !== false) {
    const pageSections = entries.flatMap((entry, index) => {
      const linked = pageFiles.filter(file => file.entry === index && files.get(file.path)?.content === file.content)
      return linked.length
        ? [`## ${entry.title ?? 'Pages'}\n\n${linked.map(file => `- [${escapeLinkLabel(file.title)}](${file.url})`).join('\n')}`]
        : []
    })
    const extraSections = [...siteEntries.slice(1).map(entry => entry.renderLlmsSection()), ...pageSections]

    if (siteEntries.length) {
      files.set('llms.txt', { path: 'llms.txt', content: siteEntries[0].renderLlmsTxt(extraSections) })
      files.set('llms-full.txt', { path: 'llms-full.txt', content: siteEntries.map(entry => entry.full).join('\n---\n\n') })
    }
    else if (extraSections.length) {
      files.set('llms.txt', { path: 'llms.txt', content: `# Documentation\n\n${extraSections.join('\n\n')}\n` })
    }
  }

  return [...files.values()]
}

/**
 * Writes `{route}.{extension}` next to each built page an entry covers (operation, whole-spec,
 * introduction, tag and `resolvePage` pages), plus `llms.txt`/`llms-full.txt`, into
 * `siteConfig.outDir`. Meant for VitePress `buildEnd`. Returns the absolute paths of the written files.
 */
export async function generateLlmsFiles(siteConfig: LlmsSiteConfig, input: LlmsFilesInput): Promise<string[]> {
  if (!siteConfig?.outDir) {
    throw new Error('[vitepress-openapi] `siteConfig.outDir` is required.')
  }

  const entries = toEntries(input)
  const modules = await loadNodeModules()
  const { fs, path } = modules
  const outDir = path.resolve(siteConfig.outDir)
  const routes = getPageRoutes(siteConfig)

  const files = await buildLlmsFiles(entries, {
    siteConfig,
    base: siteConfig.site?.base ?? '/',
    extension: entries[0].extension ?? 'md',
    // Without a page list, a route has a page when its HTML was built.
    hasPage: routes
      ? route => routes.has(route)
      : route => fs.stat(path.join(outDir, `${route}.html`)).then(stats => stats.isFile(), () => false),
    loadSpec: createSpecLoader(modules),
  })

  return writeFilesSafely(outDir, files, modules)
}

/**
 * Connect middleware serving the same files on the fly (dev server). Pages of `resolvePage` are
 * rendered on request, with the params of VitePress' dynamic routes; the other files are generated
 * on the first request. Everything is cached: restart the server after changing a spec.
 */
export function createLlmsDevMiddleware(
  input: LlmsFilesInput,
  getSiteConfig: () => LlmsSiteConfig | undefined = () => undefined,
  fallbackBase = '/',
) {
  const entries = toEntries(input)
  const extension = entries[0].extension ?? 'md'
  let loader: ((source: SpecSource) => Promise<OpenAPIDocument>) | undefined
  let siteFiles: Promise<MarkdownFile[]> | undefined
  let allFiles: Promise<MarkdownFile[]> | undefined
  const pageFiles = new Map<string, Promise<MarkdownFile | undefined>>()

  const getContext = async (): Promise<BuildContext> => {
    loader ??= createSpecLoader(await loadNodeModules())
    const siteConfig = getSiteConfig()
    const routes = getPageRoutes(siteConfig)
    return {
      siteConfig,
      base: siteConfig?.site?.base ?? fallbackBase,
      extension,
      hasPage: route => routes ? routes.has(route) : true,
      loadSpec: loader,
    }
  }

  const findPageFile = async (path: string): Promise<MarkdownFile | undefined> => {
    if (!path.endsWith(`.${extension}`)) {
      return undefined
    }
    const route = path.slice(0, -extension.length - 1)
    const page = getSitePages(getSiteConfig())?.find(page => page.route === route)
    if (!page) {
      return undefined
    }
    const ctx = await getContext()
    for (const [index, entry] of entries.entries()) {
      if (entry.resolvePage) {
        const file = await renderResolvedPage(entry, index, page, ctx)
        if (file) {
          return file
        }
      }
    }
    return undefined
  }

  const findFile = async (path: string): Promise<MarkdownFile | undefined> => {
    if (LLMS_FILES.has(path)) {
      allFiles ??= getContext().then(ctx => buildLlmsFiles(entries, ctx))
      return (await allFiles).find(file => file.path === path)
    }

    // Files of `operationRoute` entries first, like in the build.
    siteFiles ??= getContext().then(ctx => buildSiteEntries(entries, ctx)).then(results => results.flatMap(result => result.files))
    const file = (await siteFiles).find(file => file.path === path)
    if (file) {
      return file
    }

    if (!pageFiles.has(path)) {
      pageFiles.set(path, findPageFile(path))
    }
    return pageFiles.get(path)
  }

  return async (req: MiddlewareRequest, res: MiddlewareResponse, next: (error?: unknown) => void) => {
    if ((req.method !== 'GET' && req.method !== 'HEAD') || !req.url || !RE_LLMS_FILE.test(req.url)) {
      return next()
    }

    const path = getLlmsRequestPath(req.url, getSiteConfig()?.site?.base ?? fallbackBase)
    if (path === undefined) {
      return next()
    }

    try {
      const file = await findFile(path)
      if (!file) {
        return next()
      }
      res.statusCode = 200
      res.setHeader('Content-Type', getLlmsContentType(file.path))
      res.end(req.method === 'HEAD' ? undefined : file.content)
    }
    catch (error) {
      siteFiles = undefined
      allFiles = undefined
      next(error)
    }
  }
}
