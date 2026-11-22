export interface NestedMessages {
  [key: string]: string | NestedMessages
}

/**
 * `@byjohann/vue-i18n` splits keys on `.` and reads them as nested paths, so flat keys such as
 * `operation.badgePrefix.operationId` or `Failed to load the JSON editor.` were never found.
 * This nests each flat key along that same path, so `t()` finds it.
 */
export function nestMessages(messages: Record<string, string>): NestedMessages {
  const nested: NestedMessages = {}

  for (const [key, value] of Object.entries(messages)) {
    const parts = key.split('.')
    let node = nested
    let reachable = true

    for (const part of parts.slice(0, -1)) {
      const child = node[part]
      if (typeof child === 'string') {
        // A shorter key already holds this path: `t()` can't reach this one.
        reachable = false
        break
      }
      node = child ?? (node[part] = {})
    }

    const last = parts[parts.length - 1]
    if (reachable && typeof node[last] !== 'object') {
      node[last] = value
    }
  }

  return nested
}
