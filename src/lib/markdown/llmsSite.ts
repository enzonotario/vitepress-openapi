import type { OpenAPIDocument } from '../../types'
import type { OpenApiSpecInstance } from '../spec/createOpenApiSpec'
import type { MarkdownFile, OperationEntry, TagGroup } from './generateMarkdown'
import type { OperationToMarkdownOptions } from './operationToMarkdown'
import { LLMS_FULL_SEPARATOR, llmsOperationLink, prepareMarkdownSpec, renderIndex, renderLlmsFullHeader, renderLlmsTxt } from './generateMarkdown'
import { escapeLinkLabel, heading, inlineCode } from './markdownUtils'
import { operationToMarkdown, rewriteOperationLinks } from './operationToMarkdown'

export interface LlmsSiteOptions extends Omit<OperationToMarkdownOptions, 'headingLevel' | 'operationLink'> {
  /**
   * Route of the operation pages, relative to the site root, with an `{operationId}`
   * placeholder (e.g. `'operations/{operationId}'`).
   */
  operationRoute: string
  /** Routes of pages rendering the whole spec (e.g. `OASpec`): they get every operation. */
  specRoutes?: string[]
  /** Route of the API overview page (title, servers, authentication and operations by tag). */
  introductionRoute?: string
  /**
   * Route of the tag pages, with a `{tag}` placeholder (e.g. `'tags/{tag}'`).
   * Each gets the tag description and all its operations.
   */
  tagRoute?: string
  /**
   * Value of `{tag}` for a tag name. Must match the route params of your tag pages.
   * Defaults to the tag name as is, like `usePaths().getTags()`.
   */
  tagParam?: (tag: string) => string
  /**
   * Extension of the files written next to each page.
   * @default 'md'
   */
  extension?: 'md' | 'txt'
  /**
   * Also generate `llms.txt` and `llms-full.txt` at the site root.
   * @default true
   */
  llmsTxt?: boolean
  /** Tag for operations without tags. */
  defaultTag?: string
  /**
   * Maximum size in bytes of a file with many operations (whole-spec pages, tag pages and
   * `llms-full.txt`). Above it, a summary is written instead: the overview and one line per
   * operation. `false` (or `Infinity`) disables the limit.
   * @default 5 * 1024 * 1024
   */
  maxSize?: number | false
}

export interface LlmsSiteFilesOptions extends LlmsSiteOptions {
  /**
   * Site base path, used in links.
   * @default '/'
   */
  base?: string
  /** Whether a route has a page. Routes without one get no file and no link. */
  hasPage?: (route: string) => boolean | Promise<boolean>
}

export const DEFAULT_LLMS_MAX_SIZE = 5 * 1024 * 1024

const OPERATION_ID_PLACEHOLDER = '{operationId}'
const TAG_PLACEHOLDER = '{tag}'
const RE_EDGE_SLASHES = /^\/+|\/+$/g
const RE_PAGE_EXTENSION = /\.(?:md|html)$/

/**
 * Normalizes a route: no leading/trailing slashes and no `.md`/`.html` extension.
 */
export function normalizeRoute(route: string): string {
  return route.replace(RE_EDGE_SLASHES, '').replace(RE_PAGE_EXTENSION, '')
}

/**
 * UTF-8 byte length of a string, without encoding it.
 */
export function utf8Length(text: string): number {
  let length = 0
  for (let index = 0; index < text.length; index++) {
    const code = text.charCodeAt(index)
    if (code < 0x80) {
      length += 1
    }
    else if (code < 0x800) {
      length += 2
    }
    else if (code >= 0xD800 && code <= 0xDBFF) {
      // Surrogate pair: one 4-byte character.
      length += 4
      index++
    }
    else {
      length += 3
    }
  }
  return length
}

function resolveMaxSize(maxSize: number | false | undefined): number {
  return maxSize === false ? Number.POSITIVE_INFINITY : (maxSize ?? DEFAULT_LLMS_MAX_SIZE)
}

