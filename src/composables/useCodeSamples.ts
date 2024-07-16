import { useOpenapi } from 'vitepress-theme-openapi'
import {codeToHtml} from 'shikiji'

export function useCodeSamples() {
  async function generateCodeSample({ lang, label, source, theme } ) {
    return {
      lang,
      label,
      source,
      html: await codeToHtml(source, {
        lang,
        theme,
      }),
    }
  }

  async function getCodeSamples(operationId: string, { theme = 'vitesse-light' } = {}) {
    const url = useOpenapi().getBaseUrl() + useOpenapi().getOperationPath(operationId)

    return {
      curl: await generateCodeSample({
        lang: 'bash',
        label: 'cURL',
        source: `curl -X GET "${url}"`,
        theme,
      }),
      javascript: await generateCodeSample({
        lang: 'javascript',
        label: 'JavaScript',
        source: `fetch("${url}")
  .then(response => response.json())
  .then(data => console.log(data));`,
        theme,
      }),
      php: await generateCodeSample({
        lang: 'php',
        label: 'PHP',
        source: `file_get_contents("${url}");`,
        theme,
      }),
      python: await generateCodeSample({
        lang: 'python',
        label: 'Python',
        source: `import requests
response = requests.get("${url}")
print(response.json())`,
        theme,
      }),
    }
  }

  return {
    getCodeSamples,
  }
}
