---
outline: 2
---

<script setup>
import ScopeConfigurationTabs from '../.vitepress/theme/components/ScopeConfigurationTabs.vue'
</script>

# Pages by Operation

You can use the `OAOperation` component to render a specific operation.

## Creating `operations` pages

To generate pages for each operation, create a directory named `operations` in the `docs` directory. Inside the `operations` directory, create a file named `[operationId].md` and a file named `[operationId].paths.js`.

```
/docs
├── /operations
│   ├── [operationId].md
│   └── [operationId].paths.js
```

## Paths Loader File

Using the [Paths Loader File](https://vitepress.dev/guide/routing#paths-loader-file) feature of VitePress, you can use the `[operationId].paths.js` file to generate the pages for each operation.

```ts
import { usePaths } from 'vitepress-openapi'
import spec from '../public/openapi.json' assert {type: 'json'}

export default {
    paths() {
        return usePaths({ spec })
            .getPathsByVerbs()
            .map(({ operationId, summary }) => {
                return {
                    params: {
                        operationId,
                        pageTitle: `${summary} - vitepress-openapi`,
                    },
                }
            })
    },
}
```

## Markdown File

In the `[operationId].md` file, you can use the `OAOperation` component to render the operation.

<ScopeConfigurationTabs>

<template #global>

If you have configured the OpenAPI Specification using the `useOpenapi` composable in your `.vitepress/theme/index.[js,ts]` file, you can just pass the `operationId` prop to the `OAOperation` component, and it will automatically fetch the spec from the global context.

```markdown
---
aside: false
outline: false
title: vitepress-openapi
---

<script setup lang="ts">
import { useRoute, useData } from 'vitepress'

const route = useRoute()

const { isDark } = useData()

const operationId = route.data.params.operationId
</script>

<OAOperation :operationId="operationId" :isDark="isDark" />
```

</template>

<template #in-markdown>

In your `.md` files, import the OpenAPI specification and pass it as `spec` prop to the `OAOperation` component.

```markdown
---
aside: false
outline: false
title: vitepress-openapi
---

<script setup lang="ts">
import { useRoute, useData } from 'vitepress'
import spec from '../public/openapi.json'

const route = useRoute()

const { isDark } = useData()

const operationId = route.data.params.operationId
</script>

<OAOperation :spec="spec" :operationId="operationId" :isDark="isDark" />
```

</template>

</ScopeConfigurationTabs>

## Searching Operations

If you want to make use of search on your site, the default `local` search will not work due to https://github.com/vuejs/vitepress/issues/2939

Consider using [vitepress-plugin-pagefind](https://www.npmjs.com/package/vitepress-plugin-pagefind), which works with dynamic routes.

## Example

<SandboxIframe :sandbox-data="{sandboxView: 'preview', previewComponent: 'OAOperation', operationId: 'getAllArtists'}" :iframe-zoom="0.6" class="h-[70vh] max-h-[700px]" />