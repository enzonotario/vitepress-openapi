import type { OpenAPIDocument } from '../../types'
import type { OpenApiSpecInstance } from '../spec/createOpenApiSpec'
import type { OperationToMarkdownOptions } from './operationToMarkdown'
import slugify from '@sindresorhus/slugify'
import { parseOpenapi } from '../parser/parseOpenapi'
import { createOpenApiSpec } from '../spec/createOpenApiSpec'
import { parseSpec } from '../utils/parseSpec'
import { markdownToPlainText } from './markdownToPlainText'
import { heading, inlineCode, sanitizeFileName, frontmatter as toFrontmatter } from './markdownUtils'
import { describeSecurityScheme, operationToMarkdown, rewriteOperationLinks } from './operationToMarkdown'

export interface GenerateMarkdownFilesOptions extends Omit<OperationToMarkdownOptions, 'headingLevel'> {
  /**
   * One file per operation (`{operationId}.md`) or per tag (`{tag-slug}.md`).
   * @default 'operation'
   */
  groupBy?: 'operation' | 'tag'
  /**
   * Prefix of the links in `llms.txt` (e.g. `/api/` or `https://example.com/api/`).
   * @default '/'
   */
  linkPrefix?: string
  /**
   * Also generate `llms.txt` and `llms-full.txt` (https://llmstxt.org).
   * @default true
   */
  llms?: boolean
  /**
   * Add VitePress frontmatter (title, description, outline) and wrap the content
   * in `::: v-pre` so `{{ }}` in descriptions is not compiled by Vue.
   * @default true
   */
  frontmatter?: boolean
  /**
   * Tag for operations without tags.
   * @default 'Default'
   */
  defaultTag?: string
}

export interface MarkdownFile {
  /** Path relative to the output directory, e.g. `getPet.md`. */
  path: string
  content: string
}

export interface OperationEntry {
  operationId: string
  method: string
  path: string
  summary: string
  description: string
  tags: string[]
}

export interface TagGroup {
  name: string
  description: string
  fileName: string
  operations: OperationEntry[]
}

const RESERVED_FILE_NAMES = ['index', 'llms', 'llms-full']
const DESCRIPTION_MAX_LENGTH = 160

/**
 * Generates plain Markdown files from an OpenAPI document, without touching the
 * file system. Returns the files to write, with paths relative to the output directory.
 */
