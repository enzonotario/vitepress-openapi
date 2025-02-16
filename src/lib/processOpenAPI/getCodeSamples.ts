import type { OpenAPIV3 } from '@scalar/openapi-types'
import type { ParsedOpenAPI, ParsedOperation, PlaygroundSecurityScheme } from '../../types'
import { availableLanguages, useTheme } from '../../composables/useTheme'
import { buildRequest } from '../codeSamples/buildRequest'
import { generateCodeSample } from '../codeSamples/generateCodeSample'
import { resolveBaseUrl } from '../resolveBaseUrl'

export async function getCodeSamples(spec: ParsedOpenAPI): Promise<ParsedOpenAPI> {
  if (!spec?.paths) {
    return spec
  }

  const baseUrl = resolveBaseUrl(spec.servers?.[0]?.url)

  for (const [path, pathObject] of Object.entries(spec.paths)) {
    for (const verb of Object.keys(pathObject) as OpenAPIV3.HttpMethods[]) {
      const operation = pathObject[verb] as ParsedOperation

      if (!operation) {
        continue
      }

      const authorizations = operation.securityUi?.[0]?.schemes || []

      const request = buildRequest({
        path,
        method: verb,
        baseUrl,
        parameters: operation.parameters || [],
        authorizations: Object.entries(authorizations).map(([name, value]) => {
          return {
            ...spec.components?.securitySchemes?.[name],
            playgroundValue: name,
            label: String(name),
          } as PlaygroundSecurityScheme
        }),
        body: operation.requestBody?.content?.['application/json']?.examples?.example?.value || {},
        headers: {
          ...(useTheme().getCodeSamplesDefaultHeaders() || {}),
        },
        variables: {},
      })

      operation.codeSamples = await Promise.all(
        availableLanguages.map(async (language) => {
          return {
            ...language,
            source: await generateCodeSample(language.lang, request),
          }
        }),
      )
    }
  }

  return spec
}
