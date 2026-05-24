import type { OpenAPIDocument } from '../../types'
import { parseYAML } from 'confbox'

export function parseSpec(spec: OpenAPIDocument | string): OpenAPIDocument {
  if (typeof spec === 'string') {
    try {
      const parsed = parseYAML(spec)
      return (parsed ?? {}) as OpenAPIDocument
    }
    catch (e) {
      console.error('Error parsing spec', e)
      return {} as OpenAPIDocument
    }
  }

  if (typeof spec === 'object' && spec !== null) {
    return spec as OpenAPIDocument
  }

  console.error('Invalid spec format')
  return {} as OpenAPIDocument
}
