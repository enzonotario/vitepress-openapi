---
outline: 2
---

<script setup>
import ScopeConfigurationTabs from '../.vitepress/theme/components/ScopeConfigurationTabs.vue'
</script>

# Getting Started

This guide will walk you through the steps to set up and use the `vitepress-openapi` in your VitePress project.

## Demo

- [DolarApi.com](https://dolarapi.com/)
- [ArgentinaDatos](https://argentinadatos.com/)
- [CriptoYa API](https://docs.criptoya.com/)

## Prerequisites

Before you begin, make sure you have the following installed:

- Node.js
- VitePress
- OpenAPI Specification (Version 3)

## Installation

To install the theme in your VitePress project, run one of the following commands depending on your preferred package
manager:

```bash
npm install vitepress-openapi

pnpm add vitepress-openapi

yarn add vitepress-openapi

bun install vitepress-openapi
```

## Usage

In your `.vitepress/theme/index.[js,ts]`, import the theme and the CSS file.


::: code-group

```js [JavaScript]
// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import { theme } from 'vitepress-openapi' // [!code ++]
import 'vitepress-openapi/dist/style.css' // [!code ++]

export default {
    extends: DefaultTheme,
    async enhanceApp({ app }) {
        theme.enhanceApp({ app }) // [!code ++]
    }
}
```

```ts [TypeScript]
// .vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { theme } from 'vitepress-openapi' // [!code ++]
import 'vitepress-openapi/dist/style.css' // [!code ++]

export default {
    extends: DefaultTheme,
    async enhanceApp({ app }) {
        theme.enhanceApp({ app }) // [!code ++]
    }
} satisfies Theme
```

:::

## OpenAPI Specification

To use the OpenAPI specification, you can either configure it Globally, or in a specific Markdown file.

<ScopeConfigurationTabs>

<template #global>

In your `.vitepress/theme/index.[js,ts]` file, import the OpenAPI specification and pass it as `spec` prop to the `useOpenapi` composable.

::: code-group

```js [JavaScript]
// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import { theme } from 'vitepress-openapi' // [!code --]
import { theme, useOpenapi } from 'vitepress-openapi' // [!code ++]
import 'vitepress-openapi/dist/style.css'
    
import spec from '../../public/openapi.json' // [!code ++]

export default {
    extends: DefaultTheme,
    async enhanceApp({ app }) {
        // Set the OpenAPI specification.
        const openapi = useOpenapi({ // [!code ++]
            spec, // [!code ++]
        }) // [!code ++]

        // Use the theme.
        theme.enhanceApp({ app }) // [!code --]
        theme.enhanceApp({ app, openapi }) // [!code ++]
    }
}
```

```ts [TypeScript]
// .vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { theme } from 'vitepress-openapi' // [!code --]
import { theme, useOpenapi } from 'vitepress-openapi'// [!code ++]
import 'vitepress-openapi/dist/style.css'

import spec from '../../public/openapi.json' assert { type: 'json' } // [!code ++]

export default {
    extends: DefaultTheme,
    async enhanceApp({ app }) {
        // Set the OpenAPI specification.
        const openapi = useOpenapi({ // [!code ++]
            spec, // [!code ++]
        }) // [!code ++]

        // Use the theme.
        theme.enhanceApp({ app }) // [!code --]
        theme.enhanceApp({ app, openapi }) // [!code ++]
    }
} satisfies Theme
```

:::

</template>

<template #in-markdown>

In your `.md` files, import the OpenAPI specification and pass it as `spec` prop to the `OASpec` or `OAOperation` component.

::: code-group

```md [Using OASpec]
---
aside: false
outline: false
title: vitepress-openapi
---

<script setup>
import { useData } from 'vitepress'
import spec from '../public/openapi.json'

const { isDark } = useData()
</script>

<OASpec :spec="spec" :isDark="isDark" />
```

```md [Using OAOperation]
---
aside: false
outline: false
title: vitepress-openapi
---

<script setup>
import { useRoute, useData } from 'vitepress'
import spec from '../public/openapi.json'

const route = useRoute()

const { isDark } = useData()

const operationId = route.data.params.operationId
</script>

<OAOperation :spec="spec" :operationId="operationId" :isDark="isDark" />
```

:::

</template>

</ScopeConfigurationTabs>

## Theme Configuration

To configure the theme, you can set the theme configuration Globally, or in a specific Markdown file.

<ScopeConfigurationTabs>

<template #global>

If you are using `useOpenapi` in your `.vitepress/theme/index.[js,ts]` file, you can set the theme configuration using the `config` prop.

::: code-group

```js [JavaScript]
// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import { theme, useOpenapi } from 'vitepress-openapi'
import 'vitepress-openapi/dist/style.css'
    
import spec from '../../public/openapi.json'

export default {
    extends: DefaultTheme,
    async enhanceApp({ app }) {
        // Set the OpenAPI specification.
        const openapi = useOpenapi({
            spec,
            config: { // [!code ++]
                // Custom theme configuration... // [!code ++]
            }, // [!code ++]
        })

        // Use the theme.
        theme.enhanceApp({ app, openapi })
    }
}
```

```ts [TypeScript]
// .vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { theme, useOpenapi } from 'vitepress-openapi
import 'vitepress-openapi/dist/style.css'

import spec from '../../public/openapi.json' assert { type: 'json' }

export default {
    extends: DefaultTheme,
    async enhanceApp({ app }) {
        // Set the OpenAPI specification.
        const openapi = useOpenapi({
            spec,
            config: { // [!code ++]
                // Custom theme configuration... // [!code ++]
            }, // [!code ++]
        })

        // Use the theme.
        theme.enhanceApp({ app, openapi })
    }
} satisfies Theme
```

:::

</template>

<template #in-markdown>

In your `.md` files, you can set the theme configuration using the `useTheme` composable.

::: code-group

```md [Using OASpec]
---
aside: false
outline: false
title: vitepress-openapi
---

<script setup>
import { useData } from 'vitepress'
import { useTheme } from 'vitepress-openapi' // [!code ++]
import spec from '../public/openapi.json'

const { isDark } = useData()

useTheme({ // [!code ++]
    // Custom theme configuration... // [!code ++]
}) // [!code ++]
</script>

<OASpec :spec="spec" :isDark="isDark" />
```

```md [Using OAOperation]
---
aside: false
outline: false
title: vitepress-openapi
---

<script setup>
import { useRoute, useData } from 'vitepress'
import { useTheme } from 'vitepress-openapi' // [!code ++]
import spec from '../public/openapi.json'

const route = useRoute()

const { isDark } = useData()

const operationId = route.data.params.operationId

useTheme({ // [!code ++]
    // Custom theme configuration... // [!code ++]
}) // [!code ++]
</script>

<OAOperation :spec="spec" :operationId="operationId" :isDark="isDark" />
```

:::

</template>

</ScopeConfigurationTabs>
