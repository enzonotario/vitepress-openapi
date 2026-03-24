import type { JSONSchema } from '@trojs/openapi-dereference'
import type { OpenAPIDocument, ParsedOpenAPI } from '../../types'

import { $trycatch } from '@tszen/trycatch'
import { merge } from 'allof-merge'
import { parseSpec, parseSpecSync } from '../utils/parseSpec'
import { dereferenceWithAnnotationsSync } from './dereferenceWithAnnotations'
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
    spec: OpenAPIDocument | string
    defaultTag?: string
    defaultTagDescription?: string
  }) {
    if (import.meta.env.VITE_DEBUG) {
      console.warn('Transforming OpenAPI spec:', spec)
    }

    // need sync function or better alternative
    let specContent = parseSpecSync(spec)

    if (!specContent) {
      return {}
    }

    if (!specContent.openapi || !String(specContent.openapi).startsWith('3.')) {
      console.warn('Only OpenAPI 3.x is supported', JSON.stringify(specContent))
      return {}
    }

    if (specContent?.paths) {
      specContent = generateMissingOperationIds(specContent)
      specContent = generateMissingSummary(specContent)
      specContent = generateMissingTags({ spec: specContent, defaultTag, defaultTagDescription })
    }

    specContent.externalDocs = specContent.externalDocs || {}
    specContent.info = specContent.info || {}
    specContent.servers = specContent.servers || []
    specContent.tags = specContent.tags || []

    return { ...specContent }
  }

  async function transformAsync({
    spec,
  }: {
    spec: ParsedOpenAPI | string
  }): Promise<ParsedOpenAPI> {
    let specContent = await parseSpec(spec)

    const [result, err] = await $trycatch(() => generateCodeSamples(specContent as ParsedOpenAPI))
    specContent = err ? specContent : result

    return specContent as ParsedOpenAPI
  }

  function parseSync({
    spec,
    defaultTag = undefined,
    defaultTagDescription = undefined,
  }: {
    spec: OpenAPIDocument | string
    defaultTag?: string
    defaultTagDescription?: string
  }): ParsedOpenAPI {
    const specContent = parseSpecSync(spec)

    // need sync function or better alternative
    let parsedSpec = { ...specContent } as any

    const [mergedSpec, errMerge] = $trycatch(() => merge(
      transformSync({
        spec,
        defaultTag,
        defaultTagDescription,
      }),
    ) as ParsedOpenAPI)
    parsedSpec = errMerge ? parsedSpec : mergedSpec

    const [dereferencedSpec, errDereference] = $trycatch(() => dereferenceWithAnnotationsSync(parsedSpec as JSONSchema) as ParsedOpenAPI)
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

    return { ...parsedSpec }
  }

  async function parseAsync({
    spec,
    defaultTag = undefined,
    defaultTagDescription = undefined,
  }: {
    spec: OpenAPIDocument | string
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
