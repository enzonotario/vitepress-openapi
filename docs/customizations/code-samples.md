---
aside: false
outline: false
---

# Code Samples

You can customize the `langs` to show, the `availableLangs`, and `generator` for Code Samples. For example, you can add [Bru Markup Language](https://docs.usebruno.com/bru-lang/overview) to the list of languages to show and available languages to select from and a generator to convert the request object to Bru code.

```ts

```markdown
---
aside: false
outline: false
title: vitepress-openapi
---

<script setup lang="ts">
import { useData } from 'vitepress'
import { useTheme, generateCodeSample } from 'vitepress-openapi'

const { isDark } = useData()

useTheme({
    codeSamples: {
        // List of languages to show in Code Samples section.
        langs: [
            'bruno',
            ...useTheme().getCodeSamplesLangs(),
        ],
        // List of available languages to select from.
        availableLanguages: [
            {
                lang: 'bruno',
                label: 'Bruno',
                highlighter: 'plaintext',
            },
            ...useTheme().getCodeSamplesAvailableLanguages(),
        ],
        defaultLang: 'bruno',
        generator: (lang, request) => {
            if (lang === 'bruno') {
                return generateBruRequest(request)
            }

            return generateCodeSample(lang, request)
        },
    },
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

<OASpec :isDark="isDark" />
```

## Example

<script setup lang="ts">
import { useData } from 'vitepress'
import { useTheme, generateCodeSample } from 'vitepress-openapi'

const { isDark } = useData()

useTheme({
    codeSamples: {
        // List of languages to show in Code Samples section.
        langs: [
            'bruno',
            ...useTheme().getCodeSamplesLangs(),
        ],
        // List of available languages to select from.
        availableLanguages: [
            {
                lang: 'bruno',
                label: 'Bruno',
                highlighter: 'plaintext',
            },
            ...useTheme().getCodeSamplesAvailableLanguages(),
        ],
        defaultLang: 'bruno',
        generator: (lang, request) => {
            if (lang === 'bruno') {
                return generateBruRequest(request)
            }

            return generateCodeSample(lang, request)
        },
    },
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

<OASpec :isDark="isDark" />
