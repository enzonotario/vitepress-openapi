---
outline: 2
---

# Pages by Tag

You can use the `OASpec` component to render all operations that have a specific tag.

## Example

<SandboxIframe :sandbox-data="{sandboxView: 'preview', previewComponent: 'PagesByTag', tags: 'Authentication', sidebarItemsType: 'itemsByTags'}" :iframe-zoom="0.6" class="h-[70vh] max-h-[700px]" />

## Creating `tags` pages

To create tags pages, create a directory named `tags` in the `docs` directory. Inside the `tags` directory, create a file named `[tag].md` and a file named `[tag].paths.js`.

```
/docs
├── /tags
│   ├── [tag].md
│   └── [tag].paths.js
```

## Paths Loader File

Using the [Paths Loader File](https://vitepress.dev/guide/routing#paths-loader-file) feature of VitePress, you can use the `[tag].paths.js` file to generate the pages for each tag.

```ts
import { usePaths } from 'vitepress-openapi'
import spec from '../public/openapi.json' with { type: 'json' }

export default {
    paths() {
        return usePaths({ spec })
            .getTags()
            .map(({ name }) => {
                return {
                    params: {
                        tag: name,
                        pageTitle: `${name} - vitepress-openapi`,
                    },
                }
            })
    },
}
```

## Markdown File

In the `[tag].md` file, you can use the `OASpec` component to render the operations that have the tag.

<ScopeConfigurationTabs>

<template #global>

If you have configured the OpenAPI Specification using the `useOpenapi` composable in your `.vitepress/theme/index.[js,ts]` file, you can just pass the `tag` prop to the `OASpec` component, and it will automatically fetch the spec from the global context.

```markdown
---
aside: false
outline: false
title: vitepress-openapi
---

<script setup lang="ts">
import { useRoute } from 'vitepress'

const route = useRoute()

const tag = route.data.params.tag
</script>

<OASpec :tags="[tag]" hide-info hide-servers hide-paths-summary />
```

</template>

<template #in-markdown>

In your `.md` files, import the OpenAPI specification and pass it as `spec` prop to the `OASpec` component.

```markdown
---
aside: false
outline: false
title: vitepress-openapi
---

<script setup lang="ts">
import { useRoute } from 'vitepress'
import spec from '../public/openapi.json'

const route = useRoute()

const tag = route.data.params.tag
</script>

<OASpec :spec="spec" :tags="[tag]" hide-info hide-servers hide-paths-summary />
```

</template>

</ScopeConfigurationTabs>
