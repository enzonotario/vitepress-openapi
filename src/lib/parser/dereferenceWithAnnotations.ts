import type { JSONSchema } from '@trojs/openapi-dereference'

// Symbol used as a non-enumerable marker to preserve the original identity of
// each schema node. It allows us to detect circular references later even after
// objects are cloned during dereferencing.
export const originSymbol = Symbol('origin')

// Cache resolved $refs per root schema to avoid repeatedly walking the same JSON pointer path
const refCache = new Map<JSONSchema, Map<string, unknown>>()

/**
 * Resolve a JSON Pointer against the provided schema.
 * The implementation mirrors the one from @trojs/openapi-dereference but is
 * inlined here so we can tweak dereferencing behaviour.
 * Results are cached per schema for performance.
 */
export function resolveRefSync(schema: JSONSchema, ref: string): unknown {
  if (!refCache.has(schema)) {
    refCache.set(schema, new Map())
  }

  const schemaCache = refCache.get(schema) as Map<string, unknown>

  if (schemaCache.has(ref)) {
    return schemaCache.get(ref)
  }

  // The ref is a JSON pointer, so walk through the path segments to find the
  // referenced node in the schema. The leading "#" is removed by splitting.
  const path = ref.split('/').slice(1)

  let current: any = schema
  // Walk segment by segment until we either reach the target or hit a dead end
  // (e.g. the pointer references a non-object).
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

// Lightweight deep clone based on https://github.com/lukeed/klona, License - MIT;
// implementation from the @trojs/openapi-dereference https://trojs.org/, License - MIT.
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

// Recursively walk the cloned schema and attach the origin symbol to each node.
// The function uses a WeakSet to avoid infinite loops in case of cycles.
function markOrigins(obj: any, visited = new WeakSet()) {
  if (obj && typeof obj === 'object' && !visited.has(obj)) {
    visited.add(obj)

    Object.defineProperty(obj, originSymbol, { value: obj, enumerable: false })

    const values = Array.isArray(obj) ? obj : Object.values(obj)

    for (const value of values) {
      markOrigins(value, visited)
    }
  }
}

// Clone an object or array while retaining the origin symbol from the source
function cloneWithOrigins(src: any): any {
  const target = Array.isArray(src) ? [...src] : { ...src }

  Object.defineProperty(target, originSymbol, {
    value: src[originSymbol] || src,
    enumerable: false,
  })

  return target
}

// Keys that represent annotations allowed next to a $ref according to the JSON Schema specification
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

// Cache for fully dereferenced schemas so repeated calls are cheap
const cache = new Map<JSONSchema, JSONSchema>()

/**
 * Dereference the given schema while merging JSON-schema annotations that appear next to a $ref node.
 * Circular references are preserved via the originSymbol so downstream code can still detect them.
 */
export function dereferenceWithAnnotationsSync(schema: JSONSchema): JSONSchema {
  if (cache.has(schema)) {
    return cache.get(schema) as JSONSchema
  }

  const visitedNodes = new Set<any>()
  const cloned = klona(schema)
  markOrigins(cloned)

  const resolve = (current: any): any => {
    if (typeof current === 'object' && current !== null) {
      // Don't process the same object twice to prevent infinite recursion on circular structures
      if (visitedNodes.has(current)) {
        return current
      }
      visitedNodes.add(current)

      if (Array.isArray(current)) {
        // Recurse into array items
        for (let index = 0; index < current.length; index++) {
          current[index] = resolve(current[index])
        }
      } else {
        if ('$ref' in current && typeof current.$ref === 'string') {
          // Follow $ref pointers until we reach a concrete schema object
          let ref: any = current
          do {
            ref = resolveRefSync(cloned, ref.$ref)
          } while (ref?.$ref)

          // Clone the referenced object so that adding annotations doesn't mutate the cache
          // and keep track of where it originated from
          ref = cloneWithOrigins(ref)
          ref = resolve(ref)

          // Merge annotations that were defined next to the $ref
          for (const key in current) {
            if (key !== '$ref' && annotationKeys.has(key)) {
              ref[key] = current[key]
            }
          }
          return ref
        }

        // Recurse into object properties
        for (const key in current) {
          current[key] = resolve(current[key])
        }
      }
    }
    return current
  }

  // Start resolution from the cloned root object
  const result = resolve(cloned)
  cache.set(schema, result)
  return result
}
