import type { ClientId, TargetId } from '@scalar/types/snippetz'
import { snippetz } from '@scalar/snippetz'
import { buildHarRequest } from './buildHarRequest'
import { buildRequest } from './buildRequest'
import { OARequest } from './request'

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
  python: 'requests',
}

export async function generateCodeSample(lang: string, request: OARequest | any): Promise<string> {
  if (!(request instanceof OARequest)) {
    request = buildRequest(request)
  }

  const harRequest = buildHarRequest(request)

  try {
    return snippetz().print(languagesMap[lang], clientsMap[lang], harRequest) ?? ''
  } catch (e) {
    console.error(e, request)
    return ''
  }
}
