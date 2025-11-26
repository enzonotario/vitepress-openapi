function isJsonLikeString(value: string): boolean {
  const trimmed = value.trim()
  const looksLikeContainer = (trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))
  if (!looksLikeContainer) {
    return false
  }
  try {
    const parsed = JSON.parse(trimmed)
    return typeof parsed === 'object' && parsed !== null
  }
  catch {
    return false
  }
}

function safeStringify(value: any, space: number | string = 0): string {
  try {
    const json = JSON.stringify(
      value,
      null,
      space,
    )
    return json ?? String(value)
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

export function formatValueForDisplay(
  value: any,
  options: {
    space?: number | string
  } = {
    space: 2,
  },
): string {
  if (value === undefined) {
    return ''
  }

  if (value === null) {
    return 'null'
  }

  if (typeof value === 'object') {
    return safeStringify(value, options?.space ?? 0)
  }

  if (typeof value === 'string') {
    return formatStringCommon(value, { quoteNormalStrings: true })
  }

  return safeStringify(value, options?.space ?? 0)
}

export function formatValueForPlaceholder(
  value: any,
  options: {
    space?: number | string
  } = {
    space: 0,
  },
): string {
  if (value === undefined || value === null) {
    return ''
  }

  if (typeof value === 'object') {
    return safeStringify(value, options?.space ?? 0)
  }

  if (typeof value === 'string') {
    return formatStringCommon(value, { quoteNormalStrings: false })
  }

  return String(value)
}
