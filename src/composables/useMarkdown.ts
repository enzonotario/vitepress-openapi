import markdownit from 'markdown-it'
import { operationLink } from '../lib/markdown/operationLink'
import { useTheme } from './useTheme'

export function useMarkdown() {
  const operationLinkConfig = useTheme().getOperationLinkConfig()

  const md = markdownit({
    html: true,
    breaks: true,
  }).use(operationLink, operationLinkConfig)

  function render(content: string) {
    // Ensure we always return a valid HTML string even for empty/undefined content.
    return md.render(content || '')
  }

  return {
    md,
    render,
  }
}
