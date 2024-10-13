export function hasExample(schema: any, visited: Set<any> = new Set(), level: number = 0): boolean {
  if (visited.has(schema)) {
    if (level > 10) {
      return false // Assume no example for circular references.
    }

    visited = new Set()
  }

  visited.add(schema)

  if (schema?.example || schema?.examples) {
    return true
  }

  if (schema?.properties) {
    return Object.values(schema.properties).some(property =>
      hasExample(property, new Set(visited), level + 1),
    )
  }

  if (schema?.items) {
    return hasExample(schema.items, new Set(visited), level + 1)
  }

  return false
}
