import type { OpenAPI } from '@scalar/openapi-types'
import { originSymbol } from './dereferenceWithAnnotations'

interface SchemaNode {
  key: string
  value: OpenAPI.SchemaObject
  parent: SchemaNode | null
}

// `done` holds nodes already walked. Pass the same set across calls within one parse
// (operations reference the same dereferenced schemas) to walk each node only once.
export function resolveCircularRef(
  schema: OpenAPI.SchemaObject,
  done = new WeakSet<object>(),
): OpenAPI.SchemaObject {
  traverseNode({ key: 'root', value: schema, parent: null }, new Map(), done)

  return schema
}

// Depth-first walk that cuts back edges (a node whose origin is already on the
// ancestor stack). Nodes already fully walked are skipped: removing every back
// edge found by a DFS leaves an acyclic graph, so shared schemas don't need to be
// re-expanded per path (which is exponential on specs like Stripe's).
function traverseNode(node: SchemaNode, ancestors: Map<unknown, SchemaNode>, done: WeakSet<object>): void {
  const { value } = node

  if (typeof value !== 'object' || value === null) {
    // Base case: leaf node or non-object node.
    return
  }

  const origin = (value as any)[originSymbol] ?? value
  const ancestor = ancestors.get(origin)

  if (ancestor) {
    // Replace the circular reference with a descriptor object.
    node.parent!.value[node.key] = {
      type: 'object',
      circularReference: buildReferencePath(ancestor),
    }
    return
  }

  if (done.has(value)) {
    return
  }

  ancestors.set(origin, node)
  for (const [key, childValue] of Object.entries(value)) {
    traverseNode({ key, value: childValue, parent: node }, ancestors, done)
  }
  ancestors.delete(origin)
  done.add(value)
}

function buildReferencePath(node: SchemaNode | null): string {
  if (!node) {
    return ''
  }
  return `${buildReferencePath(node.parent)}/${node.key}`
}
