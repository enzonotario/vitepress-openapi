/**
 * Names of the path parameters of `path` that are still placeholders (`{name}`) in the request URL.
 * An empty path parameter keeps its placeholder: sending the request would hit a literal `{name}` segment.
 */
export function getMissingPathParameters(path: string, url: URL | string): string[] {
  const names = [...path.matchAll(/\{([^{}]+)\}/g)].map(match => match[1])
  if (!names.length) {
    return []
  }

  const pathname = new URL(String(url)).pathname
  // The URL encodes braces. Restoring only them keeps detection working when another escape is malformed.
  const candidates = [pathname.replace(/%7B/gi, '{').replace(/%7D/gi, '}'), safeDecode(pathname)]
  return [...new Set(names)].filter(name => candidates.some(candidate => candidate.includes(`{${name}}`)))
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value)
  }
  catch {
    return value
  }
}
