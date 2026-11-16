import type { LanguageConfig } from '../../composables/useTheme'
import type { OAExampleObject, ParsedContent, ParsedOperation } from '../../types'
import type { OAProperty } from '../parser/getSchemaUi'
import type { OpenApiSpecInstance } from '../spec/createOpenApiSpec'
import { availableLanguages, DEFAULT_BASE_URL } from '../../composables/useTheme'
import { buildOperationRequest } from '../codeSamples/buildOperationRequest'
import { generateCodeSample } from '../codeSamples/generateCodeSample'
import { getPropertyExample } from '../examples/getPropertyExample'
import { getSchemaExample } from '../examples/getSchemaExample'
import { normalizeExamples } from '../examples/normalizeExamples'
import { formatValueForDisplay } from '../format/formatValueForDisplay'
import { getSchemaUi } from '../parser/getSchemaUi'
import { getSecurityUi } from '../parser/getSecurityUi'
import { isJson, isXml } from '../utils/contentTypeUtils'
import { codeBlock, escapeLinkLabel, heading, indentContinuation, inlineCode, table, withAttributes } from './markdownUtils'

export interface OperationToMarkdownOptions {
  /**
   * Heading level of the operation title. Sections use the next levels.
   * @default 1
   */
  headingLevel?: number
  /**
   * URL of the machine-readable OpenAPI document, linked at the end of the page.
   */
  openapiUrl?: string
  /**
   * Code samples to include: `false` to disable, or a list of languages
   * (`lang` ids of the built-in languages, e.g. `'curl'`, `'javascript'`, `'php'`, `'python'`,
   * or custom `LanguageConfig` objects).
   * @default ['curl']
   */
  codeSamples?: boolean | Array<string | LanguageConfig>
  /**
   * Base URL used in code samples. Defaults to the first server of the operation.
   */
  baseUrl?: string
  /**
   * Maximum nesting depth when rendering schemas.
   * @default 8
   */
  schemaDepth?: number
  /**
   * Operation links in descriptions, as used by the `operationLink` markdown-it plugin
   * (e.g. `[](/operations/getPet)`): empty link texts are filled with the operation
   * summary and hrefs are mapped with `href`. `false` leaves them untouched.
   * @default { prefix: '/operations/' }
   */
  operationLink?: false | OperationLinkOptions
}

export interface OperationLinkOptions {
  /** @default '/operations/' */
  prefix?: string
  /**
   * Maps an operationId to the link href: `undefined` keeps the original href,
   * `null` drops the link and keeps its text.
   */
  href?: (operationId: string) => string | null | undefined
}

const PARAMETER_LOCATIONS = [
  { in: 'path', title: 'Path parameters' },
  { in: 'query', title: 'Query parameters' },
  { in: 'header', title: 'Header parameters' },
  { in: 'cookie', title: 'Cookie parameters' },
] as const

