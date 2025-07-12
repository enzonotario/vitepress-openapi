import markdownit from 'markdown-it'
import linkAttributes from 'markdown-it-link-attributes'
import { operationLink } from '../lib/markdown/operationLink'
import { useTheme } from './useTheme'

export function useMarkdown() {
  const theme = useTheme()
  const operationLinkConfig = theme.getOperationLinkConfig()
  const { externalLinksNewTab } = theme.getMarkdownConfig()

  const md = markdownit({
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

  md.use(operationLink, operationLinkConfig)

  function render(content: string) {
    // Ensure we always return a valid HTML string even for empty/undefined content.
    return md.render(content || '')
  }

  return {
    md,
    render,
  }
}
