import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({ html: true })

const HTML_ENTITIES: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': '\'',
}

/** Block boundaries and void line-break tags → space between adjacent blocks. */
const BLOCK_BOUNDARY_TAGS = /<\/(?:p|div|h[1-6]|li|blockquote|td|th|tr)>|<(?:br|hr)\s*\/?>/g

/**
 * Strip any HTML tag, allowing `>` inside quoted attribute values
 * (e.g. `<span title="x > y">`).
 */
const HTML_TAGS = /<(?:"[^"]*"|'[^']*'|[^'">])*>/g

const HTML_ENTITIES_PATTERN = /&(?:amp|lt|gt|quot|#39);/g
const COLLAPSE_WHITESPACE = /\s+/g
const TRAILING_PARTIAL_WORD = /\s*\S*$/

export interface MarkdownToPlainTextOptions {
  /**
   * Maximum length of the returned text. When the plain text is longer, it is
   * truncated at a word boundary and suffixed with an ellipsis, keeping the
   * result within `maxLength` characters. Useful for `<meta name="description">`.
   * Must be a non-negative integer when provided; `0` yields an empty string.
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
    .replace(BLOCK_BOUNDARY_TAGS, ' ')
    .replace(HTML_TAGS, '')
    .replace(HTML_ENTITIES_PATTERN, entity => HTML_ENTITIES[entity])
    .replace(COLLAPSE_WHITESPACE, ' ')
    .trim()

  const { maxLength } = options
  if (maxLength === undefined) {
    return text
  }

  if (!Number.isInteger(maxLength) || maxLength < 0) {
    throw new TypeError('markdownToPlainText: maxLength must be a non-negative integer')
  }

  if (maxLength === 0) {
    return ''
  }

  if (text.length <= maxLength) {
    return text
  }

  return `${text.slice(0, maxLength - 1).replace(TRAILING_PARTIAL_WORD, '')}…`
}
