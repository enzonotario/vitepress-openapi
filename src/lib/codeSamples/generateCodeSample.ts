import type { LanguageConfig } from '../../composables/useTheme'
import { snippetz } from '@scalar/snippetz'
import { buildHarRequest } from './buildHarRequest'
import { buildRequest } from './buildRequest'
import { OARequest } from './request'

export async function generateCodeSample(
  langConfig: LanguageConfig,
  request: OARequest | any,
): Promise<string> {
  const oaRequest = request instanceof OARequest
    ? request
    : buildRequest(request)

  const harRequest = buildHarRequest(oaRequest)

  const { lang, target, client } = langConfig

  if (!target) {
    console.error(`Language "${lang}" has missing property "target" in availableLanguages`)
    return ''
  }

  if (!client) {
    console.error(`Language "${lang}" has missing property "client" in availableLanguages`)
    return ''
  }

  try {
    return snippetz().print(target as any, client as any, harRequest) ?? ''
  } catch (e) {
    console.error(e, request)
    return ''
  }
}
