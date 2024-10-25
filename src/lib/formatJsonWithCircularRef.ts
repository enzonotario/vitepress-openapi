export function formatJsonWithCircularRef(json: any): string {
  if (typeof json !== 'object' && typeof json !== 'undefined' && json !== null) {
    return '{}'
  }

  try {
    return JSON.stringify(json, null, 2)
  } catch {
    return replaceCircularDependencies(json)
  }
}

/**
 * JSON.stringify, but with circular dependencies replaced with '[Circular]'.
 */
function replaceCircularDependencies(content: any) {
  const cache = new Set()

  return JSON.stringify(
    content,
    (_, value) => {
      if (typeof value === 'object' && value !== null) {
        if (cache.has(value)) {
          return '[Circular]'
        }

        cache.add(value)
      }
      return value
    },
    2,
  )
}
