---
aside: false
outline: false
---

# Code Samples

Code Samples allow you to showcase API request examples in multiple programming languages.
This feature helps API consumers understand how to integrate with your API using their preferred language.

You can customize:

- Available languages for selection (`availableLanguages`)
- The default language (`defaultLang`)
- How code is generated for each language (`generator`)

## Default Languages

Out of the box, vitepress-openapi includes the following languages:

| Language | `lang` | `target` / `client` |
|---|---|---|
| cURL | `curl` | `shell` / `curl` |
| JavaScript | `javascript` | `js` / `fetch` |
| PHP | `php` | `php` / `curl` |
| Python | `python` | `python` / `requests` |

You can filter, extend, or fully replace this list using `availableLanguages`.

## Configuring Languages

Each language is defined as a `LanguageConfig` object:

| Property | Required | Description | Examples |
|---|---|---|---|
| `lang` | Yes | Arbitrary identifier, used only for referencing | `'curl'`, `'my-lang'` |
| `label` | Yes | Name shown in the language selector | `'cURL'`, `'Python'` |
| `target` | No | Code generation target for [@scalar/snippetz](https://github.com/scalar/snippetz) | `'shell'`, `'js'`, `'python'` |
| `client` | No | HTTP client library used in generated code | `'curl'`, `'fetch'`, `'axios'` |
| `highlighter` | No | [Shiki language](https://shiki.style/languages) for syntax highlighting | `'bash'`, `'javascript'`, `'plain'` |
| `icon` | No | Icon identifier for [vitepress-plugin-group-icons](https://github.com/yuyinws/vitepress-plugin-group-icons) | `'curl'`, `'.js'`, `'.py'` |

::: tip
`target` and `client` must match a supported [@scalar/snippetz plugin](https://github.com/scalar/scalar/tree/main/packages/snippetz/src/plugins). For icon configuration, see [custom icons](https://github.com/yuyinws/vitepress-plugin-group-icons/blob/main/docs/features.md#custom-icons).
:::

### Setting the Default Language

```ts
useTheme({
  codeSamples: {
    defaultLang: 'python',
  },
})
```

### Filtering Default Languages

```ts
useTheme({
  codeSamples: {
    availableLanguages: useTheme().getCodeSamplesAvailableLanguages(['curl', 'python']),
  },
})
```

### Adding Languages

Spread the defaults and add your own:

```ts
useTheme({
  codeSamples: {
    availableLanguages: [
      ...useTheme().getCodeSamplesAvailableLanguages(),
      { lang: 'csharp', label: 'C#', highlighter: 'csharp', icon: '.cs', target: 'csharp', client: 'httpclient' },
    ],
  },
})
```

### Multiple Variants of the Same Language

You can add multiple entries for the same language with different clients. Use distinct `label` values to differentiate them in the UI:

```ts
useTheme({
  codeSamples: {
    availableLanguages: [
      ...useTheme().getCodeSamplesAvailableLanguages(['curl', 'python']),
      { lang: 'typescript', label: 'TS Fetch', highlighter: 'typescript', icon: '.ts', target: 'js', client: 'fetch' },
      { lang: 'typescript', label: 'TS Axios', highlighter: 'typescript', icon: '.ts', target: 'js', client: 'axios' },
    ],
  },
})
```

### Custom Generator

For languages not supported by `@scalar/snippetz`, omit `target` and `client` and provide a custom `generator`. The generator receives `(langConfig: LanguageConfig, request: OARequest)` and should return a `Promise<string>`. Use `generateCodeSample` from `vitepress-openapi/client` as a fallback for built-in languages.

The example below adds [Bru Markup Language](https://docs.usebruno.com/bru-lang/overview) with a custom generator that converts the request to Bru code.

<ExampleBlock browser-window-class="h-[70vh] max-h-[700px]">

<template #code>

```markdown
---
aside: false
outline: false
title: vitepress-openapi
---

<!--@include: ./parts/code-samples-example.md-->
```

</template>

<template #example>

<!--@include: ./parts/code-samples-example.md-->

</template>

</ExampleBlock>

## Using Icons with `vitepress-plugin-group-icons`

[`vitepress-plugin-group-icons`](https://github.com/yuyinws/vitepress-plugin-group-icons) is a separate plugin that must be installed manually. It only loads icons referenced in Markdown files, so since `vitepress-openapi` renders code samples via Vue components, you need to instruct the plugin to preload the icons you use:

```ts {2,7-22} [.vitepress/config.ts]
import { defineConfigWithTheme } from 'vitepress'
import { groupIconVitePlugin } from 'vitepress-plugin-group-icons'

export default defineConfigWithTheme({
  // Your VitePress configuration...
  
  vite: {
    plugins: [
      groupIconVitePlugin({
        customIcon: {
          curl: 'simple-icons:curl', // Custom icon for curl.
        },
        defaultLabels: [ // Preload icons for specific labels.
          'curl',
          '.ts',
          '.js',
          '.py',
          '.php',
        ],
      }),
    ],
  },
})
```

<div class="flex justify-center">
<div class="tip custom-block w-full max-w-xl p-4 text-center">

[Live Example](https://vitepress-openapi-vitepress-plugin-group-icons.vercel.app/) | [Source Code](https://github.com/enzonotario/vitepress-openapi-vitepress-plugin-group-icons)

</div>
</div>
