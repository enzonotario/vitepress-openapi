import type { JSONSchema } from '@trojs/openapi-dereference'

const refCache = new Map<JSONSchema, Map<string, unknown>>()

export function resolveRefSync(schema: JSONSchema, ref: string): unknown {
  if (!refCache.has(schema)) {
    refCache.set(schema, new Map())
  }

  const schemaCache = refCache.get(schema) as Map<string, unknown>

  if (schemaCache.has(ref)) {
    return schemaCache.get(ref)
  }

  const path = ref.split('/').slice(1)

  let current: any = schema
  for (const segment of path) {
    if (!current || typeof current !== 'object') {
      current = null
      break
    }
    current = current[segment] ?? null
  }

  schemaCache.set(ref, current)
  return current
}

// Lightweight deep clone based on klona
export function klona(val: any): any {
  if (Array.isArray(val)) {
    const out = Array.from({ length: val.length })
    for (let i = 0; i < val.length; i++) {
      out[i] = val[i] && typeof val[i] === 'object' ? klona(val[i]) : val[i]
    }
    return out
  }

  if (Object.prototype.toString.call(val) === '[object Object]') {
    const out: any = {}
    for (const key in val) {
      if (key === '__proto__') {
        Object.defineProperty(out, key, {
          value: klona((val as any)[key]),
          configurable: true,
          enumerable: true,
          writable: true,
        })
      } else {
        const tmp = (val as any)[key]
        out[key] = tmp && typeof tmp === 'object' ? klona(tmp) : tmp
      }
    }
    return out
  }

  return val
}

const annotationKeys = new Set([
  'title',
  'description',
  'summary',
  'default',
  'deprecated',
  'readOnly',
  'writeOnly',
  'examples',
  'example',
])

const cache = new Map<JSONSchema, JSONSchema>()

export function dereferenceWithAnnotationsSync(schema: JSONSchema): JSONSchema {
  if (cache.has(schema)) {
    return cache.get(schema) as JSONSchema
  }

  const visitedNodes = new Set<any>()
  const cloned = klona(schema)

  const resolve = (current: any, path: string = '#'): any => {
    if (typeof current === 'object' && current !== null) {
      // make sure we don't visit the same node twice
      if (visitedNodes.has(current)) {
        return current
      }
      visitedNodes.add(current)

      if (Array.isArray(current)) {
        // array
        for (let index = 0; index < current.length; index++) {
          current[index] = resolve(current[index], `${path}/${index}`)
        }
      } else {
        // object
        if ('$ref' in current && typeof current.$ref === 'string') {
          let ref: any = current
          do {
            ref = resolveRefSync(cloned, ref.$ref)
          } while (ref?.$ref)

          // Create a new object with the resolved reference properties
          const resolved = {}
          for (const key in ref) {
            resolved[key] = ref[key]
          }

          // Add annotation keys from the original reference
          for (const key in current) {
            if (key !== '$ref' && annotationKeys.has(key)) {
              resolved[key] = current[key]
            }
          }

          // Resolve any nested references in the resolved object
          for (const key in resolved) {
            resolved[key] = resolve(resolved[key], `${path}/${key}`)
          }

          return resolved
        }

        for (const key in current) {
          current[key] = resolve(current[key], `${path}/${key}`)
        }
      }
    }
    return current
  }

  const result = resolve(cloned, '#')
  cache.set(schema, result)
  return result
}
