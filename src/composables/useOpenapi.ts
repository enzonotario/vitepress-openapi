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
  spec?: OpenAPIDocument
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
    spec?: OpenAPIDocument
  } = {}) {
    if (spec) {
      setInstance(
        parseOpenapi().instanceSync({
          spec,
          defaultTag: config?.spec?.defaultTag,
          defaultTagDescription: config?.spec?.defaultTagDescription,
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
    spec?: OpenAPIDocument
  } = {}) {
    if (spec) {
      setInstance(
        await parseOpenapi().instanceAsync({
          spec,
          defaultTag: config?.spec?.defaultTag,
          defaultTagDescription: config?.spec?.defaultTagDescription,
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
