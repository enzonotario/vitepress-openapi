---
outline: 2
---

<script setup>
import ShowcaseList from '../.vitepress/theme/components/showcase/ShowcaseList.vue'
</script>

# Getting Started

This guide will walk you through the steps to set up and use the `vitepress-openapi` in your VitePress project.

## Showcase

<ShowcaseList />

## Prerequisites

Before you begin, make sure you have the following installed:

- Node.js
- VitePress
- OpenAPI Specification (Version 3)

## Installation

Install the `vitepress-openapi` package using your package manager.

::: code-group

```sh [npm]
npm install vitepress-openapi
```

```sh [yarn]
yarn add vitepress-openapi
```

```sh [pnpm]
pnpm add vitepress-openapi
```

```sh [bun]
bun add vitepress-openapi
```

:::

## Usage

In your `.vitepress/theme/index.[js,ts]`, import the theme and the CSS file.


::: code-group

```js [JavaScript]
// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import { theme } from 'vitepress-openapi/client' // [!code ++]
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
import { theme } from 'vitepress-openapi/client' // [!code ++]
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

<details open>

<summary>
<strong>Using a JSON specification</strong>
</summary>

::: code-group

```js [JavaScript]
// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import { theme } from 'vitepress-openapi/client' // [!code --]
import { theme, useOpenapi } from 'vitepress-openapi/client' // [!code ++]
import 'vitepress-openapi/dist/style.css'
    
import spec from '../../public/openapi.json' // [!code ++]

export default {
    extends: DefaultTheme,
    async enhanceApp({ app }) {
        // Set the OpenAPI specification.
        useOpenapi({ // [!code ++]
            spec, // [!code ++]
        }) // [!code ++]

        // Use the theme.
        theme.enhanceApp({ app })
    }
}
```

```ts [TypeScript]
// .vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { theme } from 'vitepress-openapi/client' // [!code --]
import { theme, useOpenapi } from 'vitepress-openapi/client'// [!code ++]
import 'vitepress-openapi/dist/style.css'

import spec from '../../public/openapi.json' with { type: 'json' } // [!code ++]

export default {
    extends: DefaultTheme,
    async enhanceApp({ app }) {
        // Set the OpenAPI specification.
        useOpenapi({ // [!code ++]
            spec, // [!code ++]
        }) // [!code ++]

        // Use the theme.
        theme.enhanceApp({ app })
    }
} satisfies Theme
```

:::

</details>

<details>

<summary>
<strong>Using a YAML specification</strong>
</summary>

The `spec` prop can also accept a YAML string.

::: code-group

```js{11-40} [JavaScript]
// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import { theme } from 'vitepress-openapi/client' // [!code --]
import { theme, useOpenapi } from 'vitepress-openapi/client' // [!code ++]
import 'vitepress-openapi/dist/style.css'

export default {
    extends: DefaultTheme,
    async enhanceApp({ app }) {
        // Set the OpenAPI specification.
        useOpenapi({
            spec: `
openapi: 3.0.4
info:
  title: Sample API
  description: Optional multiline or single-line description in [CommonMark](http://commonmark.org/help/) or HTML.
  version: 0.1.9

servers:
  - url: http://api.example.com/v1
    description: Optional server description, e.g. Main (production) server
  - url: http://staging-api.example.com
    description: Optional server description, e.g. Internal staging server for testing

paths:
  /users:
    get:
      summary: Returns a list of users.
      description: Optional extended description in CommonMark or HTML.
      responses:
        "200": # status code
          description: A JSON array of user names
          content:
            application/json:
              schema:
                type: array
                items:
                  type: string
`,
        })

        // Use the theme.
        theme.enhanceApp({ app })
    }
}
```

```ts{12-41} [TypeScript]
// .vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { theme } from 'vitepress-openapi/client' // [!code --]
import { theme, useOpenapi } from 'vitepress-openapi/client' // [!code ++]
import 'vitepress-openapi/dist/style.css'

export default {
    extends: DefaultTheme,
    async enhanceApp({ app }) {
        // Set the OpenAPI specification.
        useOpenapi({
          spec: `
openapi: 3.0.4
info:
  title: Sample API
  description: Optional multiline or single-line description in [CommonMark](http://commonmark.org/help/) or HTML.
  version: 0.1.9

servers:
  - url: http://api.example.com/v1
    description: Optional server description, e.g. Main (production) server
  - url: http://staging-api.example.com
    description: Optional server description, e.g. Internal staging server for testing

paths:
  /users:
    get:
      summary: Returns a list of users.
      description: Optional extended description in CommonMark or HTML.
      responses:
        "200": # status code
          description: A JSON array of user names
          content:
            application/json:
              schema:
                type: array
                items:
                  type: string
`,
        })

        // Use the theme.
        theme.enhanceApp({ app })
    }
} satisfies Theme
```

:::

</details>

</template>

<template #in-markdown>

<details open>

<summary>
<strong>Using a JSON specification</strong>
</summary>

In your `.md` files, import the OpenAPI specification and pass it as `spec` prop to the `OASpec` or `OAOperation` component.

::: code-group

```md [Using OASpec]
---
aside: false
outline: false
title: vitepress-openapi
---

<script setup>
import spec from '../public/openapi.json'
</script>

<OASpec :spec="spec" />
```

```md [Using OAOperation]
---
aside: false
outline: false
title: vitepress-openapi
---