function formatSize(bytes: number): string {
  return bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.ceil(bytes / 1024)} KB`
}

/**
 * Joins `head` and `count` parts (rendered one at a time) with `separator`, plus a final newline.
 * Stops as soon as the size exceeds `maxSize`, without building the whole string.
 */
async function joinWithinSize(
  head: string,
  count: number,
  renderPart: (index: number) => string | Promise<string>,
  separator: string,
  maxSize: number,
): Promise<{ content: string } | { exceeded: number }> {
  const parts = [head]
  let size = utf8Length(head) + 1
  for (let index = 0; index < count; index++) {
    const part = await renderPart(index)
    size += utf8Length(separator) + utf8Length(part)
    if (size > maxSize) {
      return { exceeded: size }
    }
    parts.push(part)
  }
  return { content: `${parts.join(separator)}\n` }
}

function warnSize(label: string, size: number, maxSize: number): void {
  console.warn(`[vitepress-openapi] ${label}: over ${size} bytes, more than maxSize (${maxSize} bytes): wrote a summary instead.`)
}

export interface LlmsSummaryOptions {
  /** URL of an operation's page, or `undefined` to list it as plain text. */
  operationUrl?: (operation: OperationEntry) => string | undefined
  /** Link to the full spec, in the note. */
  specUrl?: string
  openapiUrl?: string
  maxSize: number
  /** Summarize a single tag (a tag page) instead of the whole spec. */
  group?: TagGroup
}

/**
 * Summary written instead of a file over `maxSize`: a note, the overview (or the tag) and
 * one line per operation, grouped by tag.
 */
export function renderLlmsSummary(openapi: OpenApiSpecInstance, groups: TagGroup[], options: LlmsSummaryOptions): string {
  const specUrl = options.specUrl ?? options.openapiUrl
  const note = `> **Note:** the full content is larger than ${formatSize(options.maxSize)}, so only a summary of each operation is included.${
    specUrl ? ` See the [OpenAPI specification](${specUrl}) for every detail.` : ''}`

  const line = (operation: OperationEntry) => {
    const url = options.operationUrl?.(operation)
    const summary = url ? `[${escapeLinkLabel(operation.summary)}](${url})` : operation.summary
    return `- ${inlineCode(`${operation.method.toUpperCase()} ${operation.path}`)} – ${summary}`
  }

  if (options.group) {
    const group = options.group
    return `${[heading(1, group.name), note, group.description?.trim(), group.operations.map(line).join('\n')].filter(Boolean).join('\n\n')}\n`
  }

  const [title, ...overview] = renderIndex(openapi, [], { openapiUrl: options.openapiUrl }).split('\n\n')
  const sections = groups
    .filter(group => group.operations.length)
    .map(group => `${heading(2, group.name)}\n\n${group.operations.map(line).join('\n')}`)
  return `${[title, note, ...overview, ...sections].join('\n\n')}\n`
}

/**
 * `base` + `path`, each path segment percent-encoded (so `?` and `#` in a tag or operationId stay in the path).
 */
export function joinUrl(base: string, path: string): string {
  return `${base.endsWith('/') ? base : `${base}/`}${path.split('/').map(encodeURIComponent).join('/')}`
}

export interface LlmsSiteEntry {
  /** Page files (no `llms.txt`/`llms-full.txt`). */
  files: MarkdownFile[]
  /** `llms-full.txt` content: every operation of the spec, or a summary when over `maxSize`. */
  full: string
  /** Logs a warning if `full` is a summary (call it when writing `llms-full.txt`). */
  warnFull: () => void
  /** `llms.txt` content, with optional extra `## Section` blocks. */
  renderLlmsTxt: (extraSections?: string[]) => string
  /** This spec as a single `llms.txt` section, to merge it into another one. */
  renderLlmsSection: () => string
}

/**
 * Markdown files for a site: one per operation page (`{route}.{extension}`), one per
 * whole-spec page, and `llms.txt`/`llms-full.txt`. Paths are relative to the site output.
 */
