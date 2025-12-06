import type { InjectionKey } from 'vue'
import type { OpenApiSpecInstance } from '../lib/OpenApiSpec'
import type { OpenAPIDocument } from '../types'
import type { PartialUseThemeConfig } from './useTheme'
import { inject, provide } from 'vue'
import { createOpenApiSpec } from '../lib/OpenApiSpec'
import { parseOpenapi } from '../lib/parser/parseOpenapi'
import { parseSpec } from '../lib/utils/parseSpec'
import { useTheme } from './useTheme'

export const OPENAPI_LOCAL_KEY: InjectionKey<OpenApiSpecInstance> = Symbol('openapiLocal')

let globalInstance: OpenApiSpecInstance | null = null

function createInstance(options: {
  spec: OpenAPIDocument | string
  defaultTag?: string
  defaultTagDescription?: string
}): OpenApiSpecInstance {
  const originalSpec = parseSpec(options.spec)
  const parsedSpec = parseOpenapi().parseSync({
    spec: options.spec,
    defaultTag: options.defaultTag,
    defaultTagDescription: options.defaultTagDescription,
  })
  return createOpenApiSpec({
    spec: parsedSpec,
    originalSpec,
  })
}

async function createInstanceAsync(options: {
  spec: OpenAPIDocument | string
  defaultTag?: string
  defaultTagDescription?: string
}): Promise<OpenApiSpecInstance> {
  const originalSpec = parseSpec(options.spec)
  const parsedSpec = await parseOpenapi().parseAsync({
    spec: options.spec,
    defaultTag: options.defaultTag,
    defaultTagDescription: options.defaultTagDescription,
  })
  return createOpenApiSpec({
    spec: parsedSpec,
    originalSpec,
  })
}

export function provideOpenapi(instance: OpenApiSpecInstance): void {
  provide(OPENAPI_LOCAL_KEY, instance)
}

export function injectOpenapi(): OpenApiSpecInstance | null {
  return inject(OPENAPI_LOCAL_KEY, null)
}

export function getGlobalOpenapi(): OpenApiSpecInstance | null {
  return globalInstance
}

export function setGlobalOpenapi(instance: OpenApiSpecInstance): void {
  globalInstance = instance
}

export function useOpenapi(options: {
  spec?: OpenAPIDocument | string
  config?: PartialUseThemeConfig
} = {}): OpenApiSpecInstance & {
  async: (asyncOptions?: { spec?: OpenAPIDocument | string }) => Promise<OpenApiSpecInstance>
} {
  if (options.config) {
    useTheme(options.config)
  }

  if (options.spec) {
    globalInstance = createInstance({
      spec: options.spec,
      defaultTag: options.config?.spec?.defaultTag,
      defaultTagDescription: options.config?.spec?.defaultTagDescription,
    })
  }

  const instance = injectOpenapi() ?? globalInstance ?? createOpenApiSpec({})

  async function asyncParse(asyncOptions: { spec?: OpenAPIDocument | string } = {}): Promise<OpenApiSpecInstance> {
    const specToUse = asyncOptions.spec ?? options.spec
    if (!specToUse) {
      throw new Error('No spec provided')
    }
    globalInstance = await createInstanceAsync({
      spec: specToUse,
      defaultTag: options.config?.spec?.defaultTag,
      defaultTagDescription: options.config?.spec?.defaultTagDescription,
    })
    return globalInstance
  }

  return {
    ...instance,
    async: asyncParse,
  }
}

export function createOpenapi(options: {
  spec: OpenAPIDocument | string
  config?: PartialUseThemeConfig
}): OpenApiSpecInstance {
  if (options.config) {
    useTheme(options.config)
  }
  return createInstance({
    spec: options.spec,
    defaultTag: options.config?.spec?.defaultTag,
    defaultTagDescription: options.config?.spec?.defaultTagDescription,
  })
}

export async function createOpenapiAsync(options: {
  spec: OpenAPIDocument | string
  config?: PartialUseThemeConfig
}): Promise<OpenApiSpecInstance> {
  if (options.config) {
    useTheme(options.config)
  }
  return createInstanceAsync({
    spec: options.spec,
    defaultTag: options.config?.spec?.defaultTag,
    defaultTagDescription: options.config?.spec?.defaultTagDescription,
  })
}
