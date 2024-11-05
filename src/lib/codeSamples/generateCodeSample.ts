import type { OARequest } from './request'
import { generateCodeSampleJavaScript } from './generateCodeSampleJavaScript'
import { generateCodeSampleCurl } from './generateCodeSampleCurl'
import { generateCodeSamplePhp } from './generateCodeSamplePhp'
import { generateCodeSamplePython } from './generateCodeSamplePython'

export function generateCodeSample(lang: string, request: OARequest): string {
  switch (lang) {
    case 'curl':
      return generateCodeSampleCurl(request)
    case 'javascript':
      return generateCodeSampleJavaScript(request)
    case 'php':
      return generateCodeSamplePhp(request)
    case 'python':
      return generateCodeSamplePython(request)
    default:
      return ''
  }
}
