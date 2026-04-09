import type { OpenAPIDocument, ParsedPaths } from '../../types'

let parseYAMLCached: typeof import('confbox').parseYAML | null = null

export async function getParseYAML() {
  if (!parseYAMLCached) {
    const { parseYAML } = await import('confbox')
    parseYAMLCached = parseYAML
  }
  return parseYAMLCached
}

export async function preloadParseYAML(): Promise<void> {
  await getParseYAML()
}

function parseStringSpec(spec: string, parseYAML: typeof import('confbox').parseYAML): OpenAPIDocument {
  try {
    const parsed = parseYAML(spec)
    return (parsed ?? {}) as OpenAPIDocument & { paths: ParsedPaths }
  }
  catch (e) {
    console.error('Error parsing spec', e)
    return {} as OpenAPIDocument
  }
}

export function parseSpecSync(spec: OpenAPIDocument | string): OpenAPIDocument {
  if (typeof spec === 'string') {
    if (!parseYAMLCached) {
      console.error(
        'parseSpecSync: string specs require confbox to be loaded first. Await preloadParseYAML() or use parseSpec() before sync parsing.',
      )
      return {} as OpenAPIDocument
    }
    return parseStringSpec(spec, parseYAMLCached)
  }

  if (typeof spec === 'object' && spec !== null) {
    return spec as OpenAPIDocument
  }

  console.error('Invalid spec format')
  return {} as OpenAPIDocument
}

export async function parseSpec(spec: OpenAPIDocument | string): Promise<OpenAPIDocument> {
  if (typeof spec === 'string') {
    const parseYAML = await getParseYAML()
    return parseStringSpec(spec, parseYAML)
  }
  return parseSpecSync(spec)
}
