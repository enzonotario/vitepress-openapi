---
aside: false
outline: false
---

# Custom Server

You can allow users to set a custom server URL in the Playground section.

<ScopeConfigurationTabs>

<template #global>

If you have configured the OpenAPI Specification using the `useOpenapi` composable in your `.vitepress/theme/index.[js,ts]` file, you can set the `allowCustomServer` option to `true` in the `config` object.

```ts
useOpenapi({
    spec,
    config: {
        server: {
            allowCustomServer: true,
        },
    },
})
```

</template>

<template #in-markdown>

In your `.md` files, you can import the `useTheme` composable and set the `allowCustomServer` option to `true`.

```markdown
<script setup>
import { useTheme } from 'vitepress-openapi/client'

useTheme({
    server: {
        allowCustomServer: true,
    },
})
</script>

<OASpec />
```

</template>

</ScopeConfigurationTabs>

---

<ExampleBlock browser-window-class="h-[70vh] max-h-[700px]">

<template #code>

```markdown
---
aside: false
outline: false
title: vitepress-openapi
---

<!--@include: ./parts/custom-server-example.md-->
```

</template>

<template #example>

<!--@include: ./parts/custom-server-example.md-->

</template>

</ExampleBlock>
