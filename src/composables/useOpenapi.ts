import type { OpenAPIDocument, ParsedOpenAPI } from '../types'
import type { PartialUseThemeConfig } from './useTheme'
import { OpenApi } from '../lib/OpenApi'
import { parseOpenapi } from '../lib/parser/parseOpenapi'
import { useTheme } from './useTheme'

export const OPENAPI_LOCAL_KEY = Symbol('openapiLocal')

let openapi: ReturnType<typeof OpenApi> | null = null

export function useOpenapi({
  spec,
  config,
}: {
  spec?: OpenAPIDocument | string
  config?: PartialUseThemeConfig
} = {}) {
  if (config) {
    useTheme(config)
  }

  if (spec) {
    sync({ spec })
  }

  function setInstance({
    spec,
  }: {
    spec: ParsedOpenAPI | OpenAPIDocument
  }) {
    openapi = OpenApi({
      spec,
    })
  }

  function sync({
    spec,
  }: {
    spec?: OpenAPIDocument | string
  } = {}) {
    if (spec) {
      setInstance(
        OpenApi({
          spec: parseOpenapi().parseSync({
            spec,
            defaultTag: config?.spec?.defaultTag,
            defaultTagDescription: config?.spec?.defaultTagDescription,
          }),
        }),
      )
    } else {
      throw new Error('No spec provided')
    }

    return openapi
  }

  async function async({
    spec,
  }: {
    spec?: OpenAPIDocument | string
  } = {}) {
    if (spec) {
      setInstance(
        OpenApi({
          spec: await parseOpenapi().parseAsync({
            spec,
            defaultTag: config?.spec?.defaultTag,
            defaultTagDescription: config?.spec?.defaultTagDescription,
          }),
        }),
      )
    } else {
      throw new Error('No spec provided')
    }

    return openapi
  }

  return {
    ...openapi,
    async,
  }
}
