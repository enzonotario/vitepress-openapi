const RE_NEWLINES = /\r?\n/g
const RE_PIPE = /\|/g
const RE_BACKTICK_RUNS = /`+/g
const RE_UNSAFE_FILE_CHARS = /[^\p{L}\p{N}_.-]+/gu
const RE_REPEATED_DASHES = /-{2,}/g
const RE_EDGE_DASHES_DOTS = /^[-.]+|[-.]+$/g
const RE_ENDS_WITH_PUNCTUATION = /[.!?:;]$/

export function heading(level: number, text: string): string {
  return `${'#'.repeat(Math.min(Math.max(level, 1), 6))} ${text}`
}

/**
 * Inline code span that survives backticks in its content.
 */
export function inlineCode(value: unknown): string {
  const text = String(value)
  const longestRun = Math.max(0, ...(text.match(RE_BACKTICK_RUNS) ?? []).map(run => run.length))
  const ticks = '`'.repeat(longestRun + 1)
  const padding = text.startsWith('`') || text.endsWith('`') ? ' ' : ''
  return `${ticks}${padding}${text}${padding}${ticks}`
}

/**
 * Fenced code block whose fence is longer than any backtick run in the code.
 */
export function codeBlock(code: string, lang = ''): string {
  const longestRun = Math.max(0, ...(code.match(RE_BACKTICK_RUNS) ?? []).map(run => run.length))
  const fence = '`'.repeat(Math.max(3, longestRun + 1))
  return `${fence}${lang}\n${code.replace(/\n+$/, '')}\n${fence}`
}

/**
 * Escapes a value for a GFM table cell: pipes and newlines would break the row.
 */
export function tableCell(value: unknown): string {
  if (value === undefined || value === null) {
    return ''
  }
  return String(value).trim().replace(RE_PIPE, '\\|').replace(RE_NEWLINES, '<br>')
}

export function table(headers: string[], rows: unknown[][]): string {
  return [
    `| ${headers.map(tableCell).join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
    ...rows.map(row => `| ${row.map(tableCell).join(' | ')} |`),
  ].join('\n')
}

/**
 * Indents every line after the first, so multi-line text stays inside a list item.
 */
export function indentContinuation(text: string, indent: string): string {
  return text.trim()
    .split(RE_NEWLINES)
    .map((line, index) => index === 0 || !line.trim() ? line.trimEnd() : `${indent}${line}`)
    .join('\n')
}

/**
 * Appends attribute sentences (e.g. `Default: x.`) to a description, keeping
 * multi-paragraph descriptions intact.
 */
export function withAttributes(description: string | undefined | null, attributes: Array<string | false | undefined>): string {
  const text = description?.trim() ?? ''
  const attrs = attributes.filter(Boolean).join(' ')
  if (!text || !attrs) {
    return text || attrs
  }
  if (text.includes('\n')) {
    return `${text}\n\n${attrs}`
  }
  return `${RE_ENDS_WITH_PUNCTUATION.test(text) ? text : `${text}.`} ${attrs}`
}

/**
 * Turns an identifier (e.g. an operationId with slashes or spaces) into a safe file name.
 */
export function sanitizeFileName(value: string, fallback = 'operation'): string {
  const sanitized = value
    .replace(RE_UNSAFE_FILE_CHARS, '-')
    .replace(RE_REPEATED_DASHES, '-')
    .replace(RE_EDGE_DASHES_DOTS, '')
  return sanitized || fallback
}

/**
 * YAML frontmatter block. Strings are JSON-encoded, which is valid YAML.
 */
export function frontmatter(data: Record<string, unknown>): string {
  const lines = Object.entries(data)
    .filter(([, value]) => value !== undefined && value !== '')
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
  return ['---', ...lines, '---'].join('\n')
}
