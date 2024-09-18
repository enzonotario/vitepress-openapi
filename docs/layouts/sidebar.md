---
aside: false
outline: false
---

# Sidebar Items

To automatically generate sidebar items, you can use the `useSidebar` function. Configure your `.vitepress/config.js` as follows:

```ts
import { useSidebar, useOpenapi } from 'vitepress-theme-openapi'
import spec from '../public/openapi.json' assert { type: 'json' }

const sidebar = useSidebar({ 
    spec,
    // Optionally, you can specify a link prefix for all generated sidebar items.
    linkPrefix: '/operations/',
})

module.exports = {
    // ...
    themeConfig: {
        sidebar: [
            ...sidebar.generateSidebarGroups(),
            
            // Optionally, you can generate sidebar items with another link prefix.
            ...sidebar.generateSidebarGroups({ linkPrefix: '/v2/' }),
        ],
    },
}
```
