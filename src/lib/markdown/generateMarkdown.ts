import type { OpenAPIDocument } from '../../types'
import type { OpenApiSpecInstance } from '../spec/createOpenApiSpec'
import type { OperationToMarkdownOptions } from './operationToMarkdown'
import slugify from '@sindresorhus/slugify'
import { parseOpenapi } from '../parser/parseOpenapi'
import { createOpenApiSpec } from '../spec/createOpenApiSpec'
import { parseSpec } from '../utils/parseSpec'
import { markdownToPlainText } from './markdownToPlainText'
import { heading, inlineCode, sanitizeFileName, frontmatter as toFrontmatter } from './markdownUtils'
import { operationToMarkdown, rewriteOperationLinks } from './operationToMarkdown'

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

interface OperationEntry {
  operationId: string
  method: string
  path: string
  summary: string
  description: string
  tags: string[]
}

interface TagGroup {
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

  const openapi = toOpenApiSpecInstance(spec, defaultTag)
  const operations = getOperations(openapi)
  const groups = getTagGroups(openapi, operations, defaultTag)

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
      const sections = [heading(1, group.name)]
      if (group.description) {
        sections.push(group.description.trim())
      }
      for (const operation of group.operations) {
        sections.push(await render(operation, 2))
      }
      page(`${group.fileName}.md`, {
        title: group.name,
        description: plainText(group.description),
        outline: [2, 3],
      }, sections.join('\n\n'))
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
  const title = String(info.title || 'API Reference')

  page('index.md', {
    title,
    description: plainText(info.description),
  }, renderIndex(openapi, groups, groupBy, fileFor, operationOptions.openapiUrl))

  if (llms) {
    files.push({
      path: 'llms.txt',
      content: `${renderLlmsTxt(openapi, groups, fileFor, linkPrefix, operationOptions.openapiUrl)}\n`,
    })
    const sections = [`${heading(1, title)}\n\n> ${llmsSummary(openapi)}`]
    for (const operation of operations) {
      sections.push(await render(operation, 1))
    }
    files.push({
      path: 'llms-full.txt',
      content: `${sections.join('\n\n---\n\n')}\n`,
    })
  }

  return files
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

function renderIndex(
  openapi: OpenApiSpecInstance,
  groups: TagGroup[],
  groupBy: 'operation' | 'tag',
  fileFor: (operation: OperationEntry, group: TagGroup) => string,
  openapiUrl: string | undefined,
): string {
  const info = openapi.getInfo() ?? {}
  const blocks = [heading(1, String(info.title || 'API Reference'))]

  if (info.version) {
    blocks.push(`Version: ${inlineCode(info.version)}`)
  }

  if (info.description) {
    blocks.push(String(info.description).trim())
  }

  if (openapiUrl) {
    blocks.push(`OpenAPI specification: [${openapiUrl}](${openapiUrl})`)
  }

  const servers = openapi.getServers()
  if (servers.length) {
    blocks.push(
      heading(2, 'Servers'),
      servers.map(server => `- ${inlineCode(server.url)}${server.description ? `: ${server.description}` : ''}`).join('\n'),
    )
  }

  for (const group of groups) {
    blocks.push(heading(2, group.name))
    if (group.description) {
      blocks.push(group.description.trim())
    }

    const lines = groupBy === 'tag'
      ? [
          `- [${group.name}](./${encodeURI(fileFor(group.operations[0], group))})`,
          ...group.operations.map(operation => `  - ${operation.summary} ${inlineCode(endpoint(operation))}`),
        ]
      : group.operations.map(operation => `- [${operation.summary}](./${encodeURI(fileFor(operation, group))}) ${inlineCode(endpoint(operation))}`)
    blocks.push(lines.join('\n'))
  }

  return blocks.join('\n\n')
}

function llmsSummary(openapi: OpenApiSpecInstance): string {
  const info = openapi.getInfo() ?? {}
  const description = markdownToPlainText(info.description, { maxLength: 300 })
  if (description) {
    return description
  }
  return `API reference for ${info.title || 'this API'}${info.version ? ` (version ${info.version})` : ''}.`
}

function renderLlmsTxt(
  openapi: OpenApiSpecInstance,
  groups: TagGroup[],
  fileFor: (operation: OperationEntry, group: TagGroup) => string,
  linkPrefix: string,
  openapiUrl: string | undefined,
): string {
  const info = openapi.getInfo() ?? {}
  const blocks = [
    heading(1, String(info.title || 'API Reference')),
    `> ${llmsSummary(openapi)}`,
  ]

  const details = [
    info.version && `Version: ${info.version}`,
    openapi.getServers()[0]?.url && `Base URL: ${openapi.getServers()[0].url}`,
  ].filter(Boolean)
  if (details.length) {
    blocks.push(details.map(detail => `- ${detail}`).join('\n'))
  }

  for (const group of groups) {
    blocks.push(
      heading(2, group.name),
      group.operations.map((operation) => {
        const description = markdownToPlainText(operation.description, { maxLength: DESCRIPTION_MAX_LENGTH })
        const notes = `${endpoint(operation)}${description ? ` - ${description}` : ''}`
        return `- [${operation.summary}](${joinLink(linkPrefix, fileFor(operation, group))}): ${notes}`
      }).join('\n'),
    )
  }

  blocks.push(
    heading(2, 'Optional'),
    [
      `- [Full documentation](${joinLink(linkPrefix, 'llms-full.txt')}): all operations in a single file`,
      openapiUrl && `- [OpenAPI specification](${openapiUrl}): machine-readable source of truth`,
    ].filter(Boolean).join('\n'),
  )

  return blocks.join('\n\n')
}
