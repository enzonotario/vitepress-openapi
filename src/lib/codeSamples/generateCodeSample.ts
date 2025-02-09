import type { OARequest } from './request'
import { snippetz } from '@scalar/snippetz'
import { OARequestToRequest } from './convertOARequestToRequest'
import { convertRequestToHarRequest } from './convertRequestToHarRequest'

export async function generateCodeSample(lang: string, oaRequest: OARequest): Promise<string> {
  try {
    const req = OARequestToRequest(oaRequest)
    const harRequest = await convertRequestToHarRequest(req)

    switch (lang) {
      case 'curl':
        return snippetz().print('shell', 'curl', harRequest) ?? ''
      case 'javascript':
        return snippetz().print('js', 'fetch', harRequest) ?? ''
      case 'php':
        return snippetz().print('php', 'curl', harRequest) ?? ''
      case 'python':
        return snippetz().print('python', 'requests', harRequest) ?? ''
      default:
        return ''
    }
  } catch (e) {
    console.error(e)
    return ''
  }
}
