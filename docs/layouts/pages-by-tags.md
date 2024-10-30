---
aside: false
outline: false
---

# Pages by Tags

You can use the `OASpec` component to render all operations that have a specific tag.

## Creating Tags Pages

To create tags pages, create a directory named `tags` in the `docs` directory. Inside the `tags` directory, create a file named `[tag].md` and a file named `[tag].paths.js`.

```
/docs
├── /tags
│   ├── [tag].md
│   └── [tag].paths.js
```

Example of `[tag].paths.js`:

```ts
import { usePaths } from 'vitepress-openapi'
import spec from '../public/openapi.json' assert { type: 'json' }

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

Example of `[tag].md`:

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

const tag = route.data.params.tag
</script>

<OASpec :tags="[tag]" :isDark="isDark" hide-info hide-servers hide-paths-summary />
```
