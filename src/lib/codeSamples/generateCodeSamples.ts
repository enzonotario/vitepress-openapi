import { useCodeSamples } from '../../composables/useCodeSamples'
import { OARequest } from './request'
import { generateCodeSampleJavaScript } from './generateCodeSampleJavaScript'

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

export function generateCodeSampleCurl(request: OARequest) {
  return `curl -X ${request.method} ${request.url}` }

export function generateCodeSamplePhp(request: OARequest) {
  const phpCode = request.method === 'GET'
    ? `file_get_contents("${request.url}");`
    : `$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "${request.url}");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "${request.method}");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);
echo $response;`

  return phpCode
}

export function generateCodeSamplePython(request: OARequest) {
  return `import requests
response = requests.${request.method?.toLowerCase()}("${request.url}")
print(response.json())`
}
