function isJsonLikeString(value: string): boolean {
  const trimmed = value.trim()
  return (
    (trimmed.startsWith('{') && trimmed.endsWith('}'))
    || (trimmed.startsWith('[') && trimmed.endsWith(']'))
  )
}

function safeStringify(value: any): string {
  try {
    return JSON.stringify(value)
  }
  catch {
    return String(value)
  }
}

function formatStringCommon(value: string, options: { quoteNormalStrings: boolean }): string {
  if (isJsonLikeString(value)) {
    return value
  }
  return options.quoteNormalStrings ? JSON.stringify(value) : String(value)
}

export function formatValueForDisplay(value: any): string {
  if (value === undefined) {
    return ''
  }

  if (value === null) {
    return 'null'
  }

  if (typeof value === 'object') {
    return safeStringify(value)
  }

  if (typeof value === 'string') {
    // For normal strings, keep quotes to distinguish from numbers/booleans.
    return formatStringCommon(value, { quoteNormalStrings: true })
  }

  return safeStringify(value)
}

export function formatValueForPlaceholder(value: any): string {
  if (value === undefined || value === null) {
    return ''
  }

  if (typeof value === 'object') {
    return safeStringify(value)
  }

  if (typeof value === 'string') {
    return formatStringCommon(value, { quoteNormalStrings: false })
  }

  return String(value)
}
