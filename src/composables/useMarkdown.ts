import markdownit from 'markdown-it'
import linkAttributes from 'markdown-it-link-attributes'
import { operationLink } from '../lib/markdown/operationLink'
import { sanitizeHtml } from '../lib/markdown/sanitizeHtml'
import { useTheme } from './useTheme'

const RE_EXTERNAL_LINK = /^https?:\/\//

export function useMarkdown() {
  const theme = useTheme()
  const operationLinkConfig = theme.getOperationLinkConfig()
  const { externalLinksNewTab, config, sanitize = true } = theme.getMarkdownConfig()

  let md = markdownit({
    html: true,
    breaks: true,
  })

  if (externalLinksNewTab) {
    md.use(linkAttributes, [
      {
        matcher(href: string) {
          return RE_EXTERNAL_LINK.test(href)
        },
        attrs: {
          target: '_blank',
          rel: 'noopener',
        },
      },
    ])
  }

  if (operationLinkConfig !== false) {
    md.use(operationLink, operationLinkConfig)
  }

  if (config) {
    // user can mutate existing md to add plugins or return completely different instance
    md = config(md) || md
  }

  // Applied to the final output, so it also covers plugins or instances added by `config`.
  const sanitizeOutput = typeof sanitize === 'function'
    ? sanitize
    : sanitize === false ? (html: string) => html : sanitizeHtml

  function render(content: string) {
    // Ensure we always return a valid HTML string even for empty/undefined content.
    return sanitizeOutput(md.render(content || ''))
  }

  return {
    md,
    render,
  }
}
