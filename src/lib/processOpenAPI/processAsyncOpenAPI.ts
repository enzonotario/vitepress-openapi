import type { ParsedOpenAPI } from '../../types'
import { getCodeSamples } from './getCodeSamples'

export async function processAsyncOpenAPI(spec: ParsedOpenAPI): Promise<ParsedOpenAPI> {
  let parsedSpec = spec

  parsedSpec = await getCodeSamples(parsedSpec)

  return { ...parsedSpec }
}