export async function generateLlmsSiteFiles(
  spec: OpenAPIDocument | string | OpenApiSpecInstance,
  options: LlmsSiteFilesOptions,
): Promise<MarkdownFile[]> {
  const entry = await buildLlmsSiteEntry(spec, options)
  return options.llmsTxt === false
    ? entry.files
    : (entry.warnFull(), [
        ...entry.files,
        { path: 'llms.txt', content: entry.renderLlmsTxt() },
        { path: 'llms-full.txt', content: entry.full },
      ])
}

/**
 * Like `generateLlmsSiteFiles`, but returns the `llms.txt` parts so several specs can be merged.
 */
export async function buildLlmsSiteEntry(
  spec: OpenAPIDocument | string | OpenApiSpecInstance,
  options: LlmsSiteFilesOptions,
): Promise<LlmsSiteEntry> {
  const {
    operationRoute,
    specRoutes = [],
    introductionRoute,
    tagRoute,
    tagParam = (tag: string) => tag,
    extension = 'md',
    llmsTxt: _llmsTxt,
    base = '/',
    defaultTag,
    hasPage = () => true,
    maxSize: maxSizeOption,
    ...operationOptions
  } = options
  const maxSize = resolveMaxSize(maxSizeOption)

  if (!operationRoute?.includes(OPERATION_ID_PLACEHOLDER)) {
    throw new Error(`[vitepress-openapi] \`operationRoute\` must contain ${OPERATION_ID_PLACEHOLDER}.`)
  }
  if (tagRoute !== undefined && !tagRoute.includes(TAG_PLACEHOLDER)) {
    throw new Error(`[vitepress-openapi] \`tagRoute\` must contain ${TAG_PLACEHOLDER}.`)
  }

  const { openapi, operations, groups } = prepareMarkdownSpec(spec, defaultTag)
  const routeFor = (operationId: string) => normalizeRoute(operationRoute.replaceAll(OPERATION_ID_PLACEHOLDER, operationId))
  const urlFor = (route: string) => joinUrl(base, `${route}.${extension}`)

  const withPage = new Set<string>()
  for (const operation of operations) {
    if (await hasPage(routeFor(operation.operationId))) {
      withPage.add(operation.operationId)
    }
  }

  const tagRouteFor = (group: TagGroup) => normalizeRoute(tagRoute!.replaceAll(TAG_PLACEHOLDER, tagParam(group.name)))
  const tagsWithPage = new Set<TagGroup>()
  if (tagRoute) {
    for (const group of groups) {
      if (await hasPage(tagRouteFor(group))) {
        tagsWithPage.add(group)
      }
    }
  }
  const tagUrl = (group: TagGroup) => tagsWithPage.has(group) ? urlFor(tagRouteFor(group)) : undefined
  const operationUrl = (operation: OperationEntry) => withPage.has(operation.operationId) ? urlFor(routeFor(operation.operationId)) : undefined
  const introduction = introductionRoute ? normalizeRoute(introductionRoute) : ''
  const hasIntroduction = !!introduction && await hasPage(introduction)

  // Operation links point to sibling files; operations without a page keep their original link.
  const operationLink = {
    href: (operationId: string) => withPage.has(operationId) ? urlFor(routeFor(operationId)) : undefined,
  }
  groups.forEach((group) => {
    group.description = rewriteOperationLinks(group.description, openapi, operationLink)
  })

  const rendered = new Map<string, string>()
  for (const operation of operations) {
    rendered.set(operation.operationId, await operationToMarkdown(openapi, operation.operationId, {
      ...operationOptions,
      operationLink,
      headingLevel: 1,
    }))
  }

  const files: MarkdownFile[] = operations
    .filter(operation => withPage.has(operation.operationId))
    .map(operation => ({
      path: `${routeFor(operation.operationId)}.${extension}`,
      content: `${rendered.get(operation.operationId)}\n`,
    }))

  // `llms-full.txt` and whole-spec pages: every operation, or a summary when over `maxSize`.
  const renderedOperations = [...rendered.values()]
  const fullResult = await joinWithinSize(renderLlmsFullHeader(openapi), renderedOperations.length, index => renderedOperations[index], LLMS_FULL_SEPARATOR, maxSize)
  const full = 'content' in fullResult
    ? fullResult.content
    : renderLlmsSummary(openapi, groups, { operationUrl, openapiUrl: operationOptions.openapiUrl, maxSize })
  const warnFull = (label: string) => {
    if ('exceeded' in fullResult) {
      warnSize(label, fullResult.exceeded, maxSize)
    }
  }

  if (hasIntroduction) {
    files.push({
      path: `${introduction}.${extension}`,
      content: `${renderIndex(openapi, groups, {
        operationUrl,
        tagUrl,
        openapiUrl: operationOptions.openapiUrl,
        rewriteLinks: markdown => rewriteOperationLinks(markdown, openapi, operationLink),
      })}\n`,
    })
  }

  for (const group of tagsWithPage) {
    const path = `${tagRouteFor(group)}.${extension}`
    const result = await joinWithinSize(
      [heading(1, group.name), group.description?.trim()].filter(Boolean).join('\n\n'),
      group.operations.length,
      index => operationToMarkdown(openapi, group.operations[index].operationId, { ...operationOptions, operationLink, headingLevel: 2 }),
      '\n\n',
      maxSize,
    )
    if ('exceeded' in result) {
      warnSize(path, result.exceeded, maxSize)
    }
    files.push({
      path,
      content: 'content' in result
        ? result.content
        : renderLlmsSummary(openapi, groups, { group, operationUrl, openapiUrl: operationOptions.openapiUrl, maxSize }),
    })
  }

  for (const route of specRoutes.map(normalizeRoute)) {
    if (route && await hasPage(route)) {
      const path = `${route}.${extension}`
      warnFull(path)
      files.push({ path, content: full })
    }
  }

  // Only linked entries: operations with a page, and tags with a page or such operations.
  const linkedGroups = groups
    .filter(group => tagsWithPage.has(group) || group.operations.some(operation => withPage.has(operation.operationId)))
    .map(group => ({ ...group, operations: group.operations.filter(operation => withPage.has(operation.operationId)) }))
  const links = {
    operationUrl: (operation: OperationEntry) => urlFor(routeFor(operation.operationId)),
    overviewUrl: hasIntroduction ? urlFor(introduction) : undefined,
    tagUrl: (group: TagGroup) => tagUrl(groups.find(original => original.name === group.name)!),
    fullUrl: joinUrl(base, 'llms-full.txt'),
    openapiUrl: operationOptions.openapiUrl,
  }

  return {
    files,
    full,
    warnFull: () => warnFull('llms-full.txt'),
    renderLlmsTxt: extraSections => renderLlmsTxt(openapi, linkedGroups, { ...links, extraSections }),
    renderLlmsSection: () => {
      const lines = [
        links.overviewUrl && `- [Overview](${links.overviewUrl}): API description, servers, authentication and all operations`,
        ...linkedGroups.flatMap(group => group.operations.map(operation => llmsOperationLink(operation, links.operationUrl(operation)))),
      ].filter(Boolean)
      return [heading(2, String(openapi.getInfo()?.title || 'API Reference')), lines.join('\n')].join('\n\n')
    },
  }
}

