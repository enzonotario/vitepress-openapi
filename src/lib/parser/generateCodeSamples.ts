import type { ParsedOpenAPI, ParsedOperation } from '../../types'
import { availableLanguages, useTheme } from '../../composables/useTheme'
import { buildOperationRequest } from '../codeSamples/buildOperationRequest'
import { generateCodeSample } from '../codeSamples/generateCodeSample'
import { httpVerbs } from '../constants'
import { resolveBaseUrl } from '../utils/resolveBaseUrl'

export async function generateCodeSamples(spec: ParsedOpenAPI): Promise<ParsedOpenAPI> {
  if (!spec?.paths) {
    return spec
  }

  const baseUrl = resolveBaseUrl(spec.servers?.[0]?.url || '')

  for (const [path, pathObject] of Object.entries(spec.paths)) {
    for (const verb of httpVerbs) {
      const operation = (pathObject as Record<string, any>)[verb] as ParsedOperation

      if (!operation) {
        continue
      }

      const request = buildOperationRequest({
        path,
        method: verb,
        operation,
        baseUrl,
        headers: useTheme().getCodeSamplesDefaultHeaders() || {},
      })

      operation.codeSamples = await Promise.all(
        availableLanguages.map(async (language) => {
          return {
            ...language,
            source: await generateCodeSample(language, request),
          }
        }),
      )
    }
  }

  return spec
}
