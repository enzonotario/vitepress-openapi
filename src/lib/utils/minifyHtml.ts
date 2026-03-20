const WHITESPACE_REGEX = /\s+/g

/**
 * Minifies a string of HTML by replacing multiple whitespace characters with a single space
 * and trimming the result. This helps prevent hydration mismatches in VitePress.
 */
export function minifyHtml(html: string): string {
  return html.replace(WHITESPACE_REGEX, ' ').trim()
}
