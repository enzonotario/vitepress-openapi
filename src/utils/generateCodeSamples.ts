import { useOpenapi } from 'vitepress-theme-openapi'

export function generateCodeSamples(operationId: string) {
    const url = useOpenapi().getBaseUrl() + useOpenapi().getOperationPath(operationId)

    return {
      curl: {
        lang: 'bash',
        label: 'cURL',
        source: `curl -X GET "${url}"`,
      },
      javascript: {
        lang: 'javascript',
        label: 'JavaScript',
        source: `fetch("${url}")
  .then(response => response.json())
  .then(data => console.log(data));`,
      },
      php: {
        lang: 'php',
        label: 'PHP',
        source: `file_get_contents("${url}");`,
      },
      python: {
        lang: 'python',
        label: 'Python',
        source: `import requests
response = requests.get("${url}")
print(response.json())`,
      },
    }
  }

