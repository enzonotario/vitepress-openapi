---
aside: false
outline: false
---

# Sidebar Items

To automatically generate sidebar items, you can use the `useSidebar` function. Configure your `.vitepress/config.js` as follows:

```ts
import { useSidebar, useOpenapi } from 'vitepress-openapi'
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

## Items by tags

To generate sidebar items by tags, you can use the `itemsByTags` function. Configure your `.vitepress/config.js` as follows:

```ts
import { useSidebar, useOpenapi } from 'vitepress-openapi'
import spec from '../public/openapi.json' assert { type: 'json' }

const sidebar = useSidebar({ 
    spec,
    // Optionally, you can specify a link prefix for all generated sidebar items.
    tagLinkPrefix: '/tags/',
})

module.exports = {
    // ...
    themeConfig: {
        sidebar: [
            ...sidebar.itemsByTags(),
            
            // Optionally, you can generate sidebar items with another link prefix.
            ...sidebar.itemsByTags({ linkPrefix: '/v2/' }),
        ],
    },
}
```

## Method Aliases

By default, the methods are displayed in uppercase.

You can specify aliases for the methods by passing the `methodAliases` option to the `useSidebar` composable.

```ts
const sidebar = useSidebar({ 
    spec,
    methodAliases: {
        get: 'GE',
        post: 'PO',
        put: 'PU',
        delete: 'DE',
        patch: 'PA',
        options: 'OP',
        head: 'HE',
    },
})
```

