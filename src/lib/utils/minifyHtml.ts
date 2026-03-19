/**
 * Minifies a string of HTML by replacing multiple whitespace characters with a single space
 * and trimming the result. This helps prevent hydration mismatches in VitePress.
 */
export function minifyHtml(html: string): string {
  return html.replace(/\s+/g, ' ').trim()
}
