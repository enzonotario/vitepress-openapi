import type { ParsedOpenAPI } from '../../types'
import { getCodeSamples } from './getCodeSamples'

export async function processOpenAPIAsync(spec: ParsedOpenAPI): Promise<ParsedOpenAPI> {
  spec = await getCodeSamples(spec)

  return spec
}
