import { merge } from 'allof-merge'
import { dereferenceSync } from '@trojs/openapi-dereference'

export function parseSpec(spec) {
  if (import.meta.env.VITE_DEBUG) {
    console.warn('Parsing OpenAPI spec:', spec)
  }
  try {
    const mergedSpec = merge(spec)
    return dereferenceSync(mergedSpec)
  } catch (error) {
    console.warn('Failed to parse OpenAPI spec:', error)
    return { ...spec }
  }
}
