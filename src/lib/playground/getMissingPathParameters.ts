/**
 * Names of the path parameters of `path` that are still placeholders (`{name}`) in the request URL.
 * An empty path parameter keeps its placeholder: sending the request would hit a literal `{name}` segment.
 */
export function getMissingPathParameters(path: string, url: URL | string): string[] {
  const names = [...path.matchAll(/\{([^{}]+)\}/g)].map(match => match[1])
  if (!names.length) {
    return []
  }

  const pathname = safeDecode(new URL(String(url)).pathname)
  return [...new Set(names)].filter(name => pathname.includes(`{${name}}`))
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value)
  }
  catch {
    return value
  }
}
