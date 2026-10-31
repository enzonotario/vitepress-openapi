---
aside: false
outline: false
title: Custom Highlighter
---

<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount } from 'vue'
import { useTheme, generateCodeSample } from 'vitepress-openapi/client'

/**
 * Tiny TextMate grammar for Bru-like request blocks.
 * Keywords (get/post/...), block names (headers/body), and keys (url:) are colored.
 */
const bruGrammar = {
  name: 'bru',
  scopeName: 'source.bru',
  patterns: [
    {
      match: '\\b(get|post|put|patch|delete|options|head|trace)\\b',
      name: 'keyword.control.bru',
    },
    {
      match: '\\b(headers|body|auth|vars|script)\\b',
      name: 'entity.name.section.bru',
    },
    {
      match: '\\b(url|method|body:json)\\s*:',
      name: 'keyword.other.bru',
    },
    {
      begin: '"',
      end: '"',
      name: 'string.quoted.double.bru',
    },
    {
      match: '\\b\\d+\\b',
      name: 'constant.numeric.bru',
    },
    {
      match: '\\{[^}]*\\}',
      name: 'meta.block.bru',
    },
  ],
}

onBeforeMount(() => {
  useTheme({
    theme: {
      shikiLanguages: {
        bru: bruGrammar,
      },
    },
    codeSamples: {
      availableLanguages: [
        {
          lang: 'bru',
          label: 'Bru',
          highlighter: 'bru',
        },
        ...useTheme().getCodeSamplesAvailableLanguages(['curl', 'javascript']),
      ],
      defaultLang: 'bru',
      generator: async (langConfig, request) => {
        if (langConfig.lang === 'bru') {
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
  const { url, method, headers, body, query } = request

  const methodLower = method.toLowerCase()

  const queryString = query && Object.keys(query).length
    ? `${url}?${new URLSearchParams(query).toString()}`
    : url

  const headersSection = headers && Object.keys(headers).length
    ? `headers {\n${Object.entries(headers)
        .map(([key, value]) => `  ${key}: ${value}`)
        .join('\n')}\n}`
    : ''

  const bodySection = body
    ? `body {\n  ${JSON.stringify(body, null, 2).replace(/\n/g, '\n  ')}\n}`
    : ''

  return `${methodLower} {
  url: ${queryString}
}

${headersSection}

${bodySection}
`
    .trim()
    .replace(/\n{2,}/g, '\n\n')
}
</script>

# Custom Highlighter

This page registers a TextMate grammar with `theme.shikiLanguages` and uses it as the Bru sample `highlighter`. Open the **Bru** tab on a code sample: method names, `headers`/`body`, and `url:` should be colored. Switch to cURL/JavaScript to compare with bundled Shiki languages.

<OASpec spec-url="/openapi-custom-highlighter.json" />
