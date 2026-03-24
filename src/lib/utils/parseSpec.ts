import type { OpenAPIDocument, ParsedOpenAPI, ParsedPaths } from '../../types'
import { parseYAML } from 'confbox'

export function parseSpecSync(spec: OpenAPIDocument | string): OpenAPIDocument {
  if (typeof spec === 'string') {
    try {
      const parsed = parseYAML(spec)
      return (parsed ?? {}) as OpenAPIDocument & { paths: ParsedPaths }
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


export async function parseSpec(spec: OpenAPIDocument | string): Promise<OpenAPIDocument> {
  if (typeof spec === 'string') {
    try {
      const { parseYAML } = await import('confbox')
      const parsed = parseYAML(spec)
      return (parsed ?? {}) as OpenAPIDocument & { paths: ParsedPaths }
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
