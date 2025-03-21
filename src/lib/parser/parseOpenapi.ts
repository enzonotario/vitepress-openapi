import type { JSONSchema } from '@trojs/openapi-dereference'
import type { OpenAPIDocument, ParsedOpenAPI } from '../../types'
import { dereferenceSync } from '@trojs/openapi-dereference'
import { merge } from 'allof-merge'
import { OpenApi } from '../OpenApi'
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

  function parseSync({
    spec,
    defaultTag = undefined,
    defaultTagDescription = undefined,
  }: {
    spec: OpenAPIDocument
    defaultTag?: string
    defaultTagDescription?: string
  }): ParsedOpenAPI {
    let parsedSpec = merge(
      transformSync({
        spec,
        defaultTag,
        defaultTagDescription,
      }),
    ) as ParsedOpenAPI
    parsedSpec = dereferenceSync(parsedSpec as JSONSchema) as ParsedOpenAPI
    parsedSpec = generateSecurityUi(parsedSpec)
    parsedSpec = generateRequestBodyUi(parsedSpec)
    parsedSpec = generateResponseUi(parsedSpec)

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

    parsedSpec = await generateCodeSamples(parsedSpec)

    return parsedSpec
  }

  function instanceSync({
    spec,
    defaultTag = undefined,
    defaultTagDescription = undefined,
  }: {
    spec: OpenAPIDocument
    defaultTag?: string
    defaultTagDescription?: string
  }) {
    return OpenApi({
      spec: parseSync({
        spec,
        defaultTag,
        defaultTagDescription,
      }),
    })
  }

  async function instanceAsync({
    spec,
    defaultTag = undefined,
    defaultTagDescription = undefined,
  }: {
    spec: OpenAPIDocument
    defaultTag?: string
    defaultTagDescription?: string
  }) {
    return OpenApi({
      spec: await parseAsync({
        spec,
        defaultTag,
        defaultTagDescription,
      }),
    })
  }

  return {
    transformSync,
    parseSync,
    parseAsync,
    instanceSync,
    instanceAsync,
  }
}