export async function generateMarkdownFiles(
  spec: OpenAPIDocument | string | OpenApiSpecInstance,
  options: GenerateMarkdownFilesOptions = {},
): Promise<MarkdownFile[]> {
  const {
    groupBy = 'operation',
    linkPrefix = '/',
    llms = true,
    frontmatter = true,
    defaultTag = 'Default',
    ...operationOptions
  } = options

  const { openapi, operations, groups } = prepareMarkdownSpec(spec, defaultTag)

  const operationFileNames = new Map(
    createUniqueNames(operations.map(operation => operation.operationId))
      .map((name, index) => [operations[index], name]),
  )
  const tagFileNames = createUniqueNames(groups.map(group => slugify(group.name, { decamelize: false })))
  groups.forEach((group, index) => {
    group.fileName = tagFileNames[index]
  })

  const fileFor = (operation: OperationEntry, group: TagGroup) => {
    return groupBy === 'tag' ? `${group.fileName}.md` : `${operationFileNames.get(operation)}.md`
  }

  // Links between operations point to the generated files (relative, same directory).
  const operationLink = operationOptions.operationLink === false
    ? false
    : {
        href: (operationId: string) => {
          const group = groups.find(group => group.operations.some(operation => operation.operationId === operationId))
          const operation = group?.operations.find(operation => operation.operationId === operationId)
          return group && operation ? `./${encodeURI(fileFor(operation, group))}` : undefined
        },
        ...operationOptions.operationLink,
      }

  // Tag and API descriptions can link to operations too.
  const rewriteLinks = (markdown: string) => {
    return operationLink === false ? markdown : rewriteOperationLinks(markdown, openapi, operationLink)
  }
  groups.forEach((group) => {
    group.description = rewriteLinks(group.description)
  })

  // Rendered once per heading level: an operation can belong to several tags.
  const rendered = new Map<string, string>()
  const render = async (operation: OperationEntry, headingLevel: number) => {
    const key = `${headingLevel}:${operation.operationId}`
    if (!rendered.has(key)) {
      rendered.set(key, await operationToMarkdown(openapi, operation.operationId, { ...operationOptions, operationLink, headingLevel }))
    }
    return rendered.get(key) ?? ''
  }

  const files: MarkdownFile[] = []
  const page = (path: string, data: Record<string, unknown>, body: string) => {
    files.push({
      path,
      content: frontmatter
        ? `${toFrontmatter(data)}\n\n::: v-pre\n\n${body}\n\n:::\n`
        : `${body}\n`,
    })
  }

  if (groupBy === 'tag') {
    for (const group of groups) {
      const sections: string[] = []
      for (const operation of group.operations) {
        sections.push(await render(operation, 2))
      }
      page(`${group.fileName}.md`, {
        title: group.name,
        description: plainText(group.description),
        outline: [2, 3],
      }, renderTagMarkdown(group, sections))
    }
  }
  else {
    for (const operation of operations) {
      page(`${operationFileNames.get(operation)}.md`, {
        title: operation.summary,
        description: plainText(operation.description),
        outline: [2, 3],
      }, await render(operation, 1))
    }
  }

  const info = openapi.getInfo() ?? {}

  page('index.md', {
    title: String(info.title || 'API Reference'),
    description: plainText(info.description),
  }, renderIndex(openapi, groups, {
    // Relative links: the files are in the same directory.
    operationUrl: groupBy === 'operation' ? (operation, group) => `./${encodeURI(fileFor(operation, group))}` : undefined,
    tagUrl: groupBy === 'tag' ? group => `./${encodeURI(`${group.fileName}.md`)}` : undefined,
    openapiUrl: operationOptions.openapiUrl,
    rewriteLinks,
  }))

  if (llms) {
    files.push({
      path: 'llms.txt',
      content: renderLlmsTxt(openapi, groups, {
        operationUrl: (operation, group) => joinLink(linkPrefix, fileFor(operation, group)),
        fullUrl: joinLink(linkPrefix, 'llms-full.txt'),
        openapiUrl: operationOptions.openapiUrl,
      }),
    })
    const sections: string[] = []
    for (const operation of operations) {
      sections.push(await render(operation, 1))
    }
    files.push({ path: 'llms-full.txt', content: renderLlmsFull(openapi, sections) })
  }

  return files
}

/**
 * Parses the spec (unless it is already an instance) and lists its operations grouped by tag.
 */
export function prepareMarkdownSpec(spec: OpenAPIDocument | string | OpenApiSpecInstance, defaultTag = 'Default'): {
  openapi: OpenApiSpecInstance
  operations: OperationEntry[]
  groups: TagGroup[]
} {
  const openapi = toOpenApiSpecInstance(spec, defaultTag)
  const operations = getOperations(openapi)
  return { openapi, operations, groups: getTagGroups(openapi, operations, defaultTag) }
}

function toOpenApiSpecInstance(spec: OpenAPIDocument | string | OpenApiSpecInstance, defaultTag: string): OpenApiSpecInstance {
  if (spec && typeof spec === 'object' && typeof (spec as OpenApiSpecInstance).getOperation === 'function') {
    return spec as OpenApiSpecInstance
  }

  // Parsing mutates the document (missing operationIds, tags...), so work on a copy.
  const document = typeof spec === 'string' ? spec : structuredClone(spec as OpenAPIDocument)
  const parsed = parseOpenapi().parseSync({ spec: document, defaultTag })
  if (!parsed?.openapi || !parsed.paths) {
    throw new Error('[vitepress-openapi] Invalid OpenAPI document: only OpenAPI 3.x is supported.')
  }

  return createOpenApiSpec({ spec: parsed, originalSpec: parseSpec(spec as OpenAPIDocument | string) })
}

