import type { OpenAPIDocument } from '../types'
import type { PartialUseThemeConfig } from './useTheme'
import { prepareOpenAPI } from '../lib/prepareOpenAPI/prepareOpenAPI'
import { processOpenAPI } from '../lib/processOpenAPI/processOpenAPI'
import { useOpenapi } from './useOpenapi'

export async function useOpenapiAsync({ spec, config }: { spec: OpenAPIDocument, config?: PartialUseThemeConfig }) {
  const transformedSpec = prepareOpenAPI({
    spec,
    defaultTag: config?.spec?.defaultTag,
    defaultTagDescription: config?.spec?.defaultTagDescription,
  })

  const parsedSpec = await processOpenAPI(transformedSpec)

  return useOpenapi({ spec, parsedSpec, config })
}