const DEFAULT_CODE_SAMPLES = ['curl']
const DEFAULT_SCHEMA_DEPTH = 8
const IGNORED_CONSTRAINTS = new Set(['format', 'default'])
const DEFAULT_OPERATION_LINK_PREFIX = '/operations/'
const RE_MARKDOWN_LINK = /\[([^\]]*)\]\(([^)\s]+)\)/g
// Leading whitespace is not limited to 3 spaces: fences can be nested in list items.
const RE_FENCE_OPEN = /^\s*(`{3,}|~{3,})/
const RE_BACKTICK_RUN = /`+/g
const RE_OPERATION_ID_END = /[/?#]/

interface RenderContext {
  level: number
  schemaDepth: number
}

/**
 * Renders a single operation as plain (GitHub-flavored) Markdown, for static
 * pages, search indexing or LLMs. Expects a parsed spec (e.g. from `useOpenapi`
 * or `generateMarkdownFiles`) so `$ref`s are resolved.
 */
export async function operationToMarkdown(
  openapi: OpenApiSpecInstance,
  operationId: string,
  options: OperationToMarkdownOptions = {},
): Promise<string> {
  const operation: ParsedOperation | null = operationId ? openapi.getOperation(operationId) : null
  if (!operation) {
    return ''
  }

  const method = openapi.getOperationMethod(operationId) ?? 'get'
  const path = openapi.getOperationPath(operationId) ?? ''
  const ctx: RenderContext = {
    level: options.headingLevel ?? 1,
    schemaDepth: options.schemaDepth ?? DEFAULT_SCHEMA_DEPTH,
  }
  const endpoint = `${method.toUpperCase()} ${path}`

  const blocks: string[] = [
    heading(ctx.level, operation.summary || endpoint),
    inlineCode(endpoint),
  ]

  if (operation.deprecated) {
    blocks.push('> **Deprecated:** this operation is deprecated and may be removed in a future version.')
  }

  if (operation.description) {
    blocks.push(String(operation.description).trim())
  }

  if (operation.externalDocs?.url) {
    blocks.push(`See also: [${escapeLinkLabel(operation.externalDocs.description || operation.externalDocs.url)}](${operation.externalDocs.url})`)
  }

  blocks.push(
    ...renderServers(openapi.getOperationServers(operationId), ctx),
    ...renderSecurity(openapi, operation, ctx),
    ...renderParameters(getMergedParameters(openapi, operationId), ctx),
    ...renderRequestBody(operation, ctx),
    ...renderResponses(operation, ctx),
    ...await renderCodeSamples(openapi, operationId, operation, options, ctx),
  )

  if (options.openapiUrl) {
    blocks.push(
      heading(ctx.level + 1, 'OpenAPI'),
      `Machine-readable specification: [${escapeLinkLabel(options.openapiUrl)}](${options.openapiUrl})`,
    )
  }

  const markdown = blocks.filter(Boolean).join('\n\n')

  return options.operationLink === false
    ? markdown
    : rewriteOperationLinks(markdown, openapi, options.operationLink ?? {})
}

/**
 * Fills empty operation link texts and maps their hrefs (see `OperationToMarkdownOptions.operationLink`).
 */
export function rewriteOperationLinks(markdown: string, openapi: OpenApiSpecInstance, options: OperationLinkOptions = {}): string {
  const prefix = options.prefix ?? DEFAULT_OPERATION_LINK_PREFIX
  let fence: { char: string, length: number } | null = null

  const rewriteLink = (match: string, text: string, href: string) => {
    if (!href.startsWith(prefix)) {
      return match
    }
    let operationId: string
    try {
      operationId = decodeURIComponent(href.slice(prefix.length).split(RE_OPERATION_ID_END)[0])
    }
    catch {
      return match
    }
    const operation = openapi.getOperation(operationId)
    if (!operation) {
      return match
    }
    const target = options.href?.(operationId)
    const label = text || escapeLinkLabel(operation.summary || operationId)
    return target === null ? label : `[${label}](${target ?? href})`
  }

  return markdown.split('\n').map((line) => {
    if (fence) {
      if (isClosingFence(line, fence)) {
        fence = null
      }
      return line
    }

    const opening = line.match(RE_FENCE_OPEN)
    // A backtick fence's info string cannot contain backticks (CommonMark).
    if (opening && !(opening[1][0] === '`' && line.slice(opening[0].length).includes('`'))) {
      fence = { char: opening[1][0], length: opening[1].length }
      return line
    }

    if (!line.includes(prefix)) {
      return line
    }

    return mapOutsideCodeSpans(line, segment => segment.replace(RE_MARKDOWN_LINK, rewriteLink))
  }).join('\n')
}

/**
 * A closing fence uses the opening character, is at least as long, and has nothing else but whitespace.
 */
function isClosingFence(line: string, fence: { char: string, length: number }): boolean {
  const trimmed = line.trim()
  return trimmed.length >= fence.length && [...trimmed].every(char => char === fence.char)
}

/**
 * Applies `map` to the parts of a line that are not inline code spans.
 * A span opens with a backtick run and closes with a run of the same length.
 */
function mapOutsideCodeSpans(line: string, map: (segment: string) => string): string {
  const runs = [...line.matchAll(RE_BACKTICK_RUN)]
  let result = ''
  let cursor = 0
  let index = 0

  while (index < runs.length) {
    const open = runs[index]
    const closeIndex = runs.findIndex((run, i) => i > index && run[0].length === open[0].length)
    if (closeIndex === -1) {
      // Unmatched run: literal backticks.
      index++
      continue
    }
    const close = runs[closeIndex]
    result += map(line.slice(cursor, open.index)) + line.slice(open.index, close.index! + close[0].length)
    cursor = close.index! + close[0].length
    index = closeIndex + 1
  }

  return result + map(line.slice(cursor))
}

/**
 * Path item parameters plus operation parameters, keyed by `(name, in)`:
 * an operation parameter overrides the path item one (OpenAPI 3.x).
 */
function getMergedParameters(openapi: OpenApiSpecInstance, operationId: string): any[] {
  const path = openapi.getOperationPath(operationId)
  const pathParameters = (path ? openapi.getPaths()[path]?.parameters : undefined) ?? []
  const merged = new Map<string, any>()

  for (const parameter of [...pathParameters, ...openapi.getOperationParameters(operationId)] as any[]) {
    if (!parameter) {
      continue
    }
    // Unresolved `$ref`s have no name/in: keep them apart.
    const key = parameter.name && parameter.in ? `${parameter.in}:${parameter.name}` : `ref:${merged.size}`
    merged.set(key, parameter)
  }

  return [...merged.values()]
}

function renderServers(servers: any[], ctx: RenderContext): string[] {
  if (!servers?.length) {
    return []
  }

  const lines = servers.map((server) => {
    const description = server.description ? `: ${server.description}` : ''
    const variables = Object.entries(server.variables ?? {}).map(([name, variable]: [string, any]) => {
      const details = [
        variable.default !== undefined && `default ${inlineCode(variable.default)}`,
        variable.enum?.length && `one of ${variable.enum.map(inlineCode).join(', ')}`,
        variable.description,
      ].filter(Boolean).join('; ')
      return `  - ${inlineCode(`{${name}}`)}${details ? `: ${details}` : ''}`
    })
    return [`- ${inlineCode(server.url)}${description}`, ...variables].join('\n')
  })

  return [heading(ctx.level + 1, 'Servers'), lines.join('\n')]
}

function renderSecurity(openapi: OpenApiSpecInstance, operation: ParsedOperation, ctx: RenderContext): string[] {
  const spec = openapi.getSpec()
  const requirements: Record<string, string[]>[] = (operation.security ?? spec.security ?? []) as any
  const securityUi = getSecurityUi(requirements as any, (spec.components?.securitySchemes ?? {}) as any)

  if (!securityUi.length) {
    return []
  }

  const describe = (index: number, schemes: Record<string, any>, indent: string) => {
    return Object.entries(schemes)
      .map(([name, scheme]) => `${indent}- ${inlineCode(name)}: ${describeSecurityScheme(scheme, requirements[index]?.[name] ?? [], `${indent}  `)}`)
  }

  if (securityUi.length === 1) {
    const schemes = describe(0, securityUi[0].schemes, '')
    return [
      heading(ctx.level + 1, 'Authorization'),
      schemes.length > 1 ? 'All of the following are required:' : '',
      schemes.join('\n'),
    ]
  }

  const lines = securityUi.flatMap((option, index) => {
    const schemes = describe(index, option.schemes, '  ')
    if (!schemes.length) {
      return [`- Option ${index + 1}: no authentication`]
    }
    return [`- Option ${index + 1}${schemes.length > 1 ? ' (all required)' : ''}:`, ...schemes]
  })

  return [heading(ctx.level + 1, 'Authorization'), 'Use one of the following options:', lines.join('\n')]
}

/**
 * One-line description of a security scheme (type, location, scopes), with OAuth flows as nested items.
 */
export function describeSecurityScheme(scheme: any, scopes: string[] = [], indent = '  '): string {
  const parts: string[] = []
  const nested: string[] = []

  switch (scheme?.type) {
    case 'http': {
      const httpScheme = String(scheme.scheme ?? '').toLowerCase()
      parts.push(`HTTP ${httpScheme || 'authentication'}${scheme.bearerFormat ? ` (${scheme.bearerFormat})` : ''}.`)
      if (httpScheme === 'bearer') {
        parts.push(`Send ${inlineCode('Authorization: Bearer <token>')}.`)
      }
      else if (httpScheme === 'basic') {
        parts.push(`Send ${inlineCode('Authorization: Basic <credentials>')}.`)
      }
      break
    }
    case 'apiKey':
      parts.push(`API key in ${scheme.in ?? 'header'} ${inlineCode(scheme.name ?? '')}.`)
      break
    case 'oauth2':
      parts.push('OAuth 2.0.')
      for (const [flowName, flow] of Object.entries(scheme.flows ?? {}) as [string, any][]) {
        const urls = [
          flow?.authorizationUrl && `authorization URL ${flow.authorizationUrl}`,
          flow?.tokenUrl && `token URL ${flow.tokenUrl}`,
          flow?.refreshUrl && `refresh URL ${flow.refreshUrl}`,
        ].filter(Boolean).join(', ')
        nested.push(`${indent}- Flow ${inlineCode(flowName)}${urls ? `: ${urls}` : ''}`)
      }
      break
    case 'openIdConnect':
      parts.push(`OpenID Connect${scheme.openIdConnectUrl ? ` (${scheme.openIdConnectUrl})` : ''}.`)
      break
    case 'mutualTLS':
      parts.push('Mutual TLS.')
      break
    default:
      parts.push(`${scheme?.type ?? 'Unknown'} scheme.`)
  }

  if (scopes.length) {
    parts.push(`Required scopes: ${scopes.map(inlineCode).join(', ')}.`)
  }

  return [indentContinuation(withAttributes(parts.join(' '), [scheme?.description?.trim()]), indent), ...nested].join('\n')
}

function renderParameters(parameters: any[], ctx: RenderContext): string[] {
  const valid = (parameters ?? []).filter(parameter => parameter && parameter.name && parameter.in)
  if (!valid.length) {
    return []
  }

  const blocks = [heading(ctx.level + 1, 'Parameters')]

  for (const location of PARAMETER_LOCATIONS) {
    const rows = valid
      .filter(parameter => parameter.in === location.in)
      .map((parameter) => {
        const schema = parameter.schema ?? (Object.values(parameter.content ?? {})[0] as any)?.schema
        const ui = toSchemaUiProperty(schema)
        const description = withAttributes(
          [parameter.deprecated && '**Deprecated.**', parameter.description?.trim()].filter(Boolean).join(' '),
          describeAttributes(ui, getPropertyExample(parameter)),
        )
        return [
          inlineCode(parameter.name),
          ui ? inlineCode(typeLabel(ui)) : '',
          parameter.required ? 'Yes' : 'No',
          description,
        ]
      })

    if (rows.length) {
      blocks.push(
        heading(ctx.level + 2, location.title),
        table(['Name', 'Type', 'Required', 'Description'], rows),
      )
    }
  }

  return blocks
}

function renderRequestBody(operation: ParsedOperation, ctx: RenderContext): string[] {
  const requestBody = operation.requestBody
  if (!requestBody) {
    return []
  }

  const intro = [requestBody.required ? 'Required.' : 'Optional.', requestBody.description?.trim()]
    .filter(Boolean)
    .join(' ')

  return [
    heading(ctx.level + 1, 'Request body'),
    intro,
    ...renderContent(requestBody.content, ctx),
  ]
}

function renderResponses(operation: ParsedOperation, ctx: RenderContext): string[] {
  const responses = Object.entries(operation.responses ?? {})
  if (!responses.length) {
    return []
  }

  const blocks = [heading(ctx.level + 1, 'Responses')]

  for (const [status, response] of responses as [string, any][]) {
    blocks.push(heading(ctx.level + 2, status))

    if (response?.description) {
      blocks.push(String(response.description).trim())
    }

    const headers = Object.entries(response?.headers ?? {}) as [string, any][]
    if (headers.length) {
      const rows = headers.map(([name, header]) => {
        const ui = toSchemaUiProperty(header?.schema)
        return [
          inlineCode(name),
          ui ? inlineCode(typeLabel(ui)) : '',
          withAttributes(header?.description, describeAttributes(ui, getPropertyExample(header))),
        ]
      })
      blocks.push('Headers:', table(['Name', 'Type', 'Description'], rows))
    }

    blocks.push(...renderContent(response?.content, ctx))
  }

  return blocks
}

function renderContent(content: Record<string, ParsedContent> | undefined, ctx: RenderContext): string[] {
  const blocks: string[] = []

  for (const [contentType, media] of Object.entries(content ?? {})) {
    blocks.push(`Content type: ${inlineCode(contentType)}`)

    const ui = media?.ui ?? (media?.schema ? getSchemaUi(media.schema) : undefined)
    if (ui) {
      blocks.push(...renderSchema(ui, ctx))
    }

    for (const example of getMediaExamples(media, contentType, ui)) {
      blocks.push(
        example.title ? `Example (${example.title}):` : 'Example:',
        codeBlock(formatExample(example.value, contentType), exampleLang(example.value, contentType)),
      )
    }
  }

  return blocks
}

function getMediaExamples(
  media: ParsedContent | undefined,
  contentType: string,
  ui: OAProperty | OAProperty[] | undefined,
): Array<{ title?: string, value: unknown }> {
  if (!media) {
    return []
  }

  if (media.example !== undefined) {
    return [{ value: media.example }]
  }

  const examples = Object.entries(media.examples ?? {}) as [string, OAExampleObject][]
  const userExamples = examples.filter(([, example]) => !example?.isAutogenerated)
  if (userExamples.length) {
    return (normalizeExamples(Object.fromEntries(userExamples)) ?? [])
      .map(example => ({ title: example.summary || example.name, value: example.value }))
  }

  const autogenerated = examples.find(([, example]) => example?.isAutogenerated)?.[1]
    ?? (ui ? Object.values(getSchemaExample(contentType, ui, true))[0] : undefined)

  // Form, multipart and binary bodies are better described by their schema.
  if (!autogenerated || autogenerated.hideOnSchemaTabs || autogenerated.value === undefined || autogenerated.value === '') {
    return []
  }

  return [{ value: autogenerated.value }]
}

function formatExample(value: unknown, contentType: string): string {
  if (typeof value === 'string' && !isJson(contentType)) {
    return value
  }
  return formatValueForDisplay(value, { space: 2 })
}

function exampleLang(value: unknown, contentType: string): string {
  if (isXml(contentType)) {
    return 'xml'
  }
  if (isJson(contentType) || typeof value !== 'string') {
    return 'json'
  }
  return 'text'
}

function toSchemaUiProperty(schema: any): OAProperty | undefined {
  if (!schema || typeof schema !== 'object' || Object.keys(schema).length === 0) {
    return undefined
  }
  const ui = getSchemaUi(schema)
  return Array.isArray(ui) ? ui[0] : ui
}

function renderSchema(ui: OAProperty | OAProperty[], ctx: RenderContext): string[] {
  const roots = Array.isArray(ui) ? ui : [ui]
  const blocks: string[] = []

  for (const root of roots) {
    if (!root) {
      continue
    }

    if (root.description?.trim()) {
      blocks.push(root.description.trim())
    }

    const union = unionLabel(root)
    blocks.push([
      `Type: ${inlineCode(typeLabel(root))}.`,
      ...describeAttributes(root),
      union && `${union}:`,
    ].filter(Boolean).join(' '))

    const lines: string[] = []
    renderChildren(root, 0, ctx, lines)
    if (lines.length) {
      blocks.push(lines.join('\n'))
    }
  }

  return blocks
}

function renderChildren(property: OAProperty, depth: number, ctx: RenderContext, lines: string[]): void {
  if (property.meta?.isCircularReference || !property.properties?.length) {
    return
  }

  if (depth >= ctx.schemaDepth) {
    lines.push(`${'  '.repeat(depth)}- …`)
    return
  }

  const isUnion = !!unionLabel(property)
  property.properties.forEach((child, index) => {
    const label = isUnion
      ? `Option ${index + 1}${child.title ? ` (${child.title})` : ''}`
      : inlineCode(child.name || `[${index}]`)
    renderProperty(child, label, depth, ctx, lines)
  })
}

function renderProperty(property: OAProperty, label: string, depth: number, ctx: RenderContext, lines: string[]): void {
  const indent = '  '.repeat(depth)
  // In code: `<format>` would otherwise be parsed as HTML (e.g. `integer<int64>`).
  const flags = [inlineCode(typeLabel(property))]
  if (property.required) {
    flags.push('required')
  }
  if (property.meta?.isAdditionalProperties) {
    flags.push('additional properties')
  }

  const union = unionLabel(property)
  const text = withAttributes(property.description, [...describeAttributes(property), union && `${union}:`])

  lines.push(`${indent}- ${label} (${flags.join(', ')})${text ? `: ${indentContinuation(text, `${indent}  `)}` : ''}`)
  renderChildren(property, depth + 1, ctx, lines)
}

function unionLabel(property: OAProperty): string | undefined {
  if (!property.properties?.length) {
    return undefined
  }
  if (property.meta?.isOneOf) {
    return 'One of'
  }
  if (property.meta?.isAnyOf) {
    return 'Any of'
  }
  return undefined
}

/**
 * Compact type label, e.g. `string<uuid>`, `array<object>`, `integer | null`.
 */
function typeLabel(property: OAProperty): string {
  if (property.meta?.isCircularReference) {
    return 'object'
  }

  const format = property.constraints?.format as string | undefined
  const types = (property.types ?? []).filter(Boolean)
  const labels = types.map((type) => {
    if (type === 'array') {
      const item = property.items
        ? typeLabel(property.items)
        : property.subtype ?? (property.properties?.length && !property.meta?.hasPrefixItems ? 'object' : undefined)
      return item ? `array<${item}>` : 'array'
    }
    if (format && type !== 'object' && type !== 'null') {
      return `${type}<${format}>`
    }
    return type
  })

  if (property.nullable && !types.includes('null')) {
    labels.push('null')
  }

  return labels.join(' | ') || 'any'
}

function describeAttributes(property: OAProperty | undefined, example?: unknown): string[] {
  if (!property) {
    return example != null ? [`Example: ${inlineCode(formatInline(example))}.`] : []
  }

  const parts: string[] = []

  if (property.meta?.isConstant) {
    const constant = getPropertyExample(property)
    if (constant != null) {
      parts.push(`Constant: ${inlineCode(formatInline(constant))}.`)
    }
    return parts
  }

  const enumValues = property.enum ?? property.items?.enum
  if (enumValues?.length) {
    parts.push(`Possible values: ${enumValues.map(value => inlineCode(formatInline(value))).join(', ')}.`)
  }

  if (property.defaultValue !== undefined) {
    parts.push(`Default: ${inlineCode(formatInline(property.defaultValue))}.`)
  }

  const constraints = formatConstraints(property.constraints)
  if (constraints) {
    parts.push(`Constraints: ${constraints}.`)
  }

  // Primitive array items keep their own constraints (e.g. `minLength`), apart from `minItems`.
  const itemConstraints = formatConstraints(property.items?.constraints)
  if (itemConstraints) {
    parts.push(`Items: ${itemConstraints}.`)
  }

  const resolvedExample = example ?? getPropertyExample(property)
  if (resolvedExample != null) {
    parts.push(`Example: ${inlineCode(formatInline(resolvedExample))}.`)
  }

  return parts
}

function formatConstraints(constraints: Record<string, unknown> | undefined): string {
  return Object.entries(constraints ?? {})
    .filter(([key]) => !IGNORED_CONSTRAINTS.has(key))
    .map(([key, value]) => `${key}: ${formatInline(value)}`)
    .join(', ')
}

function formatInline(value: unknown): string {
  return typeof value === 'string' ? value : formatValueForDisplay(value, { space: 0 })
}

function resolveLanguages(codeSamples: OperationToMarkdownOptions['codeSamples']): LanguageConfig[] {
  if (codeSamples === false) {
    return []
  }

  const languages = codeSamples === true || codeSamples === undefined ? DEFAULT_CODE_SAMPLES : codeSamples
  return languages.flatMap((language) => {
    if (typeof language !== 'string') {
      return [language]
    }
    const config = availableLanguages.find(available => available.lang === language)
    if (!config) {
      console.warn(`[vitepress-openapi] Unknown code sample language "${language}". Available: ${availableLanguages.map(available => available.lang).join(', ')}`)
      return []
    }
    return [config]
  })
}

function resolveServerUrl(server: any): string {
  let url = String(server?.url ?? '')
  for (const [name, variable] of Object.entries(server?.variables ?? {}) as [string, any][]) {
    url = url.replaceAll(`{${name}}`, String(variable?.default ?? ''))
  }

  if (!url) {
    return DEFAULT_BASE_URL
  }

  // Relative server URLs (e.g. `/api/v1`) are resolved against the default base URL.
  return URL.canParse(url) ? url : new URL(url, DEFAULT_BASE_URL).href
}

async function renderCodeSamples(
  openapi: OpenApiSpecInstance,
  operationId: string,
  operation: ParsedOperation,
  options: OperationToMarkdownOptions,
  ctx: RenderContext,
): Promise<string[]> {
  const languages = resolveLanguages(options.codeSamples)
  if (!languages.length) {
    return []
  }

  const blocks: string[] = []

  try {
    const baseUrl = (options.baseUrl ?? resolveServerUrl(openapi.getOperationServers(operationId)[0])).replace(/\/+$/, '')
    const request = buildOperationRequest({
      path: openapi.getOperationPath(operationId) ?? '',
      method: openapi.getOperationMethod(operationId) ?? 'get',
      operation,
      parameters: getMergedParameters(openapi, operationId),
      baseUrl,
    })

    for (const language of languages) {
      const source = await generateCodeSample(language, request)
      if (source) {
        blocks.push(`**${language.label}**`, codeBlock(source, language.highlighter ?? language.lang))
      }
    }
  }
  catch (error) {
    console.warn(`[vitepress-openapi] Could not generate code samples for "${operationId}"`, error)
  }

  return blocks.length ? [heading(ctx.level + 1, 'Code samples'), ...blocks] : []
}
