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
