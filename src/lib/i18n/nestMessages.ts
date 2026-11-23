export interface NestedMessages {
  [key: string]: string | NestedMessages
}

/**
 * `@byjohann/vue-i18n` splits keys on `.` and reads them as nested paths, so flat keys such as
 * `operation.badgePrefix.operationId` or `Failed to load the JSON editor.` were never found.
 * This nests each flat key along that same path, so `t()` finds it.
 */
export function nestMessages(messages: Record<string, string>): NestedMessages {
  // Null-prototype nodes, read only through own properties: a key such as `__proto__.toString` must not
  // reach `Object.prototype`.
  const nested = createNode()

  for (const [key, value] of Object.entries(messages)) {
    const parts = key.split('.')
    let node = nested
    let reachable = true

    for (const part of parts.slice(0, -1)) {
      const child = Object.hasOwn(node, part) ? node[part] : undefined
      if (typeof child === 'string') {
        // A shorter key already holds this path: `t()` can't reach this one.
        reachable = false
        break
      }
      node = child ?? (node[part] = createNode())
    }

    const last = parts[parts.length - 1]
    if (reachable && !(Object.hasOwn(node, last) && typeof node[last] === 'object')) {
      node[last] = value
    }
  }

  return nested
}

function createNode(): NestedMessages {
  return Object.create(null)
}
