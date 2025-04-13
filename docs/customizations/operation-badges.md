---
aside: false
outline: false
---

# Operation Badges

Each operation can have different badges that indicate its state, for example if it is deprecated, the operation id, etc. The available badges are:

- `deprecated`
- `operationId`

By default, only the `deprecated` badge is shown, as appropriate. You can customize the operation badges using the `useTheme({ operation: { badges: string[] })` function. **The order in which you set the badges is the order in which they will be displayed.**

<ExampleBlock browser-window-class="h-[70vh] max-h-[700px]">

<template #code>

```markdown
---
aside: false
outline: false
title: vitepress-openapi
---

<!--@include: ./parts/operation-badges-example.md-->
```

</template>

<template #example>

<!--@include: ./parts/operation-badges-example.md-->

</template>

</ExampleBlock>

<span style="width:100%;height:16px;display:block"></span>

# Custom Prefix

You can also customize the prefix of the badges by setting the `operation.badgePrefix.{badgeName}` key in the i18n messages. For example, in your `.vitepress/theme/index.ts`, before calling `theme.enhanceApp({ app })`, you can set the following:

```typescript
import { locales, theme, useTheme } from 'vitepress-openapi/client'
import DefaultTheme from 'vitepress/theme'
import 'vitepress-openapi/dist/style.css'

export default {
    extends: DefaultTheme,
    enhanceApp({ app }) {
        useTheme({
            i18n: {
                messages: {
                    en: {
                        ...locales.en,
                        'operation.badgePrefix.operationId': 'Operation ID: ',
                    },
                    es: {
                        ...locales.es,
                        'operation.badgePrefix.operationId': 'ID de operación: ',
                    },
                },
            },
        })

        // Use the theme.
        theme.enhanceApp({ app })
    },
}
