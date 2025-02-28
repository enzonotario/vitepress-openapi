import type { ClientId, TargetId } from '@scalar/snippetz/types'
import type { OARequest } from './request'
import { snippetz } from '@scalar/snippetz'
import { buildHarRequest } from './buildHarRequest'
import { buildRequest } from './buildRequest'

const languagesMap: Record<string, TargetId> = {
  curl: 'shell',
  javascript: 'js',
  php: 'php',
  python: 'python',
}

const clientsMap: Record<string, ClientId<TargetId>> = {
  curl: 'curl',
  javascript: 'fetch',
  php: 'curl',
  python: 'python3',
}

export async function generateCodeSample(lang: string, request: OARequest): Promise<string> {
  const harRequest = buildHarRequest(buildRequest(request))

  try {
    return snippetz().print(languagesMap[lang], clientsMap[lang], harRequest) ?? ''
  } catch (e) {
    console.error(e, request)
    return ''
  }
}