<script setup>
import { useRoute } from 'vitepress'
import spec from '../public/openapi.json'

const route = useRoute()

const operationId = route.data.params.operationId
</script>

<OAOperation :spec="spec" :operationId="operationId" />
```

:::

</details>

<details>

<summary>
<strong>Using a YAML specification</strong>
</summary>

The `spec` prop can also accept a YAML string.

::: code-group

```md [Using OASpec]
---
aside: false
outline: false
title: vitepress-openapi
---

<script setup>
const spec = `
openapi: 3.0.4
info:
  title: Sample API
  description: Optional multiline or single-line description in [CommonMark](http://commonmark.org/help/) or HTML.
  version: 0.1.9

servers:
  - url: http://api.example.com/v1
    description: Optional server description, e.g. Main (production) server
  - url: http://staging-api.example.com
    description: Optional server description, e.g. Internal staging server for testing

paths:
  /users:
    get:
      summary: Returns a list of users.
      description: Optional extended description in CommonMark or HTML.
      responses:
        "200": # status code
          description: A JSON array of user names
          content:
            application/json:
              schema:
                type: array
                items:
                  type: string
`
</script>

<OASpec :spec="spec" />
```

```md [Using OAOperation]
---
aside: false
outline: false
title: vitepress-openapi
---

<script setup>
import { useRoute } from 'vitepress'

const spec = `
openapi: 3.0.4
info:
  title: Sample API
  description: Optional multiline or single-line description in [CommonMark](http://commonmark.org/help/) or HTML.
  version: 0.1.9

servers:
  - url: http://api.example.com/v1
    description: Optional server description, e.g. Main (production) server
  - url: http://staging-api.example.com
    description: Optional server description, e.g. Internal staging server for testing

paths:
  /users:
    get:
      summary: Returns a list of users.
      description: Optional extended description in CommonMark or HTML.
      responses:
        "200": # status code
          description: A JSON array of user names
          content:
            application/json:
              schema:
                type: array
                items:
                  type: string
`

const route = useRoute()

const operationId = route.data.params.operationId
</script>

<OAOperation :spec="spec" :operationId="operationId" />
```

:::

</details>

<details>

<summary>
<strong>Using a URL specification</strong>
</summary>

You can also use a URL to load the OpenAPI specification. The `spec-url` prop accepts a URL string.

::: code-group

```md [Using OASpec]
---
aside: false
outline: false
title: vitepress-openapi
---

<OASpec spec-url="https://vitepress-openapi.vercel.app/openapi.json" />
```

```md [Using OAOperation]
---
aside: false
outline: false
title: vitepress-openapi
---

<script setup>
import { useRoute } from 'vitepress'
const route = useRoute()
const operationId = route.data.params.operationId
</script>

<OAOperation spec-url="https://vitepress-openapi.vercel.app/openapi.json" :operationId="operationId" />
```

:::

</details>

</template>

</ScopeConfigurationTabs>

## Theme Configuration

To configure the theme, you can set the theme configuration Globally, or in a specific Markdown file.

<ScopeConfigurationTabs>

<template #global>

If you are using `useOpenapi` in your `.vitepress/theme/index.[js,ts]` file, you can set the theme configuration using the `config` prop.

::: code-group

```js-vue [JavaScript]
// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import { theme, useOpenapi } from 'vitepress-openapi/client'
import 'vitepress-openapi/dist/style.css'
    
import spec from '../../public/openapi.json'

export default {
    extends: DefaultTheme,
    async enhanceApp({ app }) {
        // Set the OpenAPI specification.
        useOpenapi({
            spec,
            config: { // [!code ++]
            {{''}}    // Custom theme configuration... [!code ++]
            }, // [!code ++]
        })

        // Use the theme.
        theme.enhanceApp({ app })
    }
}
```

```ts-vue [TypeScript]
// .vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { theme, useOpenapi } from 'vitepress-openapi
import 'vitepress-openapi/dist/style.css'

import spec from '../../public/openapi.json' with { type: 'json' }

export default {
    extends: DefaultTheme,
    async enhanceApp({ app }) {
        // Set the OpenAPI specification.
        useOpenapi({
            spec,
            config: { // [!code ++]
            {{''}}    // Custom theme configuration... [!code ++]
            }, // [!code ++]
        })

        // Use the theme.
        theme.enhanceApp({ app })
    }
} satisfies Theme
```

:::

</template>

<template #in-markdown>

In your `.md` files, you can set the theme configuration using the `useTheme` composable.

::: code-group

```md-vue [Using OASpec]
---
aside: false
outline: false
title: vitepress-openapi
---

<script setup>
import { useTheme } from 'vitepress-openapi/client' // [!code ++]
import spec from '../public/openapi.json'

useTheme({ // [!code ++]
{{''}}    // Custom theme configuration... [!code ++]
}) // [!code ++]
</script>

<OASpec :spec="spec" />
```

```md-vue [Using OAOperation]
---
aside: false
outline: false
title: vitepress-openapi
---

<script setup>
import { useRoute } from 'vitepress'
import { useTheme } from 'vitepress-openapi/client' // [!code ++]
import spec from '../public/openapi.json'

const route = useRoute()

const operationId = route.data.params.operationId

useTheme({ // [!code ++]
{{''}}    // Custom theme configuration... [!code ++]
}) // [!code ++]
</script>

<OAOperation :spec="spec" :operationId="operationId" />
```

:::

</template>

</ScopeConfigurationTabs>
