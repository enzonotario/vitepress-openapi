import type { OpenAPIV3 } from '@scalar/openapi-types'
import type { PluginWithOptions } from 'markdown-it'
import { useOpenapi } from '../../composables/useOpenapi'

export interface OperationLinkPluginOptions {
  /**
   * Prefix for operation links
   * @default '/operations/'
   */
  linkPrefix?: string

  /**
   * Function to transform the href before rendering
   * @param href The original href
   * @returns The transformed href
   */
  transformHref?: (href: string) => string

  /**
   * Custom function to create the HTML for operation links
   * @param href The transformed href
   * @param method The HTTP method of the operation
   * @param title The title of the operation
   * @returns The HTML string for the operation link
   */
  createOperationLinkHtml?: (href: string, method: string, title: string) => string
}

function createDefaultRenderer(
  tokens: any[],
  idx: number,
  options: any,
  env: any,
  self: any,
): string {
  return self.renderToken(tokens, idx, options)
}

function extractOperationId(href: string, linkPrefix: string): string | null {
  if (!href.startsWith(linkPrefix)) {
    return null
  }

  const parts = href.substring(linkPrefix.length).split('/')

  return parts.length >= 1 ? parts[0] : null
}

function getOperationTitle(
  tokens: any[],
  idx: number,
  operation: OpenAPIV3.OperationObject | undefined,
): string {
  // Get the link text from the next token if it's a text token.
  let title = ''
  if (idx + 1 < tokens.length && tokens[idx + 1].type === 'text') {
    title = tokens[idx + 1].content
  }

  // Fallback to operation summary or operationId if no title is provided.
  return title || operation?.summary || operation?.operationId || ''
}

function createOperationLinkHtml(
  href: string,
  method: string,
  title: string,
): string {
  return `<a href="${href}" class="OAOperationLink group/oaSidebarItem">`
    + `<span class="OAOperationLink-badge OAMethodBadge--${method.toLowerCase()}">${method.toUpperCase()}</span>`
    + `<span>${title}</span>`
    + `</a>`
}

function modifyTokensForOperationLink(
  tokens: any[],
  idx: number,
  html: string,
): void {
  // Replace the token content with the generated HTML.
  tokens[idx].type = 'html_inline'
  tokens[idx].content = html
  tokens[idx].children = []

  // Skip the next token if it's the text token we used for the title.
  if (idx + 1 < tokens.length && tokens[idx + 1].type === 'text') {
    tokens[idx + 1].content = ''
  }

  // Skip the link_close token.
  // For links with text, link_close is at idx+2.
  if (idx + 2 < tokens.length && tokens[idx + 2].type === 'link_close') {
    tokens[idx + 2].type = 'text'
    tokens[idx + 2].content = ''
  }
  // For links without text, link_close is at idx+1.
  else if (idx + 1 < tokens.length && tokens[idx + 1].type === 'link_close') {
    tokens[idx + 1].type = 'text'
    tokens[idx + 1].content = ''
  }
}

/**
 * Markdown-it plugin that transforms links with a specific prefix into operation links
 * with method badges and proper styling.
 */
const operationLink: PluginWithOptions<OperationLinkPluginOptions> = (md, options = {}) => {
  const defaultRender = md.renderer.rules.link_open || createDefaultRenderer

  const defaultLinkCloseRender = md.renderer.rules.link_close || createDefaultRenderer

  const {
    linkPrefix = '/operations/',
    transformHref,
    createOperationLinkHtml: customCreateOperationLinkHtml,
  } = options

  const openapi = useOpenapi()

  // Override the link renderer.
  md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
    const hrefIndex = tokens[idx].attrIndex('href')
    if (hrefIndex < 0) {
      return defaultRender(tokens, idx, options, env, self)
    }

    const href = tokens[idx].attrs![hrefIndex][1]

    const operationId = extractOperationId(href, linkPrefix)
    if (!operationId) {
      return defaultRender(tokens, idx, options, env, self)
    }

    const operation = openapi.getOperation?.(operationId)
    if (!operation) {
      return defaultRender(tokens, idx, options, env, self)
    }

    const method = openapi.getOperationMethod?.(operationId) || 'get'
    const title = getOperationTitle(tokens, idx, operation)

    let transformedHref = href
    if (transformHref) {
      transformedHref = transformHref(href)
      tokens[idx].attrs![hrefIndex][1] = transformedHref
    }

    const html = customCreateOperationLinkHtml
      ? customCreateOperationLinkHtml(transformedHref, method, title)
      : createOperationLinkHtml(transformedHref, method, title)

    modifyTokensForOperationLink(tokens, idx, html)

    return html
  }

  // We don't need the link_close handler anymore since we're replacing the entire link.
  md.renderer.rules.link_close = function (tokens, idx, options, env, self) {
    // If the token has been modified to be an empty text, return an empty string.
    if (tokens[idx].type === 'text' && tokens[idx].content === '') {
      return ''
    }

    // Otherwise use the default renderer.
    return defaultLinkCloseRender(tokens, idx, options, env, self)
  }
}

export { operationLink }

export default operationLink
