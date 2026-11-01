import { merge } from 'allof-merge'

/**
 * Merges `allOf` entries under `paths` and `components` without crawling the whole document.
 * Merge a sparse copy holding just those entries, at their original paths so the cycle
 * $refs allof-merge emits stay valid.
 */
export function mergeAllOf(spec: any): any {
  const groups = [['paths'], ...Object.keys(spec.components ?? {}).map(section => ['components', section])]
  const entries = groups.flatMap(group => Object.entries(getIn(spec, group) ?? {})
    .filter(([, entry]) => hasAllOf(entry))
    .map(([name]) => [...group, name]))

  if (!entries.length) {
    return spec
  }

  const sparse = { openapi: spec.openapi }
  entries.forEach(path => setIn(sparse, path, getIn(spec, path)))
  const merged = merge(sparse, { source: spec })

  const result = { ...spec }
  entries.forEach(path => setIn(result, path, getIn(merged, path)))
  return result
}

function hasAllOf(value: unknown): boolean {
  if (!value || typeof value !== 'object') {
    return false
  }
  return 'allOf' in value || Object.values(value).some(hasAllOf)
}

function getIn(value: any, path: string[]): any {
  return path.reduce((node, key) => node?.[key], value)
}

// Shallow-copies containers along the path, so the input spec is never mutated.
function setIn(target: any, path: string[], value: unknown): void {
  let node = target
  for (const key of path.slice(0, -1)) {
    node = node[key] = { ...node[key] }
  }
  node[path[path.length - 1]] = value
}
