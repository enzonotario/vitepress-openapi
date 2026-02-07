<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount } from 'vue'
import { useTheme, generateCodeSample } from 'vitepress-openapi/client'

onBeforeMount(() => {
    useTheme({
        codeSamples: {
            availableLanguages: [
                {
                    lang: 'bruno',
                    label: 'Bruno',
                    highlighter: 'plaintext',
                },
                ...useTheme().getCodeSamplesAvailableLanguages(),
            ],
            defaultLang: 'bruno',
            generator: async (langConfig, request) => {
                if (langConfig.lang === 'bruno') {
                    return generateBruRequest(request)
                }

                return generateCodeSample(langConfig, request)
            },
        },
    })
})

onBeforeUnmount(() => {
    useTheme().reset()
})

function generateBruRequest(request) {
  const { url, method, headers, body, query } = request;

  const methodLower = method.toLowerCase();

  const queryString = query && Object.keys(query).length
    ? `${url}?${new URLSearchParams(query).toString()}`
    : url;

  const headersSection = headers && Object.keys(headers).length
    ? `headers {\n${Object.entries(headers)
        .map(([key, value]) => `  ${key}: ${value}`)
        .join('\n')}\n}`
    : '';

  const bodySection = body
    ? `body {\n  ${JSON.stringify(body, null, 2).replace(/\n/g, '\n  ')}\n}`
    : '';

  const bruRequest = `${methodLower} {
  url: ${queryString}
}

${headersSection}

${bodySection}
`;

  return bruRequest
        .trim()
        .replace(/\n{2,}/g, '\n\n') // Remove extra newlines
}
</script>

<OASpec />