function getOperations(openapi: OpenApiSpecInstance): OperationEntry[] {
  // Empty operation link texts (`[](/operations/id)`) would vanish from plain-text descriptions.
  const describe = (description: unknown) => rewriteOperationLinks(String(description ?? ''), openapi)

  return openapi.getPathsByVerbs()
    .filter(entry => entry?.operationId)
    .map(entry => ({
      operationId: String(entry.operationId),
      method: String(entry.verb),
      path: String(entry.path),
      summary: String(entry.summary || `${String(entry.verb).toUpperCase()} ${entry.path}`),
      description: describe(entry.description),
      tags: entry.tags ?? [],
    }))
}

function getTagGroups(openapi: OpenApiSpecInstance, operations: OperationEntry[], defaultTag: string): TagGroup[] {
  const groups: TagGroup[] = openapi.getFilteredTags()
    .filter(tag => tag.name)
    .map(tag => ({
      name: String(tag.name),
      description: tag.description ?? '',
      fileName: '',
      operations: operations.filter(operation => operation.tags.includes(String(tag.name))),
    }))

  // Only reachable with an unparsed spec instance: parsing assigns `defaultTag`.
  const untagged = operations.filter(operation => operation.tags.length === 0)
  if (untagged.length) {
    const existing = groups.find(group => group.name === defaultTag)
    if (existing) {
      existing.operations.push(...untagged)
    }
    else {
      groups.push({ name: defaultTag, description: '', fileName: '', operations: untagged })
    }
  }

  return groups.filter(group => group.operations.length > 0)
}

/**
 * Sanitized, unique (case-insensitive) file names that don't clash with index/llms files.
 */
function createUniqueNames(values: string[]): string[] {
  const used = new Set(RESERVED_FILE_NAMES)
  return values.map((value) => {
    const base = sanitizeFileName(value)
    let name = base
    let suffix = 2
    while (used.has(name.toLowerCase())) {
      name = `${base}-${suffix++}`
    }
    used.add(name.toLowerCase())
    return name
  })
}

function plainText(markdown: string | undefined | null): string {
  return markdownToPlainText(markdown, { maxLength: DESCRIPTION_MAX_LENGTH })
}

function joinLink(prefix: string, file: string): string {
  return `${prefix.endsWith('/') ? prefix : `${prefix}/`}${encodeURI(file)}`
}

function endpoint(operation: OperationEntry): string {
  return `${operation.method.toUpperCase()} ${operation.path}`
}

export interface IndexLinks {
  /** URL of an operation's file, or `undefined` to list it without a link. */
  operationUrl?: (operation: OperationEntry, group: TagGroup) => string | undefined
  /** URL of a tag's file. When set, operations are nested under a link to it. */
  tagUrl?: (group: TagGroup) => string | undefined
  openapiUrl?: string
  /** Applied to the API description (e.g. to rewrite operation links). */
  rewriteLinks?: (markdown: string) => string
}

/**
 * API overview: title, version, description, servers, security schemes and operations grouped by tag.
 */
export function renderIndex(openapi: OpenApiSpecInstance, groups: TagGroup[], links: IndexLinks = {}): string {
  const info = openapi.getInfo() ?? {}
  const blocks = [heading(1, String(info.title || 'API Reference'))]

  if (info.version) {
    blocks.push(`Version: ${inlineCode(info.version)}`)
  }

  if (info.description) {
    const description = String(info.description).trim()
    blocks.push(links.rewriteLinks ? links.rewriteLinks(description) : description)
  }

  if (links.openapiUrl) {
    blocks.push(`OpenAPI specification: [${links.openapiUrl}](${links.openapiUrl})`)
  }

  const servers = openapi.getServers()
  if (servers.length) {
    blocks.push(
      heading(2, 'Servers'),
      servers.map(server => `- ${inlineCode(server.url)}${server.description ? `: ${server.description}` : ''}`).join('\n'),
    )
  }

  const securitySchemes = Object.entries(openapi.getSpec().components?.securitySchemes ?? {})
  if (securitySchemes.length) {
    blocks.push(
      // Not "Authentication": a tag often has that name.
      heading(2, 'Security schemes'),
      securitySchemes.map(([name, scheme]) => `- ${inlineCode(name)}: ${describeSecurityScheme(scheme)}`).join('\n'),
    )
  }

  for (const group of groups) {
    blocks.push(heading(2, group.name))
    if (group.description) {
      blocks.push(group.description.trim())
    }

    const tagUrl = links.tagUrl?.(group)
    const indent = tagUrl ? '  ' : ''
    const lines = group.operations.map((operation) => {
      const url = links.operationUrl?.(operation, group)
      const title = url ? `[${operation.summary}](${url})` : operation.summary
      return `${indent}- ${title} ${inlineCode(endpoint(operation))}`
    })
    blocks.push((tagUrl ? [`- [${group.name}](${tagUrl})`, ...lines] : lines).join('\n'))
  }

  return blocks.join('\n\n')
}

