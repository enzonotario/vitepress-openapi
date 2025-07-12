import type { OpenAPI } from '@scalar/openapi-types'

interface SchemaNode {
  key: string
  value: OpenAPI.SchemaObject
  parent: SchemaNode | null
}

export function resolveCircularRef(schema: OpenAPI.SchemaObject): OpenAPI.SchemaObject {
  const rootNode: SchemaNode = {
    key: 'root',
    value: schema,
    parent: null,
  }

  traverseNode(rootNode)

  return schema
}

function traverseNode(node: SchemaNode): void {
  const { value } = node

  if (typeof value !== 'object' || value === null) {
    // Base case: leaf node or non-object node.
    return
  }

  const circularReference = detectCircularReference(node.parent, value)

  if (circularReference) {
    // Replace the circular reference with a descriptor object.
    node.parent!.value[node.key] = {
      type: 'object',
      meta: {
        circularReference,
        isCircularReference: true,
      },
    }
  } else {
    // Recursively traverse child nodes.
    for (const [key, childValue] of Object.entries(value)) {
      const childNode: SchemaNode = {
        key,
        value: childValue,
        parent: node,
      }

      traverseNode(childNode)
    }
  }
}

function detectCircularReference(ancestor: SchemaNode | null, value: any): string | null {
  while (ancestor) {
    if (ancestor.value === value) {
      return buildReferencePath(ancestor)
    }
    ancestor = ancestor.parent
  }
  return null
}

function buildReferencePath(node: SchemaNode | null): string {
  if (!node) {
    return ''
  }
  return `${buildReferencePath(node.parent)}/${node.key}`
}
