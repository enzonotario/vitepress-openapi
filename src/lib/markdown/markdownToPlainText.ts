import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({ html: true })

const HTML_ENTITIES: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': '\'',
}

export interface MarkdownToPlainTextOptions {
  /**
   * Maximum length of the returned text. When the plain text is longer, it is
   * truncated at a word boundary and suffixed with an ellipsis, keeping the
   * result within `maxLength` characters. Useful for `<meta name="description">`.
   */
  maxLength?: number
}

/**
 * Reduces a Markdown string (optionally containing inline HTML) to a
 * single-line plain-text string, e.g. to build meta descriptions for
 * pages generated from OpenAPI operation descriptions.
 */
export function markdownToPlainText(
  markdown: string | null | undefined,
  options: MarkdownToPlainTextOptions = {},
): string {
  const text = md.render(markdown ?? '')
    // Block boundaries and line breaks become spaces so adjacent blocks do not
    // merge into one word; inline tags (<code>, <strong>, …) are removed
    // without adding whitespace around their content.
    .replace(/<\/(?:p|div|h[1-6]|li|blockquote|td|th|tr)>|<(?:br|hr)\s*\/?>/g, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&(?:amp|lt|gt|quot|#39);/g, entity => HTML_ENTITIES[entity])
    .replace(/\s+/g, ' ')
    .trim()

  if (options.maxLength === undefined || text.length <= options.maxLength) {
    return text
  }

  return `${text.slice(0, options.maxLength - 1).replace(/\s*\S*$/, '')}…`
}
