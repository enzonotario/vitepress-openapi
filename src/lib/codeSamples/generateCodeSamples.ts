import { useCodeSamples } from '../../composables/useCodeSamples'
import { OARequest } from './request'
import { generateCodeSampleJavaScript } from './generateCodeSampleJavaScript'
import { generateCodeSampleCurl } from './generateCodeSampleCurl'
import { generateCodeSamplePhp } from './generateCodeSamplePhp'
import { generateCodeSamplePython } from './generateCodeSamplePython'

export function generateCodeSamples(url, method) {
  const request = new OARequest(url, method)

  return useCodeSamples().availableLanguages.map((lang) => {
    return {
      highlighter: lang.highlighter,
      lang: lang.lang,
      label: lang.label,
      source: generateCodeSample(lang.lang, request),
    }
  })
}

export function generateCodeSample(lang: string, request: OARequest) {
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
      return null
  }
}
