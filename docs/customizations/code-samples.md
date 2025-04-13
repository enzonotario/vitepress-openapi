---
aside: false
outline: false
---

# Code Samples

Code Samples allow you to showcase API request examples in multiple programming languages.
This feature helps API consumers understand how to integrate with your API using their preferred language.

You can customize:

- Which languages to display (`langs`)
- Available languages for selection (`availableLangs`)
- How code is generated for each language (`generator`)

## Custom Languages

For example, you can add [Bru Markup Language](https://docs.usebruno.com/bru-lang/overview) to the list of languages to show and available languages to select from and a generator to convert the request object to Bru code.

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

You can enhance your code samples by displaying custom icons for each programming language using the [`vitepress-plugin-group-icons`](https://github.com/yuyinws/vitepress-plugin-group-icons) plugin.

`vitepress-plugin-group-icons` is a markdown-it plugin that processes your Code Groups and only loads the icons you actually use to display them. On the other hand, `vitepress-openapi` is a set of Vue components for visualizing your OpenAPI Specification. Therefore, unless you also use the icons in your Markdown code, `vitepress-plugin-group-icons` will not load the icons that are used in the Vue components of `vitepress-openapi`.

In this case, you should instruct `vitepress-plugin-group-icons` to load certain icons by default, regardless of whether they are used in Markdown files or not.

You can do this by configuring the plugin as follows:

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