/**
 * A tag page: tag name, description and its rendered operations (one heading level down).
 */
export function renderTagMarkdown(group: TagGroup, operations: string[]): string {
  return [heading(1, group.name), group.description?.trim(), ...operations].filter(Boolean).join('\n\n')
}

function llmsSummary(openapi: OpenApiSpecInstance): string {
  const info = openapi.getInfo() ?? {}
  const description = markdownToPlainText(rewriteOperationLinks(String(info.description ?? ''), openapi), { maxLength: 300 })
  if (description) {
    return description
  }
  return `API reference for ${info.title || 'this API'}${info.version ? ` (version ${info.version})` : ''}.`
}

export interface LlmsTxtLinks {
  /** URL of an operation's Markdown file. */
  operationUrl: (operation: OperationEntry, group: TagGroup) => string
  /** URL of `llms-full.txt`. */
  fullUrl: string
  openapiUrl?: string
  /** URL of the API overview, listed first. */
  overviewUrl?: string
  /** URL of a tag's file, listed first in its section. */
  tagUrl?: (group: TagGroup) => string | undefined
}

/**
 * `llms.txt` (https://llmstxt.org): title, summary and one link per operation, grouped by tag.
 */
export function renderLlmsTxt(openapi: OpenApiSpecInstance, groups: TagGroup[], links: LlmsTxtLinks): string {
  const info = openapi.getInfo() ?? {}
  const blocks = [
    heading(1, String(info.title || 'API Reference')),
    `> ${llmsSummary(openapi)}`,
  ]

  const details = [
    links.overviewUrl && `[Overview](${links.overviewUrl}): API description, servers, authentication and all operations`,
    info.version && `Version: ${info.version}`,
    openapi.getServers()[0]?.url && `Base URL: ${openapi.getServers()[0].url}`,
  ].filter(Boolean)
  if (details.length) {
    blocks.push(details.map(detail => `- ${detail}`).join('\n'))
  }

  for (const group of groups) {
    const tagUrl = links.tagUrl?.(group)
    const lines = group.operations.map((operation) => {
      const description = markdownToPlainText(operation.description, { maxLength: DESCRIPTION_MAX_LENGTH })
      const notes = `${endpoint(operation)}${description ? ` - ${description}` : ''}`
      return `- [${operation.summary}](${links.operationUrl(operation, group)}): ${notes}`
    })
    if (tagUrl) {
      lines.unshift(`- [${group.name}](${tagUrl}): all ${group.name} operations in a single file`)
    }
    blocks.push(heading(2, group.name), lines.join('\n'))
  }

  blocks.push(
    heading(2, 'Optional'),
    [
      `- [Full documentation](${links.fullUrl}): all operations in a single file`,
      links.openapiUrl && `- [OpenAPI specification](${links.openapiUrl}): machine-readable source of truth`,
    ].filter(Boolean).join('\n'),
  )

  return `${blocks.join('\n\n')}\n`
}

/**
 * `llms-full.txt`: title and summary, then every rendered operation.
 */
export function renderLlmsFull(openapi: OpenApiSpecInstance, operations: string[]): string {
  const title = String(openapi.getInfo()?.title || 'API Reference')
  return `${[`${heading(1, title)}\n\n> ${llmsSummary(openapi)}`, ...operations].join('\n\n---\n\n')}\n`
}
