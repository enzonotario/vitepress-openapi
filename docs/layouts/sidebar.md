---
aside: false
outline: false
---

# Sidebar Items

To automatically generate sidebar items, you can use the `useSidebar` function. Configure your `.vitepress/config.js` as follows:

```ts
import { useSidebar, useOpenapi } from 'vitepress-theme-openapi'
import spec from '../public/openapi.json' assert { type: 'json' }

const openapi = useOpenapi()
openapi.setSpec(spec)
const sidebar = useSidebar()

module.exports = {
    // ...
    themeConfig: {
        sidebar: [
            ...sidebar.generateSidebarGroups(),
        ],
    },
}
```