export type LlmsPageMode = 'spec' | 'operation' | 'introduction' | 'tag'

export interface LlmsPageOptions extends Omit<OperationToMarkdownOptions, 'headingLevel' | 'operationLink'> {
  /** @default 'spec' */
  mode?: LlmsPageMode
  operationId?: string
  tag?: string
  defaultTag?: string
  /** See `LlmsSiteOptions.maxSize`. Applies to the `'spec'` and `'tag'` modes. */
  maxSize?: number | false
  /** URL of the page's spec, linked from the summary note. */
  specUrl?: string
  /** Name of the file in warnings (e.g. its route). */
  label?: string
}

/**
 * Markdown of a page that renders its own spec: the whole spec, an operation, the overview or a tag.
 * Operation links become plain text: they would point to pages of another spec.
 * Returns `undefined` when the operation or tag doesn't exist.
 */
export async function renderLlmsPage(
  spec: OpenAPIDocument | string | OpenApiSpecInstance,
  options: LlmsPageOptions = {},
): Promise<{ title: string, content: string } | undefined> {
  const { mode = 'spec', operationId, tag, defaultTag, maxSize: maxSizeOption, specUrl, label = 'page', ...operationOptions } = options
  const maxSize = resolveMaxSize(maxSizeOption)
  const { openapi, operations, groups } = prepareMarkdownSpec(spec, defaultTag)
  const operationLink = { href: () => null }
  const title = String(openapi.getInfo()?.title || 'API Reference')
  const render = (id: string, headingLevel: number) => operationToMarkdown(openapi, id, { ...operationOptions, operationLink, headingLevel })

  if (mode === 'operation') {
    const operation = operations.find(operation => operation.operationId === operationId)
    return operation ? { title: operation.summary, content: `${await render(operation.operationId, 1)}\n` } : undefined
  }

  if (mode === 'introduction') {
    const rewriteLinks = (markdown: string) => rewriteOperationLinks(markdown, openapi, operationLink)
    groups.forEach((group) => {
      group.description = rewriteLinks(group.description)
    })
    return { title, content: `${renderIndex(openapi, groups, { openapiUrl: operationOptions.openapiUrl, rewriteLinks })}\n` }
  }

  if (mode === 'tag') {
    const group = groups.find(group => group.name === tag)
    if (!group) {
      return undefined
    }
    group.description = rewriteOperationLinks(group.description, openapi, operationLink)
    const result = await joinWithinSize(
      [heading(1, group.name), group.description?.trim()].filter(Boolean).join('\n\n'),
      group.operations.length,
      index => render(group.operations[index].operationId, 2),
      '\n\n',
      maxSize,
    )
    if ('content' in result) {
      return { title: group.name, content: result.content }
    }
    warnSize(label, result.exceeded, maxSize)
    return { title: group.name, content: renderLlmsSummary(openapi, groups, { group, specUrl, openapiUrl: operationOptions.openapiUrl, maxSize }) }
  }

  const result = await joinWithinSize(renderLlmsFullHeader(openapi), operations.length, index => render(operations[index].operationId, 1), LLMS_FULL_SEPARATOR, maxSize)
  if ('content' in result) {
    return { title, content: result.content }
  }
  warnSize(label, result.exceeded, maxSize)
  return { title, content: renderLlmsSummary(openapi, groups, { specUrl, openapiUrl: operationOptions.openapiUrl, maxSize }) }
}

/**
 * Path of a request relative to the site base (decoded, without query), or `undefined`.
 */
export function getLlmsRequestPath(url: string | undefined, base: string): string | undefined {
  if (!url) {
    return undefined
  }
  let pathname: string
  try {
    pathname = decodeURIComponent(url.split(/[?#]/)[0])
  }
  catch {
    return undefined
  }
  const prefix = base.endsWith('/') ? base : `${base}/`
  return pathname.startsWith(prefix) ? pathname.slice(prefix.length) : undefined
}

export function getLlmsContentType(path: string): string {
  return path.endsWith('.md') ? 'text/markdown; charset=utf-8' : 'text/plain; charset=utf-8'
}

/**
 * Serves a generated file for a request URL (dev server). Returns `undefined` when no file matches.
 */
export function resolveLlmsRequest(
  url: string | undefined,
  base: string,
  files: MarkdownFile[],
): { body: string, contentType: string } | undefined {
  const path = getLlmsRequestPath(url, base)
  const file = path === undefined ? undefined : files.find(file => file.path === path)
  return file ? { body: file.content, contentType: getLlmsContentType(file.path) } : undefined
}
