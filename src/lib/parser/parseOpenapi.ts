import type { JSONSchema } from '@trojs/openapi-dereference'
import type { OpenAPIDocument, ParsedOpenAPI } from '../../types'
import { dereferenceSync } from '@trojs/openapi-dereference'
import { $trycatch } from '@tszen/trycatch'
import { merge } from 'allof-merge'
import { generateCodeSamples } from './generateCodeSamples'
import { generateMissingOperationIds } from './generateMissingOperationIds'
import { generateMissingSummary } from './generateMissingSummary'
import { generateMissingTags } from './generateMissingTags'
import { generateRequestBodyUi } from './generateRequestBodyUi'
import { generateResponseUi } from './generateResponseUi'
import { generateSecurityUi } from './generateSecurityUi'

export function parseOpenapi() {
  function transformSync({
    spec,
    defaultTag = undefined,
    defaultTagDescription = undefined,
  }: {
    spec: OpenAPIDocument
    defaultTag?: string
    defaultTagDescription?: string
  }) {
    if (import.meta.env.VITE_DEBUG) {
      console.warn('Transforming OpenAPI spec:', spec)
    }

    if (!spec) {
      return {}
    }

    if (!spec.openapi || !String(spec.openapi).startsWith('3.')) {
      console.warn('Only OpenAPI 3.x is supported')
      return {}
    }

    if (spec?.paths) {
      spec = generateMissingOperationIds(spec)
      spec = generateMissingSummary(spec)
      spec = generateMissingTags({ spec, defaultTag, defaultTagDescription })
    }

    spec.externalDocs = spec.externalDocs || spec.externalDocs || {}
    spec.info = spec.info || spec.info || {}
    spec.servers = spec.servers || spec.servers || []
    spec.tags = spec.tags || spec.tags || []

    return Object.assign({}, spec)
  }

  async function transformAsync({
    spec,
  }: {
    spec: ParsedOpenAPI
  }): Promise<ParsedOpenAPI> {
    const [result, err] = await $trycatch(() => generateCodeSamples(spec))
    spec = err ? spec : result

    return spec
  }

  function parseSync({
    spec,
    defaultTag = undefined,
    defaultTagDescription = undefined,
  }: {
    spec: OpenAPIDocument
    defaultTag?: string
    defaultTagDescription?: string
  }): ParsedOpenAPI {
    let parsedSpec = Object.assign({}, spec) as ParsedOpenAPI

    const [mergedSpec, errMerge] = $trycatch(() => merge(
      transformSync({
        spec,
        defaultTag,
        defaultTagDescription,
      }),
    ) as ParsedOpenAPI)
    parsedSpec = errMerge ? parsedSpec : mergedSpec

    const [dereferencedSpec, errDereference] = $trycatch(() => dereferenceSync(parsedSpec as JSONSchema) as ParsedOpenAPI)
    parsedSpec = errDereference ? parsedSpec : dereferencedSpec

    const [securitySpec, errSecurity] = $trycatch(() => generateSecurityUi(parsedSpec))
    parsedSpec = errSecurity ? parsedSpec : securitySpec

    const [requestBodySpec, errRequestBody] = $trycatch(() => generateRequestBodyUi(parsedSpec))
    parsedSpec = errRequestBody ? parsedSpec : requestBodySpec

    const [responseSpec, errResponse] = $trycatch(() => generateResponseUi(parsedSpec))
    parsedSpec = errResponse ? parsedSpec : responseSpec

    parsedSpec.externalDocs = parsedSpec.externalDocs || parsedSpec.externalDocs || {}
    parsedSpec.info = parsedSpec.info || parsedSpec.info || {}
    parsedSpec.servers = parsedSpec.servers || parsedSpec.servers || []
    parsedSpec.tags = parsedSpec.tags || parsedSpec.tags || []

    return Object.assign({}, parsedSpec)
  }

  async function parseAsync({
    spec,
    defaultTag = undefined,
    defaultTagDescription = undefined,
  }: {
    spec: OpenAPIDocument
    defaultTag?: string
    defaultTagDescription?: string
  }): Promise<ParsedOpenAPI> {
    let parsedSpec = parseSync({
      spec,
      defaultTag,
      defaultTagDescription,
    })

    parsedSpec = await transformAsync({
      spec: parsedSpec,
    })

    return parsedSpec
  }

  return {
    transformSync,
    transformAsync,
    parseSync,
    parseAsync,
  }
}
