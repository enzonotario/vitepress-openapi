---
aside: false
outline: false
---

# One Operation Layout

You can use the `OAOperation` component to render a single operation in a single page layout.

## Creating Operation Pages

To create operation pages, create a directory named `operations` in the `docs` directory. Inside the `operations` directory, create a file named `[operationId].md` and a file named `[operationId].paths.js`.

```
/docs
├── /operations
│   ├── [operationId].md
│   └── [operationId].paths.js
```

Example of `[operationId].paths.js`:

```ts
import { useOpenapi, httpVerbs } from 'vitepress-theme-openapi'
import spec from '../public/openapi.json' assert { type: 'json' }

export default {
    paths() {
        const openapi = useOpenapi({ spec })

        if (!openapi?.json?.paths) {
            return []
        }

        return Object.keys(openapi.json.paths)
            .flatMap((path) => {
                return httpVerbs
                    .filter((verb) => openapi.json.paths[path][verb])
                    .map((verb) => {
                        const { operationId, summary } = openapi.json.paths[path][verb]
                        return {
                            params: {
                                operationId,
                                pageTitle: `${summary} - vitepress-theme-openapi`,
                            },
                        }
                    })
            })
    },
}
```

Example of `[operationId].md`:

```markdown
---
aside: false
outline: false
title: vitepress-theme-openapi
---

<script setup lang="ts">
import { useRoute, useData } from 'vitepress'

const route = useRoute()

const { isDark } = useData()

const operationId = route.data.params.operationId
</script>

<OAOperation :operationId="operationId" :isDark="isDark" />
```

You can also configure multiple options in this `[operationId].md` file, for example:

```markdown
---
aside: false
outline: false
title: vitepress-theme-openapi
---

<script setup lang="ts">
import { useRoute, useData } from 'vitepress'
import { useOpenapi, useTheme } from 'vitepress-theme-openapi'

const route = useRoute()

const { isDark } = useData()

const openapi = useOpenapi()

const themeConfig = useTheme()

const operationId = route.data.params.operationId

const operation = openapi.getOperation(operationId)

// Set the response code selector to select if there are more than 3 responses
themeConfig.setResponseCodeSelector(
    Object.keys(operation.responses).length > 3 ? 'select' : 'tabs'
)
</script>

<OAOperation :operationId="operationId" :isDark="isDark" />
```

## Searching Operation Pages

If you want to make use of search on your site, the default `local` search will not work due to https://github.com/vuejs/vitepress/issues/2939

Consider using [vitepress-plugin-pagefind](https://www.npmjs.com/package/vitepress-plugin-pagefind), which works with dynamic routes.
