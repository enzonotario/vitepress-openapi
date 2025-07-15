import markdownit from 'markdown-it'
import linkAttributes from 'markdown-it-link-attributes'
import { operationLink } from '../lib/markdown/operationLink'
import { useTheme } from './useTheme'

export function useMarkdown() {
  const theme = useTheme()
  const operationLinkConfig = theme.getOperationLinkConfig()
  const { externalLinksNewTab, config } = theme.getMarkdownConfig()

  let md = markdownit({
    html: true,
    breaks: true,
  })

  if (externalLinksNewTab) {
    md.use(linkAttributes, [
      {
        matcher(href: string) {
          return /^https?:\/\//.test(href)
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

  function render(content: string) {
    // Ensure we always return a valid HTML string even for empty/undefined content.
    return md.render(content || '')
  }

  return {
    md,
    render,
  }
}
